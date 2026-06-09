// AgroVerde — Mercado de Carbono & Descarbonização
// Concurso Agrinho 2026 — Subcategoria 3
// Arquivo: js/main.js

// =============================================
// MENU MOBILE
// =============================================

var menuToggle = document.getElementById("menuToggle");
var mainNav = document.querySelector(".main-nav");

menuToggle.addEventListener("click", function () {
  mainNav.classList.toggle("open");
  menuToggle.textContent = mainNav.classList.contains("open") ? "✕" : "☰";
});

// Fechar menu ao clicar em link
var navLinks = document.querySelectorAll(".main-nav a");
navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    mainNav.classList.remove("open");
    menuToggle.textContent = "☰";
  });
});

// =============================================
// ANIMAÇÃO DOS CONTADORES NO HERO
// =============================================

function animateCounter(elementId, targetValue, suffix) {
  var el = document.getElementById(elementId);
  if (!el) return;

  var startTime = null;
  var duration = 1800;
  var startVal = 0;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var progress = Math.min((timestamp - startTime) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    var current = Math.floor(eased * targetValue);
    el.textContent = current + (suffix || "");

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = targetValue + (suffix || "");
    }
  }

  requestAnimationFrame(step);
}

// Disparar contadores quando a hero entrar em tela
var heroSection = document.querySelector(".hero");
var countersStarted = false;

var heroObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      animateCounter("counterTons", 1100, " mi");
      animateCounter("counterBR", 34, "");
      animateCounter("counterPct", 17, "%");
    }
  });
}, { threshold: 0.3 });

heroObserver.observe(heroSection);

// =============================================
// TABS — MERCADO REGULADO VS VOLUNTÁRIO
// =============================================

var tabData = {
  regulado: {
    title: "Mercado Regulado (ETS)",
    desc: "Nos mercados regulados, o governo define um limite máximo de emissões e as empresas precisam possuir 'direitos de emissão' para cada tonelada de CO₂ que produzem. Quem reduz mais pode vender o excedente.",
    features: [
      "Governado por leis e políticas públicas nacionais ou supranacionais",
      "Empresas compram ou recebem 'direitos de emissão' em leilões",
      "Limite total de emissões é reduzido gradualmente ao longo dos anos",
      "Gera receita pública para financiar projetos climáticos",
      "Exemplos: EU ETS (Europa), ETS Chinês, e o futuro SBCE (Brasil)",
    ],
  },
  voluntario: {
    title: "Mercado Voluntário de Carbono",
    desc: "No mercado voluntário, empresas e indivíduos escolhem, por vontade própria, compensar suas emissões comprando 'créditos de carbono' de projetos que reduziram ou sequestraram CO₂.",
    features: [
      "Participação espontânea — não há obrigação legal",
      "Créditos gerados por projetos de reflorestamento, agricultura sustentável, biogás etc.",
      "Cada crédito representa 1 tonelada de CO₂e evitada ou removida",
      "Produtor rural brasileiro pode vender créditos para empresas do mundo todo",
      "Preços variáveis: de US$ 1 a mais de US$ 20 por tonelada, conforme a qualidade",
    ],
  },
};

var tabContent = document.getElementById("tabContent");
var tabBtns = document.querySelectorAll(".tab-btn");

function renderTab(key) {
  var data = tabData[key];
  var featuresHTML = data.features
    .map(function (f) {
      return '<div class="tab-feature"><span class="feature-dot"></span><span>' + f + "</span></div>";
    })
    .join("");

  tabContent.innerHTML =
    '<div class="tab-pane">' +
    "<h3>" + data.title + "</h3>" +
    "<p>" + data.desc + "</p>" +
    '<div class="tab-features">' + featuresHTML + "</div>" +
    "</div>";
}

tabBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    tabBtns.forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    renderTab(btn.getAttribute("data-tab"));
  });
});

// Inicializar a primeira aba
renderTab("regulado");

// =============================================
// CALCULADORA DE CRÉDITOS
// =============================================

var calcBtn = document.getElementById("calcBtn");
var calcResult = document.getElementById("calcResult");

