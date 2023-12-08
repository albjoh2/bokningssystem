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

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
canvas.width = 1920;
canvas.height = 1080;
ctx.font = "normal 250px Arial";

function Lager_1() {
  ctx.globalAlpha = 1.0;
  //room 1
  ctx.fillStyle = "#FFC280";
  ctx.beginPath();
  ctx.moveTo(112, -20);
  ctx.bezierCurveTo(114, -20, 114, -23, 112, -23);
  ctx.bezierCurveTo(110, -23, 110, -20, 112, -20);
  ctx.lineTo(112, -20);
  ctx.lineTo(112, -20);
  ctx.fill();
  ctx.fillStyle = "#754C24";
  ctx.beginPath();
  ctx.moveTo(177, 60);
  ctx.lineTo(1098, 60);
  ctx.lineTo(1098, 420);
  ctx.lineTo(177, 420);
  ctx.lineTo(177, 60);
  ctx.fill();
  ctx.fillStyle = "#8C6239";
  ctx.beginPath();
  ctx.moveTo(21, 130);
  ctx.lineTo(942, 130);
  ctx.lineTo(942, 490);
  ctx.lineTo(21, 490);
  ctx.lineTo(21, 130);
  ctx.fill();
  ctx.fillStyle = "#603813";
  ctx.beginPath();
  ctx.moveTo(942, 490);
  ctx.lineTo(1098, 420);
  ctx.lineTo(1098, 60);
  ctx.lineTo(942, 130);
  ctx.lineTo(942, 490);
  ctx.fill();
  ctx.fillStyle = "#603813";
  ctx.beginPath();
  ctx.moveTo(177, 60);
  ctx.lineTo(20, 130);
  ctx.lineTo(177, 130);
  ctx.lineTo(177, 60);
  ctx.fill();
  ctx.save();
  ctx.translate(416, 384);
  ctx.rotate(0, 0);
  ctx.scale(1, 1);
  ctx.fillText("1", 0, 0);
  ctx.restore();
  //room 2
  ctx.fillStyle = "#754C24";
  ctx.beginPath();
  ctx.moveTo(176, 507);
  ctx.lineTo(1097, 507);
  ctx.lineTo(1097, 867);
  ctx.lineTo(176, 867);
  ctx.lineTo(176, 507);
  ctx.fill();
  ctx.fillStyle = "#8C6239";
  ctx.beginPath();
  ctx.moveTo(20, 577);
  ctx.lineTo(941, 577);
  ctx.lineTo(941, 937);
  ctx.lineTo(20, 937);
  ctx.lineTo(20, 577);
  ctx.fill();
  ctx.fillStyle = "#603813";
  ctx.beginPath();
  ctx.moveTo(941, 937);
  ctx.lineTo(1097, 867);
  ctx.lineTo(1097, 507);
  ctx.lineTo(941, 577);
  ctx.lineTo(941, 937);
  ctx.fill();
  ctx.fillStyle = "#603813";
  ctx.beginPath();
  ctx.moveTo(177, 507);
  ctx.lineTo(20, 577);
  ctx.lineTo(177, 577);
  ctx.lineTo(177, 507);
  ctx.fill();
  ctx.save();
  ctx.translate(410, 838);
  ctx.rotate(0, 0);
  ctx.scale(1, 1);
  ctx.fillText("2", 0, 0);
  ctx.restore();
  //room 3
  ctx.fillStyle = "#FFC280";
  ctx.beginPath();
  ctx.moveTo(1512, 493);
  ctx.bezierCurveTo(1514, 493, 1514, 490, 1512, 490);
  ctx.bezierCurveTo(1510, 490, 1510, 493, 1512, 493);
  ctx.lineTo(1512, 493);
  ctx.lineTo(1512, 493);
  ctx.fill();
  ctx.fillStyle = "#754C24";
  ctx.beginPath();
  ctx.moveTo(1236, 507);
  ctx.lineTo(1901, 507);
  ctx.lineTo(1901, 867);
  ctx.lineTo(1236, 867);
  ctx.lineTo(1236, 507);
  ctx.fill();
  ctx.fillStyle = "#8C6239";
  ctx.beginPath();
  ctx.moveTo(1124, 577);
  ctx.lineTo(1788, 577);
  ctx.lineTo(1788, 937);
  ctx.lineTo(1124, 937);
  ctx.lineTo(1124, 577);
  ctx.fill();
  ctx.fillStyle = "#603813";
  ctx.beginPath();
  ctx.moveTo(1787, 937);
  ctx.lineTo(1901, 867);
  ctx.lineTo(1901, 507);
  ctx.lineTo(1787, 577);
  ctx.lineTo(1787, 937);
  ctx.fill();
  ctx.fillStyle = "#603813";
  ctx.beginPath();
  ctx.moveTo(1236, 507);
  ctx.lineTo(1123, 577);
  ctx.lineTo(1236, 577);
  ctx.lineTo(1236, 507);
  ctx.fill();
  ctx.save();
  ctx.translate(1414, 838);
  ctx.rotate(0, 0);
  ctx.scale(1, 1);
  ctx.fillText("3", 0, 0);
  ctx.restore();
}

