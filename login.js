document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById('loginForm');
  const errorMsg = document.getElementById('error');

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const role = document.getElementById('role').value.toLowerCase();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem("users")) || {};

    // Ensure default admin, staff, and student exist
    if (!users["admin"]) {
      users["admin"] = { username: "admin", password: "admin123", role: "admin" };
    }
    if (!users["staff"]) {
      users["staff"] = { username: "staff", password: "staff123", role: "staff" };
    }
    if (!users["student"]) {
      users["student"] = { username: "student", password: "student123", role: "student" };
    }
    localStorage.setItem("users", JSON.stringify(users));

    const currentUser = users[username];

    if (
      currentUser &&
      currentUser.password === password &&
      currentUser.role.toLowerCase() === role
    ) {
      localStorage.setItem("userRole", role);
      localStorage.setItem("username", username);

      if (role === "admin") window.location.href = "admin.html";
      else if (role === "staff") window.location.href = "staff.html";
      else if (role === "student") window.location.href = "student.html";
    } else {
      errorMsg.textContent = "Invalid credentials or role mismatch.";
    }
  });
});
