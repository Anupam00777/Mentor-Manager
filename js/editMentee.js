import {
  addMentee,
  getMentee,
  modifyMentee,
  getAllMentors,
} from "./RequestHandler.js";
import { getUrlParameters, showAlert } from "../utilities.js";
import { removeFalsyValues } from "../utilities.js";

// Function to populate the form with mentee data
function populateForm(mentee) {
  document.getElementById("mentee-name").value = mentee.name;
  document.getElementById("mentee-email").value = mentee.email;
  document.getElementById("mentee-mobile").value = mentee.mobile;
  document.getElementById("mentee-start").value =
    mentee.start_date.split("T")[0];
  document.getElementById("mentee-end").value = mentee.end_date
    ? mentee.end_date.split("T")[0]
    : "";
  document.getElementById("mentee-status").value = mentee.status;
  document.getElementById("mentee-mentor").value = mentee.mentor_id;
}

// Function to populate the mentor dropdown
async function populateMentorDropdown() {
  const mentorDropdown = document.getElementById("mentee-mentor");
  const mentors = await getAllMentors(); // Fetch the list of mentors

  mentors.forEach((mentor) => {
    const option = document.createElement("option");
    option.value = mentor.id;
    option.textContent = mentor.name;
    mentorDropdown.appendChild(option);
  });
}

// Function to handle form submission
async function handleFormSubmit(event) {
  event.preventDefault();

  const param = getUrlParameters();
  const data = {
    name: document.getElementById("mentee-name").value,
    email: document.getElementById("mentee-email").value,
    mobile: document.getElementById("mentee-mobile").value,
    start_date: document.getElementById("mentee-start").value,
    end_date: document.getElementById("mentee-end").value || null,
    status: document.getElementById("mentee-status").value,
    mentor_id: document.getElementById("mentee-mentor").value,
  };
  const menteeData = removeFalsyValues(data);
  try {
    let response;
    if (param.id) {
      response = await modifyMentee(param.id, menteeData);
    } else {
      response = await addMentee(menteeData);
    }

    if (response.error) {
      throw new Error("Failed to save mentee data: " + response.error);
    }

    showAlert("Edit Mentee", "Mentee saved successfully!");
    window.close();
  } catch (error) {
    console.error(error);
    showAlert("Error", "Error saving mentee data: " + error.message);
  }
}

// Main function to load data
async function main() {
  const param = getUrlParameters();

  await populateMentorDropdown(); // Populate the mentor dropdown

  if (param.id) {
    const mentee = await getMentee(param.id);
    if (mentee) {
      populateForm(mentee);
      document.getElementById("form-title").textContent = "Edit Mentee"; // Update title for edit mode
    }
  }
}

// Attach event listeners
document
  .getElementById("mentee-form")
  .addEventListener("submit", handleFormSubmit);

main(); // Run main function on page load
