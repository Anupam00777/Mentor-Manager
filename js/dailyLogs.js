import {
  getUrlParameters,
  navigate,
  showAlert,
  showConfirmation,
} from "../utilities.js";
import {
  getAllMentors,
  addDailySalaryRecordsFromCSV,
  getAllDailySalaryRecord,
  getMentor,
  deleteDailySalaryRecord,
} from "./RequestHandler.js";

function EditSalaryLog(id, mentorId, payPerDayPerMentee) {
  window.open(
    `editDailySalaryLog.html?id=${id}&mentor=${mentorId}&payPerDayPerMentee=${payPerDayPerMentee}`,
    `_blank`
  );
}

// Delete salary function
async function DeleteSalaryLog(date, id) {
  showConfirmation(
    `Do you want to delete this record of date ${date}?`,
    "Deleting the salary is permanent. However, the mentors related to this salary won't be affected."
  ).then((response) => {
    if (response) {
      deleteDailySalaryRecord(id).then((res) => {
        if (res.error) {
          showAlert("Error", "Error in deleting salary record", "error");
        } else {
          showAlert("Done", "Record deleted successfully");
          document.getElementById(`log_${id}`).remove();
        }
      });
    }
  });
}
async function populateLogsTable(id, limit = 50, skip = 0) {
  if (!id) return;
  const mentor = await getMentor(id);
  const dailyLogs = await getAllDailySalaryRecord(id, limit, skip);
  if (dailyLogs.length === 0) return 0;
  const tbody = document.getElementById("daily-log-tbody");
  tbody.innerHTML = "";
  dailyLogs?.forEach((log, index) => {
    const row = document.createElement("tr");
    row.id = `log_${log.id}`;
    if (index % 2 === 1) {
      row.classList.add("bg-gray-100"); // Light gray for odd rows
    }
    row.innerHTML = `
  <td class="px-4 py-2">${log.month}</td>
  <td class="px-4 py-2">${log.date}</td>
  <td class="px-4 py-2">${log.mentee_count}</td>
  <td class="px-4 py-2">₹${log.salary.toFixed(2)}</td>
  <td class="px-4 py-2">${log.status}</td>
  <td class="px-4 py-2 flex space-x-4">
      <button id="Edit_${
        log.id
      }" class="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
          Edit
      </button>
      <button id="Delete_${
        log.id
      }" class="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
          Delete
      </button>
  </td>
`;
    tbody.appendChild(row);
    document
      .getElementById(`Edit_${log.id}`)
      .addEventListener("click", () =>
        EditSalaryLog(log.id, id, mentor.pay_per_day_per_mentee)
      );
    document
      .getElementById(`Delete_${log.id}`)
      .addEventListener("click", () => DeleteSalaryLog(log.date, log.id));
  });
  return 1;
}

// Function to load mentors on page load
let limit = 50; // Set the limit for pagination
let skip = 0; // Initial skip value
let id;
async function loadLogs() {
  document.getElementById("next-page").addEventListener("click", async () => {
    skip += limit; // Increase skip for next page
    const res = await populateLogsTable(id, limit, skip);
    if (res === 0) skip -= limit; // If no more mentors, revert skip
  });

  document.getElementById("prev-page").addEventListener("click", () => {
    if (skip > 0) {
      skip = Math.max(0, skip - limit); // Decrease skip for previous page
      populateLogsTable(id, limit, skip);
    }
  });
  document
    .getElementById("csvUpload")
    .addEventListener("change", async function (event) {
      const file = event.target.files[0];
      if (file) {
        const confirm = await showConfirmation(
          `Do you want to upload ${file.name}?`,
          "This action will take some time depending on the amount of data"
        );

        if (confirm) {
          const reader = new FileReader();
          reader.onload = async function (e) {
            console.log(confirm);
            const fileContent = e.target.result;
            console.log(fileContent);

            const res = await addDailySalaryRecordsFromCSV(fileContent);
            if (res.error) {
              showAlert(
                "Something went wrong!",
                `Please check your CSV file`,
                "error"
              );
              return;
            }
            showAlert(
              "Success",
              `Number of rows inserted: ${res.rowCount}`,
              "info"
            );
          };
          reader.readAsText(file);
        }
      }
    });
  const mentors = await getAllMentors();
  const mentorDropdown = document.getElementById("custom-select");
  mentors.forEach((mentor) => {
    const option = document.createElement("option");
    option.value = mentor.id;
    option.textContent = mentor.name;
    mentorDropdown.appendChild(option);
  });
  mentorDropdown.addEventListener("change", async (e) => {
    const id = e.target.value;
    navigate(`/pages/dailyLogs.html?mentorId=${id}`);
    return;
  });
  const params = getUrlParameters();
  if (params.mentorId) {
    populateLogsTable(params.mentorId, limit, skip);
    mentorDropdown.value = params.mentorId;
  }
}

loadLogs();
