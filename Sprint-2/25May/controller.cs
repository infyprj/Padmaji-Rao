// AddressController.cs methods

[HttpGet("GetAddressesByUserId/{userId}")]
public JsonResult GetAddressesByUserId(int userId)
{
    List<Address> addresses = new List<Address>();
    try
    {
        addresses = repository.GetAddressesByUserId(userId);
    }
    catch (Exception)
    {
        addresses = null;
    }
    return Json(addresses);
}

[HttpPost("AddNewAddress")]
public JsonResult AddNewAddress([FromBody] Address address)
{
    bool result = false;
    try
    {
        result = repository.AddNewAddress(address);
    }
    catch (Exception)
    {
        result = false;
    }
    return Json(new { success = result });
}

[HttpPut("UpdateAddress")]
public JsonResult UpdateAddress([FromBody] Address address)
{
    bool result = false;
    try
    {
        result = repository.UpdateAddress(address);
    }
    catch (Exception)
    {
        result = false;
    }
    return Json(new { success = result });
}

[HttpDelete("RemoveAddress/{addressId}")]
public JsonResult RemoveAddress(int addressId)
{
    bool result = false;
    try
    {
        result = repository.RemoveAddress(addressId);
    }
    catch (Exception)
    {
        result = false;
    }
    return Json(new { success = result });
}

// OrderController.cs methods

[HttpPost("PlaceOrder")]
public JsonResult PlaceOrder([FromBody] PlaceOrderRequest request)
{
    int result = -99;
    try
    {
        result = repository.PlaceOrder(request.UserId, request.CartId, request.AddressId);
    }
    catch (Exception)
    {
        result = -99;
    }
    return Json(new { returnCode = result });
}

[HttpGet("GetOrderItemsByUserId/{userId}")]
public JsonResult GetOrderItemsByUserId(int userId)
{
    List<OrderItem> orderItems = new List<OrderItem>();
    try
    {
        orderItems = repository.GetOrderItemsByUserId(userId);
    }
    catch (Exception)
    {
        orderItems = null;
    }
    return Json(orderItems);
}

[HttpGet("GetOrderDetailsByUserId/{userId}")]
public JsonResult GetOrderDetailsByUserId(int userId)
{
    List<Order> orders = new List<Order>();
    try
    {
        orders = repository.GetOrderDetailsByUserId(userId);
    }
    catch (Exception)
    {
        orders = null;
    }
    return Json(orders);
}

// ProductController.cs methods

[HttpGet("GetProductStock/{productId}")]
public JsonResult GetProductStock(int productId)
{
    int stock = 0;
    try
    {
        stock = repository.GetProductStock(productId);
    }
    catch (Exception)
    {
        stock = 0;
    }
    return Json(new { productId = productId, stock = stock });
}

// RatingController.cs methods

[HttpPost("AddRating")]
public JsonResult AddRating([FromBody] RatingRequest request)
{
    bool result = false;
    try
    {
        result = repository.AddRating(request.UserId, request.ProductId, request.Rating);
    }
    catch (Exception)
    {
        result = false;
    }
    return Json(new { success = result });
}

// Request Models (add these to your Models folder)

public class PlaceOrderRequest
{
    public int UserId { get; set; }
    public int CartId { get; set; }
    public int AddressId { get; set; }
}

public class RatingRequest
{
    public int UserId { get; set; }
    public int ProductId { get; set; }
    public int Rating { get; set; }
}
