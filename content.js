(function () {
  "use strict";

  console.log("🎉 Bitbucket Confetti extension loaded!");
  console.log("Current URL:", window.location.href);

  // Check if we're on an individual PR page (not a list page)
  function isIndividualPRPage() {
    const url = window.location.href;
    // Individual PR URLs have a number at the end: /pull-requests/123 or /pull-requests/123/overview
    // List pages have query params: /pull-requests/?user_filter=...
    const prNumberPattern = /\/pull-requests\/\d+/;
    return prNumberPattern.test(url);
  }

  // Exit early if not on an individual PR page
  if (!isIndividualPRPage()) {
    console.log("Not on individual PR page, exiting...");
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

        // Fire from all directions
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

        // Random explosions
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

    console.log("🎉 Bitbucket Confetti triggered!", level);
  }

  // Check if PR is merged by looking for merge indicators
  function isPRMerged() {
    console.log("Checking if PR is merged...");

    // Look for the merged state badge/indicator
    const mergedBadge = document.querySelector(
      '[data-testid="pullrequest-state-badge"]'
    );
    if (mergedBadge) {
      const text = mergedBadge.textContent.toLowerCase();
      console.log("Found badge with text:", text);
      if (text.includes("merged")) {
        console.log("✓ PR is merged (badge check)");
        return true;
      }
    }

    // Alternative: check for merge message
    const mergeMessage = document.querySelector(
      '[data-qa="pr-merged-message"]'
    );
    if (mergeMessage) {
      console.log("✓ PR is merged (merge message check)");
      return true;
    }

    // Check for "Merged" text in various places
    const bodyText = document.body.innerText.toLowerCase();
    if (
      bodyText.includes("this pull request is merged") ||
      bodyText.includes("merged this pull request") ||
      bodyText.includes("pull request merged")
    ) {
      console.log("✓ PR is merged (body text check)");
      return true;
    }

    // Check for span or div with "MERGED" status
    const statusElements = document.querySelectorAll("span, div, button");
    for (const el of statusElements) {
      const text = el.textContent.trim().toUpperCase();
      if (text === "MERGED" && el.children.length === 0) {
        console.log("✓ PR is merged (status element check)");
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
      return; // Already added
    }

    console.log("Adding celebrate button!");

    const button = document.createElement("button");
    button.id = "bitbucket-confetti-btn";
    button.textContent = "🎉 Celebrate!";
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
      button.textContent = "🎉 Woohoo!";
      setTimeout(() => {
        button.textContent = "🎉 Celebrate!";
      }, 2000);
    });

    document.body.appendChild(button);
  }

  // Observe DOM changes to detect merge events
  function observePRStatus() {
    if (isPRMerged() && !hasTriggered) {
      hasTriggered = true;
      triggerConfetti();
      return;
    }

    // Add manual trigger button if already merged
    if (isPRMerged()) {
      addManualTriggerButton();
    }

    const observer = new MutationObserver((mutations) => {
      if (isPRMerged() && !hasTriggered) {
        hasTriggered = true;
        triggerConfetti();
        observer.disconnect();
      }

      // Add button if merge happens
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
