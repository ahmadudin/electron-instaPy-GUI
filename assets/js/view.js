const settings = require("electron-settings");
const fileExists = require("file-exists");
const remote = require("electron").remote;

const alpha = document.getElementById("alpha");
var elementState = "elementState.";
var exist = false;

// Listen for checkbox click
alpha.addEventListener("click", function(event) {
  if (event.target.type === "checkbox") {
    if (event.target.parentElement.classList.contains("beta")) {
      handleSelection(event.target);
    }
  }
});

// Titlebar button event handler
document.getElementById("min-btn").addEventListener("click", function(e) {
  var window = remote.getCurrentWindow();
  window.minimize();
});

document.getElementById("exit-btn").addEventListener("click", function(e) {
  var window = remote.getCurrentWindow();
  window.close();
});

function lastSelectionState(state) {
  if (state) {
    for (var i in state) {
      document.getElementById(i).click();
    }
  } else {
    document.getElementById("byTags_on").click();
  }
}

function lastDataState(data) {
  if (data) {
    for (var i in data) {
      if (!data[i]) continue;
      $("#myform")
        // set several values
        .form("set values", {
          [i]: data[i]
        });
    }
  }
}

function handleSelection(beta) {
  if (beta.checked) {
    // Change section background when selected
    var segment = beta.closest(".ui.segment").classList;
    segment.remove("secondary");
    segment.add("blue", "inverted");
    // Save cuerrent state
    settings.set(elementState.concat(beta.id), beta.id);
  } else {
    // Change background back to default when unselected
    var segment = beta.closest(".ui.segment").classList;
    segment.add("secondary");
    segment.remove("blue", "inverted");
    // save current state
    settings.delete(elementState.concat(beta.id));
  }
  // Hide input field if hideable
  if (beta.parentElement.classList.contains("omega")) {
    $(beta)
      .parent()
      .next()
      .slideToggle("fast");
  }
  // Disable input field
  $(beta)
    .parent()
    .next()
    .toggleClass("disabled");
}

function displayPath(path) {
  $("#displayPath").val(path);
}

// on input changepython path
$('#pythonPath').on("change", function(event) {
  settings.set("pythonPath", event.target.value); 
});
function displayPythonPath(path) {
  $("#pythonPath").val(path);
}

function fileCheck() {
  fileExists(instapyPath.concat("/assets/chromedriver")).then(exists => {
    if (exists) {
      $("#driver-missing").hide();
      fileExists(instapyPath.concat("/instapy/instapy.py")).then(exists => {
        if (exists) {
          $("#instapy-missing").hide();
          $("#file-not-exists").hide();
          if (!exist) {
            $("#file-exists").show();
            exist = true;
          }
        } else {
          $("#instapy-missing").show();
          $("#file-exists").hide();
          $("#file-not-exists").show();
          exist = false;
        }
      });
    } else {
      $("#driver-missing").show();
      $("#file-exists").hide();
      $("#file-not-exists").show();
      exist = false;
      fileExists(instapyPath.concat("/instapy/instapy.py")).then(exists => {
        if (exists) {
          $("#instapy-missing").hide();
        } else {
          $("#instapy-missing").show();
        }
      });
    }
  });
}

// Bind sticky header to form
$(".ui.sticky").sticky({
  context: "form"
});

// Hide error message on click
$(".error.message").on("click", function() {
  $("#myform")
    .find(".ui.error.message ul")
    .remove();
  $("#myform")
    .find(".prompt")
    .remove();
});

$("#myform").submit(function(e) {
  e.preventDefault();
});
