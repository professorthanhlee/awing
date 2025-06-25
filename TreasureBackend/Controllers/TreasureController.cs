using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TreasureBackend.Models;
using TreasureBackend.Services;

namespace TreasureBackend.Controllers;

[ApiController]
[Route("api/treasure")]
public class TreasureController : ControllerBase
{
    private readonly ITreasureService _service;
    private readonly AppDbContext _db;

    public TreasureController(ITreasureService service, AppDbContext db)
    {
        _service = service;
        _db = db;
    }

    [HttpPost("solve")]
    public async Task<IActionResult> SolveAsync([FromBody] TreasureMapInput input)
    {
        var result = _service.SolveTreasure(input.N, input.M, input.P, input.Matrix);

        var history = new TreasureHistory
        {
            Rows = input.N,
            Columns = input.M,
            P = input.P,
            MatrixJson = System.Text.Json.JsonSerializer.Serialize(input.Matrix),
            Result = Math.Round(result.Result, 5),
            CreatedAt = DateTime.UtcNow
        };

        _db.TreasureHistory.Add(history);
        await _db.SaveChangesAsync();

        return Ok(history.Result);
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetHistoryAsync()
    {
        var list = await _db.TreasureHistory
            .OrderByDescending(x => x.CreatedAt).ToListAsync();

        return Ok(list);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdAsync(int id)
    {
        var record = await _db.TreasureHistory.FindAsync(id);
        if (record == null)
            return NotFound();

        var matrix = System.Text.Json.JsonSerializer.Deserialize<int[][]>(record.MatrixJson);

        return Ok(new
        {
            record.Id,
            record.Rows,
            record.Columns,
            record.P,
            record.Result,
            record.CreatedAt,
            Matrix = matrix
        });
    }
}
