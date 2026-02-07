window.addEventListener('load', () => {
    const botao = document.getElementById('gerarPdf');

    botao.addEventListener('click', async () => {
        botao.style.display = 'none';

        const { jsPDF } = window.jspdf;

        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });

        const elemento = document.getElementById('documento');

        const canvas = await html2canvas(elemento, {
            scale: 2, // 🔥 ALTA RESOLUÇÃO
            useCORS: true,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');

        const pageWidth = 210;
        const pageHeight = 297;

        const margin = 10;
        const imgWidth = pageWidth - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let y = margin;

        // 🔹 SE PASSAR DE UMA PÁGINA, QUEBRA
        if (imgHeight > pageHeight - margin * 2) {
            let heightLeft = imgHeight;
            let position = 0;

            doc.addImage(imgData, 'PNG', margin, y, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
        } else {
            doc.addImage(imgData, 'PNG', margin, y, imgWidth, imgHeight);
        }

        doc.save('ficha-inscricao-projeto.pdf');

        botao.style.display = 'block';
    });
});