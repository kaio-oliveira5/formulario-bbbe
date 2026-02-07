

// document.addEventListener('DOMContentLoaded', () => {
//     const form = document.getElementById('formInscricao');
//     const canvas = document.getElementById('assinaturaCanvas');
//     const inputFoto = document.getElementById('fotoAluno');

//     if (!form || !canvas) {
//         console.error('Formulário ou canvas não encontrado');
//         return;
//     }

//     // 🔧 Tamanho fixo do canvas (evita bug de canvas vazio)
//     canvas.width = 400;
//     canvas.height = 150;

//     form.addEventListener('submit', (e) => {
//         e.preventDefault();
//         const botaoEnviar = document.getElementById('btnEnviar');

//         botaoEnviar.disabled = true;
//         botaoEnviar.classList.add('botao-loading');
//         botaoEnviar.innerText = 'Enviando inscrição...'

//         // 🔴 Validação da assinatura
//         if (canvasVazio(canvas)) {
//             alert('A assinatura do responsável é obrigatória.');
//             return;
//         }

//         // 🔹 Função principal
//         const salvarInscricao = (fotoBase64 = null) => {
//             const dadosInscricao = {
//                 aluno: {
//                     nome: document.getElementById('nomeAluno').value,
//                     dataNascimento: document.getElementById('dataNascimento').value,

//                     documento: {
//                         tipo: document.getElementById('tipoDocumentoAluno').value,
//                         numero: document.getElementById('documentoAluno').value
//                     },

//                     endereco: {
//                         rua: document.getElementById('endereco').value,
//                         numero: document.getElementById('numero').value,
//                         complemento: document.getElementById('complemento').value,
//                         bairro: document.getElementById('bairro').value
//                     },

//                     escola: document.getElementById('escolaAluno').value,

//                     // 📸 FOTO DO ALUNO
//                     foto: fotoBase64
//                 },

//                 responsaveis: {
//                     pai: {
//                         nome: document.getElementById('nomePai').value,
//                         telefone: document.getElementById('telefonePai').value
//                     },
//                     mae: {
//                         nome: document.getElementById('nomeMae').value,
//                         telefone: document.getElementById('telefoneMae').value
//                     },
//                     emergencia: {
//                         nome: document.getElementById('contatoEmergencia').value,
//                         telefone: document.getElementById('telefoneEmergencia').value
//                     }
//                 },

//                 nucleo: document.getElementById('nucleo').value,
//                 turno: document.getElementById('turnoTreino').value,

//                 autorizacoes: {
//                     usoImagem: document.getElementById('usoImagem').checked,
//                     cienteRegras: document.getElementById('cienteRegras').checked
//                 },

//                 assinaturaResponsavel: {
//                     nome: document.getElementById('nomeResponsavel').value,
//                     data: document.getElementById('dataAssinatura').value,
//                     imagem: canvas.toDataURL('image/png')
//                 },

//                 status: 'aguardando_escola',
//                 criadoEm: new Date().toISOString()
//             };

//             localStorage.setItem('inscricaoProjeto', JSON.stringify(dadosInscricao));

//             console.log('📦 Inscrição salva:', dadosInscricao);

//             window.location.href = 'responsavel-sucesso.html';
//         };

//         // 📸 Carrega foto antes de salvar
//         if (inputFoto && inputFoto.files.length > 0) {
//             const file = inputFoto.files[0];
//             const reader = new FileReader();

//             reader.onload = () => salvarInscricao(reader.result);
//             reader.readAsDataURL(file);
//         } else {
//             salvarInscricao(null);
//         }
//     });

//     // 🔹 Verifica se canvas está vazio
//     function canvasVazio(canvas) {
//         const blank = document.createElement('canvas');
//         blank.width = canvas.width;
//         blank.height = canvas.height;
//         return canvas.toDataURL() === blank.toDataURL();
//     }
// });

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formInscricao');
    const canvas = document.getElementById('assinaturaCanvas');
    const inputFoto = document.getElementById('fotoAluno');
    const botaoEnviar = form?.querySelector('button[type="submit"]');

    if (!form || !canvas || !botaoEnviar) {
        console.error('Formulário, canvas ou botão não encontrado');
        return;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // 🔴 VALIDA ASSINATURA (ÚNICO ALERTA DO SISTEMA)
        if (canvasVazio(canvas)) {
            alert('A assinatura do responsável é obrigatória.');
            return;
        }

        // 🔵 ATIVA LOADING APENAS APÓS VALIDAÇÃO
        botaoEnviar.disabled = true;
        botaoEnviar.innerText = 'Enviando...';

        const salvarInscricao = (fotoBase64 = '') => {
            try {
                const dadosInscricao = {
                    aluno: {
                        nome: document.getElementById('nomeAluno').value,
                        dataNascimento: document.getElementById('dataNascimento').value,
                        documento: {
                            tipo: document.getElementById('tipoDocumentoAluno').value,
                            numero: document.getElementById('documentoAluno').value
                        },
                        endereco: {
                            rua: document.getElementById('endereco').value,
                            numero: document.getElementById('numero').value,
                            complemento: document.getElementById('complemento').value,
                            bairro: document.getElementById('bairro').value
                        },
                        escola: document.getElementById('escolaAluno').value,
                        foto: fotoBase64
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

                localStorage.setItem(
                    'inscricaoProjeto',
                    JSON.stringify(dadosInscricao)
                );

                window.location.href = 'responsavel-sucesso.html';

            } catch (err) {
                console.error('Erro ao salvar inscrição:', err);
                alert('Erro ao enviar inscrição. Tente novamente.');

                botaoEnviar.disabled = false;
                botaoEnviar.innerText = 'Enviar para a Escola';
            }
        };

        // 📸 FOTO DO ALUNO
        if (inputFoto && inputFoto.files.length > 0) {
            const reader = new FileReader();
            reader.onload = () => salvarInscricao(reader.result);
            reader.readAsDataURL(inputFoto.files[0]);
        } else {
            salvarInscricao('');
        }
    });

    // 🔹 VERIFICA SE CANVAS ESTÁ VAZIO
    function canvasVazio(canvas) {
        const blank = document.createElement('canvas');
        blank.width = canvas.width;
        blank.height = canvas.height;
        return canvas.toDataURL() === blank.toDataURL();
    }
});