function login(){
    var user = document.getElementById('username').value;
    var pass = document.getElementById('password').value;
    var data = {username: user, password: pass};
    console.log(user);
    $.ajax({
        url: "http://afternoon-garden-45550.herokuapp.com/reports", type: "POST", data: data,  success: function (result) {
            console.log(result);
        }
    });
}

$(function() {
    $("#buttonOkay").on('click', function() {
        errorBox.style.display = "none";
    });

})