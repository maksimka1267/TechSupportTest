using System;

namespace HedgehogApp
{
    public static class HedgehogSolver
    {
        /// <summary>
        /// counts[0] – червоні, counts[1] – зелені, counts[2] – сині.
        /// desiredColor: 0, 1 або 2.
        /// Повертає мінімальну кількість зустрічей або -1, якщо це неможливо.
        /// </summary>
        public static int MinMeetings(int[] counts, int desiredColor)
        {
            if (counts == null || counts.Length != 3)
                throw new ArgumentException("Масив counts повинен мати довжину 3");
            if (desiredColor < 0 || desiredColor > 2)
                throw new ArgumentOutOfRangeException(nameof(desiredColor));

            long[] c = { counts[0], counts[1], counts[2] };
            long d = c[desiredColor];                   // поточна кількість їжачків бажаного кольору
            long p = c[(desiredColor + 1) % 3];         // кількість їжачків другого кольору
            long q = c[(desiredColor + 2) % 3];         // кількість їжачків третього кольору

            // Вже всі потрібного кольору
            if (p == 0 && q == 0)
                return 0;

            // Усі їжачки одного кольору, але не того, який нам потрібен — змінити неможливо
            int nonZeroColors = 0;
            foreach (var v in c)
                if (v > 0) nonZeroColors++;

            if (nonZeroColors == 1 && d == 0)
                return -1;

            // Перевірка умови існування рішення
            long diff = p - q;
            if (diff % 3 != 0)
                return -1;

            long t = diff / 3;

            // bMin – мінімальна кількість зустрічей одного типу,
            // при якій усі лічильники операцій будуть невід’ємними
            long bMin = Math.Max(0, Math.Max(-t, t - p));

            // Загальна кількість зустрічей
            long result = 3 * bMin + p;

            if (result > int.MaxValue)
                return -1;
            return (int)result;
        }
    }

    internal class Program
    {
        static void Main(string[] args)
        {
            // Невеликий набір тестів для перевірки роботи алгоритму
            Test(new[] { 8, 1, 9 }, 0);   // ціль – усі червоні
            Test(new[] { 1, 1, 1 }, 0);
            Test(new[] { 2, 2, 2 }, 1);   // ціль – усі зелені

            Console.WriteLine("Введiть три цiлi числа (через пробiл) – кiлькiсть червоних, зелених, синiх їжачкiв:");
            var parts = Console.ReadLine()?.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            if (parts is { Length: 3 } &&
                int.TryParse(parts[0], out int r) &&
                int.TryParse(parts[1], out int g) &&
                int.TryParse(parts[2], out int b))
            {
                Console.WriteLine("Введiть бажаний колiр (0 – червоний, 1 – зелений, 2 – синiй):");
                if (int.TryParse(Console.ReadLine(), out int desired))
                {
                    int ans = HedgehogSolver.MinMeetings(new[] { r, g, b }, desired);
                    Console.WriteLine($"Мiнiмальна кiлькiсть зустрiчей: {ans}");
                }
                else
                {
                    Console.WriteLine("Некоректний ввiд кольору.");
                }
            }
            else
            {
                Console.WriteLine("Некоректний ввiд кiлькостей.");
            }
        }

        private static void Test(int[] counts, int desired)
        {
            int steps = HedgehogSolver.MinMeetings(counts, desired);
            Console.WriteLine(
                $"[{counts[0]}, {counts[1]}, {counts[2]}], колiр={desired} -> {steps}");
        }
    }
}
