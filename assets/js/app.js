const fs = require("fs");
const dedent = require("dedent-js");
const PythonShell = require("python-shell");
const terminate = require("terminate");
const dialog = require("electron").remote.require("electron").dialog;
const ipcRenderer = require("electron").ipcRenderer;
const jsesc = require('jsesc');

var instapyPath = "";
var pythonPath = "";
var pyshell;
var running = false;
var data;
var option;
var check;
var media;

// Initial path based on last usage
var checkPath = settings.get("instapyPath");
if (checkPath) {
  instapyPath = checkPath;
  displayPath(checkPath);
}
var checkPythonPath = settings.get("pythonPath");
if (checkPythonPath) {
  pythonPath = checkPythonPath;
  displayPythonPath(checkPythonPath)
}

var params = {
  selection: {
    restrictTags_on: "",
    restrictUsers_on: "",
    excludeFriends_on: "",
    ignoreRestrict_on: "",
    interact_on: "",
    fLiked_on: "",
    comments_on: "",
    followCount_on: "",
    byTags_on: "",
    byImg_on: "",
    byLoc_on: "",
    fUsers_on: "",
    fFollowers_on: "",
    fFollowing_on: "",
    unfollowUsers_on: ""
  },
  data: {
    username: "",
    password: "",
    restrictTags: "",
    restrictUsers: "",
    excludeFriends: "",
    ignoreRestrict: "",
    fLikedPercent: "",
    fLikedTimes: "",
    commentsPercent: "",
    comments: "",
    upperCount: "",
    lowerCount: "",
    byTagsTags: "",
    byTagsAmount: "",
    byImgUrl: "",
    byImgAmount: "",
    byLocUrl: "",
    byLocAmount: "",
    fUsersLists: "",
    fFollowersUsers: "",
    fFollowersAmount: "",
    fFollowersDelay: "",
    fFollowingUsers: "",
    fFollowingAmount: "",
    fFollowingDelay: "",
    unfollowAmount: "",
    unfollowMethod: "",
    unfollowOrder: "",
    unfollowDelay: "",
    interactAmount: "",
    interactPercent: ""
  },
  media: {
    byLocMedia: "",
    byTagsMedia: "",
    byImgMedia: "",
    commentsMedia: ""
  },
  option: {
    commentsEmoji: "",
    fFollowingRandom: "",
    fFollowersRandom: "",
    interactRandom: ""
  }
};

// var lastParam = settings.get('params')
// if (lastParam) {
//   params = lastParam
// }

