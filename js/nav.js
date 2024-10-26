// navBar.js
export const navBar = `
<nav class="bg-white shadow-lg p-4">
    <div class="container mx-auto flex justify-between">
        <div class="text-xl font-bold">Mentor Salary Management</div>
        <ul class="flex space-x-6" id="nav-links">
            <li><a id="dashboardLink" class="hover:text-blue-500 cursor-pointer">Dashboard</a></li>
            <li><a id="mentorsLink" class="hover:text-blue-500 cursor-pointer">Mentors</a></li>
            <li><a id="menteesLink" class="hover:text-blue-500 cursor-pointer">Mentees</a></li>
            <li><a id="salaryLink" class="hover:text-blue-500 cursor-pointer">Salary</a></li>
            <li class="hidden"><a id="fileBrowserLink" class="hover:text-blue-500 cursor-pointer">Files</a></li>
        </ul>
    </div>
</nav>
`;

export function initializeNavBar() {
  document.getElementById("nav-bar").innerHTML = navBar;

  // Handle the file browser link
  const fileBrowserLink = document.getElementById("fileBrowserLink");
  if (fileBrowserLink) {
    fileBrowserLink.addEventListener("click", (event) => {
      event.preventDefault();
      // Check if running in Electron, if not, use regular navigation
      if (typeof require !== "undefined" && require("electron")) {
        const { ipcRenderer } = require("electron");
        ipcRenderer.send("open-file-browser");
      } else {
        window.location.href = "/files";
      }
    });
  }
  const navLinks = {
    dashboardLink: "/index.html",
    mentorsLink: "/pages/mentors.html",
    menteesLink: "/pages/mentees.html",
    salaryLink: "/pages/salary.html",
  };

  // Set up event listeners for navigation
  for (const [key, filePath] of Object.entries(navLinks)) {
    document.getElementById(key).addEventListener("click", (event) => {
      if (typeof require !== "undefined" && require("electron")) {
        const { ipcRenderer } = require("electron");
        ipcRenderer.send("navigate", filePath);
      } else {
        window.location.href = window.location.origin + "/" + filePath;
      }
    });
  }
}
