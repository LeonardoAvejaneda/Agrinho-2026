// AgroVerde — Mercado de Carbono & Descarbonização
// Concurso Agrinho 2026 — Subcategoria 3

// MENU MOBILE

var botaoMenu = document.getElementById("abrirMenu");
var navCabecalho = document.querySelector(".navegacao-cabecalho");

botaoMenu.addEventListener("click", function () {
  navCabecalho.classList.toggle("aberto");
  botaoMenu.textContent = navCabecalho.classList.contains("aberto") ? "✕" : "☰";
});

var linksNav = document.querySelectorAll(".navegacao-cabecalho a");
linksNav.forEach(function (link) {
  link.addEventListener("click", function () {
    navCabecalho.classList.remove("aberto");
    botaoMenu.textContent = "☰";
  });
});

// CONTADORES ANIMADOS DO HERO

function animarContador(idElemento, valorFinal, sufixo) {
  var el = document.getElementById(idElemento);
  if (!el) return;

  var inicio = null;
  var duracao = 1800;

  function passo(timestamp) {
    if (!inicio) inicio = timestamp;
    var progresso = Math.min((timestamp - inicio) / duracao, 1);
    var suavizado = 1 - Math.pow(1 - progresso, 3);
    var atual = Math.floor(suavizado * valorFinal);
    el.textContent = atual + (sufixo || "");

    if (progresso < 1) {
      requestAnimationFrame(passo);
    } else {
      el.textContent = valorFinal + (sufixo || "");
    }
  }

  requestAnimationFrame(passo);
}

var secaoHero = document.querySelector(".hero");
var contadoresIniciados = false;

var observadorHero = new IntersectionObserver(function (entradas) {
  entradas.forEach(function (entrada) {
    if (entrada.isIntersecting && !contadoresIniciados) {
      contadoresIniciados = true;
      animarContador("contadorToneladas", 1100, " mi");
      animarContador("contadorMercados", 34, "");
      animarContador("contadorPorcentagem", 17, "%");
    }
  });
}, { threshold: 0.3 });

observadorHero.observe(secaoHero);

// ABAS — MERCADO REGULADO VS VOLUNTARIO

var dadosAbas = {
  regulado: {
    titulo: "Mercado Regulado (ETS)",
    descricao: "Nos mercados regulados, o governo define um limite máximo de emissões e as empresas precisam possuir 'direitos de emissão' para cada tonelada de CO₂ que produzem. Quem reduz mais pode vender o excedente.",
    itens: [
      "Governado por leis e políticas públicas nacionais ou supranacionais",
      "Empresas compram ou recebem 'direitos de emissão' em leilões",
      "Limite total de emissões é reduzido gradualmente ao longo dos anos",
      "Gera receita pública para financiar projetos climáticos",
      "Exemplos: EU ETS (Europa), ETS Chinês, e o futuro SBCE (Brasil)",
    ],
  },
  voluntario: {
    titulo: "Mercado Voluntário de Carbono",
    descricao: "No mercado voluntário, empresas e indivíduos escolhem, por vontade própria, compensar suas emissões comprando 'créditos de carbono' de projetos que reduziram ou sequestraram CO₂.",
    itens: [
      "Participação espontânea — não há obrigação legal",
      "Créditos gerados por projetos de reflorestamento, agricultura sustentável, biogás etc.",
      "Cada crédito representa 1 tonelada de CO₂e evitada ou removida",
      "Produtor rural brasileiro pode vender créditos para empresas do mundo todo",
      "Preços variáveis: de US$ 1 a mais de US$ 20 por tonelada, conforme a qualidade",
    ],
  },
};

var conteudoAba = document.getElementById("conteudoAba");
var botoesAba = document.querySelectorAll(".botao-aba");

function mostrarAba(chave) {
  var dados = dadosAbas[chave];
  var itensHTML = dados.itens
    .map(function (item) {
      return '<div class="item-lista-aba"><span class="ponto-lista"></span><span>' + item + "</span></div>";
    })
    .join("");

  conteudoAba.innerHTML =
    '<div class="painel-aba">' +
    "<h3>" + dados.titulo + "</h3>" +
    "<p>" + dados.descricao + "</p>" +
    '<div class="lista-aba">' + itensHTML + "</div>" +
    "</div>";
}

