const { ipcRenderer } = require("electron");

// Get references to elements
const titleElement = document.getElementById("popup-title");
const messageElement = document.getElementById("popup-message");
const cancelButton = document.getElementById("cancel-button");
const continueButton = document.getElementById("continue-button");

// Get the data passed from the main process
ipcRenderer.on("popup-data", (event, { title, message }) => {
  console.log(title, message);

  titleElement.innerText = title;
  messageElement.innerText = message;
});

// Handle button clicks
cancelButton.addEventListener("click", () => {
  ipcRenderer.send("popup-response", false);
  window.close();
});

continueButton.addEventListener("click", () => {
  ipcRenderer.send("popup-response", true);
  window.close();
});
