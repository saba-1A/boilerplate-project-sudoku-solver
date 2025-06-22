const textArea = document.getElementById("text-input");
const coordInput = document.getElementById("coord");
const valInput = document.getElementById("val");
const errorMsg = document.getElementById("error");

document.addEventListener("DOMContentLoaded", () => {
  textArea.value =
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  fillpuzzle(textArea.value);
});

textArea.addEventListener("input", () => {
  if (textArea.value.length > 81) {
    errorMsg.innerHTML = `<code>{"error": "Puzzle exceeds 81 characters"}</code>`;
    return;
  }
  fillpuzzle(textArea.value);
});

function fillpuzzle(data) {
  for (let i = 0; i < 81; i++) {
    let rowLetter = String.fromCharCode("A".charCodeAt(0) + Math.floor(i / 9));
    let col = (i % 9) + 1;
    let cell = document.getElementsByClassName(rowLetter + col)[0];
    if (cell) {
      cell.innerText = (!data[i] || data[i] === ".") ? " " : data[i];
    }
  }
}

async function getSolved() {
  errorMsg.innerHTML = "";
  const puzzle = textArea.value;
  if (!puzzle) {
    errorMsg.innerHTML = `<code>{"error": "Puzzle is required"}</code>`;
    return;
  }

  const res = await fetch("/api/solve", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify({ puzzle })
  });

  const parsed = await res.json();
  if (parsed.error) {
    errorMsg.innerHTML = `<code>${JSON.stringify(parsed, null, 2)}</code>`;
  } else {
    fillpuzzle(parsed.solution);
  }
}

async function getChecked() {
  errorMsg.innerHTML = "";
  const puzzle = textArea.value;
  const coordinate = coordInput.value.toUpperCase();
  const value = valInput.value;

  if (!puzzle || !coordinate || !value) {
    errorMsg.innerHTML = `<code>{"error": "All fields are required"}</code>`;
    return;
  }

  const res = await fetch("/api/check", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify({ puzzle, coordinate, value })
  });

  const parsed = await res.json();
  errorMsg.innerHTML = `<code>${JSON.stringify(parsed, null, 2)}</code>`;
}

document.getElementById("solve-button").addEventListener("click", getSolved);
document.getElementById("check-button").addEventListener("click", getChecked);
