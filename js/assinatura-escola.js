document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('assinaturaEscola');
    const btnLimpar = document.getElementById('limparAssinatura');

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let desenhando = false;

    function ajustarCanvas() {
        const ratio = window.devicePixelRatio || 1;
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;

        canvas.width = width * ratio;
        canvas.height = height * ratio;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(ratio, ratio);
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';
    }

    ajustarCanvas();
    window.addEventListener('resize', ajustarCanvas);

    // MOUSE
    canvas.addEventListener('mousedown', (e) => {
        desenhando = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!desenhando) return;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    });

    canvas.addEventListener('mouseup', () => desenhando = false);
    canvas.addEventListener('mouseleave', () => desenhando = false);

    // TOUCH
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        desenhando = true;

        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];

        ctx.beginPath();
        ctx.moveTo(
            touch.clientX - rect.left,
            touch.clientY - rect.top
        );
    });

    canvas.addEventListener('touchmove', (e) => {
        if (!desenhando) return;
        e.preventDefault();

        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];

        ctx.lineTo(
            touch.clientX - rect.left,
            touch.clientY - rect.top
        );
        ctx.stroke();
    });

    canvas.addEventListener('touchend', () => desenhando = false);

    // LIMPAR
    if (btnLimpar) {
        btnLimpar.addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
        });
    }
});
