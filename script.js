function updateHistory(token) {
  history.pushState(token, "Titel: " + token, "");
  document.title = token;
  document.location.hash = token;
}

function showpage(pageid) {
  let pos = $("#" + pageid).position().top;
  $("body").animate({ scrollTop: pos }, 1000, "easeOutQuint");
  updateHistory(pageid);
}

function showDialog(dialogid) {
  let dialogs = document.getElementsByClassName("dialog");
  for (let dialog of dialogs) {
    dialog.style.display = "none";
  }
  addClosingEvent();
  document.getElementById(dialogid).style.display = "block";
  document.getElementById("underlay").style.display = "block";

  if (localStorage.getItem("username")) {
    let welcomeMessage = document.getElementById("welcomeMessage");
    welcomeMessage.textContent = "Welcome";
    document.querySelector(".login").textContent = "Login";
    document.querySelector(".register").style.display = "block";
    localStorage.removeItem("username");
    closedialog();
  }
}

function closedialog() {
  document.getElementById("underlay").style.display = "none";
  document.getElementById("login").style.display = "none";
  document.getElementById("register").style.display = "none";
}

function validate() {
  let validated = true;
  let pass1 = document.getElementById("pass");
  let pass2 = document.getElementById("passAgain");
  let checkbox = document.getElementById("checkbox");
  let email = document.getElementById("email");
  if (pass1.value !== pass2.value) {
    pass1.style.color = "#f8a";
    pass2.style.borderColor = "#f8a";
    pass1.style.color = "#f8a";
    pass2.style.borderColor = "#f8a";
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
  let emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/;
  if (!emailRegex.test(email.value)) {
    email.style.borderColor = "#f57";
    email.style.color = "#f57";
    document.getElementById("emailError").textContent =
      "You need to have a @ in the emailaddress";
    validated = false;
  }
  if (validated === true) {
    storeCustomer();
  }
}

function validateEmail() {
  let email = document.getElementById("email");
  let emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/;
  if (!emailRegex.test(email.value)) {
    email.style.borderColor = "#f57";
    email.style.color = "#f57";
    document.getElementById("emailError").textContent =
      "You need to have a @ in the emailaddress";
  } else {
    email.style.borderColor = "";
    email.style.color = "";
    document.getElementById("emailError").textContent = "";
  }
}

function liveValidation() {
  let pass1 = document.getElementById("pass");
  let pass2 = document.getElementById("passAgain");
  if (pass1.value !== pass2.value) {
    pass1.style.borderColor = "#f57";
    pass2.style.borderColor = "#f57";
    pass1.style.color = "#f57";
    pass2.style.color = "#f57";
    document.getElementById("passwordError").textContent =
      "Passwords are not matching";
  } else if (pass1.value.length < 5) {
    pass1.style.borderColor = "#f57";
    pass2.style.borderColor = "#f57";
    pass1.style.color = "#f57";
    pass2.style.color = "#f57";
    document.getElementById("passwordError").textContent =
      "Password has to be atleast 5 characters";
  } else {
    pass1.style.borderColor = "";
    pass2.style.borderColor = "";
    pass1.style.color = "";
    pass2.style.color = "";
    document.getElementById("passwordError").textContent = "";
  }
}

function validateRoom() {
  let room = document.getElementById("room");

  if (!room) {
    return;
  }

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

function addClosingEvent() {
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closedialog();
    }
  });
}

function login() {
  let username;
  if (document.getElementById("username").value) {
    username = document.getElementById("username").value;
  } else if (document.getElementById("user").value) {
    username = document.getElementById("user").value;
  }

  getCustomer(username);

  showpage("welcome");
  closedialog();
}

