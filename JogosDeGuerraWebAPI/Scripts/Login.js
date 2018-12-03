$("#email").text(sessionStorage.getItem("emailUsuario"));
function showError(jqXHR) {
    $("#interceptor").addClass("hide");
    var response = jqXHR.responseJSON;
    console.log(response);
    if (response) {
        if (response.Message) self.errors.push(response.Message);
        if (response.ModelState) {
            var modelState = response.ModelState;
            for (var prop in modelState) {
                if (modelState.hasOwnProperty(prop)) {
                    var msgArr = modelState[prop]; // expect array here
                    if (msgArr.length) {
                        for (var i = 0; i < msgArr.length; ++i) self.errors.push(msgArr[i]);
                    }
                }
            }
        }
        if (response.error) self.errors.push(response.error);
        if (response.error_description) self.errors.push(response.error_description);
    }
}

function login() {
    var baseUrl =
        window.location.protocol +
        "//" +
        window.location.hostname +
        (window.location.port ? ':' + window.location.port : '');
    var loginData = {
        grant_type: 'password',
        username: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value
    };
    $("#interceptor").removeClass("hide");
    $.ajax({
        type: 'POST',
        url: baseUrl + '/Token',
        data: loginData
    }).done(function (data) {
        // Cache the access token in session storage.
        sessionStorage.setItem('accessToken', data.token_type + " " + data.access_token);
        sessionStorage.setItem('emailUsuario', data.userName);
        $("#email").text(sessionStorage.getItem("emailUsuario"));
        $("#interceptor").addClass("hide");
        window.location.href = baseUrl + "/BatalhasMVC/Index";
    }).fail(showError);
}