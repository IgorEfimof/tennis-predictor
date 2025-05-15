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
      <input type="text" inputmode="numeric" placeholder="Коэффициент A" data-player="a" data-id="${i}" maxlength="5">
      <input type="text" inputmode="numeric" placeholder="Коэффициент B" data-player="b" data-id="${i}" maxlength="5">
    `;
    gamesContainer.appendChild(div);
  }

  const inputs = document.querySelectorAll("input[type='text']");
  inputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      let value = e.target.value;

      // Убираем всё, кроме цифр и запятой
      value = value.replace(/[^0-9,]/g, "");

      // Если нет запятой и есть хотя бы одна цифра — добавляем её
      if (!value.includes(",")) {
        if (value.length === 1 && !value.startsWith(",")) {
          value = value + ",";
        }
      } else {
        // После запятой максимум 2 цифры
        const parts = value.split(",");
        if (parts[1].length > 2) {
          parts[1] = parts[1].substring(0, 2);
          value = parts.join(",");
        }
      }

      // Ограничиваем длину до 5 символов (x,xx)
      if (value.length > 5) {
        value = value.slice(0, 5);
      }

      // Сохраняем значение
      e.target.value = value;

      // Автофокус на следующее поле, если ввели 2 знака после запятой
      if (value.includes(",") && value.split(",")[1].length === 2) {
        const nextInput = inputs[index + 1];
        if (nextInput) {
          nextInput.focus();
        } else {
          e.target.blur(); // Скрываем клавиатуру на iPad
        }
      }
    });

    input.addEventListener("focus", () => {
      input.select(); // Выделяем всё при фокусе
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
