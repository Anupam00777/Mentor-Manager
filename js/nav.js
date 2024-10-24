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

  const fileBrowserLink = document.getElementById("fileBrowserLink");
  if (fileBrowserLink) {
    fileBrowserLink.addEventListener("click", (event) => {
      event.preventDefault();
      if (typeof require !== "undefined" && require("electron")) {
        const { ipcRenderer } = require("electron");
        ipcRenderer.send("open-file-browser");
      } else {
        window.location.href = "/files";
      }
    });
  }
  const navLinks = {
    dashboardLink: window.location.origin + "/index.html",
    mentorsLink: window.location.origin + "/pages/mentors.html",
    menteesLink: window.location.origin + "/pages/mentees.html",
    salaryLink: window.location.origin + "/pages/salary.html",
  };

  for (const [key, url] of Object.entries(navLinks)) {
    document.getElementById(key).addEventListener("click", (event) => {
      window.location.href = url;
    });
  }
}
