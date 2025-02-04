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

app.get('/temounaoconta', (req, res) => {
    res.sendFile(path.join(__dirname, 'temounaoconta.html')); // Página de cadastro
});
app.get('/jatenhconta', (req, res) => {
    res.sendFile(path.join(__dirname, 'jatenhconta.html')); // Página de cadastro
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
    responsible: false,
    personProfileName: 'Visitante',
    accessPermission: true
};

// ROTAS
app.post('/api/reativarPessoa', async (req, res) => {
    const { cpf } = req.body;
    console.log("CPF RECEBIDO", cpf);
    pessoa.cpf = cpf;

    try {
        await logarReativado();
        res.status(200).json({ message: 'Pessoa reativada com sucesso!' });
    } catch (error) {
        if (error.message === 'Pessoa não encontrada') {
            res.status(404).json({message: 'Pessoa não encontrada. Redirecionando para a página de cadastro.' });
        } else {
            console.error('Erro ao reativar pessoa:', error.message);
            res.status(500).json({ error: 'Erro ao reativar pessoa' });
        }
    }
});

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
const loginURL = 'http://10.1.1.21:8080/api/login';
const peopleURL = 'http://10.1.1.21:8080/api/accounts/1000/people';
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
            await verificarCadastro(pessoa.cpf, imagem);
        } else {
            throw new Error('Cookie de sessão não foi retornado');
        }
    } catch (error) {
        console.error('Erro durante o login:', error);
        throw error;
    }
}

async function logarReativado() {
    try {
        const response = await axios.put(loginURL, loginData, {
            withCredentials: true,
        });

        const setCookieHeader = response.headers['set-cookie'];
        if (setCookieHeader) {
            sessionCookie = setCookieHeader.find(cookie => cookie.startsWith('Seventh.Auth'));
            console.log('Cookie de sessão obtido:', sessionCookie);
            await verificarCadastro2(pessoa.cpf);
        } else {
            throw new Error('Cookie de sessão não foi retornado');
        }
    } catch (error) {
        console.error('Erro durante o login:', error);
        throw error;
    }
}
// Funcao para verificar se ja há a pessoa cadastrada

async function verificarCadastro(cpf, imagem) {
    try {
        const response = await axios.get(`${peopleURL}`, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': sessionCookie,
            },
            params: {
                'pagination.filters.cpf': cpf, // Filtra diretamente pelo CPF
            },
        });

        const pessoas = response.data.people;

        if (!pessoas || pessoas.length === 0) {
            console.log('Pessoa não cadastrada');
            console.log({ cpf });
            cadastrarPessoa(imagem);
            return;
        }
        console.log("AQUI O CPF:", cpf);
        const pessoa = pessoas[0]; // Como estamos filtrando por CPF, deve retornar no máximo uma pessoa.

        if (pessoa) {
            console.log("AQUI O CPF:", cpf);
            console.log('Pessoa já cadastrada e está ativa:', pessoa);
            throw new Error('Pessoa ja cadastrada');
        } 
        
    } catch (error) {
        console.error('Erro ao verificar cadastro:', error.response ? error.response.data : error.message);
        throw error;
    }
}

//Funcao para verificar cadastro2

async function verificarCadastro2(cpf) {
    try {
        const response = await axios.get(`${peopleURL}`, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': sessionCookie,
            },
            params: {
                'pagination.filters.cpf': cpf, // Filtra diretamente pelo CPF
            },
        });

        const pessoas = response.data.people;

        if (!pessoas || pessoas.length === 0) {
            console.log('Pessoa não cadastrada');
            throw new Error('Pessoa não encontrada');
        }

        const pessoa = pessoas[0]; // Como estamos filtrando por CPF, deve retornar no máximo uma pessoa.
        console.log("AQUI O CPF:", cpf);
        if (pessoa) {
            console.log('Pessoa já cadastrada e está ativa 2:', pessoa);
            console.log("teste", pessoa.active)
            await cadastrarAcesso2(pessoa.id);
        }
    } catch (error) {
        console.error('Erro ao verificar cadastro:', error.response ? error.response.data : error.message);
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
        const imageUploadURL = `http://10.1.1.21:8080/api/accounts/1000/people/${id}/image`;
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
        const startDateVar = new Date(); // Obtém a data e hora atuais
        const validityDateVar = new Date(startDateVar); // Clona a data inicial

        validityDateVar.setDate(startDateVar.getDate() + 1); // Adiciona 1 dia

        // Converte para o formato ISO 8601 (padrão esperado)
        const startDateI = startDateVar.toISOString();
        const validityI = validityDateVar.toISOString();
        const accessData = {
            pin: null,
            active: true,
            type: 3,
            startDate: startDateI,
            validity: validityI
        };

        const response = await axios.post(`http://10.1.1.21:8080/api/accounts/${accountId}/people/${personId}/access`, accessData, {
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


async function cadastrarAcesso2(id) {
    try {
        const accountId = 1000;
        const personId = id;
        const startDateVar = new Date(); // Obtém a data e hora atuais
        const validityDateVar = new Date(startDateVar); // Clona a data inicial

        validityDateVar.setDate(startDateVar.getDate() + 1); // Adiciona 1 dia

        // Converte para o formato ISO 8601 (padrão esperado)
        const startDateI = startDateVar.toISOString();
        const validityI = validityDateVar.toISOString();
        const accessData = {
            pin: null,
            active: true,
            type: 3,
            startDate: startDateI,
            validity: validityI
        };

        const response = await axios.put(`http://10.1.1.21:8080/api/accounts/${accountId}/people/${personId}/access`, accessData, {
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
        const syncUrl = `http://10.1.1.21:8080/api/accounts/${accountId}/people/${personId}/synchronize`;

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