// Tile Parameters - We need width and height of tiles as well as offset to te left and top of first tile
// Each ground tile is approximately 82 by 48 units and therefore the transform is roughly half that at 41 and 24
let tileWidth = 940;
let tileHeight = 520;
let tileOffsX = 10;
let tileOffsY = 10;
let tileLean = tileWidth / tileHeight;

// Current Hover Tile
let hx = 0,
  hy = 0,
  mx = 0,
  my = 0;

// Tilemap
let tiles = [
  [0, 0],
  [0, 0],
];

//Initializations
function init() {
  drawTiles();
}

// Iterate over tile array and draw boxes accordingly
function drawTiles() {
  ctx.clearRect(0, 0, 1920, 1080);
  Lager_1();

  // Redraw Tiles
  for (cy = 0; cy < 2; cy++) {
    for (cx = 0; cx < 2; cx++) {
      if (tiles[cx][cy] == 1) {
        drawBox(
          tileOffsX + tileWidth * cx,
          tileOffsY + cy * tileHeight,

          "#ef752699"
        );
      } else if (cx == hx && cy == hy) {
        drawBox(
          tileOffsX + tileWidth * cx,
          tileOffsY + cy * tileHeight,

          "#ffffff88"
        );
      } else {
        drawBox(
          tileOffsX + tileWidth * cx,
          tileOffsY + cy * tileHeight,

          "#ffffff00"
        );
      }
    }
  }
}

// Screen coordinate to tilespace coordinate
function screenToTile(sx, sy) {
  let txc = sx - tileOffsX;
  let tyc = sy - tileOffsY;

  // Number of tile
  let tcx = Math.round(txc / tileWidth + 0.1);
  let tcy = Math.round(tyc / tileHeight + 0.1);

  console.log(tcx, tcy);

  // Coordinate in tile
  let tx = Math.round(txc % tileWidth);
  let ty = Math.round(tyc % tileHeight);

  return { x: tcx, y: tcy }; //Returns the tile coordinate
}

//This function is called by the onmousemove event for the canvas element
function mouseMove(e) {
  let rect = e.target.getBoundingClientRect();
  mx = e.clientX - rect.left; //x position within the element.
  my = e.clientY - rect.top; //y position within the element.

  //Find the position of the canvas element
  let tc = screenToTile(mx, my);
  if (hx != tc.x || hy != tc.y) {
    hx = tc.x;
    hy = tc.y;
    drawTiles();
  }
}

//This function is called when a mouse button is pressed down on the canvas element
function mouseDown(event) {
  //Find the position of the canvas element
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

//Draws a box tile at coordinate X,Y cavas code imported from svg
function drawBox(x, y, fillcolor) {
  ctx.save();
  ctx.translate(x, y);

  //gradient for the box
  let gradient = ctx.createRadialGradient(
    tileWidth / 2,
    tileHeight / 2,
    0,
    tileWidth / 2,
    tileHeight / 2,
    tileWidth / 4
  );

  gradient.addColorStop(0, fillcolor);
  gradient.addColorStop(1, "#ffffff00");
  ctx.fillStyle = gradient;

  ctx.globalAlpha = 1.0;
  ctx.beginPath();
  ctx.moveTo(tileOffsX, tileOffsY);
  ctx.lineTo(tileWidth, tileOffsY);
  ctx.lineTo(tileWidth, tileHeight);
  ctx.lineTo(tileOffsX, tileHeight);
  ctx.closePath();

  ctx.fill();

  ctx.restore();
}

init();
