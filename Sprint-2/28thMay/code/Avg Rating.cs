//DAL Method
#region GetAvgRating - Gets average rating and count of users who rated for a product
public (double averageRating, int totalUsers) GetAvgRating(int productId)
{
    try
    {
        var ratings = context.Ratings.Where(r => r.ProductId == productId).ToList();
        
        if (ratings.Count == 0)
        {
            return (0.0, 0);
        }
        
        double avgRating = ratings.Average(r => r.RatingValue);
        int totalUsers = ratings.Count;
        
        return (Math.Round(avgRating, 1), totalUsers);
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
        return (0.0, 0);
    }
}
#endregion

//Controller Method
[HttpGet]
public JsonResult GetAvgRating(int productId)
{
    try
    {
        var (averageRating, totalUsers) = repository.GetAvgRating(productId);
        
        var result = new
        {
            ProductId = productId,
            AverageRating = averageRating,
            TotalUsers = totalUsers
        };
        
        return Json(result);
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
        return Json(new { ProductId = productId, AverageRating = 0.0, TotalUsers = 0 });
    }
}

//Frontend Service Method
getAvgRating(productId: number): Observable<any> {
  return this.http.get<any>(`https://localhost:7195/api/Rating/GetAvgRating?productId=${productId}`)
    .pipe(catchError(this.errorHandler));
}

//Interface for Rating Response (Optional - for better type safety)
export interface IRatingResponse {
  ProductId: number;
  AverageRating: number;
  TotalUsers: number;
}
