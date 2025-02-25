const Fila = require('./fila');

class ProcessamentoFila {
  constructor() {
    this.fila = new Fila();
    this.processando = false;
  }

  adicionar(pedido) {
    this.fila.adicionar(pedido);
    if (!this.processando) {
      this.processar();
    }
  }

  async processar() {
    if (this.fila.estaVazia()) {
      this.processando = false;
      return;
    }

    this.processando = true;
    const pedido = this.fila.remover();
    pedido.status = 'preparando';
    await this.atualizarPedido(pedido);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    pedido.status = 'entregue';
    await this.atualizarPedido(pedido);
    this.processar();
  }

  async atualizarPedido(pedido) {
    const fs = require('fs').promises;
    const todosPedidos = JSON.parse(await fs.readFile('todosPedidos.json', 'utf-8'));
    const index = todosPedidos.findIndex((p) => p.id === pedido.id);
    todosPedidos[index] = pedido;
    await fs.writeFile('todosPedidos.json', JSON.stringify(todosPedidos, null, 2));
  }
}

module.exports = new ProcessamentoFila();