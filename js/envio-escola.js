document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formEscola');
    const canvas = document.getElementById('assinaturaEscola');
    const dataAssinatura = document.getElementById('dataAssinatura');
    const declaracao = document.getElementById('declaracao');

    if (!form || !canvas) {
        console.error('Formulário ou canvas não encontrado');
        return;
    }

    const ctx = canvas.getContext('2d');

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

        // 📷 Assinatura em base64
        const assinaturaBase64 = canvas.toDataURL('image/png');

        // 📦 Objeto final da escola
        const confirmacaoEscola = {
            dataAssinaturaEscola: dataAssinatura.value,
            assinaturaEscola: assinaturaBase64,
            status: 'confirmado_escola',
            confirmadoEm: new Date().toISOString()
        };

        console.log('Confirmação da escola:', confirmacaoEscola);

        /*
            🔜 AQUI ENTRA O FIREBASE (depois):
            - buscar inscrição pelo ID da URL
            - atualizar documento com:
            confirmacaoEscola
            status = confirmado_escola
        */

        // ✅ Redireciona para sucesso
        window.location.href = 'sucesso-escola.html';
    });

    // 🧼 Verifica se o canvas está vazio
    function canvasVazio(canvas) {
        const blank = document.createElement('canvas');
        blank.width = canvas.width;
        blank.height = canvas.height;
        return canvas.toDataURL() === blank.toDataURL();
    }
});