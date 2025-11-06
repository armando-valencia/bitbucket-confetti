(function () {
  "use strict";

  function isIndividualPRPage() {
    const url = window.location.href;
    const prNumberPattern = /\/pull-requests\/\d+/;
    return prNumberPattern.test(url);
  }

  if (!isIndividualPRPage()) {
    return;
  }

  let hasTriggered = false;

  async function getConfettiLevel() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(["confettiLevel"], (result) => {
        resolve(result.confettiLevel || "a-lot");
      });
    });
  }

  const confettiConfigs = {
    minimal: {
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    },
    "a-lot": {
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
      ticks: 200,
    },
    "a-ton": {
      particleCount: 300,
      spread: 120,
      origin: { y: 0.4 },
      ticks: 300,
      scalar: 1.2,
    },
    extreme: {
      particleCount: 500,
      spread: 180,
      origin: { y: 0.5 },
      ticks: 400,
      scalar: 1.5,
      gravity: 0.5,
    },
  };

  async function triggerConfetti() {
    const level = await getConfettiLevel();
    const config = confettiConfigs[level];

    if (level === "extreme") {
      const duration = 10000;
      const animationEnd = Date.now() + duration;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        // fire from all directions
        confetti({
          ...config,
          particleCount: 200,
          angle: 60,
          spread: 100,
          origin: { x: 0, y: 0.6 },
        });

        confetti({
          ...config,
          particleCount: 200,
          angle: 120,
          spread: 100,
          origin: { x: 1, y: 0.6 },
        });

        confetti({
          ...config,
          particleCount: 150,
          angle: 90,
          spread: 120,
          origin: { x: 0.5, y: 0.3 },
        });

        // confetti explosions
        confetti({
          ...config,
          particleCount: 100,
          angle: Math.random() * 360,
          spread: 100,
          origin: { x: Math.random(), y: Math.random() * 0.6 },
        });
      }, 150);
    } else if (level === "a-ton") {
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
          origin: { x: 0 },
        });

        confetti({
          ...config,
          particleCount: 100,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 250);
    } else {
      confetti(config);
    }
  }

  function isPRMerged() {
    const mergedBadge = document.querySelector(
      '[data-testid="pullrequest-state-badge"]'
    );
    if (mergedBadge) {
      const text = mergedBadge.textContent.toLowerCase();
      console.log("Found badge with text:", text);
      if (text.includes("merged")) {
        return true;
      }
    }

    const mergeMessage = document.querySelector(
      '[data-qa="pr-merged-message"]'
    );
    if (mergeMessage) {
      return true;
    }

    const bodyText = document.body.innerText.toLowerCase();
    if (
      bodyText.includes("this pull request is merged") ||
      bodyText.includes("merged this pull request") ||
      bodyText.includes("pull request merged")
    ) {
      return true;
    }

    const statusElements = document.querySelectorAll("span, div, button");
    for (const el of statusElements) {
      const text = el.textContent.trim().toUpperCase();
      if (text === "MERGED" && el.children.length === 0) {
        return true;
      }
    }

    console.log("✗ PR is not merged (no indicators found)");
    return false;
  }

  // Add a manual trigger button for already-merged PRs
  function addManualTriggerButton() {
    console.log("Attempting to add manual trigger button...");
    if (!isPRMerged()) {
      console.log("Skipping button - PR not merged");
      return;
    }
    if (document.getElementById("bitbucket-confetti-btn")) {
      console.log("Button already exists");
      return;
    }

    const button = document.createElement("button");
    button.id = "bitbucket-confetti-btn";
    button.textContent = "🎉 do it again";
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      padding: 12px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      transition: all 0.2s ease;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    button.addEventListener("mouseenter", () => {
      button.style.transform = "translateY(-2px)";
      button.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.5)";
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "translateY(0)";
      button.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
    });

    button.addEventListener("click", () => {
      triggerConfetti();
    });

    document.body.appendChild(button);
  }

  function observePRStatus() {
    if (isPRMerged() && !hasTriggered) {
      hasTriggered = true;
      triggerConfetti();
      return;
    }

    if (isPRMerged()) {
      addManualTriggerButton();
    }

    const observer = new MutationObserver((mutations) => {
      if (isPRMerged() && !hasTriggered) {
        hasTriggered = true;
        triggerConfetti();
        observer.disconnect();
      }

      if (isPRMerged()) {
        addManualTriggerButton();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-testid", "class"],
    });
  }

  // Initialize when page loads
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observePRStatus);
  } else {
    observePRStatus();
  }

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
