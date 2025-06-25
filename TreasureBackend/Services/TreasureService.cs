using TreasureBackend.Models;

namespace TreasureBackend.Services;

public class TreasureService : ITreasureService
{
    public TreasureResult SolveTreasure(int n, int m, int p, int[][] matrix)
    {
        var map = new Dictionary<int, List<(int x, int y)>>();

        for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
        {
            int val = matrix[i][j];
            if (!map.ContainsKey(val))
                map[val] = new List<(int, int)>();
            map[val].Add((i, j));
        }

        var fuelCost = new Dictionary<(int, int), double> { [(0, 0)] = 0 };
        var currentPositions = new List<(int, int)> { (0, 0) };

        for (int key = 1; key <= p; key++)
        {
            if (!map.TryGetValue(key, out var nextPositions)) continue;

            var nextFuelCost = new Dictionary<(int, int), double>();

            foreach (var next in nextPositions)
            {
                double minFuel = double.MaxValue;
                foreach (var current in currentPositions)
                {
                    double dist = Math.Sqrt(Math.Pow(current.Item1 - next.x, 2) + Math.Pow(current.Item2 - next.y, 2));
                    double totalFuel = fuelCost[current] + dist;
                    if (totalFuel < minFuel)
                        minFuel = totalFuel;
                }

                nextFuelCost[next] = minFuel;
            }

            fuelCost = nextFuelCost;
            currentPositions = fuelCost.Keys.ToList();
        }

        return new TreasureResult { Result = fuelCost.Values.Min() };
    }
}