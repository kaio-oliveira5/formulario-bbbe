document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formEscola');
    const canvas = document.getElementById('assinaturaEscola');
    const dataAssinatura = document.getElementById('dataAssinatura');
    const declaracao = document.getElementById('declaracao');

    if (!form || !canvas) {
        console.error('Formulário ou canvas não encontrado');
        return;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // 🔒 Valida data
        if (!dataAssinatura.value) {
            alert('Informe a data da assinatura.');
            return;
        }

        // 🔒 Valida declaração
        if (!declaracao.checked) {
            alert('É necessário confirmar a declaração.');
            return;
        }

        // 🔒 Valida assinatura
        if (canvasVazio(canvas)) {
            alert('A assinatura do diretor é obrigatória.');
            return;
        }

        // 📥 Buscar inscrição existente
        const inscricaoSalva = localStorage.getItem('inscricaoProjeto');

        if (!inscricaoSalva) {
            alert('Nenhuma inscrição encontrada.');
            return;
        }

        const dados = JSON.parse(inscricaoSalva);

        // 📷 Assinatura em base64
        dados.confirmacaoEscola = {
            dataAssinaturaEscola: dataAssinatura.value,
            assinaturaEscola: canvas.toDataURL('image/png'),
            confirmadoEm: new Date().toISOString()
        };

        // 🔄 Atualiza status
        dados.status = 'confirmado_escola';

        // 💾 Salva novamente no localStorage
        localStorage.setItem('inscricaoProjeto', JSON.stringify(dados));

        console.log('Inscrição atualizada pela escola:', dados);

        // ✅ Redireciona
        window.location.href = 'sucesso-escola.html';
    });

    function canvasVazio(canvas) {
        const blank = document.createElement('canvas');
        blank.width = canvas.width;
        blank.height = canvas.height;
        return canvas.toDataURL() === blank.toDataURL();
    }
});