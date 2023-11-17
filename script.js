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
    storeCustomer();
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

$(function () {
  $("#accordion").accordion();
});

let apptype = "a22albjo";

function fixChars(returnedData) {
  var resultset = returnedData.childNodes[0];

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
    ID: `a22albjo${Math.random()}`,
    firstname: document.getElementById("customerfnameC").value,
    lastname: document.getElementById("customerlnameC").value,
    email: document.getElementById("email").value,
    address: document.getElementById("customeraddressC").value,
  };
  console.log(input);

  fetch("./booking/makecustomer_XML.php", {
    method: "POST", // or 'PUT'
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
    .then(function (response) {
      // first then()
      if (response.ok) return response.text();
      throw new Error(response.statusText);
    })
    .then(function (text) {
      ResultBookingCustomer(
        new window.DOMParser().parseFromString(text, "text/xml")
      );
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

//------------------------------------------------------------------------
// search resources
//------------------------------------------------------------------------
// Searches through the resources for a certain application.
// If only type is given all resources for application are given
// If either company, location or name are given in any combination, these values are searched
// If fulltext is given all attributes are searched at once
//------------------------------------------------------------------------

function searchResources() {
  var input = {
    type: apptype,
    name: document.getElementById("resNameS").value,
    location: document.getElementById("resLocationS").value,
    company: document.getElementById("resCompanyS").value,
    fulltext: document.getElementById("resFulltextS").value,
    id: document.getElementById("resIDS").value,
  };

  fetch("./booking/getresources_XML.php", {
    method: "POST", // or 'PUT'
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
    .then(function (response) {
      // first then()
      if (response.ok) return response.text();
      throw new Error(response.statusText);
    })
    .then(function (text) {
      showResources(new window.DOMParser().parseFromString(text, "text/xml"));
    })
    .catch(function (error) {
      // catch
      alert("Request failed\n" + error);
    });
}

function showResources(returnedData) {
  console.log(returnedData);
  // Fix characters in XML notation to HTML notation
  fixChars(returnedData);

  // An XML DOM document is returned from AJAX
  var resultset = returnedData.childNodes[0];
  var output = "";
  // Iterate over all nodes in root node (i.e. resources)
  for (i = 0; i < resultset.childNodes.length; i++) {
    // Iterate over all child nodes of that node that are resource nodes
    if (resultset.childNodes.item(i).nodeName == "resource") {
      // Retrieve data from resource nodes
      var resource = resultset.childNodes.item(i);
      output += "<h3>Room 1</h3><div class='accordion' >";
      output +=
        "<p><b>Size</b>" + resource.attributes["size"].value + "kvm</p>";
      output +=
        "<p><b>Size</b>" + resource.attributes["company"].value + "kvm</p>";
      output +=
        "<p><b>Size</b>" + resource.attributes["name"].value + "kvm</p>";
      output +=
        "<p><b>Size</b>" + resource.attributes["location"].value + "kvm</p>";
      output +=
        "<p><b>Size</b>" + resource.attributes["category"].value + "kvm</p>";

      output += "</div>";
    }
  }

  var div = document.querySelector(".OutputDivSearchR");
  div.innerHTML = output;
}
