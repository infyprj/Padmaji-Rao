CREATE DATABASE Shop3D;
GO

USE Shop3D;
GO
-- Categories
-- Roles
-- Users
--Products
--Orders
-- order items
-- saved products
-- product images
	
IF OBJECT_ID('Categories') IS NOT NULL
	DROP TABLE Categories
GO

IF OBJECT_ID('Roles') IS NOT NULL
	DROP TABLE Roles
GO

IF OBJECT_ID('Users') IS NOT NULL
	DROP TABLE Users
GO

IF OBJECT_ID('Products') IS NOT NULL
	DROP TABLE Products
GO

IF OBJECT_ID('Orders') IS NOT NULL
	DROP TABLE Orders
GO

IF OBJECT_ID('OrderItems') IS NOT NULL
	DROP TABLE OrderItems
GO

IF OBJECT_ID('SavedProducts') IS NOT NULL
	DROP TABLE SavedProducts
GO

IF OBJECT_ID('ProductImages') IS NOT NULL
	DROP TABLE ProductImages
GO

CREATE TABLE Categories (
    CategoryID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
);
GO

INSERT INTO Categories (Name)
VALUES
('Sofa'),
('Table'),
('Bed'),
('Chair');
GO




CREATE TABLE Roles (
    RoleID INT PRIMARY KEY IDENTITY(1,1),
    RoleName NVARCHAR(50) NOT NULL UNIQUE,
);
GO

INSERT INTO Roles (RoleName)
VALUES 
('Guest User'),
('Customer'),
('Admin' );
GO



CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    FirstName NVARCHAR(100),
    LastName NVARCHAR(100),
    PhoneNumber NVARCHAR(20),
    Address NVARCHAR(255),
    City NVARCHAR(100),
    State NVARCHAR(100),
    PostalCode NVARCHAR(20),
    Country NVARCHAR(100),
    RoleID INT NOT NULL FOREIGN KEY REFERENCES Roles(RoleID)
);
GO
    
INSERT INTO Users (Email, PasswordHash, FirstName, LastName, PhoneNumber, Address, City, State, PostalCode, Country, RoleID)
VALUES 
('admin@example.com', 'hashed_pw_1', 'Alice', 'Admin', '1234567890', '123 Admin St', 'New York', 'NY', '10001', 'USA', 2),
('manager@example.com', 'hashed_pw_2', 'Bob', 'Manager', '2345678901', '456 Manager Ave', 'Los Angeles', 'CA', '90001', 'USA', 2),
('editor@example.com', 'hashed_pw_3', 'Charlie', 'Editor', '3456789012', '789 Editor Blvd', 'Chicago', 'IL', '60601', 'USA', 2),
('viewer@example.com', 'hashed_pw_4', 'Diana', 'Viewer', '4567890123', '101 Viewer Rd', 'Houston', 'TX', '77001', 'USA', 2),
('support@example.com', 'hashed_pw_5', 'Ethan', 'Support', '5678901234', '202 Support Ln', 'Phoenix', 'AZ', '85001', 'USA', 2),
('admin@mail.com', 'Admin@123', 'Fiona', 'Admin', '6789012345', '303 HR Pkwy', 'Philadelphia', 'PA', '19101', 'USA', 3);
GO



CREATE TABLE Products (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    Price DECIMAL(18, 2) NOT NULL,
    CategoryID INT NOT NULL FOREIGN KEY REFERENCES Categories(CategoryID),
    ModelURL NVARCHAR(255) NOT NULL, -- URL to 3D model file
    ThumbnailURL NVARCHAR(255),
    Quantity INT DEFAULT 0,
);
GO


