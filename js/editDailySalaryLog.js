import {
  getDailySalaryRecord,
  modifyDailySalaryRecord,
  addDailySalaryRecord,
} from "./RequestHandler.js";
import { getUrlParameters, showAlert } from "../utilities.js";

// Function to populate the form with salary log data
function populateForm(salaryLog) {
  console.log(salaryLog);

  document.getElementById("month").value = salaryLog.month;
  document.getElementById("date").value = salaryLog.date;
  document.getElementById("mentee_count").value = parseInt(
    salaryLog.mentee_count
  );
  document.getElementById("status").value = salaryLog.status;
}

// Function to handle form submission
async function handleFormSubmit(event) {
  event.preventDefault();

  const param = getUrlParameters();
  const salaryLogData = {
    mentor_id: param.mentorId,
    month: document.getElementById("month").value,
    date: document.getElementById("date").value,
    mentee_count: document.getElementById("mentee_count").value,
    status: document.getElementById("status").value,
    salary:
      document.getElementById("mentee_count").value * param.payPerDayPerMentee,
  };

  try {
    let response;
    if (param.id) {
      response = await modifyDailySalaryRecord({ id: param.id }, salaryLogData);
    } else {
      response = await addDailySalaryRecord(salaryLogData);
    }
    if (response.error) {
      throw new Error("Failed to save salary log data, ", response.error);
    }

    showAlert("Edit Daily Log", "Daily log saved successfully!");
    window.close();
  } catch (error) {
    console.error(error);
    showAlert("Error", "Error saving daily log data, " + error, "error");
  }
}

async function main() {
  const param = getUrlParameters();

  if (param.id) {
    const salaryLog = await getDailySalaryRecord(param.id);
    if (salaryLog) {
      populateForm(salaryLog);
      document.getElementById("form-title").textContent = "Edit Daily Log"; // Update title for edit mode
    }
  }
}

// Attach event listeners
document
  .getElementById("daily-log-form")
  .addEventListener("submit", handleFormSubmit);
main(); // Run main function on page load