botoesAba.forEach(function (btn) {
  btn.addEventListener("click", function () {
    botoesAba.forEach(function (b) { b.classList.remove("ativo"); });
    btn.classList.add("ativo");
    mostrarAba(btn.getAttribute("data-tab"));
  });
});

mostrarAba("regulado");

// CALCULADORA DE CREDITOS DE CARBONO

var botaoCalcular = document.getElementById("botaoCalcular");
var resultadoCalculadora = document.getElementById("resultadoCalculadora");

botaoCalcular.addEventListener("click", function () {
  var areaHa  = parseFloat(document.getElementById("areaHa").value)  || 0;
  var plantio = parseFloat(document.getElementById("plantio").value) || 0;
  var biogas  = parseFloat(document.getElementById("biogas").value)  || 0;

  if (areaHa === 0 && plantio === 0 && biogas === 0) {
    resultadoCalculadora.innerHTML =
      '<div class="placeholder-resultado">' +
      '<span class="icone-resultado">⚠️</span>' +
      "<p>Por favor, preencha ao menos um campo com valor maior que zero.</p>" +
      "</div>";
    return;
  }

  // Fatores de sequestro (estimativas didaticas)
  // Floresta / reserva: ~8 tCO2e por hectare por ano
  // Plantio direto: ~1.5 tCO2e por hectare por ano
  // Biogas: 1 m³/dia equivale a ~0.65 tCO2e por ano

  var creditosFlorestas = areaHa * 8;
  var creditosPlantio   = plantio * 1.5;
  var creditosBiogas    = biogas * 0.65 * 365 / 1000;
  var totalCreditos     = creditosFlorestas + creditosPlantio + creditosBiogas;

  // Valor estimado com preco medio de R$ 50 por tonelada
  var valorEstimado = totalCreditos * 50;

  var formatarNumero   = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  var formatarDinheiro = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  resultadoCalculadora.style.background = "linear-gradient(135deg, #d6f5e5 0%, #f7f4ed 100%)";
  resultadoCalculadora.style.border = "2px solid #3aad66";

  resultadoCalculadora.innerHTML =
    '<div class="dados-resultado">' +
    '<span class="toneladas-resultado">' + formatarNumero.format(totalCreditos) + "</span>" +
    '<span class="unidade-resultado">toneladas de CO₂e / ano</span>' +
    '<span class="valor-resultado">≈ ' + formatarDinheiro.format(valorEstimado) + " / ano estimados</span>" +
    '<div class="detalhes-resultado">' +
    (areaHa  > 0 ? "🌳 Florestas/Reserva: " + formatarNumero.format(creditosFlorestas) + " tCO₂e<br />" : "") +
    (plantio > 0 ? "🌾 Plantio Direto: "    + formatarNumero.format(creditosPlantio)   + " tCO₂e<br />" : "") +
    (biogas  > 0 ? "⚡ Biogás: "             + formatarNumero.format(Math.round(creditosBiogas)) + " tCO₂e<br />" : "") +
    "</div>" +
    "<small style='color:#2d8a52;font-size:0.75rem;margin-top:12px;display:block;'>* Estimativa didática. Valores reais dependem de certificação.</small>" +
    "</div>";
});

// QUIZ

