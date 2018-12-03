function showError(jqXHR) {
    $("#interceptor").addClass("hide");
    var response = jqXHR.responseJSON;
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


function register() {
    var baseUrl =
        window.location.protocol +
        "//" +
        window.location.hostname +
        (window.location.port ? ':' + window.location.port : '');
    var registerData = {
        Email: document.getElementById("loginEmail").value,
        Password: document.getElementById("loginPassword").value,
        ConfirmPassword: document.getElementById("loginConfirmPassword").value
    };
    var body = {
        type: 'POST',
        url: baseUrl + '/api/Account/Register',
        data: registerData
    };
    $("#interceptor").removeClass("hide");
    $.ajax(body).done(function (data) {
        alert("Registrado com Sucesso!");
        $("#interceptor").addClass("hide");
        window.location.href = baseUrl + "/Home/Login";
    }).fail(showError);
}