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
    const local = document.getElementById('local').value;
    const data = document.getElementById('data').value;
    const cpf = document.getElementById('cpf').value;
    const dados = {
        local,
        data,
        cpf
    };
    window.location.href = './foto.html';
});