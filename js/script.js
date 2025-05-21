const passwordDisplay = document.getElementById('passwordDisplay');
const copyBtn = document.getElementById('copyBtn');
const lengthRange = document.getElementById('lengthRange');
const lengthValue = document.getElementById('lengthValue');
const uppercase = document.getElementById('uppercase');
const lowercase = document.getElementById('lowercase');
const numbers = document.getElementById('numbers');
const symbols = document.getElementById('symbols');
const generateBtn = document.getElementById('generateBtn');
const feedbackMsg = document.getElementById('feedbackMsg');
const spinnerIcon = document.getElementById('spinnerIcon');

// Conjuntos de caracteres
const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  number: '0123456789',
  symbol: '!@#$%^&*()-_=+[]{}|;:,.<>?'
};

function generatePassword(length, useUpper, useLower, useNumbers, useSymbols) {
  let charset = '';
  const guaranteed = [];

  if (useUpper) {
    charset += CHARS.upper;
    guaranteed.push(randomChar(CHARS.upper));
  }
  if (useLower) {
    charset += CHARS.lower;
    guaranteed.push(randomChar(CHARS.lower));
  }
  if (useNumbers) {
    charset += CHARS.number;
    guaranteed.push(randomChar(CHARS.number));
  }
  if (useSymbols) {
    charset += CHARS.symbol;
    guaranteed.push(randomChar(CHARS.symbol));
  }

  if (!charset) return '';

  // Completa com caracteres aleatórios
  let password = guaranteed;
  while (password.length < length) {
    password.push(randomChar(charset));
  }

  // Embaralha
  return password.sort(() => 0.5 - Math.random()).join('');
}

function randomChar(charset) {
  return charset.charAt(Math.floor(Math.random() * charset.length));
}

function showFeedback(message) {
  feedbackMsg.textContent = message;
  feedbackMsg.style.opacity = '1';
  setTimeout(() => {
    feedbackMsg.style.opacity = '0';
  }, 2000);
}

function updateLengthDisplay() {
  lengthValue.textContent = lengthRange.value;
  lengthRange.setAttribute('aria-valuenow', lengthRange.value);
}

// Eventos
lengthRange.addEventListener('input', updateLengthDisplay);

copyBtn.addEventListener('click', () => {
  const password = passwordDisplay.value;
  if (!password) return;
  navigator.clipboard.writeText(password).then(() => showFeedback('Senha copiada!'));
});

generateBtn.addEventListener('click', () => {
  const length = parseInt(lengthRange.value, 10);
  const useUpper = uppercase.checked;
  const useLower = lowercase.checked;
  const useNumbers = numbers.checked;
  const useSymbols = symbols.checked;

  if (!(useUpper || useLower || useNumbers || useSymbols)) {
    showFeedback('Selecione pelo menos uma opção!');
    return;
  }

  spinnerIcon.style.animationPlayState = 'running';
  generateBtn.disabled = true;

  setTimeout(() => {
    const password = generatePassword(length, useUpper, useLower, useNumbers, useSymbols);
    passwordDisplay.value = password;
    spinnerIcon.style.animationPlayState = 'paused';
    generateBtn.disabled = false;
  }, 300);
});

// Inicializa
updateLengthDisplay();
window.addEventListener('load', () => generateBtn.click());