INSERT INTO Products (Name, Description, Price, CategoryID, ModelURL, ThumbnailURL, Quantity)
VALUES 
('Velvet Elegance Two-Seater', 'A luxurious two-seater sofa featuring premium velvet upholstery with a sturdy wooden frame, designed for modern living rooms. The plush cushions and elegant design provide both comfort and style, making it a perfect centerpiece for your home decor. Available in multiple color options upon request.', 15000, 1, 'https://shop3dprojectaccount.blob.core.windows.net/3d-models/Sofa1.glb', 'https://shop3dprojectaccount.blob.core.windows.net/images/Sofa1.png', 20),
('Catalina Office Desk', 'A sleek and functional office desk crafted from high-quality engineered wood with a durable laminate finish. The spacious work surface and minimalist design make it ideal for home offices or professional workspaces. Features cable management and ergonomic design for enhanced productivity.', 6000, 2, 'https://shop3dprojectaccount.blob.core.windows.net/3d-models/Table.glb', 'https://shop3dprojectaccount.blob.core.windows.net/images/Table.png', 35),
('Serenity Platform Bed', 'A modern platform bed with built-in under-bed storage, crafted from premium engineered wood for durability. The sleek design features a low profile with ample storage space, perfect for organizing bedding and accessories. The sturdy slat support ensures comfort and longevity for all mattress types.', 20000, 3, 'https://shop3dprojectaccount.blob.core.windows.net/3d-models/Bed.glb', 'https://shop3dprojectaccount.blob.core.windows.net/images/Bed.png', 20),
('Harmony Rocking Chair', 'Handcrafted from solid wood, this elegant rocking chair is designed for relaxation in gardens or cozy indoor spaces. The ergonomic curved backrest and smooth rocking motion provide exceptional comfort. Finished with a weather-resistant stain for outdoor durability.', 4500, 4, 'https://shop3dprojectaccount.blob.core.windows.net/3d-models/Chair.glb', 'https://shop3dprojectaccount.blob.core.windows.net/images/Chair.png', 50),
('Tokyo Curve Sectional', 'A contemporary five-seater sectional sofa with a gracefully curved design, perfect for spacious living areas. Upholstered in high-resilience foam and premium fabric for lasting comfort. The modular design allows flexible arrangement to suit any room layout.', 18000, 1, 'https://shop3dprojectaccount.blob.core.windows.net/3d-models/Sofa2.glb', 'https://shop3dprojectaccount.blob.core.windows.net/images/Sofa2.png', 10);
Go
	

CREATE TABLE SavedProducts (
    SavedProductID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID) ON DELETE CASCADE,
    ProductID INT NOT NULL FOREIGN KEY REFERENCES Products(ProductID) ON DELETE CASCADE

);
GO

INSERT INTO SavedProducts (UserID, ProductID)
VALUES
(1, 2),
(1, 4),
(2, 1),
(2, 5),
(3, 3);



CREATE TABLE ProductImages (
    ImageID INT PRIMARY KEY IDENTITY(1,1),
    ProductID INT NOT NULL FOREIGN KEY REFERENCES Products(ProductID) ON DELETE CASCADE,
    ImageURL NVARCHAR(255) NOT NULL,
);
GO
    
INSERT INTO ProductImages (ProductID, ImageURL)
VALUES
(1, 'https://example.com/images/product1_img1.jpg'),
(1, 'https://example.com/images/product1_img2.jpg'),
(2, 'https://example.com/images/product2_img1.jpg'),
(2, 'https://example.com/images/product2_img2.jpg'),
(3, 'https://example.com/images/product3_img1.jpg'),
(3, 'https://example.com/images/product3_img2.jpg'),
(4, 'https://example.com/images/product4_img1.jpg'),
(4, 'https://example.com/images/product4_img2.jpg'),
(5, 'https://example.com/images/product5_img1.jpg'),
(5, 'https://example.com/images/product5_img2.jpg');
GO



CREATE OR ALTER PROCEDURE sp_SearchProducts
    @SearchTerm NVARCHAR(255)
