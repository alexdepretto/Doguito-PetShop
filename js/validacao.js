
'use strict'

// APLICAÇÃO DE DATA //
const validadores = {
  dataNascimento:input => validarData(input),
  cpf:input => validarCPF(input),
  cep:input => recuperarCEP(input)
};

//TIPOS DE ERRO
const tiposErro = [
  'valueMissing',
  'typeMismatch',
  'patternMismatch',
  'customError'
];

// MENSAGENS DE ERRO //
const mensagensErro = {
  nome: {
    valueMissing: 'O campo nome não pode estar em branco.'
  },
  email: {
    valueMissing: 'O campo email não pode estar em branco.',
    typeMismatch: 'O email digitado não é válido.'
  },
  senha: {
    valueMissing: 'O campo senha não pode estar em branco.',
    patternMismatch: 'A senha deve conter de 6 a 12 caracteres, pelo menos 1 letra minúscula, 1 letra maiúscula, 1 número e não conter caracteres especiais.'
  },
  dataNascimento: {
    valueMissing: 'O campo data de nascimento não pode estar em branco.',
    customError: 'Você tem que ser maior de 18 anos para se cadastrar.'
  },
  cpf: {
    valueMissing: 'O campo CPF não pode estar em branco.',
    customError: 'O CPF digitado não é válido.'
  },
  cep: {
    valueMissing: 'O campo CEP não pode estar em branco.',
    patternMismatch: 'O CEP digitado não é válido.',
    customError: 'Não foi possível localizar o CEP.'
  },
  logradouro: {
    valueMissing: 'O campo logradouro não pode estar em branco.',
  },
  cidade: {
    valueMissing: 'O campo cidade não pode estar em branco.',
  },
  estado: {
    valueMissing: 'O campo estado não pode estar em branco.',
  },
  preco: {
    valueMissing: 'O campo preço não pode estar em branco.',
  },
};

function exibirMensagemErro(tipoInput, input) {
  let mensagem = '';
  tiposErro.forEach( (erro) => {
    if(input.validity[erro]) {
      mensagem = mensagensErro[tipoInput][erro];
    }
  })
  return mensagem;
}

// VALIDAÇÃO DE DADOS //
export function validacao(input) {
  const tipoInput = input.dataset.tipo;

  if(validadores[tipoInput]) { validadores[tipoInput](input); }

  if(input.validity.valid) {
    input.parentElement.classList.remove('input-container--invalido');
    input.parentElement.querySelector('.input-mensagem-erro').innerHTML = '';
  }
  else {
    input.parentElement.classList.add('input-container--invalido');
    input.parentElement.querySelector('.input-mensagem-erro').innerHTML = exibirMensagemErro(tipoInput, input);
  }
}

// DATA DE NASCIMENTO //
function validarData(input) {
  const dataCadastrada = new Date(input.value); // Utiliza a data cadastrada
  const dataHoje = new Date(); // Utiliza da data de hoje
  let mensagem = '';
  let idade = new Date(dataCadastrada.getUTCFullYear() + 18, dataCadastrada.getUTCMonth(), dataCadastrada.getUTCDate());

  // A pessoa só vai ser maior de idade depois da data de hoje
  if(idade >= dataHoje) { mensagem = 'Você tem que ser maior de 18 anos para se cadastrar.'; }
  
  input.setCustomValidity(mensagem);
}

// CPF //
function validarCPF(input) {
  const cpf = input.value.replace(/\D/g, '');
  let mensagem = '';
  if(checarCPFRepetido(cpf) == false || checarCPFMatematica(cpf) == false) {
    mensagem = 'O CPF digitado não é válido.';
  }
  input.setCustomValidity(mensagem);
}

function checarCPFRepetido(cpf) {
  const repeticao = [
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999'
  ];
  let cpfValido = true;
  repeticao.forEach( valor => {
    if(valor == cpf) { cpfValido = false; }
  })
  return cpfValido;
}

function checarCPFMatematica(cpf) {
  const multiplicador = 10;
  return checarDigitoVerificador(cpf, multiplicador);
}

function checarDigitoVerificador(cpf, multiplicador) {
  if (multiplicador >= 12) { return true; }
  let multiplicadorInicial = multiplicador;
  let soma = 0;
  let digitos = cpf.substr(0, multiplicador - 1).split('');
  let digitoVerficador = cpf.charAt(multiplicador - 1);

  for(let i = 0; multiplicadorInicial > 1; multiplicadorInicial--) {
    soma = soma + digitos[i]*multiplicadorInicial;
    i++;
  }
  let digito = 11 - (soma % 11)
  if(digitoVerficador == digito) {
    return checarDigitoVerificador(cpf, multiplicador + 1);
  }
  else { return false; }
}


// ENDEREÇO //
function recuperarCEP(input) {
  const cep = input.value.replace(/\D/g, '');
  const url = `https://viacep.com.br/ws/${cep}/json/`;
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    }
  }
  if(!input.validity.patternMismatch && !input.validity.valueMissing) {
    fetch(url, options)
    .then( response => response.json()
    ).then( data => {
      if(data.erro) {
        input.setCustomValidity('Não foi possível localizar o CEP.');
        return;
      }
      input.setCustomValidity('');
      const logradouro = document.querySelector('[data-tipo="logradouro"]');
      const cidade = document.querySelector('[data-tipo="cidade"]');
      const estado = document.querySelector('[data-tipo="estado"]');
    
      logradouro.value = data.logradouro;
      cidade.value = data.localidade;
      estado.value = data.uf;
      return;
    })
  }
}