var perguntas = [
  {
    pergunta: "O que é um 'crédito de carbono' no mercado voluntário?",
    opcoes: [
      "Um imposto cobrado de empresas poluidoras",
      "Um certificado que representa 1 tonelada de CO₂ evitada ou removida",
      "Um tipo de energia renovável gerada no campo",
      "Um subsídio do governo para agricultura orgânica",
    ],
    certa: 1,
    feedback: "Correto! Um crédito de carbono representa 1 tonelada de CO₂ equivalente que foi evitada ou retirada da atmosfera — por exemplo, por reflorestamento ou agricultura sustentável.",
  },
  {
    pergunta: "Como o produtor rural brasileiro pode se beneficiar do mercado de carbono?",
    opcoes: [
      "Comprando créditos para poluir mais",
      "Vendendo créditos gerados por práticas como reflorestamento, plantio direto e biogás",
      "Pagando taxas ambientais menores",
      "Recebendo subsídios para usar agrotóxicos",
    ],
    certa: 1,
    feedback: "Exato! O agro brasileiro gera créditos por meio de práticas sustentáveis — reservas legais, plantio direto e biogás — e pode vendê-los para empresas que precisam compensar suas emissões.",
  },
  {
    pergunta: "Qual lei criou o Sistema Brasileiro de Comércio de Emissões (SBCE)?",
    opcoes: [
      "Lei 13.709/2018 (LGPD)",
      "Lei 9.610/1998 (Direitos Autorais)",
      "Lei 15.042/2024",
      "Decreto 7.390/2010",
    ],
    certa: 2,
    feedback: "Isso mesmo! A Lei 15.042/2024, aprovada pelo Senado no final de 2024, criou o mercado regulado de carbono no Brasil. Ela ainda está em fase de regulamentação pelo Poder Executivo.",
  },
  {
    pergunta: "Qual é a meta de descarbonização do Brasil até 2050?",
    opcoes: [
      "Reduzir 10% das emissões",
      "Neutralidade de carbono (emissões líquidas zero)",
      "Dobrar a produção de petróleo sustentável",
      "Eliminar apenas o desmatamento ilegal",
    ],
    certa: 1,
    feedback: "Correto! A meta do Brasil é a neutralidade de carbono até 2050, ou seja, compensar todas as emissões com ações de sequestro e redução — e o agro sustentável é peça-chave nesse objetivo.",
  },
  {
    pergunta: "O que diferencia o mercado REGULADO do VOLUNTÁRIO de carbono?",
    opcoes: [
      "No regulado, a participação é obrigatória por lei; no voluntário, é uma escolha",
      "O mercado voluntário tem preços mais altos",
      "O mercado regulado só existe na Europa",
      "No voluntário, o governo compra todos os créditos",
    ],
    certa: 0,
    feedback: "Perfeito! Nos mercados regulados (como o EU ETS e o futuro SBCE), empresas são obrigadas por lei a limitar emissões. Nos voluntários, empresas e pessoas escolhem compensar suas emissões por iniciativa própria.",
  },
];

var perguntaAtual = 0;
var pontuacao = 0;
var blocoQuiz = document.getElementById("blocoQuiz");

function mostrarPergunta() {
  var p = perguntas[perguntaAtual];
  var opcoesHTML = p.opcoes
    .map(function (opcao, i) {
      return '<button class="botao-opcao" data-indice="' + i + '">' + opcao + "</button>";
    })
    .join("");

  blocoQuiz.innerHTML =
    '<div class="pergunta-quiz">' +
    '<p class="progresso-quiz">Pergunta ' + (perguntaAtual + 1) + " de " + perguntas.length + "</p>" +
    '<p class="texto-pergunta">' + p.pergunta + "</p>" +
    '<div class="opcoes-quiz">' + opcoesHTML + "</div>" +
    "</div>";

  var botoes = blocoQuiz.querySelectorAll(".botao-opcao");
  botoes.forEach(function (btn) {
    btn.addEventListener("click", function () {
      verificarResposta(parseInt(btn.getAttribute("data-indice")));
    });
  });
}

