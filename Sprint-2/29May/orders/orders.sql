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