if (localStorage.getItem("username")) {
  welcomeMessage.textContent = "Welcome " + localStorage.getItem("username");
  document.querySelector(".login").textContent =
    "Hello " + localStorage.getItem("username");
  document.querySelector(".register").style.display = "none";
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

let apptype = "a22albjo";

function fixChars(returnedData) {
  x = returnedData.getElementsByTagName("*");
  for (i = 0; i < x.length; i++) {
    for (j = 0; j < x[i].attributes.length; j++) {
      x[i].attributes[j].nodeValue = x[i].attributes[j].nodeValue.replace(
        /%/g,
        "&"
      );
    }
  }
}

function storeCustomer() {
  let input = {
    ID: `a22albjo${document.getElementById("user").value}`,
    firstname: document.getElementById("customerfnameC").value,
    lastname: document.getElementById("customerlnameC").value,
    email: document.getElementById("email").value,
    address: document.getElementById("customeraddressC").value,
  };

  fetch("./booking/makecustomer_XML.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
    .then(function (response) {
      if (response.ok) {
        login();
        return response.text();
      }
      throw new Error(response.statusText);
    })
    .catch(function (error) {
      if (error.status == 500) {
        alert(
          "Something went wrong. Username might already exists, please try again. \n" +
            error
        );
      } else {
        alert("Request failed\n" + error);
      }
    });
}

function getCustomer(username) {
  let customerID = "a22albjo" + username;

  let input = {
    customerID: customerID,
  };

  fetch("./booking/getcustomer_XML.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
    .then(function (response) {
      if (response.ok) return response.text();
      throw new Error(response.statusText);
    })
    .then(function (text) {
      let customer = new window.DOMParser().parseFromString(text, "text/xml");
      if (!customer.getElementsByTagName("customer")[0]) {
        alert("No customer with that username was found");
      } else {
        localStorage.setItem("username", username);
        let welcomeMessage = document.getElementById("welcomeMessage");
        welcomeMessage.textContent =
          "Welcome " + localStorage.getItem("username");
        document.querySelector(".login").textContent = "Hello " + username;
        document.querySelector(".register").style.display = "none";
      }
    })
    .catch(function (error) {
      // catch
      alert("Request failed\n" + error);
    });
}

function searchResources() {
  let input = {
    type: apptype,
    name: document.getElementById("resNameS").value,
    location: document.getElementById("resLocationS").value,
    company: document.getElementById("resCompanyS").value,
    id: document.getElementById("resIDS").value,
  };

  fetch("./booking/getresources_XML.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
    .then(function (response) {
      if (response.ok) return response.text();
      throw new Error(response.statusText);
    })
    .then(function (text) {
      showResources(new window.DOMParser().parseFromString(text, "text/xml"));
    })
    .catch(function (error) {
      alert("Request failed\n" + error);
    });
}

function showResources(returnedData) {
  fixChars(returnedData);
  let resultset = returnedData.childNodes[0];
  let output = "<div id='card'>";
  for (i = 0; i < resultset.childNodes.length; i++) {
    if (resultset.childNodes.item(i).nodeName == "resource") {
      let resource = resultset.childNodes.item(i);
      output +=
        "<div style='width:33%;'><h3>Room " +
        resource.attributes["id"].value.slice(8) +
        "</h3><div class='card' >" +
        "<p><b>Size</b> " +
        resource.attributes["cost"].value +
        "kvm</p>" +
        "<p><b>Items</b> " +
        resource.attributes["company"].value +
        "</p>" +
        "<p><b>People</b> " +
        resource.attributes["name"].value +
        "</p>" +
        "<p><b>Location</b> " +
        resource.attributes["location"].value +
        "</p>" +
        "<p><b>Screen</b> " +
        resource.attributes["category"].value +
        "'</p>" +
        "</div></div>";
    }
  }
  output += "</div>";

  let div = document.getElementById("divOutput");
  div.innerHTML = output;
}

function searchAvailability() {
  let input = {
    resid: `a22albjo${document.getElementById("resIDA").value}`,
    type: apptype,
  };

  fetch("./booking/getavailability_search_XML.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
    .then(function (response) {
      if (response.ok) return response.text();
      throw new Error(response.statusText);
    })
    .then(function (text) {
      showAvailability(
        new window.DOMParser().parseFromString(text, "text/xml")
      );
    })
    .catch(function (error) {
      alert("Request failed\n" + error);
    });
}

function showAvailability(returnedData) {
  fixChars(returnedData);
  let resultset = returnedData.childNodes[0];
  let output = "<table style='width:100%;'>";
  output +=
    "<tr><th>Room</th> <th>Items</th> <th>People</th> <th>Location</th> <th>Size</th> <th>Screen</th> <th>From</th> <th>To</th> </tr>";
  for (i = 0; i < resultset.childNodes.length; i++) {
    if (resultset.childNodes.item(i).nodeName == "availability") {
      let avail = resultset.childNodes.item(i);
      if (avail.attributes["remaining"].value > 0) {
        output +=
          "<tr class='actiontablerow'>" +
          "<td class='res" +
          i +
          "'>" +
          avail.attributes["resourceID"].value.slice(8) +
          "</td>" +
          "<td class='comp" +
          i +
          "'>" +
          avail.attributes["company"].value +
          "</td>" +
          "<td class='name" +
          i +
          "' >" +
          avail.attributes["name"].value +
          "</td>" +
          "<td class='loc" +
          i +
          "'>" +
          avail.attributes["location"].value +
          "</td>" +
          "<td class='cost" +
          i +
          "'>" +
          avail.attributes["cost"].value +
          "kvm</td>" +
          "<td class='cat" +
          i +
          "'>" +
          avail.attributes["category"].value +
          "</td>" +
          "<td class='date" +
          i +
          "'>" +
          avail.attributes["date"].value +
          "</td>" +
          "<td class='dateto" +
          i +
          "'>" +
          avail.attributes["dateto"].value +
          "</td>" +
          "<td class='Book" +
          i +
          `'><button class="bookButton" onclick="makeBooking(${i})">Book</button></td>`;
        +"</tr>";
      }
    }
  }

  output += "</table>";
  let div = document.getElementById("OutputDivSearchA");
  div.innerHTML = output;
}

function makeBooking(resourceNo) {
  if (!localStorage.getItem("username")) {
    alert("You need to login to make a booking!");
    return;
  }
  document.querySelector(".loading").style.display = "block";
  let input = {
    resourceID:
      "a22albjo" + document.querySelector(".res" + resourceNo).textContent,
    date: document.querySelector(".date" + resourceNo).textContent,
    dateto: document.querySelector(".dateto" + resourceNo).textContent,
    customerID: "a22albjo" + localStorage.getItem("username"),
    rebate: 1,
    status: 2,
    position: 1,
    auxdata: "",
    type: apptype,
  };

  document.getElementById("resIDA").value = "";
  document.getElementById("searchAva").click();

  fetch("./booking/makebooking_XML.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
    .then(function (response) {
      if (response.ok) return response.text();
      throw new Error(response.statusText);
    })
    .then(function (text) {
      alert("Booking done!");
      document.querySelector(".loading").style.display = "none";
    })
    .catch(function (error) {
      alert("Request failed\n" + error);
    });
}

//Här börjar koden till inbäddat innehåll

let canvas1 = document.getElementById("myCanvas1");
let ctx1 = canvas1.getContext("2d");
canvas1.width = 1920;
canvas1.height = 1080;
ctx1.font = "normal 250px Arial";

function Lager_1() {
  ctx1.globalAlpha = 1.0;
  //room 1
  ctx1.fillStyle = "#FFC280";
  ctx1.beginPath();
  ctx1.moveTo(112, -20);
  ctx1.bezierCurveTo(114, -20, 114, -23, 112, -23);
  ctx1.bezierCurveTo(110, -23, 110, -20, 112, -20);
  ctx1.lineTo(112, -20);
  ctx1.lineTo(112, -20);
  ctx1.fill();
  ctx1.fillStyle = "#754C24";
  ctx1.beginPath();
  ctx1.moveTo(177, 60);
  ctx1.lineTo(1098, 60);
  ctx1.lineTo(1098, 420);
  ctx1.lineTo(177, 420);
  ctx1.lineTo(177, 60);
  ctx1.fill();
  ctx1.fillStyle = "#8C6239";
  ctx1.beginPath();
  ctx1.moveTo(21, 130);
  ctx1.lineTo(942, 130);
  ctx1.lineTo(942, 490);
  ctx1.lineTo(21, 490);
  ctx1.lineTo(21, 130);
  ctx1.fill();
  ctx1.fillStyle = "#603813";
  ctx1.beginPath();
  ctx1.moveTo(942, 490);
  ctx1.lineTo(1098, 420);
  ctx1.lineTo(1098, 60);
  ctx1.lineTo(942, 130);
  ctx1.lineTo(942, 490);
  ctx1.fill();
  ctx1.fillStyle = "#603813";
  ctx1.beginPath();
  ctx1.moveTo(177, 60);
  ctx1.lineTo(20, 130);
  ctx1.lineTo(177, 130);
  ctx1.lineTo(177, 60);
  ctx1.fill();
  ctx1.save();
  ctx1.translate(416, 384);
  ctx1.rotate(0, 0);
  ctx1.scale(1, 1);
  ctx1.fillText("1", 0, 0);
  ctx1.restore();
  //room 2
  ctx1.fillStyle = "#754C24";
  ctx1.beginPath();
  ctx1.moveTo(176, 507);
  ctx1.lineTo(1097, 507);
  ctx1.lineTo(1097, 867);
  ctx1.lineTo(176, 867);
  ctx1.lineTo(176, 507);
  ctx1.fill();
  ctx1.fillStyle = "#8C6239";
  ctx1.beginPath();
  ctx1.moveTo(20, 577);
  ctx1.lineTo(941, 577);
  ctx1.lineTo(941, 937);
  ctx1.lineTo(20, 937);
  ctx1.lineTo(20, 577);
  ctx1.fill();
  ctx1.fillStyle = "#603813";
  ctx1.beginPath();
  ctx1.moveTo(941, 937);
  ctx1.lineTo(1097, 867);
  ctx1.lineTo(1097, 507);
  ctx1.lineTo(941, 577);
  ctx1.lineTo(941, 937);
  ctx1.fill();
  ctx1.fillStyle = "#603813";
  ctx1.beginPath();
  ctx1.moveTo(177, 507);
  ctx1.lineTo(20, 577);
  ctx1.lineTo(177, 577);
  ctx1.lineTo(177, 507);
  ctx1.fill();
  ctx1.save();
  ctx1.translate(410, 838);
  ctx1.rotate(0, 0);
  ctx1.scale(1, 1);
  ctx1.fillText("2", 0, 0);
  ctx1.restore();
  //room 3
  ctx1.fillStyle = "#FFC280";
  ctx1.beginPath();
  ctx1.moveTo(1512, 493);
  ctx1.bezierCurveTo(1514, 493, 1514, 490, 1512, 490);
  ctx1.bezierCurveTo(1510, 490, 1510, 493, 1512, 493);
  ctx1.lineTo(1512, 493);
  ctx1.lineTo(1512, 493);
  ctx1.fill();
  ctx1.fillStyle = "#754C24";
  ctx1.beginPath();
  ctx1.moveTo(1236, 507);
  ctx1.lineTo(1901, 507);
  ctx1.lineTo(1901, 867);
  ctx1.lineTo(1236, 867);
  ctx1.lineTo(1236, 507);
  ctx1.fill();
  ctx1.fillStyle = "#8C6239";
  ctx1.beginPath();
  ctx1.moveTo(1124, 577);
  ctx1.lineTo(1788, 577);
  ctx1.lineTo(1788, 937);
  ctx1.lineTo(1124, 937);
  ctx1.lineTo(1124, 577);
  ctx1.fill();
  ctx1.fillStyle = "#603813";
  ctx1.beginPath();
  ctx1.moveTo(1787, 937);
  ctx1.lineTo(1901, 867);
  ctx1.lineTo(1901, 507);
  ctx1.lineTo(1787, 577);
  ctx1.lineTo(1787, 937);
  ctx1.fill();
  ctx1.fillStyle = "#603813";
  ctx1.beginPath();
  ctx1.moveTo(1236, 507);
  ctx1.lineTo(1123, 577);
  ctx1.lineTo(1236, 577);
  ctx1.lineTo(1236, 507);
  ctx1.fill();
  ctx1.save();
  ctx1.translate(1414, 838);
  ctx1.rotate(0, 0);
  ctx1.scale(1, 1);
  ctx1.fillText("3", 0, 0);
  ctx1.restore();
}

let tileWidth = 940;
let tileHeight = 520;
let tileOffsX = 10;
let tileOffsY = 10;
let tileLean = tileWidth / tileHeight;

let hx = 0,
  hy = 0,
  mx = 0,
  my = 0;

let tiles = [
  [0, 0],
  [0, 0],
];

function init() {
  drawTiles();
}

function drawTiles() {
  ctx1.clearRect(0, 0, 1920, 1080);
  let x, y, z;
  Lager_1(x, y, z);

  for (cy = 0; cy < 2; cy++) {
    for (cx = 0; cx < 2; cx++) {
      if (tiles[cx][cy] == 1) {
        drawBox(
          tileOffsX + tileWidth * cx,
          tileOffsY + cy * tileHeight,
          "#ef752633",
          "#ef752655"
        );
      } else if (cx == hx && cy == hy) {
        drawBox(
          tileOffsX + tileWidth * cx,
          tileOffsY + cy * tileHeight,

          "#ef752699",
          "#ffffff00"
        );
      } else {
        drawBox(
          tileOffsX + tileWidth * cx,
          tileOffsY + cy * tileHeight,

          "#ffffff00",
          "#ffffff00"
        );
      }
    }
  }
}

function screenToTile(sx, sy) {
  let txc = sx - tileOffsX;
  let tyc = sy - tileOffsY;

  let tcx = Math.round(txc / tileWidth + 0.1);
  let tcy = Math.round(tyc / tileHeight + 0.1);

  console.log(tcx, tcy);

  return { x: tcx, y: tcy };
}

function mouseMove(e) {
  let rect = e.target.getBoundingClientRect();
  mx = e.clientX - rect.left;
  my = e.clientY - rect.top;

  let tc = screenToTile(mx, my);
  if (hx != tc.x || hy != tc.y) {
    hx = tc.x;
    hy = tc.y;
    drawTiles();
  }
}

function mouseDown(event) {
  let tc = screenToTile(mx, my);
  tiles = [
    [0, 0],
    [0, 0],
  ];

  if (tc.x == 0 && tc.y == 0) {
    document.getElementById("resIDA").value = "1";
    document.getElementById("searchAva").click();
  } else if (tc.x == 0 && tc.y == 1) {
    document.getElementById("resIDA").value = "2";
    document.getElementById("searchAva").click();
  } else if (tc.x == 1 && tc.y == 1) {
    document.getElementById("resIDA").value = "3";
    document.getElementById("searchAva").click();
  } else if (tc.x == 1 && tc.y == 0) {
    return;
  }

  tiles[tc.x][tc.y] = 1;

  drawTiles();
}

function drawBox(x, y, fillcolor, fillcolor2) {
  ctx1.save();
  ctx1.translate(x, y);

  let gradient = ctx1.createRadialGradient(
    tileWidth / 2,
    tileHeight / 2,
    0,
    tileWidth / 2,
    tileHeight / 2,
    tileWidth / 4
  );

  gradient.addColorStop(0, fillcolor);
  gradient.addColorStop(0.5, fillcolor2);
  gradient.addColorStop(1, "#ff000000");
  ctx1.fillStyle = gradient;

  ctx1.globalAlpha = 1.0;
  ctx1.beginPath();
  ctx1.moveTo(tileOffsX, tileOffsY);
  ctx1.lineTo(tileWidth, tileOffsY);
  ctx1.lineTo(tileWidth, tileHeight);
  ctx1.lineTo(tileOffsX, tileHeight);
  ctx1.closePath();

  ctx1.fill();

  ctx1.restore();
}

init();

var ctx2;
var img;
var gubbar = new Array();

var numflakes = 12;
let points = numflakes;

var mx2, my2;

let mouseIsDown = false;

let gobbe = document.getElementById("gobbe");
let gobbe2 = document.getElementById("gobbe2");

function drawAmoeba(v) {
  if (v == 1) {
    ctx2.drawImage(gobbe, 0, -20, 20, 40);
  } else {
    ctx2.drawImage(gobbe2, 0, -20, 20, 40);
  }
}

function mouseMove2(e, t) {
  var rect = e.target.getBoundingClientRect();
  mx2 = e.clientX - rect.left;
  my2 = e.clientY - rect.top;
}

function mouseDown2() {
  mouseIsDown = true;
}
function mouseUp2() {
  mouseIsDown = false;
}

function Gubbe(xk, yk, spd) {
  this.xk = xk;
  this.yk = yk;
  this.spd = spd;
}

function drawgraphics() {
  ctx2.clearRect(0, 0, 720, 540);
  ctx2.font = "30px Arial";
  ctx2.fillText(points, 15, 50);
  ctx2.save();
  ctx2.beginPath();
  ctx2.arc(mx2, my2, 100, 0, 2 * Math.PI);

  ctx2.clip();
  drawDotted(0, 0, 720, 540, "#ffe");

  for (var i = 0; i < numflakes; i++) {
    ctx2.save();
    ctx2.translate(gubbar[i].xk, gubbar[i].yk);

    var dx, dy, dist;
    dx = mx2 - gubbar[i].xk;
    dy = my2 - gubbar[i].yk;
    dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 20) {
      drawAmoeba(1);
      if (mouseIsDown) {
        gubbar.splice(i, 1);
        numflakes--;
        points--;
      }
    } else {
      drawAmoeba(2);
    }

    if (gubbar.length == 0) {
      alert("You won!");
      startupCanvas();
    }
    ctx2.restore();
    if (gubbar[i] == undefined) continue;
    gubbar[i].yk += gubbar[i].spd;
    if (gubbar[i].yk > 550) {
      alert("Game Over");
      startupCanvas();
    }
  }
  ctx2.restore();
  setTimeout(function () {
    drawgraphics();
  }, 30);
}

function drawDotted(x1, y1, x2, y2, col) {
  ctx2.beginPath();
  ctx2.moveTo(x1, y1);
  ctx2.lineTo(x2, y1);
  ctx2.lineTo(x2, y2);
  ctx2.lineTo(x1, y2);
  ctx2.closePath();

  var gradient1 = ctx2.createLinearGradient(0, 0, 0, 500);
  gradient1.addColorStop(0, "#8D5");
  gradient1.addColorStop(0.5, "#AF5");
  gradient1.addColorStop(1, "#182");
  ctx2.fillStyle = gradient1;

  ctx2.fill();

  ctx2.fillStyle = col;

  for (i = 0; i < 12; i++) {
    ctx2.beginPath();
    ctx2.rect(x1 + 60 * i, y1, 5, 830);
    ctx2.fill();
  }
}

function startupCanvas() {
  let takenFiles = [];

  numflakes = 12;
  points = numflakes;

  function file() {
    let file = Math.round(Math.random() * 11);
    while (takenFiles.includes(file)) {
      file = Math.round(Math.random() * 11);
    }
    takenFiles.push(file);

    return file;
  }

  for (var i = 0; i < numflakes; i++) {
    gubbar[i] = new Gubbe(
      Math.round(file()) * 60 + 20,
      Math.round(0),
      Math.random() * 2 + 1
    );
  }

  var canvas2 = document.getElementById("myCanvas2");
  canvas2.width = 720;
  canvas2.height = 540;
  ctx2 = canvas2.getContext("2d");
  drawgraphics();
}

var canvas3 = document.getElementById("myCanvas3");
canvas3.width = window.innerWidth;
canvas3.height = window.innerHeight;
let ctx3 = canvas3.getContext("2d");
let x = 0;
let y = 0;
let z = 0;

function drawIcon() {
  ctx3.beginPath();
  ctx3.moveTo(248, 478);
  ctx3.bezierCurveTo(120, 478, 20, 376, 20, 250);
  ctx3.bezierCurveTo(22, 92, 122, 22, 248, 22);
  ctx3.bezierCurveTo(359, 22, 452, 101, 472, 206);
  ctx3.lineTo(496, 206);
  ctx3.bezierCurveTo(476, 89, 373, 0, 250, 0);
  ctx3.bezierCurveTo(112, 0, 0, 112, 0, 250);
  ctx3.bezierCurveTo(20, 430, 112, 500, 250, 500);
  ctx3.bezierCurveTo(373, 500, 476, 411, 496, 294);
  ctx3.lineTo(472, 294);
  ctx3.bezierCurveTo(452, 399, 359, 478, 248, 478);
  ctx3.lineTo(248, 478);
  ctx3.fillStyle = "#df6516";
  ctx3.closePath();
  ctx3.fill();
}

function oneSpin(x, y, z) {
  ctx3.rotate(x);
  ctx3.scale(y % 3, z % 3);
  ctx3.rotate(x);
  drawIcon();
}

function animate() {
  x += 0.01;
  y += 0.01;
  z += 0.01;

  if (x > 1.72) {
    x = 0;
  }
  if (y > 1.72) {
    y = 0;
  }
  if (z > 1.72) {
    z = 0;
  }

  ctx3.clearRect(0, 0, canvas3.width, canvas3.height);

  var ev1 = easeInOutQuad(x);
  var ev2 = easeInOutQuad(y);
  var ev3 = easeInOutQuad(z);

  ctx3.save();
  ctx3.translate(690, 400);

  for (let i = 0; i < 30; i++) {
    oneSpin(ev1, ev2, ev3);
    ctx3.translate(ev1, ev1);
  }

  ctx3.restore();

  window.requestAnimationFrame(animate);
}

function easeInOutQuad(x) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

animate();
