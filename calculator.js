let expression = '';
let justCalculated = false;

const exprEl   = document.getElementById('expression');
const resultEl = document.getElementById('result');

function updateDisplay(value) {
  resultEl.textContent = value;
}

function appendNum(num) {
  if (justCalculated) {
    expression = '';
    justCalculated = false;
  }
  expression += num;
  exprEl.textContent = expression;
  updateDisplay(expression);
}

function appendOp(op) {
  justCalculated = false;
  // Replace trailing operator if one is already there
  if (expression && '+-*/'.includes(expression.slice(-1))) {
    expression = expression.slice(0, -1);
  }
  expression += op;
  exprEl.textContent = expression;

  const display = expression.replace(/\*/g, '×').replace(/\//g, '÷').replace(/-/g, '−');
  updateDisplay(display);
}

function appendDot() {
  if (justCalculated) {
    expression = '0';
    justCalculated = false;
  }
  // Find the last number segment and check if it already has a dot
  const parts = expression.split(/[\+\-\*\/]/);
  const lastPart = parts[parts.length - 1];
  if (lastPart.includes('.')) return;
  if (lastPart === '') expression += '0';
  expression += '.';
  exprEl.textContent = expression;
  updateDisplay(expression);
}

function percent() {
  if (!expression) return;
  try {
    const val = parseFloat(eval(expression));
    expression = String(val / 100);
    exprEl.textContent = expression;
    updateDisplay(expression);
  } catch {
    updateDisplay('Error');
  }
}

function backspace() {
  if (justCalculated) {
    clearAll();
    return;
  }
  expression = expression.slice(0, -1);
  exprEl.textContent = expression;
  updateDisplay(expression || '0');
}

function clearAll() {
  expression = '';
  justCalculated = false;
  exprEl.textContent = '';
  updateDisplay('0');
}

function calculate() {
  if (!expression) return;
  try {
    const raw = eval(expression);
    const result = parseFloat(raw.toFixed(10));
    exprEl.textContent = expression + ' =';
    expression = String(result);
    updateDisplay(result);
    justCalculated = true;
  } catch {
    updateDisplay('Error');
    expression = '';
  }
}

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendNum(e.key);
  else if (e.key === '+') appendOp('+');
  else if (e.key === '-') appendOp('-');
  else if (e.key === '*') appendOp('*');
  else if (e.key === '/') { e.preventDefault(); appendOp('/'); }
  else if (e.key === '.') appendDot();
  else if (e.key === '%') percent();
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Backspace') backspace();
  else if (e.key === 'Escape') clearAll();
});