// Bitbucket Confetti - Content Script
// Monitors PR pages and triggers confetti on merge

(function() {
  'use strict';

  let hasTriggered = false;

  // Get confetti settings from storage
  async function getConfettiLevel() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['confettiLevel'], (result) => {
        resolve(result.confettiLevel || 'a-lot');
      });
    });
  }

  // Confetti configurations based on level
  const confettiConfigs = {
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

  // Trigger confetti based on level
  async function triggerConfetti() {
    const level = await getConfettiLevel();
    const config = confettiConfigs[level];

    if (level === 'a-ton') {
      // Multiple bursts for "a ton"
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
      // Single burst for minimal and a-lot
      confetti(config);
    }

    console.log('🎉 Bitbucket Confetti triggered!', level);
  }

  // Check if PR is merged by looking for merge indicators
  function isPRMerged() {
    // Look for the merged state badge/indicator
    const mergedBadge = document.querySelector('[data-testid="pullrequest-state-badge"]');
    if (mergedBadge) {
      const text = mergedBadge.textContent.toLowerCase();
      return text.includes('merged');
    }

    // Alternative: check for merge message
    const mergeMessage = document.querySelector('[data-qa="pr-merged-message"]');
    if (mergeMessage) {
      return true;
    }

    // Check for "Merged" text in various places
    const headerText = document.body.innerText;
    if (headerText.includes('This pull request is merged')) {
      return true;
    }

    return false;
  }

  // Observe DOM changes to detect merge events
  function observePRStatus() {
    if (isPRMerged() && !hasTriggered) {
      hasTriggered = true;
      triggerConfetti();
      return;
    }

    const observer = new MutationObserver((mutations) => {
      if (isPRMerged() && !hasTriggered) {
        hasTriggered = true;
        triggerConfetti();
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-testid', 'class']
    });
  }

  // Initialize when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observePRStatus);
  } else {
    observePRStatus();
  }

  // Also check on navigation changes (for single-page app behavior)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      hasTriggered = false;
      setTimeout(observePRStatus, 1000); // Wait for page to load
    }
  }).observe(document, { subtree: true, childList: true });
})();
