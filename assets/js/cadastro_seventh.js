const axios = require('axios');
const base64Img = require('base64-img');
const express = require('express');


const app = express();
app.use(express.json());

//OBJETO PESSOA:

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
}

//SERVIDOR

app.post('/api/cadastrarPessoa', (req, res) => {
    const { nome, sala, data, cpf, imagem } = req.body;
    
    console.log('Pessoa recebida:', req.body);

    pessoa.name = nome;
    pessoa.birthday = data;
    pessoa.cpf = cpf;
    pessoa.company = sala;

    logar(imagem);
    // Lógica de salvar no banco de dados, etc.

    res.status(200).json({ message: 'Pessoa cadastrada com sucesso!' });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

// Informações de login
const loginURL = 'http://10.1.1.101:8080/api/login';

const peopleURL = 'http://10.1.1.101:8080/api/accounts/1000/people';

const loginData = {
  username: 'admin',
  password: 'atmosfera123'
};

let sessionCookie = null; // Variável para armazenar o cookie de sessão



// Função de login
async function logar(imagem) {
    try {
        const response = await axios.put(loginURL, loginData, {
        withCredentials: true, // Garante que cookies sejam manipulados
        });

        // Captura o cookie de sessão
        const setCookieHeader = response.headers['set-cookie'];
        if (setCookieHeader) {
            sessionCookie = setCookieHeader.find(cookie => cookie.startsWith('Seventh.Auth'));
            console.log('Cookie de sessão obtido:', sessionCookie);
            await cadastrarPessoa(imagem);
        } else {
            throw new Error('Cookie de sessão não foi retornado');
        }

        return response.data; // Retorna os dados de login se necessário
    } catch (error) {
        console.error('Erro durante o login:', error);
        throw error;
    }
}
async function cadastrarPessoa(imagem) {
    try {
        const response = await axios.post(peopleURL, pessoa, {
        headers: {
            'Content-Type': 'application/json',  // Define o tipo de conteúdo como JSON
            Cookie: sessionCookie               // Passa o cookie de autenticação
        }
        });
        // Exibe a resposta
        console.log('Pessoa cadastrada com sucesso:', response.data.id); //retorna o ID

        await enviarImagemPessoa(response.data.id,imagem);
    } catch (error) {
      console.error('Erro ao cadastrar pessoa:', error.response ? error.response.data : error.message);
    }
}

async function enviarImagemPessoa(id,imagem) {
    try {
    
        const imageUploadURL = `http://10.1.1.101:8080/api/accounts/1000/people/${id}/image`;
        const caminhoImagem = imagem;
    
        // Converte a imagem para Base64
        base64Img.base64(caminhoImagem, function(err, data) {
            if (err) {
                console.error('Erro ao converter imagem para Base64:', err);
                return;
            }
    
            // Cria o corpo da requisição com a imagem em Base64
            const requestBody = {
            base64: data.split(',')[1] // Remove o prefixo data:image/jpeg;base64, da string Base64
            };
    
            // Faz a requisição POST para enviar a imagem
            axios.put(imageUploadURL, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': sessionCookie, // Passa o cookie de autenticação
            }
            })
            .then(response => {
            // Exibe a resposta de sucesso
                console.log('Imagem enviada com sucesso:', response.data);
                cadastrarAcesso(id);
            })
            .catch(error => {
                if (error.response) {
                    console.error('Erro ao enviar imagem:', error.response.status, error.response.data);
                } else {
                    console.error('Erro ao enviar imagem:', error.message);
                }
            });
        });
    } catch (error) {
        console.error('Erro na função enviarImagemPessoa:', error.message);
    }
}
async function cadastrarAcesso(id) {
    try {

        console.log("ID: " + id);
        const accountId = 1000; 
        const personId = id; 

        const accessData = {
            pin: null, 
            active: true,
            type: 3,
            startDate: "2024-09-17T18:04:23.552Z",
            validity: "2024-09-18T18:04:23.552Z"
        };
    
          const response = await axios.post(`http://10.1.1.101:8080/api/accounts/${accountId}/people/${personId}/access`,
            accessData,
            {
              headers: {
                'Content-Type': 'application/json',
                'Cookie': sessionCookie
              }
            }
          );
      
          await sincronizarDispositivo(accountId, personId);

        console.log('Acesso cadastrado com sucesso:', response.data);
    } catch (error) {
      console.error('Erro ao cadastrar acesso:', error.response ? error.response.data : error.message);
    }
}

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
    }
}