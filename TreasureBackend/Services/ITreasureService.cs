using TreasureBackend.Models;

namespace TreasureBackend.Services;

public interface ITreasureService
{
    TreasureResult SolveTreasure(int n, int m, int p, int[][] matrix);
}