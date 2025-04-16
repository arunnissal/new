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
        alert("Already marked for this session.");
        return;
      }
  
      logs.push(logEntry);
      localStorage.setItem(key, JSON.stringify(logs));
      displayLog(logEntry);
    } catch (err) {
      alert("Invalid QR code");
    }
  }
  
  function displayLog(entry) {
    const li = document.createElement("li");
    li.textContent = `ID: ${entry.id} — Marked at ${entry.time}`;
    logList.prepend(li);
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
    (errorMessage) => {}
  );