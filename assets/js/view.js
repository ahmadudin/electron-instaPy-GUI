const settings = require('electron-settings')
const alpha = document.getElementById('alpha');
const fileExists = require('file-exists');
var remote = require('electron').remote; 

// Listen for checkbox click
alpha.addEventListener('click', function(event) {
    if (event.target.type === 'checkbox') {
        if (event.target.parentElement.classList.contains('beta')) {
            handleSelection(event.target)

        } else if (event.target.parentElement.classList.contains('delta')) {
            handleSettingSelection(event.target)
        }
    }
})

// Titlebar button event handler
document.getElementById("min-btn").addEventListener("click", function (e) {
    console.log('btn clicked!')
    var window = remote.getCurrentWindow();
    window.minimize(); 
});

document.getElementById("exit-btn").addEventListener("click", function (e) {
    console.log('btn clicked!')
    var window = remote.getCurrentWindow();
    window.close();
}); 

// Initial view based on last usage
var state = settings.getAll()
if (state) {
    for (var i in state) {
        document.getElementById(i).click()
    }
} else {
    document.getElementById('byTags_on').click()
}


function handleSettingSelection(delta) {
    var checkbox = document.getElementsByClassName('delta')
    var checked = 0

    for (var i = 0; i < checkbox.length ; i++) {
        if (checkbox[i].firstElementChild.checked) {
            checked++
        }
    }

    // Remove selected class when none checked
    if (checked > 0) {
        delta.closest('.ui.message').classList.add('selected')
    } else {
        delta.closest('.ui.message').classList.remove('selected')
    }

    // Saving checkbox last state
    if (delta.checked) {
        settings.set(delta.id, delta.id)
    } else {
        settings.delete(delta.id)
    }
}

function handleSelection(beta) {
    if (beta.checked) {
        // Change section background when selected
        beta.closest('.ui.message').classList.add('selected')
        // Save cuerrent state
        settings.set(beta.id, beta.id)
    } else {
        // Change background back to default when unselected
        beta.closest('.ui.message').classList.remove('selected')
        // save current state
        settings.delete(beta.id)
    }
    // Hide input field if hideable
    if (beta.parentElement.classList.contains('omega')) {
        $(beta).parent().next().slideToggle("fast")
    }
    // Disable input field
    $(beta).parent().next().toggleClass('disabled')
}

function fileCheck() {
    fileExists('./indexs.html').then(exists => {
        if (exists) {
            $('#driver-missing').hide()
            fileExists('./indexx.html').then(exists => {
                if (exists) {
                    $('#instapy-missing').hide()
                    $('#file-exists').show()
                    $('#file-not-exists').hide()
                    clearInterval(interval);
                } else {
                    $('#instapy-missing').show()
                    $('#file-exists').hide()
                    $('#file-not-exists').show()
                }
            })
        } else {
            $('#driver-missing').show()
            $('#file-exists').hide()
            $('#file-not-exists').show()
            fileExists('./indexx.html').then(exists => {
                if (exists) {
                    $('#instapy-missing').hide()
                    console.log('file b is ', exists)
                } else {
                    $('#instapy-missing').show()
                }
            })
        }
    })
}

// Bind sticky header to form
$('.ui.sticky')
    .sticky({
        context: 'form'
    })

// Hide error message on click
$('.error.message')
.on('click', function() {
    $('#myform').find('.ui.error.message ul').remove();
    $('#myform').find('.prompt').remove();
})

$("#myform").submit(function(e) {
    e.preventDefault();
})
