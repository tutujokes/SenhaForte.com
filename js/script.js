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
const toggleBtn = document.getElementById('toggleHistoryBtn');
const historyContainer = document.getElementById('historyContainer');

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

  let password = guaranteed;
  while (password.length < length) {
    password.push(randomChar(charset));
  }

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

function savePasswordToHistory(password) {
  const history = JSON.parse(localStorage.getItem('passwordHistory')) || [];
  history.unshift(password);
  if (history.length > 10) history.pop();
  localStorage.setItem('passwordHistory', JSON.stringify(history));
}

function loadPasswordHistory() {
  const history = JSON.parse(localStorage.getItem('passwordHistory')) || [];
  const historyList = document.getElementById('historyList');
  if (!historyList) return;
  historyList.innerHTML = '';
  history.forEach(pwd => {
    const li = document.createElement('li');
    li.textContent = pwd;
    li.className = 'font-mono text-sm text-[#2d3436] bg-[#dfe6e9] px-2 py-1 rounded mb-1';
    historyList.appendChild(li);
  });
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
  generateBtn.classList.remove('bg-[#0984e3]', 'hover:bg-[#74b9ff]');
  generateBtn.classList.add('bg-gray-400', 'cursor-not-allowed');

  setTimeout(() => {
    const password = generatePassword(length, useUpper, useLower, useNumbers, useSymbols);
    passwordDisplay.value = password;

    savePasswordToHistory(password);
    loadPasswordHistory();

    spinnerIcon.style.animationPlayState = 'paused';
    generateBtn.disabled = false;
    generateBtn.classList.remove('bg-gray-400', 'cursor-not-allowed');
    generateBtn.classList.add('bg-[#0984e3]', 'hover:bg-[#74b9ff]');
  }, 300);
});

// Botão de mostrar/ocultar histórico
toggleBtn.addEventListener('click', () => {
  const isHidden = historyContainer.classList.toggle('hidden');
  toggleBtn.textContent = isHidden ? 'Mostrar histórico de senhas' : 'Ocultar histórico de senhas';
});

// Inicializa
updateLengthDisplay();
window.addEventListener('load', () => {
  generateBtn.click();
  loadPasswordHistory();
});