class NoFila {
    constructor(valor) {
      this.valor = valor;
      this.proximo = null;
    }
  }
  
  class Fila {
    constructor() {
      this.primeiro = null;
      this.ultimo = null;
      this.tamanho = 0;
    }
  
    adicionar(valor) {
      const novoNo = new NoFila(valor);
      if (!this.primeiro) {
        this.primeiro = novoNo;
        this.ultimo = novoNo;
      } else {
        this.ultimo.proximo = novoNo;
        this.ultimo = novoNo;
      }
      this.tamanho++;
    }
  
    remover() {
      if (!this.primeiro) {
        return null;
      }
      const pedidoRemovido = this.primeiro.valor;
      this.primeiro = this.primeiro.proximo;
      if (!this.primeiro) {
        this.ultimo = null;
      }
      this.tamanho--;
      return pedidoRemovido;
    }
  
    peek() {
      if (!this.primeiro) {
        return null;
      }
      return this.primeiro.valor;
    }
  
    estaVazia() {
      return this.tamanho === 0;
    }
  
    getTamanho() {
      return this.tamanho;
    }
  }
  
  module.exports = Fila;