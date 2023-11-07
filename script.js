function updateHistory(token) {
  history.pushState(token, "Titel: " + token, "");
  document.title = token;
  document.location.hash = token;
}

function showpage(pageid) {
  var pos = $("#" + pageid).position().top;
  $("body").animate({ scrollTop: pos }, 500, "easeOutQuint");

  updateHistory(pageid);
}

function validate() {
  let validated = true;
  let pass1 = document.getElementById("pass");
  let pass2 = document.getElementById("passAgain");
  let checkbox = document.getElementById("checkbox");
  let email = document.getElementById("email");
  if (pass1.value !== pass2.value) {
    pass1.style.backgroundColor = "#f8a";
    pass2.style.backgroundColor = "#f8a";
    document.getElementById("passwordError").textContent =
      "Passwords are not matching";
    validated = false;
  }
  if (!checkbox.checked) {
    document.getElementById("checkboxError").textContent =
      "You need to sell us all of your data to proceed";
    validated = false;
  }
  if (checkbox.checked) {
    document.getElementById("checkboxError").textContent = "";
  }
  if (email.value.indexOf("@") === -1) {
    email.style.borderColor = "#f57";
    email.style.color = "#f57";
    document.getElementById("emailError").textContent =
      "You need to have a @ in the emailaddress";
    validated = false;
  }
  if (validated === true) {
    newName();
  }
}

function validateEmail() {
  let email = document.getElementById("email");
  if (email.value.indexOf("@") === -1) {
    email.style.borderColor = "#f57";
    email.style.color = "#f57";
    document.getElementById("emailError").textContent =
      "You need to have a @ in the emailaddress";
  } else {
    email.style.backgroundColor = "#fff";
    email.style.borderColor = "#aaa";
    email.style.color = "#000";
    document.getElementById("emailError").textContent = "";
  }
}

function validateRoom() {
  let room = document.getElementById("room");
  if (room.value > 50 || room.value < 1) {
    room.style.borderColor = "#f57";
    room.style.color = "#f57";
    document.getElementById("roomError").textContent =
      "You need to enter a valid rooms number 1-50.";
  } else {
    room.style.backgroundColor = "#fff";
    room.style.borderColor = "#aaa";
    room.style.color = "#000";
    document.getElementById("roomError").textContent = "";
  }
}

function liveValidation() {
  let pass1 = document.getElementById("pass");
  let pass2 = document.getElementById("passAgain");
  if (pass1.value !== pass2.value) {
    pass1.style.backgroundColor = "#f8a";
    pass2.style.backgroundColor = "#f8a";
    document.getElementById("passwordError").textContent =
      "Passwords are not matching";
  } else {
    pass1.style.backgroundColor = "#fff";
    pass2.style.backgroundColor = "#fff";
    document.getElementById("passwordError").textContent = "";
  }
}

function newName() {
  let username;
  if (document.getElementById("username").value) {
    username = document.getElementById("username");
  } else if (document.getElementById("user").value) {
    username = document.getElementById("user");
  }
  let welcomeMessage = document.getElementById("welcomeMessage");
  welcomeMessage.textContent = "Welcome " + username.value;
  document.querySelector(".login").textContent = "Hello " + username.value;
  document.querySelector(".register").style.display = "none";
  showpage("welcome");

  closedialog();
}

let isDarkMode = true;
function darkMode() {
  isDarkMode
    ? (document.querySelector("body").style.backgroundColor = "#353535")
    : (document.querySelector("body").style.backgroundColor = "#eee");

  isDarkMode
    ? (document.querySelector("body").style.color = "#eee")
    : (document.querySelector("body").style.color = "#353535");

  isDarkMode
    ? (document.getElementById("modeButton").textContent = "☀️")
    : (document.getElementById("modeButton").textContent = "🌙");

  isDarkMode = !isDarkMode;
}

function showDialog(dialogid) {
  var dialogs = document.getElementsByClassName("dialog");
  for (dialog of dialogs) {
    dialog.style.display = "none";
  }
  document.getElementById(dialogid).style.display = "block";
  document.getElementById("underlay").style.display = "block";

  if (document.getElementById("welcomeMessage").textContent) {
    let welcomeMessage = document.getElementById("welcomeMessage");
    welcomeMessage.textContent = "Welcome";
    document.querySelector(".login").textContent = "Login";
    document.querySelector(".register").style.display = "block";
  }
}

function closedialog() {
  document.getElementById("underlay").style.display = "none";
  document.getElementById("login").style.display = "none";
  document.getElementById("register").style.display = "none";
}
