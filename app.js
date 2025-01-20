const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();

// Configuração do servidor
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Servir arquivos estáticos da pasta "assets"
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Servir os arquivos HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Página inicial
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'cadastro.html')); // Página de cadastro
});

app.get('/foto', (req, res) => {
    res.sendFile(path.join(__dirname, 'foto.html')); // Página de foto
});

app.get('/finalizado', (req, res) => {
    res.sendFile(path.join(__dirname, 'finalizado.html')); // Página finalizado
});

// OBJETO PESSOA
const pessoa = {
    name: "",
    active: true,
    personType: 3,
    cpf: "",
    birthday: "",
    company: "",
    personProfileId: 3,
    responsible: true,
    personProfileName: 'Visitante',
    accessPermission: true
};

// ROTAS
app.post('/api/cadastrarPessoa', (req, res) => {
    const { name, sala, data, cpf, imagem } = req.body;

    console.log('Pessoa recebida:', req.body);

    pessoa.name = name;
    pessoa.birthday = data;
    pessoa.cpf = cpf;
    pessoa.company = sala;

    logar(imagem)
        .then(() => {
            res.status(200).json({ message: 'Pessoa cadastrada com sucesso!' });
        })
        .catch(error => {
            console.error('Erro ao processar cadastro:', error.message);
            res.status(500).json({ error: 'Erro ao cadastrar pessoa' });
        });
});

// Informações de login
const loginURL = 'http://10.1.1.101:8080/api/login';
const peopleURL = 'http://10.1.1.101:8080/api/accounts/1000/people';
const loginData = {
    username: 'admin',
    password: 'atmosfera123'
};
let sessionCookie = null;

// Função de login
async function logar(imagem) {
    try {
        const response = await axios.put(loginURL, loginData, {
            withCredentials: true,
        });

        const setCookieHeader = response.headers['set-cookie'];
        if (setCookieHeader) {
            sessionCookie = setCookieHeader.find(cookie => cookie.startsWith('Seventh.Auth'));
            console.log('Cookie de sessão obtido:', sessionCookie);
            await cadastrarPessoa(imagem);
        } else {
            throw new Error('Cookie de sessão não foi retornado');
        }
    } catch (error) {
        console.error('Erro durante o login:', error);
        throw error;
    }
}

// Função para cadastrar pessoa
async function cadastrarPessoa(imagem) {
    try {
        const response = await axios.post(peopleURL, pessoa, {
            headers: {
                'Content-Type': 'application/json',
                Cookie: sessionCookie
            }
        });

        console.log('Pessoa cadastrada com sucesso:', response.data.id);
        await enviarImagemPessoa(response.data.id, imagem);
    } catch (error) {
        console.error('Erro ao cadastrar pessoa:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Função para enviar imagem da pessoa
async function enviarImagemPessoa(id, imagem) {
    try {
        const imageUploadURL = `http://10.1.1.101:8080/api/accounts/1000/people/${id}/image`;
        const base64Image = imagem.split(',')[1];

        const requestBody = { base64: base64Image };

        const response = await axios.put(imageUploadURL, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': sessionCookie,
            }
        });

        console.log('Imagem enviada com sucesso:', response.data);
        await cadastrarAcesso(id);
    } catch (error) {
        console.error('Erro ao enviar imagem:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Função para cadastrar acesso
async function cadastrarAcesso(id) {
    try {
        const accountId = 1000;
        const personId = id;

        const accessData = {
            pin: null,
            active: true,
            type: 3,
            startDate: "2028-09-17T18:04:23.552Z",
            validity: "2028-09-26T18:04:23.552Z"
        };

        const response = await axios.post(`http://10.1.1.101:8080/api/accounts/${accountId}/people/${personId}/access`, accessData, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': sessionCookie
            }
        });

        console.log('Acesso cadastrado com sucesso:', response.data);
        await sincronizarDispositivo(accountId, personId);
    } catch (error) {
        console.error('Erro ao cadastrar acesso:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Função para sincronizar dispositivo
async function sincronizarDispositivo(accountId, personId) {
    try {
        const syncUrl = `http://10.1.1.101:8080/api/accounts/${accountId}/people/${personId}/synchronize`;

        const syncResponse = await axios.put(syncUrl, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': sessionCookie
            }
        });

        console.log('Sincronização realizada com sucesso:', syncResponse.data);
    } catch (error) {
        console.error('Erro ao sincronizar o dispositivo:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
