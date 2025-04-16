// --- QR Scanner Script with Enhanced UI Integration ---

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
  }
  
  const username = localStorage.getItem("username");
  const logList = document.getElementById("log");
  const users = JSON.parse(localStorage.getItem("users")) || {};
  const studentName = users[username]?.username || username;
  
  function markAttendance(qrText) {
    try {
      const data = JSON.parse(qrText);
      const sessionId = data.sessionId;
      const staff = data.staff;
      const time = new Date().toLocaleString();
      const logEntry = { id: studentName, time };
      const key = `attendance-${sessionId}`;
  
      const logs = JSON.parse(localStorage.getItem(key)) || [];
  
      if (logs.find(e => e.id === studentName)) {
        showMessage("You have already marked attendance for this session.", "warning");
        return;
      }
  
      logs.push(logEntry);
      localStorage.setItem(key, JSON.stringify(logs));
      displayLog(logEntry);
      showMessage("Attendance marked successfully!", "success");
    } catch (err) {
      showMessage("Invalid QR code. Please try again.", "error");
    }
  }
  
  function displayLog(entry) {
    const li = document.createElement("li");
    li.className = "log-item";
    li.textContent = `ID: ${entry.id} — Marked at ${entry.time}`;
    logList.prepend(li);
  }
  
  function showMessage(message, type) {
    const msgBox = document.createElement("div");
    msgBox.className = `message-box ${type}`;
    msgBox.textContent = message;
    document.body.appendChild(msgBox);
    setTimeout(() => msgBox.remove(), 3000);
  }
  
  const html5QrCode = new Html5Qrcode("reader");
  
  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    (decodedText) => {
      markAttendance(decodedText);
      html5QrCode.stop();
      setTimeout(() => {
        html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 }, markAttendance);
      }, 2000);
    },
    (errorMessage) => {
      console.warn("QR Scan error:", errorMessage);
    }
  );
  