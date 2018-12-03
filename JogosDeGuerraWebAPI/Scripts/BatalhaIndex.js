$("#email").text(sessionStorage.getItem("emailUsuario"));
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


function criarBatalha() {
    var baseUrl =
        window.location.protocol +
        "//" +
        window.location.hostname +
        (window.location.port ? ':' + window.location.port : '');
    var token = sessionStorage.getItem("accessToken");
    var headers = {};
    if (token) {
        headers.Authorization = token;
    }
    var urlIniciarBatalha = baseUrl + "/api/Batalhas/Iniciar?Id=1";
    var nacao = document.querySelector('input[name="Nacao"]:checked').value;
    if (nacao) {
        var urlNovaBatalha = baseUrl + '/api/Batalhas/CriarNovaBatalha?Nacao=' + nacao;
        $("#interceptor").removeClass("hide");
        $.ajax({
            type: 'GET',
            url: urlNovaBatalha,
            headers: headers
        }).done(function (data) {
            $("#interceptor").addClass("hide");
            location.reload();
        }).fail(showError);
    } else {
        alert("Selecione uma Nação!");
    }

}