/***
 * Baseado no código 
 * https://www.devmedia.com.br/desenhando-um-tabuleiro-de-damas-em-html-css-js/24591
 * 
 * **/

var ObterBatalha;
var IniciarBatalha;
var CriarNovaBatalha;
var MontarTabuleiro;
var Interval;
var UltimaBatalha;
$(function () {
    $("#email").text(sessionStorage.getItem("emailUsuario"));
    var baseUrl = window.location.protocol + "//" +
        window.location.hostname +
        (window.location.port ? ':' + window.location.port : '');
    var casa_selecionada = null;
    var alcanceAtaque = [];
    var alcanceMovimento = [];
    var batalha = null;
    var peca_selecionadaId = null;
    var pecasNoTabuleiro = null;
    var pecaSelecionadaObj = null;
    var pecaElem = null;
    var elementos = null;
    var token = sessionStorage.getItem("accessToken");

    function buscaAlteracao() {
        if (UltimaBatalha && UltimaBatalha.UltimoMovimento) {
            var date = new Date();
            var urlVerificaBatalha = baseUrl + "/api/Batalhas/VerificaAtualizacao?idBatalha=" + UltimaBatalha.Id + "&data=" + UltimaBatalha.UltimoMovimento + "&noCache=" + date.getTime();
            var headers = {};
            if (token) {
                headers.Authorization = token;
            }
            $.ajax({
                type: 'GET',
                url: urlVerificaBatalha,
                headers: headers
            })
            .done(function (data) {
                if (data == true) {
                    ObterBatalha(UltimaBatalha.Id);
                }
            });
        }
    }
    setInterval(buscaAlteracao, 5 * 1000);
    function VerificarBatalha(Batalha) {
        if (Batalha.Estado == 0) {
            if (Batalha.ExercitoPretoId == null || Batalha.ExercitoBrancoId == null) {
                if ((Batalha.ExercitoPreto != null &&
                    Batalha.ExercitoPreto.Usuario.Email ==
                    sessionStorage.getItem("EmailUsuario")) ||
                    (Batalha.ExercitoBranco != null &&
                        Batalha.ExercitoBranco.Usuario.Email ==
                        sessionStorage.getItem("EmailUsuario"))
                ) {
                    alert("Espere. Ainda não existe jogador disponível");
                } else {
                    IniciarBatalha(Batalha.Id);
                }
            } else {
                IniciarBatalha(Batalha.Id);
            }
        } else {
            UltimaBatalha = Batalha;
            MontarTabuleiro(Batalha);
            if (Batalha.Estado == 10 || Batalha.Estado == 99) {
            }
        }
    }

    ObterBatalha = function (BatalhaId) {
        var urlObterBatalha = baseUrl + "/api/Batalhas/" + BatalhaId;
        var headers = {};
        if (token) {
            headers.Authorization = token;
        }
        $("#interceptor").removeClass("hide");
        $.ajax({
            type: 'GET',
            url: urlObterBatalha,
            headers: headers
        })
            .done(function (data) {
                VerificarBatalha(data);
                $("#interceptor").addClass("hide");
            })
            .fail(
            function (jqXHR, textStatus) {
                $("#interceptor").addClass("hide");
                alert("Código de Erro: " + jqXHR.status + "\n\n" + jqXHR.responseText);
            });
    }

    CriarNovaBatalha = function (NacaoID) {
        var urlCriarNovaBatalha = baseUrl + "/api/Batalhas/CriarNovaBatalha?Nacao=" + NacaoID;
        var headers = {};
        if (token) {
            headers.Authorization = token;
        }
        $("#interceptor").removeClass("hide");
        $.ajax({
            type: 'GET',
            url: urlCriarNovaBatalha,
            headers: headers
        }).done(function (data) {
            $("#interceptor").addClass("hide");
            window.location.reload();
        }
        ).fail(
        function (jqXHR, textStatus) {
            $("#interceptor").addClass("hide");
            alert("Código de Erro: " + jqXHR.status + "\n\n" + jqXHR.responseText);
        });
    }

    IniciarBatalha = function (BatalhaID) {
        var urlIniciarBatalha = baseUrl + "/api/Batalhas/Iniciar?Id=" + BatalhaID;
        var headers = {};
        if (token) {
            headers.Authorization = token;
        }
        $("#interceptor").removeClass("hide");
        $.ajax({
            type: 'GET',
            url: urlIniciarBatalha,
            headers: headers
        }
        ).done(function (data) {
            VerificarBatalha(data);
            $("#interceptor").addClass("hide");
        }
            ).fail(
            function (jqXHR, textStatus) {
                $("#interceptor").addClass("hide");
                alert("Código de Erro: " + jqXHR.status + "\n\n" + jqXHR.responseText);
            });
    }
    ////icones jQuery
    ////https://api.jqueryui.com/theming/icons/

    function retornaAlcanceMovimento(tabuleiro, alturaPeca, larguraPeca, peca) {
        var listMov = [];
        var listAtak = [];
        alturaPeca = parseInt(alturaPeca);
        larguraPeca = parseInt(larguraPeca);
        for (var j = 1; j <= peca.AlcanceMovimento; j++) {
            var altura1 = alturaPeca;
            var largura1 = larguraPeca + j;
            var posicao1 = {
                altura: altura1,
                largura: largura1
            };

            var altura2 = alturaPeca + j;
            var largura2 = larguraPeca;
            var posicao2 = {
                altura: altura2,
                largura: largura2
            };

            var altura3 = alturaPeca - j;
            var largura3 = larguraPeca;
            var posicao3 = {
                altura: altura3,
                largura: largura3
            };

            var altura4 = alturaPeca;
            var largura4 = larguraPeca - j;
            var posicao4 = {
                altura: altura4,
                largura: largura4
            };

            if (posicao1.altura >= 0 && posicao1.largura >= 0) {
                if (!tabuleiro[altura1] || !tabuleiro[altura1][largura1]) {
                    listMov.push(posicao1);
                }
            }

            if (posicao2.altura >= 0 && posicao2.largura >= 0) {
                if (!tabuleiro[altura2] || !tabuleiro[altura2][largura2]) {
                    listMov.push(posicao2);
                }
            }
            
            if (posicao3.altura >= 0 && posicao3.largura >= 0) {
                if (!tabuleiro[altura3] || !tabuleiro[altura3][largura3]) {
                    listMov.push(posicao3);
                }
            }

            if (posicao4.altura >= 0 && posicao4.largura >= 0) {
                if (!tabuleiro[altura4] || !tabuleiro[altura4][largura4]) {
                    listMov.push(posicao4);
                }
            }
        }
        return listMov;
    }

    function retornaAlcanceAtaque(tabuleiro, alturaPeca, larguraPeca, peca) {
        var listAtak = [];
        alturaPeca = parseInt(alturaPeca);
        larguraPeca = parseInt(larguraPeca);
        for (var j = 1; j <= peca.AlcanceAtaque; j++) {
            var altura1 = alturaPeca;
            var largura1 = larguraPeca + j;
            var posicao1 = {
                altura: altura1,
                largura: largura1
            };

            var altura2 = alturaPeca + j;
            var largura2 = larguraPeca;
            var posicao2 = {
                altura: altura2,
                largura: largura2
            };

            var altura3 = alturaPeca - j;
            var largura3 = larguraPeca;
            var posicao3 = {
                altura: altura3,
                largura: largura3
            };

            var altura4 = alturaPeca;
            var largura4 = larguraPeca - j;
            var posicao4 = {
                altura: altura4,
                largura: largura4
            };

            if (posicao1.altura >= 0 && posicao1.largura >= 0) {
                if (tabuleiro[altura1] && tabuleiro[altura1][largura1] &&
                    tabuleiro[altura1][largura1].ExercitoId != peca.ExercitoId) {
                    listAtak.push(posicao1);
                }
            }

            if (posicao2.altura >= 0 && posicao2.largura >= 0) {
                if (tabuleiro[altura2] && tabuleiro[altura2][largura2] &&
                    tabuleiro[altura2][largura2].ExercitoId != peca.ExercitoId) {
                    listAtak.push(posicao2);
                }
            }

            if (posicao3.altura >= 0 && posicao3.largura >= 0) {
                if (tabuleiro[altura3] && tabuleiro[altura3][largura3] &&
                    tabuleiro[altura3][largura3].ExercitoId != peca.ExercitoId) {
                    listAtak.push(posicao3);
                }
            }

            if (posicao4.altura >= 0 && posicao4.largura >= 0) {
                if (tabuleiro[altura4] && tabuleiro[altura4][largura4] &&
                    tabuleiro[altura4][largura4].ExercitoId != peca.ExercitoId) {
                    listAtak.push(posicao4);
                }
            }
        }
        return listAtak;
    }
    
    function removeClassesMovimentoAtaque(alcanceAtaque, alcanceMovimento) {
        for (var mov in alcanceMovimento) {
            var casa = "casa_" + alcanceMovimento[mov].altura + "_" + alcanceMovimento[mov].largura;
            $("#" + casa).removeClass("movimento_peca");
        }
        for (var atk in alcanceAtaque) {
            var casa = "casa_" + alcanceAtaque[atk].altura + "_" + alcanceAtaque[atk].largura;
            $("#" + casa).removeClass("ataque_peca");
        }
    }

    function aplicaClassesMovimentoAtaque(alcanceAtaque, alcanceMovimento) {
        for (var mov in alcanceMovimento) {
            var casa = "casa_" + alcanceMovimento[mov].altura + "_" + alcanceMovimento[mov].largura;
            $("#" + casa).addClass("movimento_peca");
        }
        for (var atk in alcanceAtaque) {
            var casa = "casa_" + alcanceAtaque[atk].altura + "_" + alcanceAtaque[atk].largura;
            $("#" + casa).addClass("ataque_peca");
        }
    }

    function retornaLetraPorIndex(index) {
        switch (index) {
            case "0":
                return 'A';
                break;
            case "1":
                return 'B';
                break;
            case "2":
                return 'C';
                break;
            case "3":
                return 'D';
                break;
            case "4":
                return 'E';
                break;
            case "5":
                return 'F';
                break;
            case "6":
                return 'G';
                break;
            case "7":
                return 'H';
                break;
        }
    }

    function converteCasa(casa) {
        var altura = casa.split("_")[1];
        var largura = casa.split("_")[2];
        altura = retornaLetraPorIndex(altura);
        largura = parseInt(largura) + 1;
        return altura + largura;
    }

    MontarTabuleiro = function(batalhaParam) {
        pecasNoTabuleiro = [];
        var batalha = batalhaParam;
        var pecas = batalha.Tabuleiro.ElementosDoExercito
        var ExercitoBrancoId = batalha.ExercitoBrancoId;
        var ExercitoPretoId = batalha.ExercitoPretoId;
        if (batalha.TurnoId == batalha.ExercitoBranco.UsuarioId) {
            $("#turno_jogador").text(batalha.ExercitoBranco.Usuario.Email)
        } else {
            $("#turno_jogador").text(batalha.ExercitoPreto.Usuario.Email)
        }
        $("#tabuleiro").empty();
        var i;
        $("#tabuleiro").append("<div class='header-top'><div class='space'></div><div class='casa-h'>1</div><div class='casa-h'>2</div><div class='casa-h'>3</div><div class='casa-h'>4</div><div class='casa-h'>5</div><div class='casa-h'>6</div><div class='casa-h'>7</div><div class='casa-h'>8</div></div>");
        for (i = 0; i < batalha.Tabuleiro.Altura; i++) {
            $("#tabuleiro").append("<div id='linha_" + i.toString() + "' class='linha' >");
            $("#linha_" + i.toString()).append("<div class='casa-l'>" + retornaLetraPorIndex(i.toString()) + "</div>");
            pecasNoTabuleiro[i] = [];
            for (j = 0; j < batalha.Tabuleiro.Largura; j++) {
                var nome_casa = "casa_" + i.toString() + "_" + j.toString();
                var classe = (i % 2 == 0 ? (j % 2 == 0 ? "casa_branca" : "casa_preta") : (j % 2 != 0 ? "casa_branca" : "casa_preta"));
                $("#linha_" + i.toString()).append("<div id='" + nome_casa + "' class='casa " + classe + "' />");
                
                for (x = 0; x < pecas.length; x++) {
                    if (pecas[x].Saude <= 0) {
                        continue;
                    }
                    if (pecas[x].posicao.Altura == i && pecas[x].posicao.Largura == j){
                        pecasNoTabuleiro[i][j] = pecas[x];
                        if (pecas[x].ExercitoId == ExercitoBrancoId) {
                            var img = "/Images/" + pecas[x].Image + "Branco.png";
                            $("#" + nome_casa).append("<img src=" + img +" class='peca' id='" + nome_casa.replace("casa", "peca_preta") + "'/>");
                        }
                        else if (pecas[x].ExercitoId == ExercitoPretoId) {
                            var img = "/Images/" + pecas[x].Image + "Preto.png";
                            $("#" + nome_casa).append("<img src='" + img + "' class='peca' id='" + nome_casa.replace("casa", "peca_branca") + "'/>");
                        }

                    }                    
                }
            }
        }
        $(".casa").click(function () {
            //Retirando a seleção da casa antiga.
            $("#" + casa_selecionada).removeClass("casa_selecionada");
            removeClassesMovimentoAtaque(alcanceAtaque, alcanceMovimento);
            //Obtendo o Id.
            casa_selecionada = $(this).attr("id");
            //Adicionando Vermelho na Casa nova.
            $("#" + casa_selecionada).addClass("casa_selecionada");
            //Legenda que mostra informações da casa selecionada.
            $("#info_casa_selecionada").text(converteCasa(casa_selecionada));
            var altura = casa_selecionada.split("_")[1];
            var largura = casa_selecionada.split("_")[2];
            
            if (pecaElem == null) {
                //Obter o id da imagem selecionada.
                peca_selecionadaId = ObterPecaIDNaCasa(casa_selecionada);
                //Se for nulo
                if (peca_selecionadaId == null) {
                    pecaElem = null;
                    peca_selecionadaId = "NENHUMA PECA SELECIONADA";
                } else {
                    //Guardar a peça selecionada.
                    pecaElem = document.getElementById(peca_selecionadaId);
                    pecaSelecionadaObj = pecasNoTabuleiro[altura][largura];
                    alcanceMovimento = retornaAlcanceMovimento(pecasNoTabuleiro, altura, largura, pecaSelecionadaObj);
                    alcanceAtaque = retornaAlcanceAtaque(pecasNoTabuleiro, altura, largura, pecaSelecionadaObj);
                    aplicaClassesMovimentoAtaque(alcanceAtaque, alcanceMovimento);
                }
                //Legenda que mostra informações da peça selecionada.
                var msgPecaSelecionada = converteCasa(casa_selecionada);
                if (pecaSelecionadaObj) msgPecaSelecionada += " | Saúde: " + pecaSelecionadaObj.Saude;
                $("#info_peca_selecionada").text(msgPecaSelecionada);
            } else {
                var posicaopeca = {
                    Altura: altura,
                    Largura: largura
                };
                var ExercitoTurno = (batalha.TurnoId == batalha.ExercitoBrancoId) ? batalha.ExercitoBranco : batalha.ExercitoPreto;

                if (ObterPecaIDNaCasa(casa_selecionada) == null) {
                    ataque = false;
                } else {
                    ataque = true;
                }

                var movimento = {
                    Posicao: posicaopeca,
                    AutorId: ExercitoTurno.UsuarioId,
                    BatalhaId: batalha.Id,
                    ElementoId: pecaSelecionadaObj.Id,
                    TipoMovimento: ataque ? "Atacar" : "Mover"
                };
                var EmailUsuario = sessionStorage.getItem("emailUsuario");


                if (ExercitoTurno.Usuario.Email == EmailUsuario &&
                    ExercitoTurno.Id == pecaSelecionadaObj.ExercitoId
                ) {
                    Mover(movimento, pecaElem.parentNode, document.getElementById(casa_selecionada), pecaElem);
                } else if (ExercitoTurno.Usuario.Email != EmailUsuario) {
                    alert("Não é a sua vez!");
                } else if (ExercitoTurno.Id != pecaSelecionadaObj.ExercitoId) {
                    alert("Não é o seu exercito!");
                }


                pecaElem = null;
                $("#" + casa_selecionada).removeClass("casa_selecionada");
            }
        });

        function ObterPecaIDNaCasa(casa_selecionada) {
            return $("#" + casa_selecionada).children("img:first").attr("id");
        }

        function Mover(movimento, posAntiga, posNova, peca) {
            var token = sessionStorage.getItem("accessToken");
            var headers = {};
            if (token) {
                headers.Authorization = token;
            }
            $("#interceptor").removeClass("hide");
            $.ajax({
                type: 'POST',
                url: baseUrl + "/api/Batalhas/Jogar",
                headers: headers,
                data: movimento
            })
                .done(
                function (data) {
                    MontarTabuleiro(data);
                    $("#interceptor").addClass("hide");
                    //$("#msgInterceptor").text("Carregou");
                }
                )
                .fail(
                function (jqXHR, textStatus) {
                    alert("Código de Erro: " + jqXHR.status + "\n\n" + jqXHR.responseText);
                    $("#interceptor").addClass("hide");
                });
        }

        function MoverPeca(posAntiga, posNova, peca) {
//            var casaElem = document.getElementById(casa_selecionada);
            //Remover a peça da casa antiga.
            posAntiga.removeChild(peca);
            //Colocar a peça na nova casa.
            posNova.appendChild(peca);
            //pecaElem = null para não mover a peça no novo clique.
            posNova.classList.remove("casa_selecionada")
        }
    }   

    
});