calcBtn.addEventListener("click", function () {
  var areaHa = parseFloat(document.getElementById("areaHa").value) || 0;
  var plantio = parseFloat(document.getElementById("plantio").value) || 0;
  var biogas = parseFloat(document.getElementById("biogas").value) || 0;

  if (areaHa === 0 && plantio === 0 && biogas === 0) {
    calcResult.innerHTML =
      '<div class="result-placeholder">' +
      '<span class="result-icon">⚠️</span>' +
      "<p>Por favor, preencha ao menos um campo com valor maior que zero.</p>" +
      "</div>";
    return;
  }

  // Fatores de sequestro / crédito (estimativas didáticas)
  // Floresta nativa / reserva: ~8 tCO2e/ha/ano
  // Plantio direto: ~1.5 tCO2e/ha/ano de carbono no solo
  // Biogás: 1 m³/dia ≈ 0.65 tCO2e/ano (metano evitado)

  var creditosFlorestas = areaHa * 8;
  var creditosPlantio = plantio * 1.5;
  var creditosBiogas = biogas * 0.65 * 365 / 1000;
  var totalCreditos = creditosFlorestas + creditosPlantio + creditosBiogas;

  // Valor estimado: preço médio ~R$ 50/tCO2e (mercado voluntário BR)
  var valorEstimado = totalCreditos * 50;

  var formatter = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  var currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  calcResult.style.background = "linear-gradient(135deg, #d6f5e5 0%, #f7f4ed 100%)";
  calcResult.style.border = "2px solid #3aad66";

  calcResult.innerHTML =
    '<div class="result-data">' +
    '<span class="result-tons">' + formatter.format(totalCreditos) + "</span>" +
    '<span class="result-unit">toneladas de CO₂e / ano</span>' +
    '<span class="result-value">≈ ' + currencyFormatter.format(valorEstimado) + " / ano estimados</span>" +
    '<div class="result-breakdown">' +
    (areaHa > 0 ? "🌳 Florestas/Reserva: " + formatter.format(creditosFlorestas) + " tCO₂e<br />" : "") +
    (plantio > 0 ? "🌾 Plantio Direto: " + formatter.format(creditosPlantio) + " tCO₂e<br />" : "") +
    (biogas > 0 ? "⚡ Biogás: " + formatter.format(Math.round(creditosBiogas)) + " tCO₂e<br />" : "") +
    "</div>" +
    "<small style='color:#2d8a52;font-size:0.75rem;margin-top:12px;display:block;'>* Estimativa didática. Valores reais dependem de certificação.</small>" +
    "</div>";
});

// =============================================
// QUIZ
// =============================================

var quizData = [
  {
    question: "O que é um 'crédito de carbono' no mercado voluntário?",
    options: [
      "Um imposto cobrado de empresas poluidoras",
      "Um certificado que representa 1 tonelada de CO₂ evitada ou removida",
      "Um tipo de energia renovável gerada no campo",
      "Um subsídio do governo para agricultura orgânica",
    ],
    correct: 1,
    feedback:
      "Correto! Um crédito de carbono representa 1 tonelada de CO₂ equivalente que foi evitada ou retirada da atmosfera — por exemplo, por reflorestamento ou agricultura sustentável.",
  },
  {
    question: "Como o produtor rural brasileiro pode se beneficiar do mercado de carbono?",
    options: [
      "Comprando créditos para poluir mais",
      "Vendendo créditos gerados por práticas como reflorestamento, plantio direto e biogás",
      "Pagando taxas ambientais menores",
      "Recebendo subsídios para usar agrotóxicos",
    ],
    correct: 1,
    feedback:
      "Exato! O agro brasileiro gera créditos por meio de práticas sustentáveis — reservas legais, plantio direto e biogás — e pode vendê-los para empresas que precisam compensar suas emissões.",
  },
  {
    question: "Qual lei criou o Sistema Brasileiro de Comércio de Emissões (SBCE)?",
    options: [
      "Lei 13.709/2018 (LGPD)",
      "Lei 9.610/1998 (Direitos Autorais)",
      "Lei 15.042/2024",
      "Decreto 7.390/2010",
    ],
    correct: 2,
    feedback:
      "Isso mesmo! A Lei 15.042/2024, aprovada pelo Senado no final de 2024, criou o mercado regulado de carbono no Brasil. Ela ainda está em fase de regulamentação pelo Poder Executivo.",
  },
  {
    question: "Qual é a meta de descarbonização do Brasil até 2050?",
    options: [
      "Reduzir 10% das emissões",
      "Neutralidade de carbono (emissões líquidas zero)",
      "Dobrar a produção de petróleo sustentável",
      "Eliminar apenas o desmatamento ilegal",
    ],
    correct: 1,
    feedback:
      "Correto! A meta do Brasil é a neutralidade de carbono até 2050, ou seja, compensar todas as emissões com ações de sequestro e redução — e o agro sustentável é peça-chave nesse objetivo.",
  },
  {
    question: "O que diferencia o mercado REGULADO do VOLUNTÁRIO de carbono?",
    options: [
      "No regulado, a participação é obrigatória por lei; no voluntário, é uma escolha",
      "O mercado voluntário tem preços mais altos",
      "O mercado regulado só existe na Europa",
      "No voluntário, o governo compra todos os créditos",
    ],
    correct: 0,
    feedback:
      "Perfeito! Nos mercados regulados (como o EU ETS e o futuro SBCE), empresas são obrigadas por lei a limitar emissões. Nos voluntários, empresas e pessoas escolhem compensar suas emissões por iniciativa própria.",
  },
];

