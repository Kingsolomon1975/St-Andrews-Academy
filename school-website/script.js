const form = document.getElementById("student-form");
const table = document.getElementById("student-table");



let suspendedStudents = JSON.parse(localStorage.getItem("suspendedStudents")) || [];



// Load from localStorage or use default students
let students = JSON.parse(localStorage.getItem("students")) || [
  {
    name: "John Doe",
    class: "SS2",
    result: "85%",
    subjects: [
      { subject: "Math", test: 15, exam: 60, homework: 10, classwork: 15 },
      { subject: "English", test: 14, exam: 55, homework: 9, classwork: 13 }
    ]
  },
  {
    name: "Grace Okoro",
    class: "JSS1",
    result: "92%",
    subjects: [
      { subject: "Science", test: 18, exam: 70, homework: 10, classwork: 14 }
    ]
  }
];


// Display students in the table
function displayStudents() {
  table.innerHTML = "";
  students.forEach((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.class}</td>
        <td>${student.result}</td>
        <td>${student.age}</td>
        <td>
            <a href="view.html?student=${encodeURIComponent(student.name)}" class="view">View</a>
            <button class="remove" onclick="removeStudent(${index})">Suspend</button>        </td>
    `;
    table.appendChild(row);
  });
}

// Save students to localStorage
function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students));
}

// Add a new student
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const studentClass = document.getElementById("class").value;
  const result = document.getElementById("result").value;
  const age = document.getElementById("age").value;

  students.push({ name, class: studentClass, result, age });
  form.reset();
  saveStudents();
  displayStudents();
});

// Remove student
function removeStudent(index) {
  if (confirm("Are you sure you want to suspend this student?")) {
    const [suspended] = students.splice(index, 1);
    suspendedStudents.push(suspended);
    saveStudents();
    saveSuspended();
    displayStudents();
    displaySuspended();
  }
}
function saveSuspended() {
  localStorage.setItem("suspendedStudents", JSON.stringify(suspendedStudents));
}
const suspendedTable = document.getElementById("suspended-table");

function displaySuspended() {
  suspendedTable.innerHTML = "";
  suspendedStudents.forEach((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.class}</td>
      <td>${student.result}</td>
      <td><button onclick="reinstateStudent(${index})">Reinstate</button></td>
    `;
    suspendedTable.appendChild(row);
  });
}

function reinstateStudent(index) {
  const [reinstate] = suspendedStudents.splice(index, 1);
  students.push(reinstate);
  saveStudents();
  saveSuspended();
  displayStudents();
  displaySuspended();
  alert(`${reinstate.name} has been reinstated.`);
}

function viewStudent(index) {
  const student = students[index];
  const tbody = document.querySelector("#subjectTable tbody");
  tbody.innerHTML = "";

  student.subjects.forEach(sub => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${sub.subject}</td>
      <td>${sub.test}</td>
      <td>${sub.exam}</td>
      <td>${sub.homework}</td>
      <td>${sub.classwork}</td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById("viewResultModal").style.display = "flex";
}

function closeView() {
  document.getElementById("viewResultModal").style.display = "none";
}
// Auto-load and display
displayStudents();
const studentsBtn = document.getElementById("studentsBtn");
const studentPage = document.getElementById("studentPage");
const upload = document.getElementById("upload");

studentsBtn.addEventListener("click", () => {
  studentPage.style.display = "block"; // Show students section
  upload.style.display = "block";
});
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function () {
  // Clear remembered user
  localStorage.removeItem("username");

  // Optionally, show a message or alert
  alert("You have been logged out.");

  // Redirect to login page
  window.location.href = "login.html";
});
function searchStudent() {
  const name = document.getElementById("searchName").value.trim().toLowerCase();
  const display = document.getElementById("resultDisplay");

  if (studentsResults[name]) {
    let html = `<h3>Results for ${name.toUpperCase()}</h3><ul>`;
    for (let term in studentsResults[name]) {
      html += `<li>${term}: ${studentsResults[name][term]}</li>`;
    }
    html += "</ul>";
    display.innerHTML = html;
  } else {
    display.innerHTML = "<p style='color:red;'>Student not found.</p>";
  }
}
const uploadResultBtn = document.getElementById("uploadResultBtn");
const uploadResultSection = document.getElementById("uploadResultSection");
const uploadResultForm = document.getElementById("uploadResultForm");
const uploadResultBody = document.getElementById("uploadResultBody");

