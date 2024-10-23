import { showAlert, showConfirmation } from "../utilities.js";
import { deleteMentor, getAllMentors } from "./RequestHandler.js";

// Edit mentor function
function EditMentor(id) {
  window.open(`editMentor.html?id=${id}`, `_blank`);
}

// Delete mentor function
async function DeleteMentor(name, id) {
  showConfirmation(
    `Do you want to delete mentor ${name}?`,
    "Deleting the mentor is permanent. However, the salary records and the mentees related to this mentor won't be affected."
  ).then((response) => {
    if (response) {
      deleteMentor(id).then((res) => {
        if (res.error) {
          showAlert("Error", "Error in deleting mentor record", "error");
        } else {
          showAlert("Done", "Record deleted successfully");
          window.location.reload();
        }
      });
    }
  });
}
// Function to populate the mentor table
function populateMentorTable(mentors) {
  const tbody = document.getElementById("mentors-tbody");
  tbody.innerHTML = ""; // Clear existing content

  mentors?.forEach((mentor, index) => {
    const row = document.createElement("tr");
    if (index % 2 === 1) {
      row.classList.add("bg-gray-100"); // Light gray for odd rows
    }
    row.innerHTML = `
  <td class="px-4 py-2">${mentor.name}</td>
  <td class="px-4 py-2">${mentor.email}</td>
  <td class="px-4 py-2">${mentor.mobile}</td>
  <td class="px-4 py-2">₹${mentor.pay_per_day_per_mentee.toFixed(2)}</td>
  <td class="px-4 py-2">${mentor.status}</td>
  <td class="px-4 py-2">${mentor.start_date.split("T")[0]}</td>
  <td class="px-4 py-2 flex space-x-2">
      <button id="Edit_${
        mentor.id
      }" class="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
          Edit
      </button>
      <button id="Delete_${
        mentor.id
      }" class="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
          Delete
      </button>
  </td>
`;
    tbody.appendChild(row);
    document
      .getElementById(`Edit_${mentor.id}`)
      .addEventListener("click", () => EditMentor(mentor.id));
    document
      .getElementById(`Delete_${mentor.id}`)
      .addEventListener("click", () => DeleteMentor(mentor.name, mentor.id));
  });
}

// Function to load mentors on page load
async function loadMentors() {
  const mentors = await getAllMentors();
  console.log(mentors);

  populateMentorTable(mentors);
}

// Call loadMentors on page load
loadMentors();