function verificarResposta(indiceSelecionado) {
  var p = perguntas[perguntaAtual];
  var botoes = blocoQuiz.querySelectorAll(".botao-opcao");
  var divPergunta = blocoQuiz.querySelector(".pergunta-quiz");

  botoes.forEach(function (btn) { btn.disabled = true; });

  var acertou = indiceSelecionado === p.certa;

  if (acertou) {
    botoes[indiceSelecionado].classList.add("certa");
    pontuacao++;
  } else {
    botoes[indiceSelecionado].classList.add("errada");
    botoes[p.certa].classList.add("certa");
  }

  var feedbackEl = document.createElement("div");
  feedbackEl.className = "feedback-quiz " + (acertou ? "certa" : "errada");
  feedbackEl.textContent = (acertou ? "✅ " : "❌ ") + p.feedback;
  divPergunta.appendChild(feedbackEl);

  var botaoProxima = document.createElement("button");
  botaoProxima.className = "botao botao-principal botao-proxima";
  botaoProxima.textContent = perguntaAtual < perguntas.length - 1 ? "Próxima pergunta →" : "Ver resultado";

  botaoProxima.addEventListener("click", function () {
    perguntaAtual++;
    if (perguntaAtual < perguntas.length) {
      mostrarPergunta();
    } else {
      mostrarPlacar();
    }
  });

  divPergunta.appendChild(botaoProxima);
}

function mostrarPlacar() {
  var porcentagem = Math.round((pontuacao / perguntas.length) * 100);
  var mensagem = "";

  if (porcentagem === 100) {
    mensagem = "🏆 Incrível! Você acertou tudo. O agro tem um campeão do clima!";
  } else if (porcentagem >= 60) {
    mensagem = "🌱 Muito bem! Você entende o potencial do agro sustentável.";
  } else {
    mensagem = "📚 Continue explorando! O mercado de carbono é o futuro do campo.";
  }

  blocoQuiz.innerHTML =
    '<div class="placar-quiz">' +
    "<h3>Resultado Final</h3>" +
    '<span class="numero-placar">' + pontuacao + "/" + perguntas.length + "</span>" +
    "<p>" + mensagem + "</p>" +
    '<button class="botao botao-principal" id="botaoReiniciar">Tentar novamente</button>' +
    "</div>";

  document.getElementById("botaoReiniciar").addEventListener("click", function () {
    perguntaAtual = 0;
    pontuacao = 0;
    mostrarPergunta();
  });
}

mostrarPergunta();

// SCROLL REVEAL — elementos aparecem ao rolar

var elementosAnimados = document.querySelectorAll(".cartao, .cartao-timeline, .visual-explicacao");

elementosAnimados.forEach(function (el) {
  el.style.opacity = "0";
  el.style.transform = "translateY(28px)";
  el.style.transition = "opacity 0.55s ease, transform 0.55s ease";
});

var observadorScroll = new IntersectionObserver(
  function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.style.opacity = "1";
        entrada.target.style.transform = "translateY(0)";
        observadorScroll.unobserve(entrada.target);
      }
    });
  },
  { threshold: 0.15 }
);

elementosAnimados.forEach(function (el) {
  observadorScroll.observe(el);
});

// ACESSIBILIDADE

// --- MODO ESCURO ---
var botaoModoEscuro = document.getElementById("botaoModoEscuro");

botaoModoEscuro.addEventListener("click", function () {
  document.body.classList.toggle("modo-escuro");
  botaoModoEscuro.classList.toggle("ativo");

  // Desativa alto contraste se estiver ativo (nao combinam)
  if (document.body.classList.contains("alto-contraste")) {
    document.body.classList.remove("alto-contraste");
    botaoAltoContraste.classList.remove("ativo");
  }
});

// --- ALTO CONTRASTE ---
var botaoAltoContraste = document.getElementById("botaoAltoContraste");

botaoAltoContraste.addEventListener("click", function () {
  document.body.classList.toggle("alto-contraste");
  botaoAltoContraste.classList.toggle("ativo");

  // Desativa modo escuro se estiver ativo
  if (document.body.classList.contains("modo-escuro")) {
    document.body.classList.remove("modo-escuro");
    botaoModoEscuro.classList.remove("ativo");
  }
});

// --- TAMANHO DA FONTE ---
var tamanhoFonteAtual = 16;
var tamanhoMinimo = 12;
var tamanhoMaximo = 22;

