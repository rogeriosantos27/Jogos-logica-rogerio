document.addEventListener("DOMContentLoaded", () => {
    // Banco de dados de opções para preencher a tabela dinamicamente
    const valoresPorCategoria = {
        "Camisa": ["Azul", "Branco", "Marrom", "Rosa", "Roxo"],
        "Nome": ["Kamila", "Ludmyla", "Mary", "Ruth", "Danielle"],
        "Talento": ["Cantora", "Imitação", "Malabarista", "Música", "Dança"],
        "Idade": ["22 anos", "24 anos", "27 anos", "30 anos", "25 anos"],
        "Fruta": ["Abacaxi", "Maçã", "Morango", "Uva", "Banana"],
        "Prato": ["Almôndega", "Feijoada", "Lasanha", "Macarronada", "Pratinho"]
    };

    // Gabarito do Enigma 4 para validação do botão final
    const gabarito = {
        "Camisa": ["Marrom", "Roxo", "Azul", "Branco", "Rosa"],
        "Nome": ["Ludmyla", "Kamila", "Mary", "Ruth", "Danielle"],
        "Talento": ["Música", "Imitação", "Malabarista", "Cantora", "Dança"],
        "Idade": ["24 anos", "27 anos", "30 anos", "22 anos", "25 anos"],
        "Fruta": ["Uva", "Banana", "Morango", "Abacaxi", "Maçã"],
        "Prato": ["Almôndega", "Macarronada", "Pratinho", "Lasanha", "Feijoada"]
    };

    const tabela = document.getElementById("tabuleiro");
    const linhas = tabela.querySelectorAll("tbody tr");

    // --- RENDERIZAÇÃO DA TABELA (CONSERTA O SUMIÇO) ---
    linhas.forEach(linha => {
        const categoria = linha.getAttribute("data-categoria");
        const opcoes = valoresPorCategoria[categoria] || [];

        for (let i = 1; i <= 5; i++) {
            const td = document.createElement("td");
            const select = document.createElement("select");
            select.setAttribute("data-posicao", i);
            
            const optDefault = document.createElement("option");
            optDefault.value = "";
            optDefault.textContent = "Selecione...";
            select.appendChild(optDefault);

            opcoes.forEach(opcao => {
                const opt = document.createElement("option");
                opt.value = opcao;
                opt.textContent = opcao;
                select.appendChild(opt);
            });

            if (categoria === "Camisa") {
                select.addEventListener("change", (e) => atualizarCorColuna(i, e.target.value));
            }

            td.appendChild(select);
            linha.appendChild(td);
        }
    });

    // Função visual das colunas coloridas
    function atualizarCorColuna(posicao, cor) {
        const linhasTabela = tabela.querySelectorAll("tbody tr");
        linhasTabela.forEach(linha => {
            const td = linha.querySelectorAll("td")[posicao];
            if (td) {
                td.classList.remove("coluna-cor-roxo", "coluna-cor-marrom", "coluna-cor-azul", "coluna-cor-rosa", "coluna-cor-branco");
                if (cor === "Roxo") td.classList.add("coluna-cor-roxo");
                if (cor === "Marrom") td.classList.add("coluna-cor-marrom");
                if (cor === "Azul") td.classList.add("coluna-cor-azul");
                if (cor === "Rosa") td.classList.add("coluna-cor-rosa");
                if (cor === "Branco") td.classList.add("coluna-cor-branco");
            }
        });
    }

    function getVal(categoria, posicao) {
        const linha = document.querySelector(`tr[data-categoria="${categoria}"]`);
        if (!linha) return "";
        const select = linha.querySelector(`select[data-posicao="${posicao}"]`);
        return select ? select.value : "";
    }

    function findPos(categoria, valor) {
        for (let i = 1; i <= 5; i++) {
            if (getVal(categoria, i) === valor) return i;
        }
        return 0;
    }

    function atualizarPistaVisual(idPista, status) {
        const elemento = document.getElementById(`pista-${idPista}`);
        if (!elemento) return;
        
        elemento.classList.remove("pista-certa", "pista-errada");
        if (status === "certa") {
            elemento.classList.add("pista-certa");
        } else if (status === "errada") {
            elemento.classList.add("pista-errada");
        }
    }

    // --- SISTEMA DE VALIDAÇÃO EM TEMPO REAL CORRIGIDO ---
    function validarPistasEmTempoReal() {
        
        // Pista 5 FOCADA: Quem gosta de Uva gosta de Almôndega
        let erroPista5 = false;
        let preenchidoPista5 = false;
        for (let i = 1; i <= 5; i++) {
            const prato = getVal("Prato", i);
            const fruta = getVal("Fruta", i);
            if (prato === "Almôndega" && fruta !== "") {
                preenchidoPista5 = true;
                if (fruta !== "Uva") erroPista5 = true; // Se botou Abacaxi com Almôndega, dá ERRO!
            }
            if (fruta === "Uva" && prato !== "") {
                preenchidoPista5 = true;
                if (prato !== "Almôndega") erroPista5 = true;
            }
        }
        atualizarPistaVisual(5, preenchidoPista5 ? (erroPista5 ? "errada" : "certa") : "");

        // Pista 21: A Música está de Marrom
        let erroPista21 = false;
        let preenchidoPista21 = false;
        for (let i = 1; i <= 5; i++) {
            const talento = getVal("Talento", i);
            const camisa = getVal("Camisa", i);
            if (talento === "Música" && camisa !== "") { preenchidoPista21 = true; if (camisa !== "Marrom") erroPista21 = true; }
            if (camisa === "Marrom" && talento !== "") { preenchidoPista21 = true; if (talento !== "Música") erroPista21 = true; }
        }
        atualizarPistaVisual(21, preenchidoPista21 ? (erroPista21 ? "errada" : "certa") : "");

        // Pista 2: Na quarta posição está quem gosta de Lasanha
        const p2 = getVal("Prato", 4);
        atualizarPistaVisual(2, p2 ? (p2 === "Lasanha" ? "certa" : "errada") : "");

        // Pista 3: A candidata que gosta de Macarronada está na segunda posição
        const p3 = getVal("Prato", 2);
        atualizarPistaVisual(3, p3 ? (p3 === "Macarronada" ? "certa" : "errada") : "");

        // Pista 11: Na segunda posição está a candidata de 27 anos
        const p11 = getVal("Idade", 2);
        atualizarPistaVisual(11, p11 ? (p11 === "27 anos" ? "certa" : "errada") : "");

        // Pista 15: Macarronada exatamente à direita de Imitação
        const posMacarronada = findPos("Prato", "Macarronada");
        const posImitacao = findPos("Talento", "Imitação");
        if (posMacarronada && posImitacao) {
            atualizarPistaVisual(15, posMacarronada === posImitacao + 1 ? "certa" : "errada");
        } else {
            atualizarPistaVisual(15, "");
        }

        // Pista 18: Ludmyla exatamente à esquerda de 27 anos
        const posLudmyla = findPos("Nome", "Ludmyla");
        const pos27 = findPos("Idade", "27 anos");
        if (posLudmyla && pos27) {
            atualizarPistaVisual(18, posLudmyla === pos27 - 1 ? "certa" : "errada");
        } else {
            atualizarPistaVisual(18, "");
        }

        // Pista 19: Mary está com a camisa Azul
        let erroPista19 = false;
        let preenchidoPista19 = false;
        for (let i = 1; i <= 5; i++) {
            if (getVal("Nome", i) === "Mary" && getVal("Camisa", i) !== "") { preenchidoPista19 = true; if (getVal("Camisa", i) !== "Azul") erroPista19 = true; }
            if (getVal("Camisa", i) === "Azul" && getVal("Nome", i) !== "") { preenchidoPista19 = true; if (getVal("Nome", i) !== "Mary") erroPista19 = true; }
        }
        atualizarPistaVisual(19, preenchidoPista19 ? (erroPista19 ? "errada" : "certa") : "");

        // Pista 12: Quem tem 22 anos está exatamente à esquerda de Ruth
        const pos22 = findPos("Idade", "22 anos");
        const posRuth = findPos("Nome", "Ruth");
        if (pos22 && posRuth) {
            atualizarPistaVisual(12, pos22 === posRuth - 1 ? "certa" : "errada");
        } else {
            atualizarPistaVisual(12, "");
        }

        // Pista 6: Ruth exatamente à esquerda de Maçã
        const posMaca = findPos("Fruta", "Maçã");
        if (posRuth && posMaca) {
            atualizarPistaVisual(6, posRuth === posMaca - 1 ? "certa" : "errada");
        } else {
            atualizarPistaVisual(6, "");
        }

        // Pista 4: Ruth exatamente à esquerda de Pratinho
        const posPratinho = findPos("Prato", "Pratinho");
        if (posRuth && posPratinho) {
            atualizarPistaVisual(4, posRuth === posPratinho - 1 ? "certa" : "errada");
        } else {
            atualizarPistaVisual(4, "");
        }
    }

    tabela.addEventListener("change", validarPistasEmTempoReal);

    // Botão de verificação de vitória
    document.getElementById("btn-verificar").addEventListener("click", () => {
        let completo = true;
        const selects = tabela.querySelectorAll("select");
        selects.forEach(s => { if(s.value === "") completo = false; });

        const msgContainer = document.getElementById("mensagem-resultado");
        if (!completo) {
            msgContainer.style.color = "#f1c40f";
            msgContainer.textContent = "⚠️ Preencha todas as opções da tabela antes de verificar!";
            return;
        }

        let acertos = 0;
        let totalCampos = 0;
        linhas.forEach(linha => {
            const categoria = linha.getAttribute("data-categoria");
            for (let i = 1; i <= 5; i++) {
                totalCampos++;
                if (getVal(categoria, i) === gabarito[categoria][i - 1]) acertos++;
            }
        });

        if (acertos === totalCampos) {
            msgContainer.style.color = "#2ecc71";
            msgContainer.innerHTML = "🎉 PARABÉNS! Você solucionou o Enigma perfeitamente!";
        } else {
            msgContainer.style.color = "#e74c3c";
            msgContainer.textContent = "❌ Algumas associações estão incorretas. Confira as pistas vermelhas!";
        }
    });
});