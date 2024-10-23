import {
  checkAuthorisation,
  getAllMentors,
  getAllMonthlySalaryRecord,
  getInsights,
} from "./js/RequestHandler.js";
import { showAlert, showInputPrompt } from "./utilities.js";

async function fetchInsights() {
  try {
    const response = await getInsights();
    if (response.error) {
      showAlert(
        "Network Error",
        "There was a problem connecting to server. Check your internet connection or wait for server to restart.",
        "error"
      );
      return;
    }

    document.getElementById("total-mentors").textContent =
      response.totalMentors || 0;
    document.getElementById("total-mentees").textContent =
      response.totalMentees || 0;
    document.getElementById("mentors-onleave").textContent =
      response.totalMentorsOnLeave || 0;
    document.getElementById("monthly-salary").textContent = `₹${
      response.totalMonthlySalary.toFixed(2) || "0.00"
    }`;
    await populateSalaryTable();
  } catch (error) {
    console.error("Error fetching insights:", error);
  }
}

// Function to populate the salary table
async function populateSalaryTable() {
  const salaries = await getAllMonthlySalaryRecord();
  const tbody = document.getElementById("salary-breakdown-tbody");
  tbody.innerHTML = ""; // Clear existing content
  const mentors = await getAllMentors();
  salaries?.forEach((salary, index) => {
    const row = document.createElement("tr");
    if (index % 2 === 1) {
      row.classList.add("bg-gray-100"); // Light gray for odd rows
    }
    row.innerHTML = `
    <td class="px-4 py-2">${
      mentors?.find((m) => m.id === salary.mentor_id).name
    }</td>
  <td class="px-4 py-2">${salary.days_worked}</td>
  <td class="px-4 py-2">${salary.total_leaves}</td>
  <td class="px-4 py-2">₹${salary.total_salary}</td>
  
`;
    tbody.appendChild(row);
  });
}

async function main() {
  let isAuthorized = false;

  while (!isAuthorized) {
    const res = await checkAuthorisation();
    if (res.error) {
      const key = await showInputPrompt("Enter Access Key!");
      console.log(key);
      localStorage.setItem("accessKey", key);
      if (!key) {
        await showAlert("Please provide a correct key", "warning");
        return;
      }
    } else {
      isAuthorized = true; // Exit the loop if authorized
    }
  }
  await fetchInsights();
}
main();