AS
BEGIN
    SELECT p.*, c.Name AS CategoryName
    FROM Products p
    JOIN Categories c ON p.CategoryID = c.CategoryID
    WHERE p.Name LIKE '%' + @SearchTerm + '%' 
       OR p.Description LIKE '%' + @SearchTerm + '%'
       OR c.Name LIKE '%' + @SearchTerm + '%';
END
GO


CREATE PROCEDURE sp_RegisterUser
    @Email NVARCHAR(255),
    @PasswordHash NVARCHAR(255),
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @PhoneNumber NVARCHAR(20),
    @Address NVARCHAR(255),
    @City NVARCHAR(100),
    @State NVARCHAR(100),
    @PostalCode NVARCHAR(20),
    @Country NVARCHAR(100),
    @RoleID INT
AS
BEGIN
    -- Check if email already exists
    IF EXISTS (SELECT 1 FROM Users WHERE Email = @Email)
    BEGIN
        RETURN -1; -- Email already exists
    END
    -- Insert new user
    INSERT INTO Users (Email, PasswordHash, FirstName, LastName, PhoneNumber, Address, City, State, PostalCode, Country, RoleID)
    VALUES (@Email, @PasswordHash, @FirstName, @LastName, @PhoneNumber, @Address, @City, @State, @PostalCode, @Country, @RoleID);
    
    DECLARE @UserID INT = SCOPE_IDENTITY();

    INSERT INTO Carts(UserID) values (@UserID);

    INSERT INTO Address (userId, name, phoneNumber, address, city, state, postalCode, country)
    VALUES (@UserID, @FirstName, @PhoneNumber, @Address, @City, @State, @PostalCode, @Country);

    RETURN 1;
END;
GO


CREATE PROCEDURE sp_RemoveSavedProduct
    @UserID INT,
    @ProductID INT
AS
BEGIN
    DELETE FROM SavedProducts 
    WHERE UserID = @UserID AND ProductID = @ProductID;
    
    RETURN @@RowCount; -- Returns number of rows affected
END;
GO

CREATE PROCEDURE sp_AddProduct
    @Name NVARCHAR(255),
    @Description NVARCHAR(MAX),
    @Price DECIMAL(18, 2),
    @CategoryID INT,
    @ModelURL NVARCHAR(255),
    @ThumbnailURL NVARCHAR(255) = NULL,
    @Quantity INT
AS
BEGIN
    INSERT INTO Products (
        Name, Description, Price, CategoryID, 
        ModelURL, ThumbnailURL, Quantity
    )
    VALUES (
        @Name, @Description, @Price, @CategoryID,
        @ModelURL, @ThumbnailURL, @Quantity
    );
    
    RETURN 1;
END;
GO



CREATE PROCEDURE sp_SaveProduct
    @UserID INT,
    @ProductID INT
AS
BEGIN
    -- Check if already saved
    IF NOT EXISTS (SELECT 1 FROM SavedProducts WHERE UserID = @UserID AND ProductID = @ProductID)
    BEGIN
        INSERT INTO SavedProducts (UserID, ProductID)
        VALUES (@UserID, @ProductID);
        RETURN 1; -- Success
    END
    ELSE
    BEGIN
        RETURN 0; -- Already saved
    END
END;
GO



CREATE OR ALTER PROCEDURE sp_AuthenticateUser
    @Email NVARCHAR(255),
    @PasswordHash NVARCHAR(255)
AS
BEGIN
    SELECT *
    FROM Users 
    WHERE Email = @Email AND PasswordHash = @PasswordHash;
END
GO


CREATE OR ALTER PROCEDURE sp_UpdateUserDetails
    @UserID INT,
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @PhoneNumber NVARCHAR(20),
    @Address NVARCHAR(255),
    @City NVARCHAR(100),
    @State NVARCHAR(100),
    @PostalCode NVARCHAR(20),
    @Country NVARCHAR(100)
