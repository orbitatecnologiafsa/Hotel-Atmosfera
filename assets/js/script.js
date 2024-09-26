document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.btn');
    const inputCPF = document.getElementById('cpf');
    const inputSala = document.getElementById('sala');
    const inputNome = document.getElementById('nome');
    const inputData = document.getElementById('data');
    const keyboardCPF = document.querySelector('.keyboardcpf');
    const keyboardContainer = document.querySelector('.keyboard');
    let selectedInput = null;

    function showKeyboard(keyboard) {
        hideKeyboards();
        keyboard.classList.add('active');
        console.log('Keyboard shown:', keyboard);
    }

    function hideKeyboards() {
        keyboardCPF.classList.remove('active');
        keyboardContainer.classList.remove('active');
        console.log('Keyboards hidden');
    }

    function formatarCPF(input) {

        let cpf = input.value.replace(/\D/g, '');
        if (cpf.length > 11) {
            cpf = cpf.slice(0, 11);
        }
        if (cpf.length <= 11) {
            cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
            cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
            cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        input.value = cpf;
    }

    function formatarData(input) {
      
        let data = input.value.replace(/\D/g, '');
        if (data.length > 8) {
            data = data.slice(0, 8);
        }
        if (data.length <= 8) {
            data = data.replace(/(\d{2})(\d)/, '$1/$2');
            data = data.replace(/(\d{2})(\d)/, '$1/$2');
            data = data.replace(/(\d{2})(\d{2})$/, '$1$2');
        }
        input.value = data;
    }

    inputCPF.addEventListener('click', function () {
        selectedInput = this;
        showKeyboard(keyboardCPF);
    });

    inputData.addEventListener('click', function () {
        selectedInput = this;
        showKeyboard(keyboardCPF);
    });

    inputSala.addEventListener('click', function () {
        selectedInput = this;
        showKeyboard(keyboardContainer);
    });

    inputNome.addEventListener('click', function () {
        selectedInput = this;
        showKeyboard(keyboardContainer);
    });

    inputCPF.addEventListener('focus', function () {
        selectedInput = this;
        showKeyboard(keyboardCPF);
    });

    inputData.addEventListener('focus', function () {
        selectedInput = this;
        showKeyboard(keyboardCPF);
    });

    inputSala.addEventListener('focus', function () {
        selectedInput = this;
        showKeyboard(keyboardContainer);
    });

    inputNome.addEventListener('focus', function () {
        selectedInput = this;
        showKeyboard(keyboardContainer);
    });

    document.addEventListener('click', function (event) {
        if (!keyboardContainer.contains(event.target) && 
            !keyboardCPF.contains(event.target) && 
            event.target !== inputCPF && 
            event.target !== inputSala && 
            event.target !== inputNome &&
            event.target !== inputData) {
            hideKeyboards();
        }
    });

    keyboardContainer.addEventListener('click', function (event) {
        event.stopPropagation();
    });

    keyboardCPF.addEventListener('click', function (event) {
        event.stopPropagation();
    });

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (selectedInput) {
                selectedInput.value += btn.innerText;
                if (selectedInput == inputCPF) {
                    formatarCPF(selectedInput);
                }
                if (selectedInput == inputData) {
                    formatarData(selectedInput);
                }
            }
        });
    });

    document.querySelector('.delete').addEventListener('click', () => {
        if (selectedInput) {
            selectedInput.value = selectedInput.value.slice(0, -1);
            if (selectedInput === inputCPF) {
                formatarCPF(selectedInput);
            }
        }
    });

    document.getElementById('delete').addEventListener('click', () => {
        if (selectedInput) {
            selectedInput.value = selectedInput.value.slice(0, -1);
        }
    });

    

    document.querySelector('.space').addEventListener('click', (event) => {
        event.preventDefault();
        if (selectedInput) {
            selectedInput.value += ' ';
        }
    });
    

    document.querySelector('.shift').addEventListener('click', () => {
        buttons.forEach(btn => {
            btn.classList.toggle('upper');
            btn.innerText = btn.classList.contains('upper') ? btn.innerText.toUpperCase() : btn.innerText.toLowerCase();
        });
    });

    const cpfInput = document.getElementById('cpf');

    if (cpfInput) {
        cpfInput.addEventListener('input', function () {
            formatarCPF(this);
        });
    } else {
        console.error('Elemento do campo de CPF não encontrado.');
    }

const form = document.getElementById('form');

const dados = {
    name: '',
    sala: '',
    data: '',
    cpf: ''
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    if(inputCPF.value.length < 14){
        alert('Por favor, preencha o campo de CPF corretamente.');
        return;
    }
    const nome = document.getElementById('nome').value;
    const sala = document.getElementById('sala').value;
    const data = document.getElementById('data').value;
    const cpf = document.getElementById('cpf').value;
    
    dados.name = nome;
    dados.sala = sala;
    dados.data = converterParaISO(data);
    dados.cpf = cpf;
    
    localStorage.setItem('dados', JSON.stringify(dados));
    window.location.href = './foto.html';
    });
});

function converterParaISO(dataStr) {
    const [dia, mes, ano] = dataStr.split('/');
    const data = new Date(`${ano}-${mes}-${dia}T00:00:00`);
    return data.toISOString();
}