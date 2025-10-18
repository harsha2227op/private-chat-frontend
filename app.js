const BACKEND_URL = "https://private-chat-backendr.onrender.com/"; // 🔴 replace this with your Render URL
const socket = io(BACKEND_URL);

const loginContainer = document.getElementById("loginContainer");
const chatContainer = document.getElementById("chatContainer");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const registerLink = document.getElementById("registerLink");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const logoutBtn = document.getElementById("logoutBtn");

let username = localStorage.getItem("username");
if (username) {
  showChat();
} else {
  showLogin();
}

registerLink.addEventListener("click", async () => {
  const user = usernameInput.value;
  const pass = passwordInput.value;
  if (!user || !pass) return alert("Enter both fields!");
  const res = await fetch(`${BACKEND_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: user, password: pass })
  });
  if (res.ok) alert("Registered! Now login.");
  else alert("User already exists!");
});

loginBtn.addEventListener("click", async () => {
  const user = usernameInput.value;
  const pass = passwordInput.value;
  if (!user || !pass) return alert("Enter both fields!");
  const res = await fetch(`${BACKEND_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: user, password: pass })
  });
  if (res.ok) {
    localStorage.setItem("username", user);
    username = user;
    showChat();
  } else {
    alert("Invalid login!");
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("username");
  username = null;
  showLogin();
});

sendBtn.addEventListener("click", () => {
  const text = messageInput.value.trim();
  if (!text) return;
  socket.emit("chatMessage", { username, text });
  messageInput.value = "";
});

socket.on("chatMessage", (data) => {
  const msg = document.createElement("div");
  msg.textContent = `${data.username}: ${data.text}`;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

function showLogin() {
  loginContainer.classList.remove("hidden");
  chatContainer.classList.add("hidden");
}

function showChat() {
  loginContainer.classList.add("hidden");
  chatContainer.classList.remove("hidden");
}