AS
BEGIN
    UPDATE Users
    SET FirstName = @FirstName,
        LastName = @LastName,
        PhoneNumber = @PhoneNumber,
        Address = @Address,
        City = @City,
        State = @State,
        PostalCode = @PostalCode,
        Country = @Country
    WHERE UserID = @UserID;

    --userId, name, phoneNumber, address, city, state, postalCode, country

    UPDATE Address
    SET address = @Address,
        name=@FirstName,
        phoneNumber=@PhoneNumber,
        city = @City,
        state = @State,
        postalCode = @PostalCode,
        country = @Country
    WHERE AddressID = (
        SELECT TOP 1 addressId
        FROM Address
        WHERE userId = @UserID
        ORDER BY addressId ASC
    );
    
    SELECT @@ROWCOUNT AS RecordsUpdated;
END
GO

-- Create Carts table
IF OBJECT_ID('CartItems') IS NOT NULL
    DROP TABLE CartItems
GO

IF OBJECT_ID('Carts') IS NOT NULL
    DROP TABLE Carts
GO

CREATE TABLE Carts (
    CartID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID) ON DELETE CASCADE
);
GO

-- Create CartItems table
CREATE TABLE CartItems (
    CartItemID INT PRIMARY KEY IDENTITY(1,1),
    CartID INT NOT NULL FOREIGN KEY REFERENCES Carts(CartID) ON DELETE CASCADE,
    ProductID INT NOT NULL FOREIGN KEY REFERENCES Products(ProductID),
    Quantity INT NOT NULL DEFAULT 1
);
GO

-- Insert sample data
INSERT INTO Carts (UserID)
VALUES 
(1),
(2),
(3);
GO

INSERT INTO CartItems (CartID, ProductID, Quantity)
VALUES 
(1, 1, 2),
(1, 3, 1),
(2, 2, 3),
(3, 4, 1);
GO

-- Stored Procedure to create a cart for a user
CREATE PROCEDURE sp_CreateCart
    @UserID INT
AS
BEGIN
    -- Check if user already has a cart
    IF EXISTS (SELECT 1 FROM Carts WHERE UserID = @UserID)
    BEGIN
        RETURN -1; -- User already has a cart
    END
    
    -- Create new cart
    INSERT INTO Carts (UserID)
    VALUES (@UserID);
    
    -- Return the new cart ID
    SELECT SCOPE_IDENTITY() AS CartID;
    RETURN 1;
END;
GO

-- Stored Procedure to get a user's cart
CREATE PROCEDURE sp_GetCartByUserID
    @UserID INT
AS
BEGIN
    SELECT c.CartID, c.UserID
    FROM Carts c
    WHERE c.UserID = @UserID;
END;
GO

-- Stored Procedure to add item to cart
CREATE PROCEDURE sp_AddToCart
    @UserID INT,
    @ProductID INT,
    @Quantity INT
AS
BEGIN
    DECLARE @CartID INT;
    
    -- Get the user's cart ID
    SELECT @CartID = CartID FROM Carts WHERE UserID = @UserID;
    
    -- If user doesn't have a cart, create one
    IF @CartID IS NULL
    BEGIN
        INSERT INTO Carts (UserID)
        VALUES (@UserID);
        
        SET @CartID = SCOPE_IDENTITY();
    END
    
    -- Check if product already exists in cart
    IF EXISTS (SELECT 1 FROM CartItems WHERE CartID = @CartID AND ProductID = @ProductID)
    BEGIN
        RETURN -1; -- Product already in cart
    END
    
    -- Add product to cart
    INSERT INTO CartItems (CartID, ProductID, Quantity)
    VALUES (@CartID, @ProductID, @Quantity);
    
    RETURN 1; -- Success
END;
GO

-- Stored Procedure to update cart item quantity
CREATE PROCEDURE sp_UpdateCartItemQuantity
    @CartItemID INT,
    @Quantity INT
