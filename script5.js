document.addEventListener("DOMContentLoaded", () => {
    // Array estruturado contendo a pergunta, alternativas e resposta correta
    const perguntasQuiz = [
        {
            pergunta: "Na coreografia de Maracatu, as bailarinas precisam formar um círculo. Tio Jessy explicou que cada bailarina deve ficar exatamente entre duas colegas. Se há 12 bailarinas na roda, quantas bailarinas cada bailarina consegue ter ao seu lado?",
            alternativas: ["2", "3", "4"],
            correta: 0 // Index 0 representa a alternativa "2"
        }
    ];

    let indicePerguntaAtual = 0;
    let pontosAcumulados = 0; // Computador de pontos (1 ponto por acerto)

    const campoPergunta = document.getElementById("pergunta-campo");
    const botoesAlternativas = document.querySelectorAll(".btn-alternativa");
    const campoFeedback = document.getElementById("mensagem-feedback");
    const btnProxima = document.getElementById("btn-proxima");
    const containerOpcoes = document.getElementById("container-opcoes");

    function carregarQuestao() {
        campoFeedback.textContent = "";
        btnProxima.style.display = "none"; // Oculta o botão de avançar no início da pergunta

        if (indicePerguntaAtual >= perguntasQuiz.length) {
            exibirResultadoFinal();
            return;
        }

        const dadosQuestao = perguntasQuiz[indicePerguntaAtual];
        campoPergunta.textContent = dadosQuestao.pergunta;

        botoesAlternativas.forEach((botao, index) => {
            botao.textContent = dadosQuestao.alternativas[index];
            botao.classList.remove("correta", "errada");
            botao.disabled = false; 
        });
    }

    function selecionarAlternativa(e) {
        const botaoSelecionado = e.target;
        const indiceSelecionado = parseInt(botaoSelecionado.getAttribute("data-index"));
        const indiceCorreto = perguntasQuiz[indicePerguntaAtual].correta;

        // Sem segundas chances: Bloqueia todas as alternativas imediatamente ao clicar
        botoesAlternativas.forEach(botao => {
            botao.disabled = true;
        });

        // Verifica a resposta e computa a pontuação
        if (indiceSelecionado === indiceCorreto) {
            botaoSelecionado.classList.add("correta");
            campoFeedback.style.color = "#2ecc71";
            campoFeedback.textContent = "✨ Resposta correta! Muito bem.";
            pontosAcumulados++; // Soma +1 ponto
        } else {
            botaoSelecionado.classList.add("errada");
            botoesAlternativas[indiceCorreto].classList.add("correta"); // Mostra onde errou
            campoFeedback.style.color = "#e74c3c";
            campoFeedback.textContent = "❌ Resposta incorreta!";
        }

        // Modifica o texto se for a última pergunta antes de liberar o botão seguinte
        if (indicePerguntaAtual === perguntasQuiz.length - 1) {
            btnProxima.textContent = "Ver Resultado Final 📊";
        } else {
            btnProxima.textContent = "Próxima Pergunta ➡️";
        }

        // Exibe o botão de avançar APENAS depois de selecionar alguma alternativa
        btnProxima.style.display = "inline-block";
    }

    // Tela final mostrando a contagem total de pontos
    function exibirResultadoFinal() {
        containerOpcoes.style.display = "none";
        btnProxima.style.display = "none";
        
        campoPergunta.innerHTML = `🏁 Quiz Finalizado!`;
        campoFeedback.style.color = "#ffffff";
        campoFeedback.innerHTML = `Você fez um total de <span style="color: #f1c40f; font-size: 1.6rem;">${pontosAcumulados}</span> ponto(s) de ${perguntasQuiz.length} possíveis.`;
    }

    botoesAlternativas.forEach(botao => {
        botao.addEventListener("click", selecionarAlternativa);
    });

    btnProxima.addEventListener("click", () => {
        indicePerguntaAtual++;
        carregarQuestao();
    });

    carregarQuestao();
});