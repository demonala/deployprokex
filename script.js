document.addEventListener("DOMContentLoaded", () => {
  const terminal = document.querySelector(".terminal-text");
  const messages = [
    "[INFO] Initializing system...",
    "[INFO] Ready for deployment.",
    "[INFO] Upload your HTML file now."
  ];
  let index = 0;

  setInterval(() => {
    if (index < messages.length) {
      terminal.textContent = messages[index];
      index++;
    }
  }, 2000);
});