var app = {
  /* -------- APP METHOD -------- */
  // Compiling python script
  compileScript: function() {
    data = settings.get("data");
    option = settings.get("option");
    check = settings.get("elementState");
    media = settings.get("media");
    var identity = app.identity();
    var restrictTag = app.restrictTags(check.restrictTags_on);
    var restrictUser = app.restrictUsers(check.restrictUsers_on);
    var excludeFriends = app.excludeFriends(check.excludeFriends_on);
    var ignoreRestrict = app.ignoreRestrict(check.ignoreRestrict_on);
    var interact = app.interact(check.interact_on);
    var fLiked = app.fLiked(check.fLiked_on);
    var comments = app.comments(check.comments_on);
    var followCount = app.followCount(check.followCount_on);
    var fFollowers = app.fFollowers(check.fFollowers_on);
    var fFollowing = app.fFollowing(check.fFollowing_on);
    var fUsers = app.fUsers(check.fUsers_on);
    var unfollowUsers = app.unfollowUsers(check.unfollowUsers_on);
    var byTags = app.byTags(check.byTags_on);
    var byImages = app.byImages(check.byImg_on);
    var byLocations = app.byLocations(check.byLoc_on);

    // Python script template
    var content = dedent(`
            from instapy import InstaPy
            ${identity}
            \nsession.login()
            ${restrictTag}${restrictUser}${excludeFriends}${ignoreRestrict}${fLiked}${comments}${followCount}${interact}${byTags}${byImages}${byLocations}${fFollowers}${fFollowing}${fUsers}${unfollowUsers}
            \nsession.end()
        `);
    return content;
  },
  // Write and save Script to local storage
  createScript: function(content) {
    fs.writeFileSync(instapyPath.concat("/quickstart.py"), content, err => {
      if (err) throw err;
    });
  },
  // format input string to match python script syntax
  parser: function(input) {
    var parsed =
      "'" +
      input
        .replace(/\s+/g, "")
        .split(",")
        .join("', '") +
      "'";

    return parsed;
  },
  updateData: function() {
    for (var i in params.data) {
      params.data[i] = $("#" + i).val();
    }
    settings.set("data", params.data);

    for (var i in params.option) {
      params.option[i] = $("#" + i).is(":checked");
    }
    settings.set("option", params.option);

    for (var i in params.media) {
      params.media[i] = $(`input[name=${i}]:checked`).val();
    }
    settings.set("media", params.media);
  },
  updatePath: function() {
    path = dialog.showOpenDialog({
      properties: ["openDirectory"]
    });
    displayPath(path);
    settings.set("instapyPath", path[0]);
    instapyPath = path[0];
  },
  /* --------- INPUT PROCESSING --------- */
  identity: function() {
    var content = `\nsession = InstaPy(username='${data.username}', password='${data.password}')`;
    return content;
  },
  restrictTags: function(on) {
    var content = ``;

    if (on) {
      content = `\nsession.set_dont_like([${this.parser(data.restrictTags)}])`;
    }

    return content;
  },
  restrictUsers: function(on) {
    var content = ``;

    if (on) {
      content = `\nsession.set_ignore_users([${this.parser(
        data.restrictUsers
      )}])`;
    }

    return content;
  },
  excludeFriends: function(on) {
    var content = ``;

    if (on) {
      content = `\nsession.set_dont_include([${this.parser(
        data.excludeFriends
      )}])`;
    }

    return content;
  },
  ignoreRestrict: function(on) {
    var content = ``;

    if (on) {
      content = `\nsession.set_ignore_if_contains([${this.parser(
        data.ignoreRestrict
      )}])\n`;
    }

    return content;
  },
  interact: function(on) {
    var content = ``;
    var random = "False";

    if (on) {
      if (option.interactRandom) {
        random = "True";
      }
      content = `\nsession.set_user_interact(amount=${data.interactAmount}, randomize=${random}, percentage=${data.interactPercent})\n`;
    }

    return content;
  },
  fLiked: function(on) {
    var content = ``;

    if (on) {
      content = `\nsession.set_do_follow(enabled=True, percentage=${data.fLikedPercent}, times=${data.fLikedTimes})`;
    }

    return content;
  },
  comments: function(on) {
    var content = ``;
    var value = "None";

    if (on) {
      if (media.commentsMedia != value) {
        value = `'${media.commentsMedia}'`;
      }

      // Escape to handle non-ascii input.
      var escapedComments = jsesc(data.comments, {
        'quotes': 'double'
      })

      // Add `u`(Python unicode indentifier) beginning of each comment.
      escapedComments = 
        'u' + 
        escapedComments
          .replace(/\s+/g, "")
          .split("',")
          .join("', u");

      content = `\nsession.set_do_comment(enabled=True, percentage=${data.commentsPercent})\nsession.set_comments([${escapedComments}], media=${value})`;
    }

    return content;
  },
  followCount: function(on) {
    var content = ``;

    if (on) {
      content = `\nsession.set_upper_follower_count(limit = ${data.upperCount})\nsession.set_lower_follower_count(limit = ${data.lowerCount})`;
    }

    return content;
  },
  fFollowers: function(on) {
    var content = ``;
    var interact = "False";
    var random = "False";

    if (on) {
      if (check.interact_on) {
        interact = "True";
      }
      if (option.fFollowersRandom) {
        random = "True";
      }
      content = `\nsession.follow_user_followers([${this.parser(
        data.fFollowersUsers
      )}], amount=${data.fFollowersAmount}, sleep_delay=${data.fFollowersDelay}, randomize=${random}, interact=${interact})`;
    }

    return content;
  },
  fFollowing: function(on) {
    var content = ``;
    var interact = "False";
    var random = "False";

    if (on) {
      if (check.interact_on) {
        interact = "True";
      }
      if (option.fFollowingRandom) {
        random = "True";
      }
      content = `\nsession.follow_user_following([${this.parser(
        data.fFollowingUsers
      )}], amount=${data.fFollowingAmount}, sleep_delay=${data.fFollowingDelay}, randomize=${random}, interact=${interact})`;
    }

    return content;
  },
  fUsers: function(on) {
    var content = ``;

    if (on) {
      content = `\nsession.follow_by_list([${this.parser(
        data.fUsersLists
      )}], times=1)`;
    }

    return content;
  },
  unfollowUsers: function(on) {
    var content = ``;
    if (on) { if (data.unfollowMethod == "InstaPy") {
			var instaPyMode = `'${data.unfollowMethod}'`;
			var onlyInstaPyMode = "True";
    		content = `\nsession.unfollow_users(amount=${data.unfollowAmount}, onlyInstapyFollowed=${onlyInstaPyMode}, onlyInstapyMethod:${instaPyMode}, sleep_delay=${data.unfollowDelay})`;
		}
		else if (data.unfollowMethod == "NotFollowing") {
			var onlyNotMode = "True";
    		content = `\nsession.unfollow_users(amount=${data.unfollowAmount}, onlyNotFollowMe=${onlyNotMode}, sleep_delay=${data.unfollowDelay})`;
		}
		else {
    		content = `\nsession.unfollow_users(amount=${data.unfollowAmount}, sleep_delay=${data.unfollowDelay})`;
		}
    }

    return content;
  },
  byTags: function(on) {
    var content = ``;
    var value = "None";

    if (on) {
      if (media.byTagsMedia != value) {
        value = `'${media.byTagsMedia}'`;
      }
      content = `\nsession.like_by_tags([${this.parser(
        data.byTagsTags
      )}], amount=${data.byTagsAmount}, media=${value})`;
    }

    return content;
  },
  byImages: function(on) {
    var content = ``;
    var value = "None";

    if (on) {
      if (media.byImgMedia != value) {
        value = `'${media.byImgMedia}'`;
      }
      content = `\nsession.like_from_image([${this.parser(
        data.byImgUrl
      )}], amount=${data.byImgAmount}, media=${value})`;
    }

    return content;
  },
  byLocations: function(on) {
    var content = ``;
    var value = "None";

    if (on) {
      if (media.byLocMedia != value) {
        value = `'${media.byLocMedia}'`;
      }
      content = `\nsession.like_by_locations([${this.parser(
        data.byLocUrl
      )}], amount=${data.byLocAmount}, media=${value})\n`;
    }

    return content;
  }
};

