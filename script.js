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
    storeCustomer();
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
  localStorage.setItem("username", username.value);

  getCustomer();

  let welcomeMessage = document.getElementById("welcomeMessage");
  if (localStorage.getItem("username")) {
    welcomeMessage.textContent = "Welcome " + localStorage.getItem("username");
    document.querySelector(".login").textContent = "Hello " + username.value;
    document.querySelector(".register").style.display = "none";
  }

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
  var input = {
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
      if (response.ok) return response.text();
      throw new Error(response.statusText);
    })
    .then(function (text) {
      ResultBookingCustomer(
        new window.DOMParser().parseFromString(text, "text/xml")
      );
    })
    .catch(function (error) {
      alert("Request failed\n" + error);
    });
}

function getCustomer() {
  var customerID = "a22albjo" + localStorage.getItem("username");

  var input = {
    customerID: encodeURIComponent(customerID),
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
        showDialog("login");
      }
    })
    .catch(function (error) {
      // catch
      alert("Request failed\n" + error);
    });
}

function ResultCustomern(returnedData) {
  // Iterate over all nodes in root node (i.e. the 'created' element in root which has an attribute called status)
  for (i = 0; i < returnedData.childNodes.length; i++) {
    if (returnedData.childNodes.item(i).nodeName == "created") {
      alert(returnedData.childNodes.item(i).attributes["status"].value);
    }
  }
}

function searchResources() {
  var input = {
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
  // Fix characters in XML notation to HTML notation
  fixChars(returnedData);
  // An XML DOM document is returned from AJAX
  var resultset = returnedData.childNodes[0];
  var output = "<div id='accordion'>";
  // Iterate over all nodes in root node (i.e. resources)
  for (i = 0; i < resultset.childNodes.length; i++) {
    // Iterate over all child nodes of that node that are resource nodes
    if (resultset.childNodes.item(i).nodeName == "resource") {
      // Retrieve data from resource nodes
      var resource = resultset.childNodes.item(i);
      output +=
        "<div style='width:33%;'><h3>Room " +
        resource.attributes["id"].value.slice(8) +
        "</h3><div class='accordion' >";
      output +=
        "<p><b>Size</b> " + resource.attributes["size"].value + "kvm</p>";
      output +=
        "<p><b>Items</b> " + resource.attributes["company"].value + "</p>";
      output +=
        "<p><b>People</b> " + resource.attributes["name"].value + "</p>";
      output +=
        "<p><b>Location</b> " + resource.attributes["location"].value + "</p>";
      output +=
        "<p><b>Screen</b> " + resource.attributes["category"].value + "'</p>";

      output += "</div></div>";
    }
  }
  output += "</div>";

  var div = document.getElementById("divOutput");
  div.innerHTML = output;
}

function searchAvailability() {
  var input = {
    resid: `a22albjo${document.getElementById("resIDA").value}`,
    type: apptype, // Only show bookings for your webbapplication using the apptype
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
  var resultset = returnedData.childNodes[0];
  var output = "<table>";
  for (i = 0; i < resultset.childNodes.length; i++) {
    if (resultset.childNodes.item(i).nodeName == "availability") {
      var avail = resultset.childNodes.item(i);
      output +=
        "<tr class='actiontablerow' onclick='alert(\"" +
        avail.attributes["resourceID"].value +
        "\")'>";
      output +=
        "<td class='res" +
        i +
        "'>" +
        avail.attributes["resourceID"].value.slice(8) +
        "</td>";
      output +=
        "<td class='comp" +
        i +
        "'>" +
        avail.attributes["company"].value +
        "</td>";
      output +=
        "<td class='name" +
        i +
        "' >" +
        avail.attributes["name"].value +
        "</td>";
      output +=
        "<td class='loc" +
        i +
        "'>" +
        avail.attributes["location"].value +
        "</td>";
      output +=
        "<td class='size" + i + "'>" + avail.attributes["size"].value + "</td>";
      output +=
        "<td class='cost" +
        i +
        "'>" +
        avail.attributes["cost"].value +
        "kvm</td>";
      output +=
        "<td class='cat" +
        i +
        "'>" +
        avail.attributes["category"].value +
        "</td>";
      output +=
        "<td class='date" + i + "'>" + avail.attributes["date"].value + "</td>";
      output +=
        "<td class='dateto" +
        i +
        "'>" +
        avail.attributes["dateto"].value +
        "</td>";
      output +=
        "<td class='count" +
        i +
        "'>" +
        avail.attributes["bookingcount"].value +
        "</td>";
      output +=
        "<td class='remain" +
        i +
        "'>" +
        avail.attributes["remaining"].value +
        "</td>";
      output += "</tr>";
    }
  }

  output += "</table>";
  var div = document.getElementById("OutputDivSearchA");
  div.innerHTML = output;
}

function makeBooking() {
  var input = {
    resourceID: document.getElementById("resourceIDB").value,
    date: document.getElementById("dateB").value,
    dateto: document.getElementById("dateToB").value,
    customerID: document.getElementById("customerIDB").value,
    rebate: document.getElementById("rebateB").value,
    status: document.getElementById("statusB").value, // 2 = "Real" booking.
    position: document.getElementById("positionB").value,
    auxdata: document.getElementById("auxDataB").value,
    type: apptype, // Only show bookings for your webbapplication using the apptype
  };

  fetch("../booking/makebooking_XML.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
    .then(function (response) {
      if (response.ok) return response.text();
      throw new Error(response.statusText);
    })
    .then(function (text) {
      bookingmade(new window.DOMParser().parseFromString(text, "text/xml"));
    })
    .catch(function (error) {
      alert("Request failed\n" + error);
    });
}

function bookingmade(returnedData) {
  alert("booked!");
  console.log(returnedData);
}
