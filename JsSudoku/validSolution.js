// validSolution.js

// board – масив 9×9 чисел
// Повертає true, якщо розв'язок судоку коректний, інакше false
function validSolution(board) {
    if (!Array.isArray(board) || board.length !== 9) return false;

    // Перевірка, що в групі є всі числа від 1 до 9 без повторів
    const isValidGroup = (arr) => {
        if (!Array.isArray(arr) || arr.length !== 9) return false;
        const seen = new Set();
        for (const v of arr) {
            // Кожен елемент має бути цілим числом від 1 до 9
            if (!Number.isInteger(v) || v < 1 || v > 9) return false;
            if (seen.has(v)) return false;
            seen.add(v);
        }
        return true;
    };

    // Перевірка рядків
    for (let r = 0; r < 9; r++) {
        if (!isValidGroup(board[r])) return false;
    }

    // Перевірка стовпців
    for (let c = 0; c < 9; c++) {
        const col = [];
        for (let r = 0; r < 9; r++) {
            col.push(board[r][c]);
        }
        if (!isValidGroup(col)) return false;
    }

    // Перевірка всіх квадратів 3×3
    for (let br = 0; br < 3; br++) {
        for (let bc = 0; bc < 3; bc++) {
            const box = [];
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    box.push(board[3 * br + r][3 * bc + c]);
                }
            }
            if (!isValidGroup(box)) return false;
        }
    }

    return true;
}

// ===== Нижче — інтерактивна частина (Node.js) =====

const readline = require("readline");

// Створюємо інтерфейс для читання з консолі
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Допоміжна функція для запитань (Promise)
function ask(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}

// Вивід матриці у зручному вигляді
function printBoard(board) {
    console.log("Поточна матриця:");
    for (const row of board) {
        console.log(row.join(" "));
    }
}

// Генерація випадкової матриці 9×9 з чисел 1–9
function generateRandomBoard() {
    const board = [];
    for (let r = 0; r < 9; r++) {
        const row = [];
        for (let c = 0; c < 9; c++) {
            row.push(1 + Math.floor(Math.random() * 9));
        }
        board.push(row);
    }
    return board;
}

// Ручне введення матриці 9×9
async function inputBoardManually() {
    const board = [];
    console.log("Введіть 9 рядків по 9 чисел (від 1 до 9), розділених пробілами.");

    for (let i = 0; i < 9; i++) {
        // повторюємо запит, поки рядок некоректний
        while (true) {
            const line = await ask(`Рядок ${i + 1}: `);
            const parts = line
                .trim()
                .split(/\s+/)
                .map((x) => Number(x));

            if (
                parts.length === 9 &&
                parts.every((v) => Number.isInteger(v) && v >= 1 && v <= 9)
            ) {
                board.push(parts);
                break;
            } else {
                console.log("Некоректний рядок. Спробуйте ще раз (9 чисел 1–9 через пробіл).");
            }
        }
    }

    return board;
}

// Головна функція
async function main() {
    console.log("Оберіть режим:");
    console.log("1 – використати приклад з умови");
    console.log("2 – згенерувати випадкову матрицю 9×9");
    console.log("3 – ввести матрицю вручну");
    const mode = await ask("Ваш вибір (1/2/3): ");

    let board;

    if (mode === "1") {
        // Приклад коректного розв'язку
        board = [
            [5, 3, 4, 6, 7, 8, 9, 1, 2],
            [6, 7, 2, 1, 9, 5, 3, 4, 8],
            [1, 9, 8, 3, 4, 2, 5, 6, 7],
            [8, 5, 9, 7, 6, 1, 4, 2, 3],
            [4, 2, 6, 8, 5, 3, 7, 9, 1],
            [7, 1, 3, 9, 2, 4, 8, 5, 6],
            [9, 6, 1, 5, 3, 7, 2, 8, 4],
            [2, 8, 7, 4, 1, 9, 6, 3, 5],
            [3, 4, 5, 2, 8, 6, 1, 7, 9],
        ];
    } else if (mode === "2") {
        board = generateRandomBoard();
    } else if (mode === "3") {
        board = await inputBoardManually();
    } else {
        console.log("Невідомий режим. Завершення роботи.");
        rl.close();
        return;
    }

    printBoard(board);

    const result = validSolution(board);
    console.log("Результат перевірки validSolution(board):", result ? "true" : "false");

    rl.close();
}

// Запускаємо тільки якщо файл запускається напряму (node validSolution.js)
if (require.main === module) {
    main();
}