var currentQuestion = 0;
var score = 0;
var quizWrapper = document.getElementById("quizWrapper");

function renderQuestion() {
  var q = quizData[currentQuestion];
  var optionsHTML = q.options
    .map(function (opt, i) {
      return '<button class="quiz-opt-btn" data-index="' + i + '">' + opt + "</button>";
    })
    .join("");

  quizWrapper.innerHTML =
    '<div class="quiz-question">' +
    '<p class="quiz-progress">Pergunta ' + (currentQuestion + 1) + " de " + quizData.length + "</p>" +
    '<p class="quiz-q-text">' + q.question + "</p>" +
    '<div class="quiz-options">' + optionsHTML + "</div>" +
    "</div>";

  var optBtns = quizWrapper.querySelectorAll(".quiz-opt-btn");
  optBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      handleAnswer(parseInt(btn.getAttribute("data-index")));
    });
  });
}

function handleAnswer(selectedIndex) {
  var q = quizData[currentQuestion];
  var optBtns = quizWrapper.querySelectorAll(".quiz-opt-btn");
  var quizQuestion = quizWrapper.querySelector(".quiz-question");

  optBtns.forEach(function (btn) {
    btn.disabled = true;
  });

  var isCorrect = selectedIndex === q.correct;

  if (isCorrect) {
    optBtns[selectedIndex].classList.add("correct");
    score++;
  } else {
    optBtns[selectedIndex].classList.add("wrong");
    optBtns[q.correct].classList.add("correct");
  }

  var feedbackEl = document.createElement("div");
  feedbackEl.className = "quiz-feedback " + (isCorrect ? "correct" : "wrong");
  feedbackEl.textContent = (isCorrect ? "✅ " : "❌ ") + q.feedback;
  quizQuestion.appendChild(feedbackEl);

  var nextBtn = document.createElement("button");
  nextBtn.className = "btn btn-primary quiz-next-btn";
  nextBtn.textContent =
    currentQuestion < quizData.length - 1 ? "Próxima pergunta →" : "Ver resultado";

  nextBtn.addEventListener("click", function () {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      renderQuestion();
    } else {
      showScore();
    }
  });

  quizQuestion.appendChild(nextBtn);
}

function showScore() {
  var pct = Math.round((score / quizData.length) * 100);
  var msg = "";
  if (pct === 100) {
    msg = "🏆 Incrível! Você acertou tudo. O agro tem um campeão do clima!";
  } else if (pct >= 60) {
    msg = "🌱 Muito bem! Você entende o potencial do agro sustentável.";
  } else {
    msg = "📚 Continue explorando! O mercado de carbono é o futuro do campo.";
  }

  quizWrapper.innerHTML =
    '<div class="quiz-score">' +
    "<h3>Resultado Final</h3>" +
    '<span class="score-num">' + score + "/" + quizData.length + "</span>" +
    "<p>" + msg + "</p>" +
    '<button class="btn btn-primary" id="restartQuiz">Tentar novamente</button>' +
    "</div>";

  document.getElementById("restartQuiz").addEventListener("click", function () {
    currentQuestion = 0;
    score = 0;
    renderQuestion();
  });
}

// Iniciar quiz
renderQuestion();

// =============================================
// SCROLL REVEAL SUAVE NAS SEÇÕES
// =============================================

var revealElements = document.querySelectorAll(".card, .timeline-item, .explainer-visual");

revealElements.forEach(function (el) {
  el.style.opacity = "0";
  el.style.transform = "translateY(28px)";
  el.style.transition = "opacity 0.55s ease, transform 0.55s ease";
});

var revealObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach(function (el) {
  revealObserver.observe(el);
});