AS
BEGIN
    UPDATE CartItems
    SET Quantity = @Quantity
    WHERE CartItemID = @CartItemID;
    
    RETURN @@ROWCOUNT; -- Returns number of rows affected
END;
GO

-- Stored Procedure to remove item from cart
CREATE PROCEDURE sp_RemoveFromCart
    @CartItemID INT
AS
BEGIN
    DELETE FROM CartItems 
    WHERE CartItemID = @CartItemID;
    
    RETURN @@ROWCOUNT; -- Returns number of rows affected
END;
GO

-- Stored Procedure to clear cart
CREATE PROCEDURE sp_ClearCart
    @CartID INT
AS
BEGIN
    DELETE FROM CartItems 
    WHERE CartID = @CartID;
    
    RETURN @@ROWCOUNT; -- Returns number of rows affected
END;
GO

-- Stored Procedure to get cart items with product details
CREATE PROCEDURE sp_GetCartItems
    @UserID INT
AS
BEGIN
    SELECT ci.CartItemID, ci.CartID, ci.ProductID, ci.Quantity,
           p.Name, p.Description, p.Price, p.ThumbnailURL,
           (p.Price * ci.Quantity) AS SubTotal
    FROM Carts c
    JOIN CartItems ci ON c.CartID = ci.CartID
    JOIN Products p ON ci.ProductID = p.ProductID
    WHERE c.UserID = @UserID;
END;
GO

Create table Customizations (
CustomizationID INT IDENTITY(1,1) Primary Key,
UserID INT Not null,
ProductID INT Not null,
CustomizationDescription NVARCHAR(MAx) NOT null,
Foreign Key (UserID) REFERENCES Users(UserID),
Foreign Key (ProductID) REFERENCES Products(ProductID)
);

insert into Customizations(UserID,ProductID,CustomizationDEscription)
values(1,1,'Please make the sofa in navy blue velvet and add extra  lumbar support cushions.');

insert into Customizations(UserID,ProductID,CustomizationDEscription)
values(2,2,'Requesting a larger desktop  surface and built in usb ports.');

insert into Customizations(UserID,ProductID,CustomizationDEscription)
values(3,3,'I want the bed frame in a dark walnut finish.');

insert into Customizations(UserID,ProductID,CustomizationDEscription)
values(4,4,'I want light oak finish with an ergonomic seat cushion in grey fabric.');

insert into Customizations(UserID,ProductID,CustomizationDEscription)
values(5,5,'Add cup holders in the armrest  and request biege color upholestry.');



CREATE TABLE Reviews (
    ReviewID INT PRIMARY KEY IDENTITY(1,1),
    ProductID INT NOT NULL FOREIGN KEY REFERENCES Products(ProductID) ON DELETE CASCADE,
    UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID) ON DELETE CASCADE,
    Description NVARCHAR(MAX) NOT NULL,
    ReviewDate DATETIME DEFAULT GETDATE(),
    IsVisible BIT DEFAULT 1
);
GO


INSERT INTO Reviews (ProductID, UserID, Description, IsVisible)
VALUES
(1, 1, 'Absolutely love this sofa! Very comfortable and looks great in my living room.', 1),
(2, 2, 'The desk is sturdy and has plenty of space for my work essentials.', 1),
(3, 3, 'Nice bed frame, but the finish was a bit lighter than expected.', 1),
(4, 4, 'Rocking chair is perfect for my porch and very relaxing.', 1),
(5, 5, 'Great sectional sofa, fits perfectly in my living room.', 1);
GO


CREATE PROCEDURE sp_GetReviewsByProduct
    @ProductID INT
AS
BEGIN
    SELECT r.ReviewID, r.ProductID, r.UserID, u.FirstName, u.LastName, r.Description, r.ReviewDate, r.IsVisible
    FROM Reviews r
    JOIN Users u ON r.UserID = u.UserID
    WHERE r.ProductID = @ProductID AND r.IsVisible = 1
    ORDER BY r.ReviewDate DESC;
