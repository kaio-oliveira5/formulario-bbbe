const form = document.getElementById('formInscricao');

form.addEventListener('submit', function (e) {
    // ⚠️ NÃO usa preventDefault aqui
    // quem controla o envio é o envio-responsavel.js

    let valido = true;

    // DOCUMENTO (CPF / RG)
    const tipoDocumento = document.getElementById('tipoDocumentoAluno');
    const documentoAluno = document.getElementById('documentoAluno');
    const erroDocumento = document.getElementById('erroCpfAluno');

    if (tipoDocumento.value === '' || documentoAluno.value.trim() === '') {
        erroDocumento.textContent = 'Informe o tipo e o número do documento';
        erroDocumento.style.display = 'block';
        valido = false;
    } else {
        erroDocumento.textContent = '';
        erroDocumento.style.display = 'none';
    }

    // ❌ REMOVIDO:
    // - validação de assinatura
    // - alert
    // - form.submit()

    if (!valido) {
        e.preventDefault(); // bloqueia envio se algo estiver inválido
    }
});