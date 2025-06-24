using Microsoft.AspNetCore.Mvc;
using TreasureBackend.Models;
using TreasureBackend.Services;

namespace TreasureBackend.Controllers;

[ApiController]
[Route("api/treasure")]
public class TreasureController : ControllerBase
{
    private readonly ITreasureService _service;

    public TreasureController(ITreasureService service)
    {
        _service = service;
    }
    [HttpPost("solve")]
    public IActionResult Solve([FromBody] TreasureMapInput input)
    {
        var result = _service.SolveTreasure(input.N, input.M, input.P, input.Matrix);
        return Ok(Math.Round(result.Fuel, 5));
    }
}
