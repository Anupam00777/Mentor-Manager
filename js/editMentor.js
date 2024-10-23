import {
  addMentor,
  getAllMentorLeaveRecord,
  getMentor,
  modifyDailySalaryRecord,
  modifyMentor,
} from "./RequestHandler.js";
import { getUrlParameters, showAlert } from "../utilities.js";
import { removeFalsyValues } from "../utilities.js";

async function DeleteMentorLeaveRecord(id) {
  try {
    const response = await modifyDailySalaryRecord(
      { id },
      { status: "active" }
    );
    if (response.error) {
      showAlert("Error", "Cannot delete record", "error");
      return;
    }
    showAlert("Success", "Leave record deleted successfully");
    window.location.reload();
  } catch (error) {
    showAlert("Error", "Something went wrong", "error");
  }
}

// Function to populate the form with mentor data
function populateForm(mentor) {
  document.getElementById("mentor-name").value = mentor.name;
  document.getElementById("mentor-email").value = mentor.email;
  document.getElementById("mentor-phone").value = mentor.mobile;
  document.getElementById("mentor-pay").value = mentor.pay_per_day_per_mentee;
  document.getElementById("mentor-start").value =
    mentor.start_date.split("T")[0];
  document.getElementById("mentor-leaves").value = mentor.paid_leaves;
  document.getElementById("mentor-status").value = mentor.status;
}

// Function to populate the mentor table
async function populateLeavesTable(mentor) {
  const tbody = document.getElementById("leaves-tbody");
  tbody.innerHTML = ""; // Clear existing content
  const mentorLeaves = await getAllMentorLeaveRecord(mentor.id);
  mentorLeaves.sort((a, b) => new Date(b.date) - new Date(a.date));
  mentorLeaves?.forEach((leave, index) => {
    const row = document.createElement("tr");
    if (index % 2 === 1) {
      row.classList.add("bg-gray-100"); // Light gray for odd rows
    }
    row.innerHTML = `
  <td class="px-4 py-2">${leave.date}</td>
  <td class="px-4 py-2">${leave.mentee_count}</td>
  <td class="px-4 py-2 flex space-x-2">
      <button id="Delete_${leave.id}" class="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
          Delete
      </button>
  </td>
`;
    tbody.appendChild(row);
    document
      .getElementById(`Delete_${leave.id}`)
      .addEventListener("click", () => DeleteMentorLeaveRecord(leave.id));
  });
}

// Function to handle form submission
async function handleFormSubmit(event) {
  event.preventDefault();

  const param = getUrlParameters();
  const data = {
    name: document.getElementById("mentor-name").value,
    email: document.getElementById("mentor-email").value,
    mobile: document.getElementById("mentor-phone").value,
    pay_per_day_per_mentee: document.getElementById("mentor-pay").value,
    start_date: document.getElementById("mentor-start").value,
    paid_leaves: document.getElementById("mentor-leaves").value,
    status: document.getElementById("mentor-status").value,
  };
  const mentorData = removeFalsyValues(data);
  try {
    let response;
    if (param.id) {
      response = await modifyMentor(param.id, mentorData);
    } else {
      response = await addMentor(mentorData);
    }
    if (response.error) {
      throw new Error("Failed to save mentor data, ", response.error);
    }

    showAlert("Edit Mentor", "Mentor saved successfully!");
    window.close();
  } catch (error) {
    console.error(error);
    showAlert("Error", "Error saving mentor data, " + error);
  }
}

// Main function to load data
async function main() {
  const param = getUrlParameters();

  if (param.id) {
    const mentor = await getMentor(param.id);
    if (mentor) {
      populateForm(mentor);
      document.getElementById("leaves").style.display = "block";
      await populateLeavesTable(mentor);
      document.getElementById("form-title").textContent = "Edit Mentor"; // Update title for edit mode
      document
        .getElementById("add-leave-button")
        .addEventListener("click", async () => {
          const date = document.getElementById("leave-date").value;
          if (!date) return;
          const response = await modifyDailySalaryRecord(
            { date: date, mentor_id: mentor.id },
            { status: "onLeave" }
          );
          if (response.error) {
            showAlert("Error", "Cannot add record", "error");
            return;
          }
          showAlert("Success", "Leave record added successfully");
          window.location.reload();
        });
    }
  }
}

// Attach event listeners
document
  .getElementById("mentor-form")
  .addEventListener("submit", handleFormSubmit);
main(); // Run main function on page load
