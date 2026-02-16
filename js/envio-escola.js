
import { db } from './firebase.js';
import { doc, getDoc, runTransaction } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ===== CONFIG =====
const SITE_BASE = 'https://bbbe-formulario.web.app';
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzVzgaI3_0EPTOulMZe4_5dogCu_F7poL1lDE-ULy66n7K4M2T3liI9FNSydyaOOUpn/exec';
const EMAIL_SECRETARIA = 'bomdebola@carlosbarbosa.rs.gov.br';

// ✅ Mapa: ID técnico -> Nome amigável (somente exibição)
const ESCOLAS_MAP = {
    escola_antonio_adriano_guerra: 'Escola Antônio Adriano Guerra',
    escola_aparecida: 'Escola Aparecida',
    escola_carlos_barbosa: 'Escola Carlos Barbosa',
    escola_dom_vital: 'Escola Dom Vital',
    escola_elisa_tramontina: 'Escola Elisa Tramontina',
    escola_jose_chies: 'Escola Prefeito José Chies',
    escola_papepi: 'Escola Padre Pedro Piccoli',
    escola_sao_roque: 'Escola São Roque',
    escola_santa_rosa: 'Escola Santa Rosa',
    escola_cardeal_arcoverde: 'Escola Cardeal Arcoverde',
    escola_bordini: 'Escola Salvador Bordini',

};

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('formEscola');
    const canvas = document.getElementById('assinaturaEscola');
    const dataAssinatura = document.getElementById('dataAssinatura');
    const declaracao = document.getElementById('declaracao');

    // Campos readonly
    const alunoNome = document.getElementById('alunoNome');
    const alunoNascimento = document.getElementById('alunoNascimento');
    const alunoEscola = document.getElementById('alunoEscola');
    const responsavelNome = document.getElementById('responsavelNome');
    const linkDocumento = document.getElementById('linkDocumento');

    const btnSubmit = form?.querySelector('button[type="submit"]') || null;

    if (!form || !canvas) return;

    // ✅ ID via URL: escola.html?id=XXXX
    const params = new URLSearchParams(window.location.search);
    const inscricaoId = params.get('id');

    if (!inscricaoId) {
        alert('Link inválido. Peça um novo link para a Secretaria.');
        bloquearFormulario(form);
        return;
    }

    const docRef = doc(db, 'inscricoes', inscricaoId);

    // Guardar dados para o e-mail final
    let dadosInscricao = null;

    // ✅ Carrega inscrição
    try {
        const snap = await getDoc(docRef);

        if (!snap.exists()) {
            alert('Inscrição não encontrada. Verifique o link ou contate a Secretaria.');
            bloquearFormulario(form);
            return;
        }

        dadosInscricao = snap.data();

        // ✅ Se já foi confirmado, bloqueia a tela (evita reenvio)
        if (dadosInscricao?.status === 'confirmado_escola' || dadosInscricao?.confirmacaoEscola?.assinaturaEscola) {
            alert('Este link já foi utilizado para confirmar a inscrição.');
            bloquearFormulario(form);
            // opcional: já manda direto pra tela de sucesso
            window.location.href = 'sucesso-escola.html';
            return;
        }

        if (alunoNome) alunoNome.value = dadosInscricao?.aluno?.nome || '';
        if (alunoNascimento) alunoNascimento.value = dadosInscricao?.aluno?.dataNascimento || '';

        // ✅ Escola com nome amigável
        if (alunoEscola) {
            const escolaId = (dadosInscricao?.aluno?.escola || '').trim();
            alunoEscola.value = ESCOLAS_MAP[escolaId] || escolaId;
        }

        if (responsavelNome) responsavelNome.value = dadosInscricao?.assinaturaResponsavel?.nome || '';

        // Link “visualizar documento”
        if (linkDocumento) {
            const assinaturaResp = dadosInscricao?.assinaturaResponsavel?.imagem || '';
            if (assinaturaResp) {
                linkDocumento.href = assinaturaResp;
                linkDocumento.style.pointerEvents = 'auto';
                linkDocumento.style.opacity = '1';
            } else {
                linkDocumento.href = '#';
                linkDocumento.style.pointerEvents = 'none';
                linkDocumento.style.opacity = '0.6';
                linkDocumento.textContent = '📄 Documento não disponível';
            }
        }

    } catch (err) {
        alert('Falha ao carregar a inscrição. Tente novamente ou contate a Secretaria.');
        bloquearFormulario(form);
        return;
    }

    // ✅ Submit: valida + atualiza Firestore + envia e-mail final para secretaria
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!dataAssinatura.value) {
            alert('Informe a data da assinatura.');
            return;
        }

        if (!declaracao.checked) {
            alert('É necessário confirmar a declaração.');
            return;
        }

        if (canvasVazio(canvas)) {
            alert('A assinatura do diretor é obrigatória.');
            return;
        }

        try {
            // trava botão
            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.textContent = 'Enviando...';
            }

            const confirmacaoEscola = {
                dataAssinaturaEscola: dataAssinatura.value,
                assinaturaEscola: canvas.toDataURL('image/png'),
                confirmadoEm: new Date().toISOString()
            };

            // 🔒 Transaction: impede reenvio
            await runTransaction(db, async (transaction) => {
                const snapAtual = await transaction.get(docRef);

                if (!snapAtual.exists()) throw new Error('Inscrição não encontrada.');

                const atual = snapAtual.data();

                if (atual?.status === 'confirmado_escola' || atual?.confirmacaoEscola?.assinaturaEscola) {
                    throw new Error('ja-confirmado');
                }

                transaction.update(docRef, {
                    confirmacaoEscola,
                    status: 'confirmado_escola'
                });
            });

            // tenta enviar e-mail (se falhar, não trava)
            try {
                await enviarEmailFinalSecretaria({
                    inscricaoId,
                    dadosInscricao,
                    dataAssinaturaEscola: dataAssinatura.value
                });
            } catch (_) {
                // não trava o fluxo
            }

            // já desabilita tudo antes de sair
            bloquearFormulario(form);

            // Redireciona
            window.location.href = 'sucesso-escola.html';

        } catch (err) {
            // ✅ Se já estava confirmado, avisa e bloqueia
            if (err?.message === 'ja-confirmado') {
                alert('Esta inscrição já foi confirmada anteriormente.');
                bloquearFormulario(form);
                window.location.href = 'sucesso-escola.html';
                return;
            }

            alert('Erro ao confirmar a inscrição. Tente novamente.');

            if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.textContent = 'Confirmar e Assinar';
            }
        }
    });

    function canvasVazio(canvasEl) {
        const ctx = canvasEl.getContext('2d');
        const pixels = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height).data;
        return !Array.from(pixels).some(channel => channel !== 0);
    }
});

