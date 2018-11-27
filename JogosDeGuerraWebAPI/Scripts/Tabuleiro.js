/***
 * Baseado no código 
 * https://www.devmedia.com.br/desenhando-um-tabuleiro-de-damas-em-html-css-js/24591
 * 
 * **/

$(function () {
    $("#email").text(sessionStorage.getItem("emailUsuario"));
    var baseUrl = window.location.protocol + "//" +
        window.location.hostname +
        (window.location.port ? ':' + window.location.port : '');
    var casa_selecionada = null;
    var batalha = null;
    var peca_selecionadaId = null;
    var pecasNoTabuleiro = null;
    var pecaSelecionadaObj = null;
    var pecaElem = null;
    var elementos = null;
    var token = sessionStorage.getItem("accessToken");
    var headers = {};
    if (token) {
        headers.Authorization = token;
    }
    var idBatalha = window.location.href.split('/')[window.location.href.split('/').length - 1];
    var urlIniciarBatalha = baseUrl + "/api/Batalhas/Iniciar?Id=" + idBatalha;
    var batalha = ObterbatalhaId(idBatalha);
    //1 CriarNovaBatalha, 2 RetomarBatalha
    $.ajax({
        type: 'GET',
        url: urlIniciarBatalha,
        headers: headers
    }
    ).done(function (data) {
        MontarTabuleiro(data);
        $("#turno_jogador").text(data.Turno.Usuario.Email);
    }).fail(
        function (jqXHR, textStatus) {
            alert("Código de Erro: " + jqXHR.status + "\n\n" + jqXHR.responseText);
     });

    function verificarSejogadorEstaNaBatalha(batalha) {
        if (batalha) {
            if (batalha.ExercitoBranco) {
                if (batalha.ExercitoBranco.Usuario.Email == sessionStorage.getItem("EmailUsuario")) {
                    return true;
                }
            }
            if (batalha.ExercitoPreto) {
                if (batalha.ExercitoPreto.Usuario.Email == sessionStorage.getItem("EmailUsuario")) {
                    return true;
                }
            }
        }
        return false;
    }

    function ObterbatalhaId(idBatalha) {
        $.ajax({
            type: 'GET',
            url: urlIniciarBatalha,
            headers: headers
        }
        ).done(function (data) {
            if (!verificarSejogadorEstaNaBatalha(data)) {
                if (BatalhaTemDoisJogadores(data)) {
                    VisualizarBatalha(data);
                } else {
                    PerguntarUsuario(data);
                }
            } else {
                if (BatalhaTemDoisJogadores(data)) {
                    Jogar(data);
                } else {
                    AvisarJogador();
                }
            }
        }
        ).fail(
            function (jqXHR, textStatus) {
                alert("Código de Erro: " + jqXHR.status + "\n\n" + jqXHR.responseText);
            });   
    }

    function BatalhaTemDoisJogadores(batalha) {
        return batalha.ExercitoBranco != null && batalha.ExercitoPreto != null;
    }
    function VisualizarBatalha(batalha) {
        //TODO: vizualizar batalha
    }

    function inicializaDialog() {
        
        
    }

    function AvisarJogador() {
        $(function () {
            $("#dialogAguardaJogador").dialog({
                bgiframe: true,
                autoOpen: false,
                modal: true,
                show: "blind",
                hide: "blind",
                title: "Aguarde...",
                buttons: [{
                    text: "Voltar",
                    icon: "ui-icon-arrowreturnthick-1-w",
                    click: function () {
                        $(this).dialog("close");
                    }
                }]
            });
        });
        $("#dialogAguardaJogador").dialog("open");
    }
    
    //icones jQuery
    //https://api.jqueryui.com/theming/icons/
    function PerguntarUsuario(batalha) {
        $(function () {
            $("#dialogDesejaEntrar").dialog({
                bgiframe: true,
                autoOpen: false,
                modal: true,
                show: "blind",
                hide: "blind",
                title: "Aguarde...",
                buttons: [{
                    text: "Cancelar",
                    icon: "ui-icon-closethick",
                    click: function () {
                        $(this).dialog("close");
                    }
                },
                {
                    text: "Entrar",
                    icon: "ui-icon-check",
                    click: function () {
                        //TODO: entrar na batalha
                        $(this).dialog("close");
                    }
                }]
            });
        });
        $("#dialogDesejaEntrar").dialog("open");
    }
    
    function MontarTabuleiro(batalhaParam) {

        //inicializaDialog();
        //AvisarJogador();
        //PerguntarUsuario();

        pecasNoTabuleiro = [];
        batalha = batalhaParam;
        var pecas = batalha.Tabuleiro.ElementosDoExercito
        var ExercitoBrancoId = batalha.ExercitoBrancoId;
        var ExercitoPretoId = batalha.ExercitoPretoId;
        
        var i;
        for (i = 0; i < batalha.Tabuleiro.Altura; i++) {
            $("#tabuleiro").append("<div id='linha_" + i.toString() + "' class='linha' >");
            pecasNoTabuleiro[i] = [];
            for (j = 0; j < batalha.Tabuleiro.Largura; j++) {
                var nome_casa = "casa_" + i.toString() + "_" + j.toString();
                var classe = (i % 2 == 0 ? (j % 2 == 0 ? "casa_branca" : "casa_preta") : (j % 2 != 0 ? "casa_branca" : "casa_preta"));
                $("#linha_" + i.toString()).append("<div id='" + nome_casa + "' class='casa " + classe + "' />");
   
                for (x = 0; x < pecas.length; x++) {
                    if (pecas[x].posicao.Altura == i && pecas[x].posicao.Largura == j){
                        pecasNoTabuleiro[i][j] = pecas[x];
                        if (pecas[x].ExercitoId == ExercitoBrancoId) {
                            var img;
                            if (pecas[x].Ataque == 45 && pecas[x].AlcanceMovimento == 1 && pecas[x].AlcanceAtaque == 1 && pecas[x].Saude == 150) {
                                //Guerreiro
                                //img = "https://images.vexels.com/media/users/3/127091/isolated/preview/30741a210f3e6e7f67002ccdcd3e920b-axes-camping-kit-icon-by-vexels.png";
                                img = "/Images/axes-black.png";
                            } else if (pecas[x].Ataque == 25 && pecas[x].AlcanceMovimento == 3 && pecas[x].AlcanceAtaque == 1 && pecas[x].Saude == 100) {
                                //Cavalaria
                                //img = "http://www.clker.com/cliparts/S/t/h/N/9/9/mustang-maroongold4print-md.png";
                                img = "/Images/horse-black.png";
                            } else if (pecas[x].Ataque == 10 && pecas[x].AlcanceMovimento == 1 && pecas[x].AlcanceAtaque == 3 && pecas[x].Saude == 75) {
                                //Aruqueiro
                                //img = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/H%C3%A9raldique_meuble_Arc_et_fl%C3%A8che.svg/1172px-H%C3%A9raldique_meuble_Arc_et_fl%C3%A8che.svg.png";
                                img = "/Images/bow-black.png";
                            } else {
                                //Padrão
                                img = "https://www.w3schools.com/images/compatible_firefox.gif";
                            }
                            $("#" + nome_casa).append("<img src=" + img +" class='peca' id='" + nome_casa.replace("casa", "peca_preta") + "'/>");
                        }
                        else if (pecas[x].ExercitoId == ExercitoPretoId) {
                            var img;
                            if (pecas[x].Ataque == 45 && pecas[x].AlcanceMovimento == 1 && pecas[x].AlcanceAtaque == 1 && pecas[x].Saude == 150) {
                                //Guerreiro
                                //img = "https://images.vexels.com/media/users/3/127091/isolated/preview/30741a210f3e6e7f67002ccdcd3e920b-axes-camping-kit-icon-by-vexels.png";
                                img = "/Images/axes-white.png";
                            } else if (pecas[x].Ataque == 25 && pecas[x].AlcanceMovimento == 3 && pecas[x].AlcanceAtaque == 1 && pecas[x].Saude == 100) {
                                //Cavalaria
                                //img = "http://www.clker.com/cliparts/S/t/h/N/9/9/mustang-maroongold4print-md.png";
                                img = "/Images/horse-white.png";
                            } else if (pecas[x].Ataque == 10 && pecas[x].AlcanceMovimento == 1 && pecas[x].AlcanceAtaque == 3 && pecas[x].Saude == 75) {
                                //Aruqueiro
                                //img = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/H%C3%A9raldique_meuble_Arc_et_fl%C3%A8che.svg/1172px-H%C3%A9raldique_meuble_Arc_et_fl%C3%A8che.svg.png";
                                img = "/Images/bow-white.png";
                            } else {
                                //Padrão
                                img = "https://www.w3schools.com/images/compatible_firefox.gif";
                            }
                            $("#" + nome_casa).append("<img src='" + img + "' class='peca' id='" + nome_casa.replace("casa", "peca_branca") + "'/>");
                        }

                    }                    
                }

            }
        }
        $(".casa").click(function () {
            //Retirando a seleção da casa antiga.
            $("#" + casa_selecionada).removeClass("casa_selecionada");
            //Obtendo o Id.
            casa_selecionada = $(this).attr("id");
            //Adicionando Vermelho na Casa nova.
            $("#" + casa_selecionada).addClass("casa_selecionada");
            //Legenda que mostra informações da casa selecionada.
            $("#info_casa_selecionada").text(casa_selecionada);
            var altura = casa_selecionada.split("_")[1]
            var largura = casa_selecionada.split("_")[2]
            if (pecaElem == null) {
                //Obter o id da imagem selecionada.
                peca_selecionadaId = $("#" + casa_selecionada).children("img:first").attr("id");
                //Se for nulo
                if (peca_selecionadaId == null) {
                    pecaElem = null;
                    peca_selecionadaId = "NENHUMA PECA SELECIONADA";
                } else {
                    //Guardar a peça selecionada.
                    pecaElem = document.getElementById(peca_selecionadaId);
                    pecaSelecionadaObj = pecasNoTabuleiro[altura][largura];
                }
                //Legenda que mostra informações da peça selecionada.
                $("#info_peca_selecionada").text(peca_selecionadaId.toString());
            } else {
                var posicaopeca = {
                    Altura: altura,
                    Largura: largura
                };
                var movimento = {
                    Posicao: posicaopeca,
                    AutorId: batalha.Turno.UsuarioId,
                    BatalhaId: batalha.Id,
                    ElementoId: pecaSelecionadaObj.Id
                };
                var EmailUsuario = sessionStorage.getItem("emailUsuario");


                if( batalha.Turno.Usuario.Email == EmailUsuario &&
                    batalha.Turno.Id == pecaSelecionadaObj.ExercitoId
                    ){
                    Mover(movimento, pecaElem.parentNode, document.getElementById(casa_selecionada), pecaElem);
                }else if(batalha.Turno.Usuario.Email != EmailUsuario){
                    alert("Não é a sua vez!");
                }else if(batalha.Turno.Id != pecaSelecionadaObj.ExercitoId){
                    alert("Não é o seu exercito!");
                }
            

                pecaElem = null;
            }
        });


        function Mover(movimento, posAntiga, posNova, peca) {
            var token = sessionStorage.getItem("accessToken");
            var headers = {};
            if (token) {
                headers.Authorization = token;
            }
            alert("Movimento");
            $.ajax({
                type: 'POST',
                url: baseUrl + "/api/Batalhas/Jogar",
                headers: headers,
                data: movimento
            })
                .done(function(batalha){
                    console.log("done")
                    console.log(data)
                    //MoverPeca(posAntiga, posNova, peca)
                })
                .fail(
                function (jqXHR, textStatus) {
                    alert("Código de Erro: " + jqXHR.status + "\n\n" + jqXHR.responseText);
                });
        }

        function MoverPeca(posAntiga, posNova, peca) {
//            var casaElem = document.getElementById(casa_selecionada);
            //Remover a peça da casa antiga.
            posAntiga.removeChild(pecaElem);
            //Colocar a peça na nova casa.
            posNova.appendChild(pecaElem);
            //pecaElem = null para não mover a peça no novo clique.
            posNova.classList.remove("casa_selecionada")
        }
    }   

    
});
