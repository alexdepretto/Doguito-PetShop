
'use strict'

import { validacao } from "./validacao.js";

const entradas = document.querySelectorAll('input');

entradas.forEach( (input) => {
  if(input.dataset.tipo === 'preco') {
    SimpleMaskMoney.setMask(input, {
      prefix: 'R$ ',
      fixed: true,
      fractionDigits: 2,
      decimalSeparator: ',',
      thousandsSeparator: '.',
      cursor: 'end'
    })
  }
  input.addEventListener('blur', (evento) => {
    validacao(evento.target);
  })
})
