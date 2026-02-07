document.addEventListener('DOMContentLoaded', () => {

    const dados = JSON.parse(localStorage.getItem('inscricaoProjeto'));

    if (!dados) {
        alert('Nenhuma inscrição encontrada.');
        return;
    }

    console.log('📄 Dados carregados:', dados);

    // ==========================
    // DADOS DO ALUNO
    // ==========================

    if (dados.aluno?.foto) {
        document.getElementById('fotoAlunoDocumento').src = dados.aluno.foto;
    }
    document.getElementById('alunoNome').innerText = dados.aluno?.nome || '';
    document.getElementById('alunoNascimento').innerText = formatarData(dados.aluno?.dataNascimento);

    document.getElementById('alunoDocumento').innerText =
        `${dados.aluno?.documento?.tipo || ''} - ${dados.aluno?.documento?.numero || ''}`;

    document.getElementById('alunoEndereco').innerText = dados.aluno?.endereco?.rua || '';
    document.getElementById('alunoNumero').innerText = dados.aluno?.endereco?.numero || '';
    document.getElementById('alunoComplemento').innerText = dados.aluno?.endereco?.complemento || '';
    document.getElementById('alunoBairro').innerText = dados.aluno?.endereco?.bairro || '';
    document.getElementById('alunoEscola').innerText = dados.aluno?.escola || '';

    // ==========================
    // RESPONSÁVEIS
    // ==========================
    document.getElementById('paiNome').innerText = dados.responsaveis?.pai?.nome || '';
    document.getElementById('paiTelefone').innerText = dados.responsaveis?.pai?.telefone || '';

    document.getElementById('maeNome').innerText = dados.responsaveis?.mae?.nome || '';
    document.getElementById('maeTelefone').innerText = dados.responsaveis?.mae?.telefone || '';

    document.getElementById('emergenciaNome').innerText = dados.responsaveis?.emergencia?.nome || '';
    document.getElementById('emergenciaTelefone').innerText = dados.responsaveis?.emergencia?.telefone || '';

    // ==========================
    // NÚCLEO
    // ==========================
    document.getElementById('nucleo').innerText = dados.nucleo || '';
    document.getElementById('turno').innerText = dados.turno || '';

    // ==========================
    // AUTORIZAÇÕES
    // ==========================
    document.getElementById('usoImagem').innerText =
        dados.autorizacoes?.usoImagem
            ? '✔ Responsável autoriza o uso de imagem'
            : '✖ Responsável NÃO autoriza o uso de imagem';

    document.getElementById('cienteRegras').innerText =
        dados.autorizacoes?.cienteRegras
            ? '✔ Responsável declara estar ciente das regras'
            : '✖ Responsável NÃO declarou ciência das regras';

    // ==========================
    // ASSINATURA DO RESPONSÁVEL
    // ==========================
    if (dados.assinaturaResponsavel?.imagem) {
        document.getElementById('assinaturaResponsavel').src =
            dados.assinaturaResponsavel.imagem;
    }

    // ==========================
    // ASSINATURA DA ESCOLA
    // ==========================
    if (dados.confirmacaoEscola?.assinaturaEscola) {
        document.getElementById('assinaturaEscola').src =
            dados.confirmacaoEscola.assinaturaEscola;
    }

    // ==========================
    // STATUS / CONTROLE ADM
    // ==========================
    document.getElementById('status').innerText =
        traduzirStatus(dados.status);

    document.getElementById('criadoEm').innerText =
        formatarDataHora(dados.criadoEm);

    document.getElementById('confirmadoEm').innerText =
        dados.confirmacaoEscola?.confirmadoEm
            ? formatarDataHora(dados.confirmacaoEscola.confirmadoEm)
            : 'Ainda não confirmado pela escola';

});


// ==========================
// FUNÇÕES AUXILIARES
// ==========================
function formatarData(data) {
    if (!data) return '';
    return new Date(data).toLocaleDateString('pt-BR');
}

function formatarDataHora(data) {
    if (!data) return '';
    return new Date(data).toLocaleString('pt-BR');
}

function traduzirStatus(status) {
    const mapa = {
        aguardando_escola: 'Aguardando confirmação da escola',
        confirmado_escola: 'Confirmado pela escola'
    };
    return mapa[status] || status;
}