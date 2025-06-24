using TreasureBackend.Models;

namespace TreasureBackend.Services;

public class TreasureService : ITreasureService
{
    public TreasureResult SolveTreasure(int n, int m, int p, int[][] matrix)
    {
        var map = new Dictionary<int, List<(int x, int y)>>();

        for (var i = 0; i < n; ++i)
        for (var j = 0; j < m; ++j)
        {
            var val = matrix[i][j];
            if (!map.ContainsKey(val)) map[val] = new List<(int, int)>();
            map[val].Add((i, j));
        }

        var fuelCost = new Dictionary<(int, int), double>
        {
            [(0, 0)] = 0
        };

        var currentPositions = new List<(int x, int y)> { (0, 0) };

        for (var key = 1; key <= p; key++)
        {
            if (!map.ContainsKey(key)) continue;
            var nextPositions = map[key];
            var nextFuelCost = new Dictionary<(int, int), double>();

            foreach (var next in nextPositions)
            {
                var minFuel = double.MaxValue;
                foreach (var cur in currentPositions)
                {
                    var dist = Math.Sqrt(Math.Pow(cur.x - next.x, 2) + Math.Pow(cur.y - next.y, 2));
                    var totalFuel = fuelCost[cur] + dist;
                    if (totalFuel < minFuel) minFuel = totalFuel;
                }

                nextFuelCost[next] = minFuel;
            }

            fuelCost = nextFuelCost;
            currentPositions = fuelCost.Keys.ToList();
        }

        var result = new TreasureResult
        {
            Fuel = fuelCost.Values.Min()
        };
        return result;
    }
}