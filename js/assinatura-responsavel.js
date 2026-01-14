document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('assinaturaCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let desenhando = false;

    function ajustarCanvas() {
        const ratio = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * ratio;
        canvas.height = rect.height * ratio;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(ratio, ratio);

        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';
    }

    ajustarCanvas();
    window.addEventListener('resize', ajustarCanvas);

    // 🔥 FUNÇÃO CORRIGIDA (remove o deslocamento)
    function posicao(e) {
        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        if (e.touches) {
            return {
                x: (e.touches[0].clientX - rect.left) * scaleX,
                y: (e.touches[0].clientY - rect.top) * scaleY
            };
        }

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    // ===== MOUSE =====
    canvas.addEventListener('mousedown', (e) => {
        desenhando = true;
        const p = posicao(e);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!desenhando) return;
        const p = posicao(e);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    });

    canvas.addEventListener('mouseup', () => desenhando = false);
    canvas.addEventListener('mouseleave', () => desenhando = false);

    // ===== TOQUE (CELULAR) =====
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        desenhando = true;
        const p = posicao(e);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
    });

    canvas.addEventListener('touchmove', (e) => {
        if (!desenhando) return;
        e.preventDefault();
        const p = posicao(e);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    });

    canvas.addEventListener('touchend', () => desenhando = false);

    // ===== LIMPAR ASSINATURA =====
    const btnLimpar = document.getElementById('limparAssinatura');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
    }
});