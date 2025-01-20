// Obtém referências aos elementos de vídeo, botão e canvas
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const fotografar = document.getElementById('fotografar');
const div_btn_enviar_cancelar = document.getElementById('btn-cancelar-enviar');
const enviar = document.getElementById('enviar');
const cancelar = document.getElementById('cancelar');

// Define a resolução do canvas para ser maior, aumentando a qualidade da foto
canvas.width = 1920; // Largura maior para uma imagem de alta resolução (Full HD)
canvas.height = 1080; // Altura correspondente

// Solicita permissão para usar a câmera
navigator.mediaDevices.getUserMedia({ video: { width: 1920, height: 1080 } }) // Solicita resolução de vídeo mais alta
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

    // Salva a imagem como data URL com qualidade de 0.9 (90% de qualidade para JPEG)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9); // Ajusta a qualidade para 90%
    console.log(dataUrl);

    video.style.display = 'none';
    fotografar.style.display = 'none';

    // Mostrar a foto tirada no canvas
    div_btn_enviar_cancelar.style.display = 'flex';
    canvas.style.display = 'block';
});

enviar.addEventListener('click', async () => {
    const dataUrl = canvas.toDataURL('image/png', 1.0); // Use 1.0 para a melhor qualidade

    const dados = JSON.parse(localStorage.getItem('dados'));

    dados.imagem = dataUrl;

    try {
        // Envia os dados (incluindo a imagem) para a API do servidor
        const response = await fetch('http://localhost:3000/api/cadastrarPessoa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)  // Envia o objeto atualizado com a imagem
        });

        if (response.ok) {
            const resultado = await response.json();
            console.log('Pessoa cadastrada com sucesso:', resultado);
            window.location.href = '/finalizado';
        } else {
            console.error('Erro ao cadastrar pessoa:', response.statusText);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
});

cancelar.addEventListener('click', () => {
    video.style.display = 'block';
    fotografar.style.display = 'block';
    div_btn_enviar_cancelar.style.display = 'none';
    canvas.style.display = 'none';
});