var shell = {
  initProcess: function() {
    pyshell = new PythonShell("quickstart.py", {
      pythonPath: (pythonPath.length > 2) ? pythonPath : undefined,
      pythonOptions: ["-u"],
      scriptPath: instapyPath + '/'
    });
    running = !pyshell.terminated;

    // Listen to message event and display it to  modal
    pyshell.on("message", function(message) {
      if (message) {
        shell.writeLog(message);
      }
    });

    // Listen to process close event, then change modal action content
    pyshell.on("close", function() {
      $("#terminate").addClass("disabled");
      $("#logButton").removeClass("disabled");
      $("#finish")
        .removeClass("disabled")
        .on("click", function() {
          running = !pyshell.terminated;
          $("#fireButton").removeClass("loading");
        });
      $(".actions > .loader").hide();
      $(".actions > label")[0].innerText = "InstaPy ended";
    });

    // Listen to process exit event and terminate the process (since it won't terminate itself)
    pyshell.childProcess.on("exit", err => {
      pyshell.stdout.end();
      pyshell.stderr.end();
    });

    // end the input stream and allow the process to exit
    pyshell.end(function(err) {
      if (err) {
        shell.writeLog(err, "red");
      }
    });
  },
  killProcess: function(pid) {
    terminate(pid, "SIGINT", function(err) {
      if (err) throw err;
    });
  },
  writeLog: function(content, color = false) {
    var text = document.createTextNode(content);
    var p = document.createElement("p");
    if (color) {
      p.style.color = color;
    }

    p.appendChild(text);
    document.getElementById("exec-log").appendChild(p);
    $("#modal-content")
      .stop()
      .animate(
        {
          scrollTop: $("#modal-content")[0].scrollHeight
        },
        800
      );
  },
  clearLog: function() {
    var log = document.getElementById("exec-log");
    while (log.firstChild) {
      log.removeChild(log.firstChild);
    }
  },
  openLog: function() {
    var array = fs
      .readFileSync(instapyPath.concat("/logs/logFile.txt"))
      .toString()
      .split("\n");

    array.forEach(function(e) {
      shell.writeLog(e);
    });
  }
};

// Interface interaction handler
var handler = {
  submit: function() {
    app.updateData();
    app.createScript(app.compileScript());
  }
};

$(document).ready(function() {
  // Check app last settings and apply settings
  lastSelectionState(settings.get("elementState")[0]);
  lastDataState(settings.get("data"));
  lastDataState(settings.get("media"));
  lastDataState(settings.get("option"));

  // Updating InstaPy path
  $("#getPath").on("click", function() {
    app.updatePath();
  });

  // RUN button delegation
  $("#myform").submit(function(e) {
    e.preventDefault();
    if ($("#myform").form("is valid") && selectionCheck()) {
      $(".test").modal("show");
      $(".actions > .button").show();

      // Will not start new session before the last session ended
      if (!running) {
        handler.submit();
        $("#fireButton").addClass("loading");
        $(".actions > .loader").show();
        $("#terminate");
        $("#finish").addClass("disabled");
        $("#logButton").addClass("disabled");
        $(".actions > label")[0].innerText = "InstaPy running...";
        $("#terminate")
          .removeClass("disabled")
          .off("click")
          .on("click", function(e) {
            shell.killProcess(pyshell.childProcess.pid);
          });

        // Clear modal content
        shell.clearLog();

        // Initiate new script executing process
        shell.initProcess();
      }
    }
  });

  // Open instaPy logFile.txt
  $("#logButton").click(function() {
    $(".test").modal("show");
    $(".actions > .button").hide();
    $("#logButton").addClass("loading");
    $("#logButton").removeClass("loading");
    shell.clearLog();
    shell.openLog();
  });

  // Checking if dependecy is exist
  setInterval(function() {
    fileCheck();
  }, 2000);

  // Listen signal from main process to save settings before app closed
  ipcRenderer.on("save", function(event) {
    handler.submit();
    app.updateData();
    ipcRenderer.sendSync("exit");
  });
});
