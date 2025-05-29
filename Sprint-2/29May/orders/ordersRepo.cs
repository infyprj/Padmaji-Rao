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
