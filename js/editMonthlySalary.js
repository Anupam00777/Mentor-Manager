import {
  addMonthlySalaryRecord,
  getMonthlySalaryRecord,
  modifyMonthlySalaryRecord,
  getAllMentors,
} from "./RequestHandler.js";
import { getUrlParameters, showAlert } from "../utilities.js";

// Function to populate the form with salary log data
function populateForm(salaryLog) {
  document.getElementById("mentor-id").value = salaryLog.mentor_id;
  document.getElementById("month").value = salaryLog.month;
  document.getElementById("total-salary").value = salaryLog.total_salary;
  document.getElementById("status").value = salaryLog.status;
}

// Function to load mentors into the dropdown
async function loadMentors() {
  const mentors = await getAllMentors();
  const mentorSelect = document.getElementById("mentor-id");
  console.log(mentors);

  mentors.forEach((mentor) => {
    const option = document.createElement("option");
    option.value = mentor.id;
    option.textContent = mentor.name;
    mentorSelect.appendChild(option);
  });
}

// Function to handle form submission
async function handleFormSubmit(event) {
  event.preventDefault();

  const param = getUrlParameters();
  const salaryLogData = {
    mentor_id: document.getElementById("mentor-id").value,
    month: document.getElementById("month").value,
    total_salary: document.getElementById("total-salary").value,
    status: document.getElementById("status").value,
  };

  try {
    let response;
    if (param.id) {
      response = await modifyMonthlySalaryRecord(param.id, salaryLogData);
    } else {
      response = await addMonthlySalaryRecord(salaryLogData);
    }
    if (response.error) {
      throw new Error("Failed to save salary log data, ", response.error);
    }

    showAlert("Edit Salary Log", "Salary log saved successfully!");
    window.close();
  } catch (error) {
    console.error(error);
    showAlert("Error", "Error saving salary log data, " + error, "error");
  }
}

// Main function to load data
async function main() {
  await loadMentors(); // Load mentors first

  const param = getUrlParameters();

  if (param.id) {
    const salaryLog = await getMonthlySalaryRecord(param.id);
    if (salaryLog) {
      populateForm(salaryLog);
      document.getElementById("form-title").textContent = "Edit Salary Log"; // Update title for edit mode
    }
  }
}

// Attach event listeners
document
  .getElementById("salary-log-form")
  .addEventListener("submit", handleFormSubmit);
main(); // Run main function on page load
