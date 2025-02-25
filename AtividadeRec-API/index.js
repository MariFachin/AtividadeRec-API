const express = require('express');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const processamentoFila = require('./processamentoFila');

const app = express();
app.use(express.json());

let indexacao = {};

async function atualizarIndexacao() {
  const todosPedidos = JSON.parse(await fs.readFile('todosPedidos.json', 'utf-8'));
  indexacao = {};
  todosPedidos.forEach((pedido, index) => {
    indexacao[pedido.id] = index;
  });
}

app.post('/todosPedidos', async (req, res) => {
  const pedido = { id: uuidv4(), ...req.body, status: 'pendente' };
  const todosPedidos = JSON.parse(await fs.readFile('todosPedidos.json', 'utf-8'));
  todosPedidos.push(pedido);
  await fs.writeFile('todosPedidos.json', JSON.stringify(todosPedidos, null, 2));
  await atualizarIndexacao();
  processamentoFila.adicionar(pedido);
  res.status(201).json(pedido);
});

app.get('/todosPedidos', async (req, res) => {
  const todosPedidos = JSON.parse(await fs.readFile('todosPedidos.json', 'utf-8'));
  res.json(todosPedidos);
});

app.get('/pedido/:id', async (req, res) => {
  const todosPedidos = JSON.parse(await fs.readFile('todosPedidos.json', 'utf-8'));
  const index = indexacao[req.params.id];
  if (index === undefined) {
    return res.status(404).send('Pedido não encontrado');
  }
  res.json(todosPedidos[index]);
});

app.put('/pedido/:id', async (req, res) => {
  const todosPedidos = JSON.parse(await fs.readFile('todosPedidos.json', 'utf-8'));
  const index = indexacao[req.params.id]; 
  if (index === undefined) {
    return res.status(404).send('Pedido não encontrado');
  }
  todosPedidos[index] = { ...todosPedidos[index], ...req.body };
  await fs.writeFile('todosPedidos.json', JSON.stringify(todosPedidos, null, 2));
  await atualizarIndexacao();
  res.json(todosPedidos[index]);
});

app.delete('/pedido/:id', async (req, res) => {
  const todosPedidos = JSON.parse(await fs.readFile('todosPedidos.json', 'utf-8'));
  const index = indexacao[req.params.id];
  if (index === undefined) {
    return res.status(404).send('Pedido não encontrado');
  }
  todosPedidos.splice(index, 1);
  await fs.writeFile('todosPedidos.json', JSON.stringify(todosPedidos, null, 2));
  await atualizarIndexacao(); 
  res.status(204).send();
});

atualizarIndexacao();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ativo ${PORT}`);
});