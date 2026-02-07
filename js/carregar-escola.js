document.addEventListener('DOMContentLoaded', () => {
    const dados = localStorage.getItem('inscricaoProjeto');

    if (!dados) {
        alert('Nenhuma inscrição encontrada.');
        return;
    }

    const inscricao = JSON.parse(dados);

    // 🧒 Aluno
    document.getElementById('alunoNome').value = inscricao.aluno.nome;
    document.getElementById('alunoNascimento').value = inscricao.aluno.dataNascimento;
    document.getElementById('alunoEscola').value = inscricao.aluno.escola;

    // 👤 Responsável
    document.getElementById('responsavelNome').value = inscricao.assinaturaResponsavel.nome;

});