END;
GO


CREATE PROCEDURE sp_AddReview
    @ProductID INT,
    @UserID INT,
    @Description NVARCHAR(MAX)
AS
BEGIN
    INSERT INTO Reviews (ProductID, UserID, Description)
    VALUES (@ProductID, @UserID, @Description);

    RETURN SCOPE_IDENTITY(); -- Return the new ReviewID
END;
GO


CREATE PROCEDURE sp_UpdateReviewVisibility
    @ReviewID INT,
    @UserID INT,
    @IsVisible BIT
AS
BEGIN
    -- Only allow the user who created the review to update it
    UPDATE Reviews
    SET IsVisible = @IsVisible
    WHERE ReviewID = @ReviewID AND UserID = @UserID;

    RETURN @@ROWCOUNT; -- Number of rows affected, 0 means update not allowed or no changes
END;
GO
GO



CREATE TABLE Rating (
    ratingId INT PRIMARY KEY IDENTITY(1,1),
    userId INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    productId INT NOT NULL FOREIGN KEY REFERENCES Products(ProductID),
    rating INT CHECK (rating >= 1 AND rating <= 5)
);
GO

INSERT INTO Rating (userId, productId, rating)
VALUES
    (1, 1, 5),
    (2, 2, 4),
    (3, 3, 3),
    (1, 4, 4),
    (2, 1, 2),
    (3, 2, 5),
    (4, 3, 1),
    (5, 4, 3),
    (4, 1, 4),
    (5, 2, 5);

GO


CREATE TABLE Address (
    addressId INT PRIMARY KEY IDENTITY(1,1),
    userId INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    name NVARCHAR(100),
    phoneNumber NVARCHAR(20),
    address NVARCHAR(255),
    city NVARCHAR(100),
    state NVARCHAR(100),
    postalCode NVARCHAR(20),
    country NVARCHAR(100)
);
GO

INSERT INTO Address (userId, name, phoneNumber, address, city, state, postalCode, country)
VALUES
    -- User 1 addresses
    (1, 'Rajesh Kumar', '9876543210', '12 MG Road', 'Bengaluru', 'Karnataka', '560001', 'India'),
    (1, 'Rajesh Kumar', '9876543210', '45 Residency Rd', 'Bengaluru', 'Karnataka', '560025', 'India'),

    -- User 2 addresses
    (2, 'Anjali Sharma', '9123456789', '34 Park Street', 'Kolkata', 'West Bengal', '700001', 'India'),
    (2, 'Anjali Sharma', '9123456789', '78 Salt Lake', 'Kolkata', 'West Bengal', '700091', 'India'),

    -- User 3 addresses
    (3, 'Vikram Singh', '9988776655', '56 Nehru Nagar', 'Mumbai', 'Maharashtra', '400001', 'India'),
    (3, 'Vikram Singh', '9988776655', '89 Bandra West', 'Mumbai', 'Maharashtra', '400050', 'India'),

    -- User 4 addresses
    (4, 'Priya Patel', '9876501234', '78 Marine Drive', 'Mumbai', 'Maharashtra', '400002', 'India'),
    (4, 'Priya Patel', '9876501234', '23 Juhu Beach', 'Mumbai', 'Maharashtra', '400049', 'India'),

    -- User 5 addresses
    (5, 'Amit Desai', '9567890123', '90 Ashok Road', 'New Delhi', 'Delhi', '110001', 'India'),
    (5, 'Amit Desai', '9567890123', '15 Connaught Place', 'New Delhi', 'Delhi', '110001', 'India');

Go




CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    OrderDate DATETIME DEFAULT GETDATE(),
    TotalAmount DECIMAL(18, 2) NOT NULL,
    ShippingAddress NVARCHAR(255),
    ShippingCity NVARCHAR(100),
    ShippingState NVARCHAR(100),
    ShippingPostalCode NVARCHAR(20),
    ShippingCountry NVARCHAR(100),
    Name NVARCHAR(100),
    PhoneNumber NVARCHAR(20)
);
GO

