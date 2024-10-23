const { ipcRenderer } = require("electron");

function sendInput() {
  const input = document.getElementById("user-input").value;
  ipcRenderer.send("input-received", input);
  window.close(); // Close the prompt window
}
// Get the data passed from the main process
ipcRenderer.on("prompt-data", (event, message) => {
  document.getElementById("prompt-message").innerText = message;
  document.getElementById("prompt-submit").addEventListener("click", sendInput);
});
