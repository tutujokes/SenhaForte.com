const { createApp, ref, computed, onMounted } = Vue;

createApp({
  setup() {
    const password = ref('');
    const length = ref(16);
    const useUpper = ref(true);
    const useLower = ref(true);
    const useNumbers = ref(true);
    const useSymbols = ref(true);
    const feedbackMsg = ref('');
    const history = ref([]);
    const showHistory = ref(false);
    const spinnerRunning = ref(false);

    const CHARS = {
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lower: 'abcdefghijklmnopqrstuvwxyz',
      number: '0123456789',
      symbol: '!@#$%^&*()-_=+[]{}|;:,.<>?'
    };

    const isDark = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
};
    
    const generatePassword = () => {
      let charset = '';
      const guaranteed = [];

      if (useUpper.value) { charset += CHARS.upper; guaranteed.push(randomChar(CHARS.upper)); }
      if (useLower.value) { charset += CHARS.lower; guaranteed.push(randomChar(CHARS.lower)); }
      if (useNumbers.value) { charset += CHARS.number; guaranteed.push(randomChar(CHARS.number)); }
      if (useSymbols.value) { charset += CHARS.symbol; guaranteed.push(randomChar(CHARS.symbol)); }

      if (!charset) return '';

      let pwd = [...guaranteed];
      while (pwd.length < length.value) {
        pwd.push(randomChar(charset));
      }

      return pwd.sort(() => 0.5 - Math.random()).join('');
    };

    const randomChar = (charset) => charset.charAt(Math.floor(Math.random() * charset.length));

    const copyPassword = () => {
      if (!password.value) return;
      navigator.clipboard.writeText(password.value).then(() => {
        showFeedback('Senha copiada!');
      });
    };

    const showFeedback = (msg) => {
      feedbackMsg.value = msg;
      setTimeout(() => feedbackMsg.value = '', 2000);
    };

    const saveToHistory = (pwd) => {
      history.value.unshift(pwd);
      if (history.value.length > 10) history.value.pop();
      localStorage.setItem('passwordHistory', JSON.stringify(history.value));
    };

    const loadHistory = () => {
      history.value = JSON.parse(localStorage.getItem('passwordHistory')) || [];
    };

    const generate = () => {
      if (!(useUpper.value || useLower.value || useNumbers.value || useSymbols.value)) {
        showFeedback('Selecione pelo menos uma opção!');
        return;
      }
      spinnerRunning.value = true;
      setTimeout(() => {
        password.value = generatePassword();
        saveToHistory(password.value);
        spinnerRunning.value = false;
      }, 300);
    };

    onMounted(() => {
      loadHistory();
      generate();
    });

    return {
      password, length, useUpper, useLower, useNumbers, useSymbols,
      feedbackMsg, history, showHistory, spinnerRunning,
      copyPassword, generate, isDark, toggleTheme
    };
  }
}).mount('#app');