function bloquearFormulario(form) {
    form?.querySelectorAll('input, button, textarea, select').forEach(el => {
        el.disabled = true;
    });
}

// ===== Envio do e-mail final (Secretaria) =====
async function enviarEmailFinalSecretaria({ inscricaoId, dadosInscricao, dataAssinaturaEscola }) {
    const aluno = dadosInscricao?.aluno || {};
    const resp = dadosInscricao?.assinaturaResponsavel || {};

    const escolaId = (aluno.escola || '').trim();
    const nomeEscola = ESCOLAS_MAP[escolaId] || escolaId || '—';

    const linkDocumentoFinal = `${SITE_BASE}/documento-final.html?id=${encodeURIComponent(inscricaoId)}`;

    const assunto = `Projeto BBBE – Documento final pronto (${nomeEscola})`;

    const mensagemHtml = `
    <div style="font-family: Arial, sans-serif; line-height:1.6">
    <h2>✅ Documento final disponível – Projeto Bom de Bola Bom na Escola</h2>

    <p>A escola <strong>${escapeHtml(nomeEscola)}</strong> confirmou uma inscrição.</p>

    <p>
        <strong>Aluno:</strong> ${escapeHtml(aluno.nome || '—')}<br>
        <strong>Responsável:</strong> ${escapeHtml(resp.nome || '—')}<br>
        <strong>Data da assinatura da escola:</strong> ${escapeHtml(dataAssinaturaEscola || '—')}
    </p>

    <p>Para visualizar e baixar o PDF (com foto e assinaturas), acesse:</p>

    <p>
        <a href="${linkDocumentoFinal}" target="_blank" rel="noopener">
        Abrir Documento Final / Baixar PDF
        </a>
    </p>
    </div>
`;

    const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        keepalive: true,
        body: JSON.stringify({
            emailDestino: EMAIL_SECRETARIA,
            assunto,
            mensagemHtml
        })
    });

    const text = await res.text();

    let parsed = null;
    try { parsed = JSON.parse(text); } catch { /* ignore */ }

    if (!res.ok) throw new Error(`Apps Script HTTP ${res.status}: ${text}`);
    if (parsed && parsed.ok === false) throw new Error(parsed.erro || 'Apps Script retornou ok=false');
}

// ===== util: escapar HTML básico =====
function escapeHtml(str) {
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}