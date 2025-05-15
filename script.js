document.addEventListener("DOMContentLoaded", () => {
  const gameCount = 3;
  const gamesContainer = document.getElementById("games");
  const predictBtn = document.getElementById("predictBtn");
  const resultDiv = document.getElementById("result");
  const avgASpan = document.getElementById("avgA");
  const avgBSpan = document.getElementById("avgB");
  const winnerSpan = document.getElementById("winner");

  // Создаем поля ввода для каждого гейма
  for (let i = 1; i <= gameCount; i++) {
    const div = document.createElement("div");
    div.className = "game-input";
    div.innerHTML = `
      <p><strong>Гейм ${i}</strong></p>
      <input type="text" inputmode="decimal" placeholder="Коэффициент A" data-player="a" data-id="${i}" maxlength="5">
      <input type="text" inputmode="decimal" placeholder="Коэффициент B" data-player="b" data-id="${i}" maxlength="5">
    `;
    gamesContainer.appendChild(div);
  }

  // Добавляем обработчики событий
  const inputs = document.querySelectorAll("input[type='text']");
  inputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      let value = e.target.value.replace(/[^0-9]/g, "");

      if (value.length === 0) {
        e.target.value = "";
        return;
      }

      // Автоматически добавляем запятую и форматируем до 2 знаков
      if (value.length === 1) {
        e.target.value = value + ",";
      } else if (value.length <= 3) {
        const before = value.slice(0, 1);
        const after = value.slice(1).padEnd(2, "0").slice(0, 2);
        e.target.value = `${before},${after}`;
      } else {
        const before = value.slice(0, -2);
        const after = value.slice(-2);
        e.target.value = `${before},${after}`;
      }

      // Автофокус на следующее поле при вводе 2 цифр после запятой
      const parts = e.target.value.split(",");
      if (parts.length > 1 && parts[1].length === 2) {
        const nextInput = inputs[index + 1];
        if (nextInput) {
          nextInput.focus();
        } else {
          e.target.blur(); // Скрываем клавиатуру, если это последнее поле
        }
      }
    });

    // Позволяем очищать поле или вводить вручную
    input.addEventListener("focus", () => {
      input.select(); // Выделение текста при фокусе
    });
  });

  predictBtn.addEventListener("click", () => {
    const inputs = document.querySelectorAll("input[type='text']");
    let totalA = 0;
    let totalB = 0;
    let count = 0;

    inputs.forEach((input) => {
      const valueStr = input.value.replace(/,/g, ".");
      const value = parseFloat(valueStr);
      if (!isNaN(value)) {
        if (input.dataset.player === "a") {
          totalA += value;
        } else {
          totalB += value;
        }
        count++;
      }
    });

    if (count === 0) {
      alert("Введите хотя бы один коэффициент.");
      return;
    }

    const avgA = (totalA / count).toFixed(2);
    const avgB = (totalB / count).toFixed(2);

    let winner = "Ничья";
    if (avgA < avgB) {
      winner = "Игрок A";
    } else if (avgB < avgA) {
      winner = "Игрок B";
    }

    avgASpan.textContent = avgA;
    avgBSpan.textContent = avgB;
    winnerSpan.textContent = winner;

    resultDiv.classList.remove("hidden");
  });
});
