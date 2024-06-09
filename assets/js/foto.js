// Obtém referências aos elementos de vídeo, botão e canvas
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const fotografar = document.getElementById('fotografar');
const div_btn_enviar_cancelar = document.getElementById('btn-cancelar-enviar');
const enviar = document.getElementById('enviar');
const cancelar = document.getElementById('cancelar');
// Solicita permissão para usar a câmera
navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        // Exibe o feed da câmera no elemento de vídeo
        video.srcObject = stream;
        video.play();
    })
    .catch((err) => {
        console.error(`Erro ao acessar a câmera: ${err}`);
    });

// Adiciona um evento ao botão para tirar a foto
fotografar.addEventListener('click', () => {

    // Desenha o quadro atual do vídeo no canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Salva a imagem como data URL e exibe a imagem no console (pode ser ajustado para salvar ou enviar a imagem)
    const dataUrl = canvas.toDataURL('image/png');
    console.log(dataUrl);

    video.style.display = 'none';
    fotografar.style.display = 'none';



    // mostrar a foto tirada no canvas
    div_btn_enviar_cancelar.style.display = 'flex';
    canvas.style.display = 'block';
});

enviar.addEventListener('click', () => {
    const dataUrl = canvas.toDataURL('image/png');
    window.location.href = 'finalizado.html';
    console.log(dataUrl);
});

cancelar.addEventListener('click', () => {
    video.style.display = 'block';
    fotografar.style.display = 'block';
    div_btn_enviar_cancelar.style.display = 'none';
    canvas.style.display = 'none';
});
