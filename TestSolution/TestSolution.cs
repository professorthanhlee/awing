using TreasureBackend.Services;

namespace TestSolution
{
    public class TreasureTests
    {
        private readonly TreasureService _service;

        public TreasureTests()
        {
            _service = new TreasureService();
        }

        [Fact]
        public void TestCase1()
        {
            int[][] matrix =
            {
                new[] {3, 2, 2},
                new[] {2, 2, 2},
                new[] {2, 2, 1}
            };
            var result = _service.SolveTreasure(3, 3, 3, matrix);
            Assert.Equal(4 * Math.Sqrt(2), result.Fuel, 5); 
        }

        [Fact]
        public void TestCase2()
        {
            int[][] matrix =
            {
                new[] {2, 1, 1, 1},
                new[] {1, 1, 1, 1},
                new[] {2, 1, 1, 3}
            };
            var result = _service.SolveTreasure(3, 4, 3, matrix);
            Assert.Equal(5.0, result.Fuel, 5);
        }

        [Fact]
        public void TestCase3()
        {
            int[][] matrix =
            {
                new[] {1, 2, 3, 4},
                new[] {8, 7, 6, 5},
                new[] {9, 10, 11, 12}
            };
            var result = _service.SolveTreasure(3, 4, 12, matrix);
            Assert.Equal(11.0, result.Fuel, 5);
        }
    }
}