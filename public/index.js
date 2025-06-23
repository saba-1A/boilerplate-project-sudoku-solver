const textArea = document.getElementById("text-input");
const coordInput = document.getElementById("coord");
const valInput = document.getElementById("val");
const errorMsg = document.getElementById("error-msg");

document.addEventListener("DOMContentLoaded", () => {
  textArea.value =
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  fillPuzzle(textArea.value);
});

textArea.addEventListener("input", () => {
  fillPuzzle(textArea.value);
});

function fillPuzzle(data) {
  const len = Math.min(data.length, 81);
  for (let i = 0; i < len; i++) {
    const rowLetter = String.fromCharCode("A".charCodeAt(0) + Math.floor(i / 9));
    const col = (i % 9) + 1;
    const cell = document.querySelector(`.${rowLetter}${col}`);
    if (!cell) continue;
    cell.textContent = data[i] === "." ? " " : data[i];
  }
}

async function getSolved() {
  const payload = { puzzle: textArea.value };
  try {
    const res = await fetch("/api/solve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.error) {
      errorMsg.innerHTML = `<code>${data.error}</code>`;
      return;
    }
    fillPuzzle(data.solution);
    errorMsg.textContent = "";
  } catch (err) {
    errorMsg.textContent = "Error communicating with server.";
  }
}

async function getChecked() {
  const payload = {
    puzzle: textArea.value,
    coordinate: coordInput.value.toUpperCase().trim(),
    value: valInput.value.trim(),
  };

  // 🛑 Basic validation
  if (!payload.puzzle || !payload.coordinate || !payload.value) {
    errorMsg.textContent = "All fields are required.";
    return;
  }

  try {
    const res = await fetch("/api/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.error) {
      errorMsg.innerHTML = `<code>${data.error}</code>`;
    } else {
      errorMsg.innerHTML = `<code>${JSON.stringify(data, null, 2)}</code>`;
      errorMsg.textContent = "";
      if (data.valid) {
        const cell = document.querySelector(`.${payload.coordinate}`);
        if (cell) cell.textContent = payload.value;
      }
    }
  } catch (err) {
    errorMsg.textContent = "Error communicating with server.";
  }
}

document.getElementById("solve-button").addEventListener("click", getSolved);
document.getElementById("check-button").addEventListener("click", getChecked);
