function login(){
    var user = document.getElementById('username').value;
    var pass = document.getElementById('password').value;
    var data = {username: user, password: pass};
    console.log(user);
    $.ajax({
        url: "http://localhost:3000/reports", type: "POST", data: data,  success: function (result) {
            console.log(result);
        }
    });
}