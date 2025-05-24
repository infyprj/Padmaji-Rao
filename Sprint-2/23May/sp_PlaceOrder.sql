CREATE PROCEDURE sp_PlaceOrder
    @UserID INT,
    @CartID INT,
    @AddressID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @OrderID INT;
    DECLARE @TotalAmount DECIMAL(18, 2) = 0;
    DECLARE @CartItemCount INT = 0;
    
    -- Declare variables for address details
    DECLARE @Name NVARCHAR(100);
    DECLARE @PhoneNumber NVARCHAR(20);
    DECLARE @Address NVARCHAR(255);
    DECLARE @City NVARCHAR(100);
    DECLARE @State NVARCHAR(100);
    DECLARE @PostalCode NVARCHAR(20);
    DECLARE @Country NVARCHAR(100);
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validation 1: Check if user exists
        IF NOT EXISTS (SELECT 1 FROM Users WHERE UserID = @UserID)
        BEGIN
            ROLLBACK TRANSACTION;
            RETURN -1; -- User does not exist
        END
        
        -- Validation 2: Check if cart exists and belongs to the user
        IF NOT EXISTS (SELECT 1 FROM Carts WHERE CartID = @CartID AND UserID = @UserID)
        BEGIN
            ROLLBACK TRANSACTION;
            RETURN -2; -- Cart does not exist or does not belong to user
        END
        
        -- Validation 3: Check if address exists and belongs to the user
        IF NOT EXISTS (SELECT 1 FROM Address WHERE addressId = @AddressID AND userId = @UserID)
        BEGIN
            ROLLBACK TRANSACTION;
            RETURN -3; -- Address does not exist or does not belong to user
        END
        
        -- Validation 4: Check if cart has items
        SELECT @CartItemCount = COUNT(*)
        FROM CartItems 
        WHERE CartID = @CartID;
        
        IF @CartItemCount = 0
        BEGIN
            ROLLBACK TRANSACTION;
            RETURN -4; -- Cart is empty
        END
        
        -- Validation 5: Check product availability and calculate total amount
        IF EXISTS (
            SELECT 1 
            FROM CartItems ci
            JOIN Products p ON ci.ProductID = p.ProductID
            WHERE ci.CartID = @CartID AND p.Quantity < ci.Quantity
        )
        BEGIN
            ROLLBACK TRANSACTION;
            RETURN -5; -- Insufficient product quantity
        END
        
        -- Calculate total amount
        SELECT @TotalAmount = SUM(p.Price * ci.Quantity)
        FROM CartItems ci
        JOIN Products p ON ci.ProductID = p.ProductID
        WHERE ci.CartID = @CartID;
        
        -- Get address details
        SELECT 
            @Name = name,
            @PhoneNumber = phoneNumber,
            @Address = address,
            @City = city,
            @State = state,
            @PostalCode = postalCode,
            @Country = country
        FROM Address 
        WHERE addressId = @AddressID;
        
        -- Create order record
        INSERT INTO Orders (
            UserID, 
            TotalAmount, 
            ShippingAddress, 
            ShippingCity, 
            ShippingState, 
            ShippingPostalCode, 
            ShippingCountry,
            Name,
            PhoneNumber
        )
        VALUES (
            @UserID,
            @TotalAmount,
            @Address,
            @City,
            @State,
            @PostalCode,
            @Country,
            @Name,
            @PhoneNumber
        );
        
        -- Get the newly created order ID
        SET @OrderID = SCOPE_IDENTITY();
        
        -- Transfer cart items to order items
        INSERT INTO OrderItems (OrderID, ProductID, Quantity, UnitPrice, CustomizationDetails)
        SELECT 
            @OrderID,
            ci.ProductID,
            ci.Quantity,
            p.Price,
            NULL -- No customization details from cart
        FROM CartItems ci
        JOIN Products p ON ci.ProductID = p.ProductID
        WHERE ci.CartID = @CartID;
        
        -- Update product quantities (reduce inventory)
        UPDATE p
        SET Quantity = p.Quantity - ci.Quantity
        FROM Products p
        JOIN CartItems ci ON p.ProductID = ci.ProductID
        WHERE ci.CartID = @CartID;
        
        -- Clear cart items
        DELETE FROM CartItems 
        WHERE CartID = @CartID;
        
        COMMIT TRANSACTION;
        
        -- Return success with order ID
        SELECT @OrderID AS OrderID, 'Order placed successfully' AS Message;
        RETURN 1; -- Success
        
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        
        -- Return error information
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
        RETURN -99; -- General error
    END CATCH
END;
GO

-- Return codes explanation:
-- 1: Success
-- -1: User does not exist
-- -2: Cart does not exist or does not belong to user
-- -3: Address does not exist or does not belong to user
-- -4: Cart is empty
-- -5: Insufficient product quantity
-- -99: General error

-- Example usage:
-- DECLARE @Result INT;
-- EXEC @Result = sp_PlaceOrder @UserID = 1, @CartID = 1, @AddressID = 1;
-- SELECT @Result AS ReturnCode;
