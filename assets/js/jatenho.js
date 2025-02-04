document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.btn');
    const inputCPF = document.getElementById('cpf');
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


    inputCPF.addEventListener('click', function () {
        selectedInput = this;
        showKeyboard(keyboardCPF);
    });

    document.addEventListener('click', function (event) {
        if (!keyboardContainer.contains(event.target) && 
            !keyboardCPF.contains(event.target) && 
            event.target !== inputCPF) {
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
    cpf: ''
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    if(inputCPF.value.length < 14){
        alert('Por favor, preencha o campo de CPF corretamente.');
        return;
    }

    const cpf = document.getElementById('cpf').value;
    
    dados.cpf = cpf;
    
    localStorage.setItem('dados', JSON.stringify(dados));
    });
});




// Exemplo de modal usando SweetAlert2
function mostrarModalCadastro() {
    Swal.fire({
        title: 'Pessoa não encontrada!',
        text: 'Deseja se cadastrar ou tentar novamente?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ir para Cadastro',
        cancelButtonText: 'Tentar novamente',
        reverseButtons: true,
        width: '400px', // Reduzindo a largura do modal
        customClass: {
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            htmlContainer: 'swal-custom-text',
            confirmButton: 'swal-custom-confirm',
            cancelButton: 'swal-custom-cancel',
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Redirecionar para a página de cadastro
            window.location.href = '/cadastro';
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.close();
        }
    });
}

const btnReativar = document.getElementById('cadastrar');

btnReativar.addEventListener('click', function () {
    try {
        fetch('/api/reativarPessoa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cpf }),
        })
            .then(response => {
                if (response.status === 404) {
                    return response.json().then(data => {
                        if (data.message === 'Pessoa não encontrada') {
                            mostrarModalCadastro();
                        }
                    });
                } else if (response.ok) {
                    window.location.href = '/finalizado';
                } else {
                    throw new Error('Erro inesperado');
                }
            })
            .catch(error => console.error('Erro:', error));
    } catch (error) {
        console.error('Erro:', error);
    }
});

