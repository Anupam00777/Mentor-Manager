const { ipcRenderer } = require("electron");

// Show confirmation dialog
export async function showConfirmation(title, message) {
  const result = await ipcRenderer.invoke(
    "show-popup",
    title || "Confirm Action",
    message || "Are you sure you want to continue?"
  );
  return result;
}
export function showAlert(title = "App", message, type) {
  ipcRenderer.send("show-alert", title, message, type);
}

export async function showInputPrompt(message) {
  const userInput = await ipcRenderer.invoke("show-prompt", message);
  return userInput;
}

/**
 * Gets all URL parameters as an object.
 * @returns {object} An object containing all URL parameters.
 */
export function getUrlParameters() {
  const params = new URLSearchParams(window.location.search);
  const paramsObj = {};

  // Iterate through the parameters and add them to the object
  for (const [key, value] of params.entries()) {
    paramsObj[key] = value;
  }

  return paramsObj;
}

export function objectHasFalsyValues(obj) {
  for (const [key, value] of Object.entries(obj)) {
    if (
      !value ||
      (Array.isArray(value) &&
        (value.length === 0 || value.every((item) => !item)))
    ) {
      return true;
    }
  }
}

export function removeFalsyValues(data) {
  if (Array.isArray(data)) {
    return data
      .map((item) => removeFalsyValues(item))
      .filter((value) => {
        if (value === 0) return true;
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === "object" && value !== null)
          return Object.keys(value).length > 0;
        if (typeof value === "string") return value.trim() !== "";
        return Boolean(value);
      });
  } else if (typeof data === "object" && data !== null) {
    return Object.fromEntries(
      Object.entries(data)
        .map(([key, value]) => [key, removeFalsyValues(value)])
        .filter(([_, value]) => {
          if (value === 0) return true; // Keep 0
          if (Array.isArray(value)) return value.length > 0;
          if (typeof value === "object" && value !== null)
            return Object.keys(value).length > 0;
          if (typeof value === "string") return value.trim() !== "";
          return Boolean(value);
        })
    );
  }
  return data;
}
