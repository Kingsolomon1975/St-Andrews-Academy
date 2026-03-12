const params = new URLSearchParams(window.location.search);
const studentName = decodeURIComponent(params.get("student"));
const studentData = JSON.parse(localStorage.getItem("students")) || [];

const student = studentData.find(s => s.name === studentName);
document.getElementById("studentName").innerText = student ? student.name + "'s Results" : "Student Not Found";

const tableBody = document.getElementById("resultTable");

if (student && student.subjects && student.subjects.length > 0) {
  student.subjects.forEach(sub => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${sub.subject}</td>
      <td>${sub.test}</td>
      <td>${sub.exam}</td>
      <td>${sub.homework}</td>
      <td>${sub.classwork}</td>
    `;
    tableBody.appendChild(row);
  });
} else {
  tableBody.innerHTML = `<tr><td colspan="5">No subject scores found for this student.</td></tr>`;
}
