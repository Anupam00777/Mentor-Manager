import { showAlert, showConfirmation } from "../utilities.js";
import {
  deleteMentee,
  getAllMentees,
  getAllMentors,
} from "./RequestHandler.js";

// Edit mentee function
function EditMentee(id) {
  window.open(`editMentee.html?id=${id}`, `_blank`);
}

// Delete mentee function
async function DeleteMentee(name, id) {
  showConfirmation(
    `Do you want to delete mentee ${name}?`,
    "Deleting the mentee is permanent. However, the salary records and the mentors related to this mentee won't be affected."
  ).then((response) => {
    if (response) {
      deleteMentee(id).then((res) => {
        if (res.error) {
          showAlert("Error", "Error in deleting mentee record", "error");
        } else {
          showAlert("Done", "Record deleted successfully");
          window.location.reload();
        }
      });
    }
  });
}
// Function to populate the mentee table
async function populateMenteeTable(mentees) {
  const tbody = document.getElementById("mentees-tbody");
  tbody.innerHTML = ""; // Clear existing content
  const mentors = await getAllMentors();
  mentees?.forEach((mentee, index) => {
    const row = document.createElement("tr");
    if (index % 2 === 1) {
      row.classList.add("bg-gray-100"); // Light gray for odd rows
    }
    row.innerHTML = `
  <td class="px-4 py-2">${mentee.name}</td>
  <td class="px-4 py-2">${mentee.email}</td>
  <td class="px-4 py-2">${mentee.mobile}</td>
  <td class="px-4 py-2">${
    mentors?.find((m) => m.id === mentee.mentor_id).name || "None"
  }</td>
  <td class="px-4 py-2">${mentee.status}</td>
  <td class="px-4 py-2">${mentee.start_date.split("T")[0]}</td>
  <td class="px-4 py-2">${mentee.end_date.split("T")[0]}</td>
  <td class="px-4 py-2 flex space-x-2">
      <button id="Edit_${
        mentee.id
      }" class="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
          Edit
      </button>
      <button id="Delete_${
        mentee.id
      }" class="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
          Delete
      </button>
  </td>
`;
    tbody.appendChild(row);
    document
      .getElementById(`Edit_${mentee.id}`)
      .addEventListener("click", () => EditMentee(mentee.id));
    document
      .getElementById(`Delete_${mentee.id}`)
      .addEventListener("click", () => DeleteMentee(mentee.name, mentee.id));
  });
}

// Function to load mentees on page load
async function loadMentess() {
  const mentees = await getAllMentees();
  console.log(mentees);

  await populateMenteeTable(mentees);
}

// Call loadMentees on page load
loadMentess();
