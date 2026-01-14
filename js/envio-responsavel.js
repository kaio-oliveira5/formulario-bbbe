document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formInscricao');
    const canvas = document.getElementById('assinaturaCanvas');

    if (!form || !canvas) {
        console.error('Formulário ou canvas não encontrado');
        return;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // 🔴 Validação da assinatura
        if (canvasVazio(canvas)) {
            alert('A assinatura do responsável é obrigatória.');
            return;
        }

        // 🔹 Coletar dados do formulário
        const dadosInscricao = {
            aluno: {
                nome: document.getElementById('nomeAluno').value,
                dataNascimento: document.getElementById('dataNascimento').value,
                cpf: document.getElementById('cpfAluno').value,
                endereco: document.getElementById('endereco').value,
                bairro: document.getElementById('bairro').value,
                escola: document.getElementById('escolaAluno').value
            },

            responsaveis: {
                pai: {
                    nome: document.getElementById('nomePai').value,
                    telefone: document.getElementById('telefonePai').value
                },
                mae: {
                    nome: document.getElementById('nomeMae').value,
                    telefone: document.getElementById('telefoneMae').value
                },
                emergencia: {
                    nome: document.getElementById('contatoEmergencia').value,
                    telefone: document.getElementById('telefoneEmergencia').value
                }
            },

            nucleo: document.getElementById('nucleo').value,
            turno: document.getElementById('turnoTreino').value,

            autorizacoes: {
                usoImagem: document.getElementById('usoImagem').checked,
                cienteRegras: document.getElementById('cienteRegras').checked
            },

            assinaturaResponsavel: {
                nome: document.getElementById('nomeResponsavel').value,
                data: document.getElementById('dataAssinatura').value,
                imagem: canvas.toDataURL('image/png')
            },

            status: 'aguardando_escola',
            criadoEm: new Date().toISOString()
        };

        // 🔹 Salvar no localStorage
        localStorage.setItem('inscricaoProjeto', JSON.stringify(dadosInscricao));

        console.log('Inscrição salva:', dadosInscricao);

        // 🔹 Redirecionar para escola
        window.location.href = 'responsavel-sucesso.html';
    });

    // 🔹 Função para verificar se o canvas está vazio
    function canvasVazio(canvas) {
        const blank = document.createElement('canvas');
        blank.width = canvas.width;
        blank.height = canvas.height;
        return canvas.toDataURL() === blank.toDataURL();
    }
});