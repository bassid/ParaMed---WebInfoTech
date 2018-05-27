// Send a POST request with login credentials to the web server's API endpoint for authentication.
function login(){
    var user = document.getElementById('username').value;
    var pass = document.getElementById('password').value;
    var data = {username: user, password: pass};
    console.log(user);
    $.ajax({
        url: "/reports", type: "POST", data: data,  success: function (result) {
            console.log(result);
        }
    });
}

// Display an error box if login credentials are invalid.
$(function() {
    $("#buttonOkay").on('click', function() {
        errorBox.style.display = "none";
    });
})