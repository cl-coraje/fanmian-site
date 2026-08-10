(() => {
  "use strict";

  const allowedThresholds = new Set([10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]);
  const allowedBreaks = new Set([30, 60, 90]);
  const params = new URLSearchParams(window.location.search);
  const parsedThreshold = Number.parseInt(params.get("threshold") || "", 10);
  const parsedBreak = Number.parseInt(params.get("break") || "", 10);
  const threshold = allowedThresholds.has(parsedThreshold) ? parsedThreshold : 25;
  const breakSeconds = allowedBreaks.has(parsedBreak) ? parsedBreak : 60;
  const customLink = `fanmian://challenge?threshold=${threshold}&break=${breakSeconds}`;

  document.querySelector("#threshold").textContent = String(threshold);
  document.querySelector("#break-seconds").textContent = String(breakSeconds);

  const fallback = document.querySelector("#install-fallback");
  const openButton = document.querySelector("#open-app");
  openButton.href = customLink;
  openButton.addEventListener("click", () => {
    window.setTimeout(() => {
      if (document.visibilityState === "visible") fallback.hidden = false;
    }, 1300);
  });

  const config = window.FANMIAN_CONFIG || {};
  const stores = [
    ["#ios-store", config.appStoreUrl],
    ["#android-store", config.androidStoreUrl],
  ];
  let hasStoreLink = false;
  stores.forEach(([selector, url]) => {
    if (typeof url !== "string" || !/^https:\/\//.test(url)) return;
    const element = document.querySelector(selector);
    element.href = url;
    element.hidden = false;
    hasStoreLink = true;
  });
  if (hasStoreLink) document.querySelector("#testing-note").hidden = true;

  const toast = document.querySelector("#toast");
  let toastTimer;
  const showToast = (message) => {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 1800);
  };

  document.querySelector("#share-link").addEventListener("click", async () => {
    const shareData = {
      title: "翻面挑战",
      text: `短视频刷到 ${threshold} 分钟，就把手机翻面 ${breakSeconds} 秒。`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast("挑战链接已复制");
      }
    } catch (error) {
      if (error && error.name === "AbortError") return;
      showToast("请复制浏览器地址分享");
    }
  });
})();