var botaoAumentarFonte = document.getElementById("botaoAumentarFonte");
var botaoDiminuirFonte = document.getElementById("botaoDiminuirFonte");

botaoAumentarFonte.addEventListener("click", function () {
  if (tamanhoFonteAtual < tamanhoMaximo) {
    tamanhoFonteAtual += 2;
    document.documentElement.style.fontSize = tamanhoFonteAtual + "px";
  }
});

botaoDiminuirFonte.addEventListener("click", function () {
  if (tamanhoFonteAtual > tamanhoMinimo) {
    tamanhoFonteAtual -= 2;
    document.documentElement.style.fontSize = tamanhoFonteAtual + "px";
  }
});

// --- LEITURA EM VOZ ALTA (Web Speech API) ---
var botaoLeitura = document.getElementById("botaoLeitura");
var lendoAgora = false;
var elementoAtual = null;

// Pega todos os paragrafos e titulos legiveis da pagina
function pegarTextosLegíveis() {
  var seletores = "h1, h2, h3, p, .legenda-contador, .ano-timeline";
  return Array.from(document.querySelectorAll(seletores)).filter(function (el) {
    // Ignora elementos dentro do cabecalho e rodape
    return !el.closest(".cabecalho") && !el.closest(".rodape") && el.textContent.trim().length > 0;
  });
}

botaoLeitura.addEventListener("click", function () {
  // Verifica se o navegador suporta a API
  if (!window.speechSynthesis) {
    alert("Seu navegador não suporta leitura em voz alta. Tente o Google Chrome.");
    return;
  }

  if (lendoAgora) {
    // Para a leitura
    window.speechSynthesis.cancel();
    lendoAgora = false;
    botaoLeitura.innerHTML = '<svg class="svg-icone-acesso" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 18V14M6 14H8L13 17V7L8 10H5C3.89543 10 3 10.8954 3 12V12C3 13.1046 3.89543 14 5 14H6ZM17 7L19 5M17 17L19 19M19 12H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    botaoLeitura.classList.remove("ativo");
    botaoLeitura.setAttribute("aria-label", "Leitura em voz alta");

    // Remove destaque do elemento atual
    if (elementoAtual) {
      elementoAtual.classList.remove("lendo");
      elementoAtual = null;
    }
    return;
  }

  // Inicia a leitura
  lendoAgora = true;
  botaoLeitura.textContent = "⏹";
  botaoLeitura.classList.add("ativo");
  botaoLeitura.setAttribute("aria-label", "Parar leitura");

  var textos = pegarTextosLegíveis();
  var indice = 0;

  function lerProximo() {
    // Remove destaque do anterior
    if (elementoAtual) {
      elementoAtual.classList.remove("lendo");
    }

    if (indice >= textos.length || !lendoAgora) {
      // Terminou tudo
      lendoAgora = false;
      botaoLeitura.innerHTML = '<svg class="svg-icone-acesso" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 18V14M6 14H8L13 17V7L8 10H5C3.89543 10 3 10.8954 3 12V12C3 13.1046 3.89543 14 5 14H6ZM17 7L19 5M17 17L19 19M19 12H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      botaoLeitura.classList.remove("ativo");
      botaoLeitura.setAttribute("aria-label", "Leitura em voz alta");
      return;
    }

    // Destaca o elemento sendo lido e rola até ele
    elementoAtual = textos[indice];
    elementoAtual.classList.add("lendo");
    elementoAtual.scrollIntoView({ behavior: "smooth", block: "center" });

    // Cria o utterance (fala)
    var fala = new SpeechSynthesisUtterance(elementoAtual.textContent);
    fala.lang = "pt-BR";
    fala.rate = 0.95;  // velocidade ligeiramente mais lenta para melhor compreensão
    fala.pitch = 1;

    fala.onend = function () {
      indice++;
      lerProximo();
    };

    fala.onerror = function () {
      indice++;
      lerProximo();
    };

    window.speechSynthesis.speak(fala);
  }

  lerProximo();
});

// Para a leitura se o usuario sair da pagina
window.addEventListener("beforeunload", function () {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
});