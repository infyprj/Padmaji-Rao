using Infosys.Shop3D.DataAccessLayer;
using Infosys.Shop3D.DataAccessLayer.Models;
using Microsoft.AspNetCore.Mvc;

namespace Infosys.Shop3D.WebServices.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class OrderController:Controller
    {
        public Shop3DRepository repository;
        public OrderController(Shop3DRepository repository)
        {
            this.repository = repository;
        }


        [HttpPost]
        public JsonResult PlaceOrder([FromBody] Models.PlaceOrderRequest request)
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

        [HttpGet]
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

        [HttpGet]
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
    }
}
