#region GetAddressesByUserId - Returns all addresses for a specific user
public List<Address> GetAddressesByUserId(int userId)
{
    List<Address> addresses = new List<Address>();
    try
    {
        addresses = (from address in context.Addresses 
                    where address.UserId == userId 
                    select address).ToList();
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
        addresses = new List<Address>();
    }
    return addresses;
}
#endregion

#region AddNewAddress - Adds a new address for a user
public bool AddNewAddress(Address address)
{
    try
    {
        context.Addresses.Add(address);
        context.SaveChanges();
        return true;
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
        return false;
    }
}
#endregion

#region UpdateAddress - Updates an existing address
public bool UpdateAddress(Address address)
{
    try
    {
        var existingAddress = context.Addresses.Find(address.AddressId);
        if (existingAddress != null)
        {
            existingAddress.Name = address.Name;
            existingAddress.PhoneNumber = address.PhoneNumber;
            existingAddress.Address1 = address.Address1;
            existingAddress.City = address.City;
            existingAddress.State = address.State;
            existingAddress.PostalCode = address.PostalCode;
            existingAddress.Country = address.Country;
            context.SaveChanges();
            return true;
        }
        return false;
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
        return false;
    }
}
#endregion

#region RemoveAddress - Removes an address by ID
public bool RemoveAddress(int addressId)
{
    try
    {
        var address = context.Addresses.Find(addressId);
        if (address != null)
        {
            context.Addresses.Remove(address);
            context.SaveChanges();
            return true;
        }
        return false;
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
        return false;
    }
}
#endregion

#region PlaceOrder - Calls sp_PlaceOrder stored procedure
public int PlaceOrder(int userId, int cartId, int addressId)
{
    try
    {
        var userIdParam = new SqlParameter("@UserID", userId);
        var cartIdParam = new SqlParameter("@CartID", cartId);
        var addressIdParam = new SqlParameter("@AddressID", addressId);
        var returnParam = new SqlParameter("@ReturnValue", SqlDbType.Int)
        {
            Direction = ParameterDirection.ReturnValue
        };

        context.Database.ExecuteSqlRaw("EXEC @ReturnValue = sp_PlaceOrder @UserID, @CartID, @AddressID", 
            returnParam, userIdParam, cartIdParam, addressIdParam);
        
        return (int)returnParam.Value;
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
        return -99;
    }
}
#endregion

#region GetProductStock - Returns stock quantity for a specific product
public int GetProductStock(int productId)
{
    try
    {
        var product = context.Products.Find(productId);
        return product?.Quantity ?? 0;
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
        return 0;
    }
}
#endregion

#region GetOrderItemsByUserId - Returns all order items for a specific user
public List<OrderItem> GetOrderItemsByUserId(int userId)
{
    List<OrderItem> orderItems = new List<OrderItem>();
    try
    {
        orderItems = (from orderItem in context.OrderItems
                     join order in context.Orders on orderItem.OrderId equals order.OrderId
                     where order.UserId == userId
                     select orderItem).ToList();
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
        orderItems = new List<OrderItem>();
    }
    return orderItems;
}
#endregion

#region GetOrderDetailsByUserId - Returns all orders for a specific user
public List<Order> GetOrderDetailsByUserId(int userId)
{
    List<Order> orders = new List<Order>();
    try
    {
        orders = (from order in context.Orders 
                 where order.UserId == userId 
                 select order).ToList();
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
        orders = new List<Order>();
    }
    return orders;
}
#endregion

#region AddRating - Adds or updates a rating for a product by user
public bool AddRating(int userId, int productId, int rating)
{
    try
    {
        var existingRating = context.Ratings.FirstOrDefault(r => r.UserId == userId && r.ProductId == productId);
        
        if (existingRating != null)
        {
            // Update existing rating
            existingRating.Rating1 = rating;
        }
        else
        {
            // Add new rating
            var newRating = new Rating
            {
                UserId = userId,
                ProductId = productId,
                Rating1 = rating
            };
            context.Ratings.Add(newRating);
        }
        
        context.SaveChanges();
        return true;
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
        return false;
    }
}
#endregion