INSERT INTO Orders 
    (UserID, TotalAmount, ShippingAddress, ShippingCity, ShippingState, ShippingPostalCode, ShippingCountry, Name, PhoneNumber)
VALUES 
    (1, 150.75, '123 Main St', 'New Delhi', 'Delhi', '110001', 'India', 'Rajesh Kumar', '9876543210'),
    (2, 299.99, '456 Oak Ave', 'Mumbai', 'Maharashtra', '400001', 'India', 'Anjali Sharma', '9123456789'),
    (3, 89.50, '789 Pine Rd', 'Bengaluru', 'Karnataka', '560001', 'India', 'Vikram Singh', '9988776655'),
    (4, 420.00, '101 Maple Blvd', 'Chennai', 'Tamil Nadu', '600001', 'India', 'Priya Patel', '9876501234'),
    (5, 59.95, '202 Birch Ln', 'Kolkata', 'West Bengal', '700001', 'India', 'Amit Desai', '9567890123'),
    (1, 230.25, '123 Main St', 'New Delhi', 'Delhi', '110001', 'India', 'Rajesh Kumar', '9876543210'),
    (2, 199.99, '456 Oak Ave', 'Mumbai', 'Maharashtra', '400001', 'India', 'Anjali Sharma', '9123456789'),
    (3, 320.10, '789 Pine Rd', 'Bengaluru', 'Karnataka', '560001', 'India', 'Vikram Singh', '9988776655'),
    (4, 150.00, '101 Maple Blvd', 'Chennai', 'Tamil Nadu', '600001', 'India', 'Priya Patel', '9876501234'),
    (5, 75.00, '202 Birch Ln', 'Kolkata', 'West Bengal', '700001', 'India', 'Amit Desai', '9567890123');


-- Order Items Table
CREATE TABLE OrderItems (
    OrderItemID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT NOT NULL FOREIGN KEY REFERENCES Orders(OrderID) ON DELETE CASCADE,
    ProductID INT NOT NULL FOREIGN KEY REFERENCES Products(ProductID),
    ProductName NVARCHAR(255) NOT NULL,
    ThumbnailURL NVARCHAR(255),
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(18, 2) NOT NULL
);
GO

-- Updated INSERT statements with ProductName and ThumbnailURL
INSERT INTO OrderItems (OrderID, ProductID, ProductName, ThumbnailURL, Quantity, UnitPrice)
VALUES
(1, 2, 'Catalina Office Desk', 'https://shop3dprojectaccount.blob.core.windows.net/images/Table.png', 1, 6000.00),
(3, 3, 'Serenity Platform Bed', 'https://shop3dprojectaccount.blob.core.windows.net/images/Bed.png', 2, 20000.00),
(2, 5, 'Tokyo Curve Sectional', 'https://shop3dprojectaccount.blob.core.windows.net/images/Sofa2.png', 1, 18000.00),
(2, 1, 'Velvet Elegance Two-Seater', 'https://shop3dprojectaccount.blob.core.windows.net/images/Sofa1.png', 3, 15000.00);
GO

-- Updated Stored Procedure
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
        
        -- Transfer cart items to order items (Updated to include ProductName and ThumbnailURL)
        INSERT INTO OrderItems (OrderID, ProductID, ProductName, ThumbnailURL, Quantity, UnitPrice)
        SELECT 
            @OrderID,
            ci.ProductID,
            p.Name,
            p.ThumbnailURL,
            ci.Quantity,
            p.Price
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
--DECLARE @Result INT;
--EXEC @Result = sp_PlaceOrder @UserID = 1, @CartID = 1, @AddressID = 1;
--SELECT @Result AS ReturnCode;
