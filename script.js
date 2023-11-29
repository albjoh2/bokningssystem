function updateHistory(token) {
  history.pushState(token, "Titel: " + token, "");
  document.title = token;
  document.location.hash = token;
}

function showpage(pageid) {
  let pos = $("#" + pageid).position().top;
  $("body").animate({ scrollTop: pos }, 500, "easeOutQuint");
  updateHistory(pageid);
}

function showDialog(dialogid) {
  let dialogs = document.getElementsByClassName("dialog");
  for (let dialog of dialogs) {
    dialog.style.display = "none";
  }
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
  if (email.value.indexOf("@") === -1) {
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
  let emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;
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
  } else {
    pass1.style.borderColor = "#fff";
    pass2.style.borderColor = "#fff";
    pass1.style.color = "#fff";
    pass2.style.color = "#fff";
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

$(function () {
  $("#accordion").accordion();
});

let apptype = "a22albjo";

function fixChars(returnedData) {
  // Iterate over all nodes in root node recursively and replace the strings inside attributes
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
  let output = "<div id='accordion'>";
  for (i = 0; i < resultset.childNodes.length; i++) {
    if (resultset.childNodes.item(i).nodeName == "resource") {
      let resource = resultset.childNodes.item(i);
      output +=
        "<div style='width:33%;'><h3>Room " +
        resource.attributes["id"].value.slice(8) +
        "</h3><div class='accordion' >" +
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
  let input = {
    resourceID:
      "a22albjo" + document.querySelector(".res" + resourceNo).textContent,
    date: document.querySelector(".date" + resourceNo).textContent,
    dateto: document.querySelector(".dateto" + resourceNo).textContent,
    customerID: "a22albjo" + localStorage.getItem("username"),
    rebate: 1,
    status: 2, // 2 = "Real" booking.
    position: 1,
    auxdata: "",
    type: apptype, // Only show bookings for your webbapplication using the apptype
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
    .catch(function (error) {
      alert("Request failed\n" + error);
    });
}
