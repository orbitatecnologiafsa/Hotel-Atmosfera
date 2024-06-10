// TECLADO VIRTUAL
document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.btn');
    const textarea = document.querySelectorAll('input');

    let selectedInput = null;

    // Adiciona evento de clique para cada campo de entrada
    textarea.forEach(input => {
        input.addEventListener('click', function () {
            selectedInput = this;
        });
    });

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (selectedInput) {
                selectedInput.value += btn.innerText;
            }
        });
    });

    // Função para deletar o último caractere do campo de entrada selecionado
    document.querySelector('.delete').addEventListener('click', () => {
        if (selectedInput) {
            selectedInput.value = selectedInput.value.slice(0, -1);
        }
    });

    // Função para adicionar espaço ao campo de entrada selecionado
    document.querySelector('.space').addEventListener('click', () => {
        if (selectedInput) {
            selectedInput.value += ' ';
        }
    });

    // Função para alternar entre maiúsculas e minúsculas
    document.querySelector('.shift').addEventListener('click', () => {
        buttons.forEach(btn => {
            btn.classList.toggle('upper');
        });
    });
});

//Cadastro

const form = document.getElementById('form');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const cpf = document.getElementById('cpf').value;

    if(!validarCpf(cpf)){
        alert('CPF inválido');
        return;
    }
    const nome = document.getElementById('nome').value;
    const local = document.getElementById('local').value;
    const data = document.getElementById('data').value;
    
    const dados = {
        nome,
        local,
        data,
        cpf
    };
    window.location.href = './foto.html';
});


// Validar CPF

function validarCpf(cpf){

    let Soma = 0;
    let Resto = 0;

    if(cpf == "00000000000"){
        return false;
    }
    if(cpf.length != 11){
        return false;
    }
    for (i=1; i<=9; i++){
        Soma = Soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)){
        Resto = 0;
    } 
    if (Resto != parseInt(cpf.substring(9, 10))){
        return false;
    } 

    Soma = 0;
    for (i = 1; i <= 10; i++){
        Soma = Soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
    }

    Resto = (Soma * 10) % 11;
      
    if ((Resto == 10) || (Resto == 11)) {
        Resto = 0;
    }
        
    if (Resto != parseInt(cpf.substring(10, 11))){
        return false;
    }
       
    return true;
}