uploadResultBtn.addEventListener("click", () => {
  uploadResultSection.style.display = "block";
});

document.getElementById("addSubjectRowBtn").addEventListener("click", () => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" name="subject" required></td>
    <td><input type="number" name="test" min="0" max="100" required></td>
    <td><input type="number" name="exam" min="0" max="100" required></td>
    <td><input type="number" name="homework" min="0" max="100" required></td>
    <td><input type="number" name="classwork" min="0" max="100" required></td>
    <td><button type="button" onclick="this.closest('tr').remove()">Remove</button></td>
  `;
  uploadResultBody.appendChild(row);
});

// Handle form submission
uploadResultForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("uploadStudentName").value.trim();
  const studentClass = document.getElementById("uploadStudentClass").value.trim();

  // Gather subjects data
  const subjects = [];
  const rows = uploadResultBody.querySelectorAll("tr");
  rows.forEach(row => {
    const subject = row.querySelector('input[name="subject"]').value.trim();
    const test = Number(row.querySelector('input[name="test"]').value);
    const exam = Number(row.querySelector('input[name="exam"]').value);
    const homework = Number(row.querySelector('input[name="homework"]').value);
    const classwork = Number(row.querySelector('input[name="classwork"]').value);

    subjects.push({ subject, test, exam, homework, classwork });
  });

  // Calculate overall result (optional: simple average of exams & tests)
  let total = 0;
  subjects.forEach(s => total += s.test + s.exam + s.homework + s.classwork);
  const avg = (total / (subjects.length * 4)).toFixed(2) + "%";

  // Check if student exists
  
  let studentIndex = students.findIndex(s => s.name.toLowerCase() === name.toLowerCase());
  if (studentIndex >= 0) {
    // Update existing student
    students[studentIndex].class = studentClass;
    students[studentIndex].subjects = subjects;
    students[studentIndex].result = avg;
  } else {
    // Add new student
    students.push({ name, class: studentClass, subjects, result: avg });
  }

  saveStudents();
  displayStudents();

  alert("✅ Student result uploaded successfully!");

  // Reset form and hide section
  uploadResultForm.reset();
  uploadResultBody.innerHTML = "";
  uploadResultSection.style.display = "none";
  
});
suspendedBtn.addEventListener("click", () => {
  suspendedPage.style.display = "block";
  studentPage.style.display = "none";
  uploadResultSection.style.display = "none";
  displaySuspended(); // Make sure suspended list is refreshed/shown
});
const staffList = [
  { name: "Mrs. Johnson", position: "Principal" },
  { name: "Mr. Ade", position: "Math Teacher" },
  { name: "Ms. Chika", position: "Counselor" },
];

let parents = JSON.parse(localStorage.getItem("parents")) || [
  { name: "Mrs. Kalu", phone: "08012345678", email: "kalu@example.com", child: "John Kalu" },
  { name: "Mr. Musa", phone: "08123456789", email: "musa@example.com", child: "Fatima Musa" }
];
const staffParentBtn = document.getElementById("staffParentBtn");
const staffParentPage = document.getElementById("staffParentPage");
const parentSection = document.getElementById("parentSection");
const toggleParents = document.getElementById("toggleParents");

// Navigation button
staffParentBtn.addEventListener("click", () => {
  studentPage.style.display = "none";
  uploadResultSection.style.display = "none";
  suspendedPage.style.display = "none";
  staffParentPage.style.display = "block";
  displayStaff();
  displayParents();
});

// Toggle checkbox
toggleParents.addEventListener("change", () => {
  parentSection.style.display = toggleParents.checked ? "block" : "none";
});
function displayStaff() {
  const tbody = document.getElementById("staffList");
  tbody.innerHTML = "";

  staffList.forEach((staff, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input value="${staff.name}" onchange="editStaff(${index}, 'name', this.value)" /></td>
      <td><input value="${staff.position}" onchange="editStaff(${index}, 'position', this.value)" /></td>
      <td><button onclick="saveStaff()">💾 Save</button></td>
    `;
    tbody.appendChild(row);
  });
}


