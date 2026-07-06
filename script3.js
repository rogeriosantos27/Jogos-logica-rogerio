// Solução correta do Enigma 3 baseada estritamente nas pistas fornecidas
const solucaoCorreta = {
    1: { camiseta: "Preta", nome: "Isadora", hamburguer: "Sem alface", refrigerante: "Cajuína", idade: "15", esporte: "Vôlei" },
    2: { camiseta: "Amarela", nome: "Nikaelly", hamburguer: "Bem passado", refrigerante: "Guaraná", idade: "12", esporte: "Futebol" },
    3: { camiseta: "Azul", nome: "Luna", hamburguer: "Bacon extra", refrigerante: "Coca Cola", idade: "11", esporte: "Corrida" },
    4: { camiseta: "Vermelha", nome: "Damarys", hamburguer: "Onion rings", refrigerante: "Fanta Uva", idade: "14", esporte: "Basquete" },
    5: { camiseta: "Verde", nome: "Emilly", hamburguer: "Sem cebola", refrigerante: "Pepsi", idade: "13", esporte: "Carimba" }
};

function verificarRespostas() {
    const colunas = document.querySelectorAll('.coluna');
    let acertouTudo = true;
    let algumVazio = false;

    // Remove classes antigas de validação antes de testar novamente
    colunas.forEach(coluna => {
        coluna.classList.remove('coluna-correta', 'coluna-errada');
    });

    colunas.forEach(coluna => {
        const pos = coluna.getAttribute('data-pos');
        const selects = coluna.querySelectorAll('.select-enigma');
        let colunaCorreta = true;

        selects.forEach(select => {
            const categoria = select.getAttribute('data-categoria');
            const valorSelecionado = select.value;

            if (!valorSelecionado) {
                algumVazio = true;
                colunaCorreta = false;
            } else if (solucaoCorreta[pos][categoria] !== valorSelecionado) {
                colunaCorreta = false;
            }
        });

        // Aplica feedback visual na coluna
        if (colunaCorreta) {
            coluna.classList.add('coluna-correta');
        } else {
            coluna.classList.add('coluna-errada');
            acertouTudo = false;
        }
    });

    const msgElement = document.getElementById('mensagem-resultado');

    if (algumVazio) {
        msgElement.innerHTML = "⚠️ Por favor, preencha todos os campos antes de conferir!";
        msgElement.style.color = "#f1c40f";
        return;
    }

    if (acertouTudo) {
        msgElement.innerHTML = "🎉 PARABÉNS! Você desvendou o enigma 'Amigas na Lanchonete' perfeitamente!";
        msgElement.style.color = "#2ecc71";
    } else {
        msgElement.innerHTML = "❌ Algumas combinações estão incorretas. Reveja as pistas e tente novamente!";
        msgElement.style.color = "#e74c3c";
    }
}