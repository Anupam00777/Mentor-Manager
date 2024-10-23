import { showAlert, showConfirmation } from "../utilities.js";
import {
  deleteMonthlySalaryRecord,
  getAllMonthlySalaryRecord,
  modifyMonthlySalaryRecord,
  getAllMentors,
  auditMonthlySalaryRecord,
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

// Audit  salary function
async function AuditSalary(mentorId, month, name) {
  showConfirmation(
    `Do you want to audit salary record of ${name} for month ${month}?`,
    "The previous record will be overwritten."
  ).then((response) => {
    if (response) {
      auditMonthlySalaryRecord(mentorId, month).then((res) => {
        if (res.error) {
          showAlert("Error", "Error in audit salary record", "error");
        } else {
          showAlert("Done", "Record updated successfully");
          window.location.reload();
        }
      });
    }
  });
}
// Function to populate the salary table
async function populateSalaryTable(limit = 50, skip = 0) {
  const salaries = await getAllMonthlySalaryRecord(limit, skip);
  if (salaries.length === 0) return 0;
  const tbody = document.getElementById("salaries-tbody");
  tbody.innerHTML = ""; // Clear existing content
  const mentors = await getAllMentors();
  salaries?.forEach((salary, index) => {
    const row = document.createElement("tr");
    if (index % 2 === 1) {
      row.classList.add("bg-gray-100"); // Light gray for odd rows
    }
    const mentorName = mentors?.find((m) => m.id === salary.mentor_id).name;
    row.innerHTML = `
    <td class="px-4 py-2">${mentorName}</td>
  <td class="px-4 py-2">${salary.month}</td>
  <td class="px-4 py-2">${salary.days_worked}</td>
  <td class="px-4 py-2">${salary.total_leaves}</td>
  <td class="px-4 py-2">₹${salary.total_salary}</td>
  <td class="px-4 py-2">${salary.status}</td>
  <td class="px-4 py-2 flex space-x-4">
      <button id="Settle_${salary.id}" class="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">
          Settle
      </button>
      <button id="Edit_${salary.id}" class="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
          Edit
      </button>
      <button id="Audit_${salary.id}" class="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600">
          Audit
      </button>
      <button id="Delete_${salary.id}" class="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
          Delete
      </button>
  </td>
`;
    tbody.appendChild(row);
    document
      .getElementById(`Settle_${salary.id}`)
      .addEventListener("click", () =>
        SettleSalary(mentorName, salary.month, salary.id)
      );
    document
      .getElementById(`Edit_${salary.id}`)
      .addEventListener("click", () => EditSalary(salary.id));
    document
      .getElementById(`Delete_${salary.id}`)
      .addEventListener("click", () =>
        DeleteSalary(mentorName, salary.month, salary.id)
      );
    document
      .getElementById(`Audit_${salary.id}`)
      .addEventListener("click", () =>
        AuditSalary(salary.mentor_id, salary.month, mentorName)
      );
  });
  return 1;
}

// Function to load mentors on page load
let limit = 50; // Set the limit for pagination
let skip = 0; // Initial skip value
async function loadSalaries() {
  document.getElementById("next-page").addEventListener("click", async () => {
    skip += limit; // Increase skip for next page
    const res = await populateSalaryTable(limit, skip);
    if (res === 0) skip -= limit; // If no more mentors, revert skip
  });

  document.getElementById("prev-page").addEventListener("click", () => {
    if (skip > 0) {
      skip = Math.max(0, skip - limit); // Decrease skip for previous page
      populateSalaryTable(limit, skip);
    }
  });

  await populateSalaryTable(limit, skip);
}

loadSalaries();
