import { showAlert, showConfirmation } from "../utilities.js";
import {
  deleteMonthlySalaryRecord,
  getAllMonthlySalaryRecord,
  modifyMonthlySalaryRecord,
  getAllMentors,
} from "./RequestHandler.js";

// Edit salary function
function EditSalary(id) {
  window.open(`editMonthlySalary.html?id=${id}`, `_blank`);
}

function SettleSalary(name, month, id) {
  showConfirmation(
    `Do you want to settle salary of ${name} for month ${month}?`,
    "The status of this payroll will be changed to settled."
  ).then((response) => {
    if (response) {
      modifyMonthlySalaryRecord(id, { status: "paid" }).then((res) => {
        if (res.error) {
          showAlert("Error", "Error in settling salary record", "error");
        } else {
          showAlert("Done", "Salary settled successfully");
        }
      });
    }
  });
}

// Delete salary function
async function DeleteSalary(name, month, id) {
  showConfirmation(
    `Do you want to delete salary record of ${name} for month ${month}?`,
    "Deleting the salary is permanent. However, the mentors related to this salary won't be affected."
  ).then((response) => {
    if (response) {
      deleteMonthlySalaryRecord(id).then((res) => {
        if (res.error) {
          showAlert("Error", "Error in deleting salary record", "error");
        } else {
          showAlert("Done", "Record deleted successfully");
          window.location.reload();
        }
      });
    }
  });
}
// Function to populate the salary table
async function populateSalaryTable(salaries) {
  const tbody = document.getElementById("salaries-tbody");
  tbody.innerHTML = ""; // Clear existing content
  const mentors = await getAllMentors();
  salaries.sort((a, b) => new Date(b.month) - new Date(a.month));
  salaries?.forEach((salary, index) => {
    const row = document.createElement("tr");
    if (index % 2 === 1) {
      row.classList.add("bg-gray-100"); // Light gray for odd rows
    }
    row.innerHTML = `
    <td class="px-4 py-2">${
      mentors?.find((m) => m.id === salary.mentor_id).name
    }</td>
  <td class="px-4 py-2">${salary.month}</td>
  <td class="px-4 py-2">₹${salary.total_salary}</td>
  <td class="px-4 py-2">${salary.status}</td>
  <td class="px-4 py-2 flex space-x-4">
      <button id="Settle_${
        salary.id
      }" class="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">
          Settle
      </button>
      <button id="Edit_${
        salary.id
      }" class="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
          Edit
      </button>
      <button id="Delete_${
        salary.id
      }" class="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
          Delete
      </button>
  </td>
`;
    tbody.appendChild(row);
    document
      .getElementById(`Settle_${salary.id}`)
      .addEventListener("click", () =>
        SettleSalary(
          mentors?.find((m) => m.id === salary.mentor_id).name,
          salary.month,
          salary.id
        )
      );
    document
      .getElementById(`Edit_${salary.id}`)
      .addEventListener("click", () => EditSalary(salary.id));
    document
      .getElementById(`Delete_${salary.id}`)
      .addEventListener("click", () =>
        DeleteSalary(
          mentors?.find((m) => m.id === salary.mentor_id).name,
          salary.month,
          salary.id
        )
      );
  });
}

// Function to load salaries on page load
async function loadSalaries() {
  const salaries = await getAllMonthlySalaryRecord();
  console.log(salaries);

  await populateSalaryTable(salaries);
}

// Call loadSalaries on page load
loadSalaries();
