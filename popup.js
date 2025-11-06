// Bitbucket Confetti - Popup Settings

// Load saved settings
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['confettiLevel'], (result) => {
    const level = result.confettiLevel || 'a-lot';
    const radio = document.querySelector(`input[value="${level}"]`);
    if (radio) {
      radio.checked = true;
    }
  });
});

// Save settings when changed
document.querySelectorAll('input[name="confettiLevel"]').forEach((radio) => {
  radio.addEventListener('change', (e) => {
    const level = e.target.value;
    chrome.storage.sync.set({ confettiLevel: level }, () => {
      showStatus('Settings saved!');
    });
  });
});

// Test button functionality
document.getElementById('testBtn').addEventListener('click', () => {
  const selectedLevel = document.querySelector('input[name="confettiLevel"]:checked').value;
  testConfetti(selectedLevel);
  showStatus('Testing confetti...');
});

// Show status message
function showStatus(message) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.style.opacity = '1';

  setTimeout(() => {
    status.style.opacity = '0';
  }, 2000);
}

// Test confetti in popup
function testConfetti(level) {
  const configs = {
    'minimal': {
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    },
    'a-lot': {
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
      ticks: 200
    },
    'a-ton': {
      particleCount: 300,
      spread: 120,
      origin: { y: 0.4 },
      ticks: 300,
      scalar: 1.2
    }
  };

  const config = configs[level];

  if (level === 'a-ton') {
    // Multiple bursts
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti({
        ...config,
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });

      confetti({
        ...config,
        particleCount: 100,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 250);
  } else {
    confetti(config);
  }
}