function displayParents() {
  const parentTable = document.getElementById("parentTable");
  parentTable.innerHTML = "";
  parents.forEach((parent, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><input value="${parent.name}" onchange="editParent(${index}, 'name', this.value)" /></td>
      <td><input value="${parent.phone}" onchange="editParent(${index}, 'phone', this.value)" /></td>
      <td><input value="${parent.email}" onchange="editParent(${index}, 'email', this.value)" /></td>
      <td><input value="${parent.child}" onchange="editParent(${index}, 'child', this.value)" /></td>
      <td><button onclick="saveParents()">💾 Save</button></td>
    `;

    parentTable.appendChild(row);
  });
}

function editParent(index, field, value) {
  parents[index][field] = value;
}

function saveParents() {
  localStorage.setItem("parents", JSON.stringify(parents));
  alert("✅ Parent info saved!");
}
function editStaff(index, field, value) {
  staffList[index][field] = value;
}
function saveStaff() {
  localStorage.setItem("Staff", JSON.stringify(staffList));
  alert("✅ Staff info saved!");
}
document.getElementById("saveStaffBtn").addEventListener("click", () => {
  localStorage.setItem("staffList", JSON.stringify(staffList));
  alert("✅ Staff list saved successfully!");
});


// === ADD STAFF ===
document.getElementById("staffForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("newStaffName").value.trim();
  const position = document.getElementById("newStaffPosition").value.trim();

  if (name && position) {
    staffList.push({ name, position });
    localStorage.setItem("staffList", JSON.stringify(staffList));
    displayStaff();
    this.reset();
  }
});

// === ADD PARENT ===
document.getElementById("parentForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("newParentName").value.trim();
  const phone = document.getElementById("newParentPhone").value.trim();
  const email = document.getElementById("newParentEmail").value.trim();
  const child = document.getElementById("newParentChild").value.trim();

  if (name && phone && email && child) {
    parents.push({ name, phone, email, child });
    localStorage.setItem("parents", JSON.stringify(parents));
    displayParents();
    this.reset();
  }
});
function showMenu() {
  const menu = document.getElementById("menuDropdown");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function changeUsername() {
  const current = localStorage.getItem("rememberedUser") || "admin";
  const newUsername = prompt("Enter new username:", current);
  if (newUsername) {
    localStorage.setItem("rememberedUser", newUsername);
    alert("✅ Username updated!");
  }
  showMenu();
}

function changePassword() {
  const newPassword = prompt("Enter new password:");
  if (newPassword) {
    localStorage.setItem("password", newPassword);
    alert("✅ Password updated!");
  }
  showMenu();
}

function clearData() {
  if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
    localStorage.clear();
    alert("✅ All data cleared. Reloading...");
    window.location.reload();
  }
}

function logout() {
  alert("Logging out...");
  window.location.href = "login.html";
}
// Elements
const homePage = document.getElementById("homePage");
const welcomeUser = document.getElementById("welcomeUser");
const totalStudentsEl = document.getElementById("totalStudents");
const totalSuspendedEl = document.getElementById("totalSuspended");

const goStudents = document.getElementById("goStudents");
const goUploadResults = document.getElementById("goUploadResults");
const goStaffParents = document.getElementById("goStaffParents");

// Show Home page function
function showHomePage() {
  // Hide other pages
  studentPage.style.display = "none";
  uploadResultSection.style.display = "none";
  suspendedPage.style.display = "none";
  staffParentPage.style.display = "none";

  // Show home page
  homePage.style.display = "block";

  // Set welcome user (from login data)
  const username = localStorage.getItem("rememberedUser") || "User";
  welcomeUser.textContent = username;

  // Show counts
  totalStudentsEl.textContent = students.length;
  totalSuspendedEl.textContent = suspendedStudents.length;
}

// Navigation buttons
goStudents.addEventListener("click", () => {
  homePage.style.display = "none";
  studentPage.style.display = "block";
  uploadResultSection.style.display = "none";
  suspendedPage.style.display = "none";
  staffParentPage.style.display = "none";
  displayStudents();
});

goUploadResults.addEventListener("click", () => {
  homePage.style.display = "none";
  uploadResultSection.style.display = "block";
  studentPage.style.display = "none";
  suspendedPage.style.display = "none";
  staffParentPage.style.display = "none";
});

goStaffParents.addEventListener("click", () => {
  homePage.style.display = "none";
  staffParentPage.style.display = "block";
  studentPage.style.display = "none";
  uploadResultSection.style.display = "none";
  suspendedPage.style.display = "none";
  displayStaff();
  displayParents();
});

// Call showHomePage() on app load after successful login
showHomePage();

const classes = [
  "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6",
  "JSS 1", "JSS 2", "JSS 3",
  "SSS 1", "SSS 2", "SSS 3"
];


document.getElementById("classBtn").addEventListener("click", () => {
  studentPage.style.display = "none";
  uploadResultSection.style.display = "none";
  staffParentPage.style.display = "none";
  homePage.style.display = "none";
  classPage.style.display = "block";
  loadClassButtons();
});

function loadClassButtons() {
  const container = document.getElementById("classButtons");
  container.innerHTML = "";

  classes.forEach(className => {
    const btn = document.createElement("button");
    btn.textContent = className;
    btn.onclick = () => showStudentsInClass(className);
    btn.style.padding = "8px 12px";
    btn.style.borderRadius = "6px";
    btn.style.border = "1px solid #00b894";
    btn.style.background = "#fff";
    btn.style.cursor = "pointer";
    container.appendChild(btn);
  });

}

function showStudentsInClass(className) {
  document.getElementById("classTitle").textContent = `Students in ${className}`;
  const list = document.getElementById("studentsInClass");
  list.innerHTML = "";

  const filtered = students.filter(student => student.class === className);
  if (filtered.length === 0) {
    list.innerHTML = "<li>No students found in this class.</li>";
  } else {
    filtered.forEach(student => {
      const li = document.createElement("li");
      li.textContent = student.name;
      list.appendChild(li);
    });
  }
}
function showSection(section) {
  document.getElementById("addSection").style.display = section === 'add' ? 'block' : 'none';
  document.getElementById("classSection").style.display = section === 'class' ? 'block' : 'none';
  document.getElementById("printSection").style.display = section === 'print' ? 'block' : 'none';
  if (section === 'class') loadClassButtons();
}

function printStudentResult() {
  const name = document.getElementById("printSearch").value.trim();
  const term = document.getElementById("termSelect").value;
  if (!name || !studentResults[name]) {
    alert("Student not found or has no result.");
    return;
  }

  const resultData = studentResults[name];
  let html = `<h2>${name} - ${term} Result</h2>`;
  ["Math", "English", "Science", "Social Studies"].forEach(sub => {
    html += `<h4>${sub}</h4>`;
    html += `Test: ${resultData[sub + '_test'] || 0}<br>`;
    html += `Exam: ${resultData[sub + '_exam'] || 0}<br>`;
    html += `Homework: ${resultData[sub + '_homework'] || 0}<br>`;
    html += `Classwork: ${resultData[sub + '_classwork'] || 0}<br><hr>`;
  });

  const printWindow = window.open('', '', 'width=800,height=600');
  printWindow.document.write(`<html><head><title>${name} Result</title></head><body>${html}</body></html>`);
  printWindow.document.close();
  printWindow.print();
}