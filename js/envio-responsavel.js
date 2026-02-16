
import { db } from './firebase.js';
import {
    collection,
    addDoc,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formInscricao');
    const canvas = document.getElementById('assinaturaCanvas');
    const inputFoto = document.getElementById('fotoAluno');
    const botaoEnviar = form?.querySelector('button[type="submit"]');

    if (!form || !canvas || !botaoEnviar) {
        console.error('Formulário, canvas ou botão não encontrado');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 🔴 Valida assinatura
        if (canvasVazio(canvas)) {
            alert('A assinatura do responsável é obrigatória.');
            return;
        }

        // 🩺 SAÚDE – Sim / Não
        const saudeRadio = document.querySelector('input[name="saudePossui"]:checked');
        const saudePossui = saudeRadio?.value || '';

        if (!saudePossui) {
            alert('Informe se o aluno possui algum problema de saúde.');
            return;
        }

        const saudeDetalhesEl = document.getElementById('saudeDetalhes');
        const saudeDetalhes = (saudeDetalhesEl?.value || '').trim();

        if (saudePossui === 'sim' && saudeDetalhes.length === 0) {
            alert('Descreva o problema de saúde do aluno.');
            saudeDetalhesEl?.focus();
            return;
        }

        botaoEnviar.disabled = true;
        botaoEnviar.innerText = 'Enviando...';

        const salvarInscricao = async (fotoBase64 = '') => {
            try {
                // 📦 Dados da inscrição
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
                        foto: fotoBase64,
                        saude: {
                            possui: saudePossui,
                            detalhes: saudePossui === 'sim' ? saudeDetalhes : ''
                        }
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

                // 🔥 Salva inscrição no Firestore
                const docRef = await addDoc(
                    collection(db, 'inscricoes'),
                    dadosInscricao
                );

                console.log('Inscrição salva. ID:', docRef.id);

                // 🏫 Busca dados da escola (coleção: "escola")
                const escolaId = dadosInscricao.aluno.escola;
                const escolaRef = doc(db, 'escola', escolaId);
                const escolaSnap = await getDoc(escolaRef);

                if (!escolaSnap.exists()) {
                    throw new Error('Escola não encontrada: ' + escolaId);
                }

                const dadosEscola = escolaSnap.data() || {};
                const emailEscola = (dadosEscola.email || '').trim();

                // ✅ evita "Olá, undefined"
                const nomeEscola =
                    (dadosEscola.nome && String(dadosEscola.nome).trim()) ||
                    'Equipe da escola';

                if (!emailEscola) {
                    throw new Error('E-mail da escola não cadastrado: ' + escolaId);
                }

                // 🔗 Link para a escola (produção)
                const linkEscola = `https://bbbe-formulario.web.app/escola.html?id=${docRef.id}`;

                // ✉️ Mensagem (mais explicativa + contato)
                const assunto = 'Projeto Bom de Bola Bom na Escola – Confirmação Escolar';

                const mensagemHtml = `
            <div style="font-family: Arial, sans-serif; line-height:1.6; color:#222">
            <h2 style="margin:0 0 12px 0">Projeto Bom de Bola Bom na Escola</h2>

            <p style="margin:0 0 10px 0">Olá, <strong>${nomeEscola}</strong>.</p>

            <p style="margin:0 0 10px 0">
            Você está recebendo este e-mail porque um(a) responsável realizou uma nova inscrição no
            Projeto Bom de Bola Bom na Escola e informou esta unidade escolar.
            </p>

            <p style="margin:0 0 10px 0">
            <strong>Aluno(a):</strong> ${dadosInscricao.aluno.nome}<br>
            <strong>Responsável:</strong> ${dadosInscricao.assinaturaResponsavel.nome}
            </p>

            <p style="margin:0 0 10px 0">
            Para confirmar que o(a) aluno(a) está matriculado(a) nesta unidade e realizar a assinatura
            da confirmação escolar, acesse o link abaixo:
            </p>

            <p style="margin:0 0 14px 0">
            <a href="${linkEscola}" target="_blank" style="font-weight:bold">
                Acessar formulário de confirmação da escola
            </a>
            </p>

            <hr style="border:none; border-top:1px solid #e6e6e6; margin:16px 0">

            <p style="margin:0; font-size:13px; color:#555">
            Em caso de dúvidas, entre em contato com a <strong>Secretaria de Esportes, Lazer e Juventude</strong>.<br>
            <strong>Contato:</strong> (54) 3433-2952
            </p>

            <p style="margin:10px 0 0 0; font-size:12px; color:#777">
            Município de Carlos Barbosa
            </p>
        </div>
        `;

                // 🚀 Envia e-mail via Apps Script
                const resp = await fetch(
                    'https://script.google.com/macros/s/AKfycbzVzgaI3_0EPTOulMZe4_5dogCu_F7poL1lDE-ULy66n7K4M2T3liI9FNSydyaOOUpn/exec',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                        body: JSON.stringify({
                            emailDestino: emailEscola,
                            assunto,
                            mensagemHtml
                            // CC já é fixo no Apps Script (bomdebola@...)
                        })
                    }
                );

                // ✅ se o Apps Script responder com JSON, valida
                let json = null;
                try {
                    json = await resp.json();
                } catch (_) { }

                if (!resp.ok || (json && json.ok === false)) {
                    throw new Error('Falha no envio do e-mail: ' + (json?.erro || resp.statusText));
                }

                // Guarda ID local (opcional)
                localStorage.setItem('inscricaoId', docRef.id);

                window.location.href = 'responsavel-sucesso.html';

            } catch (err) {
                console.error('Erro no envio:', err);
                alert('Erro ao enviar a inscrição.');

                botaoEnviar.disabled = false;
                botaoEnviar.innerText = 'Enviar para a Escola';
            }
        };

        // 📸 Foto
        if (inputFoto && inputFoto.files.length > 0) {
            const reader = new FileReader();
            reader.onload = () => salvarInscricao(reader.result);
            reader.readAsDataURL(inputFoto.files[0]);
        } else {
            salvarInscricao('');
        }
    });

    // ✍️ Verifica se canvas está vazio
    function canvasVazio(canvasEl) {
        const ctx = canvasEl.getContext('2d');
        const pixels = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height).data;
        return !Array.from(pixels).some(channel => channel !== 0);
    }
});