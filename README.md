# Lista de Tarefas

## Sobre o projeto

Este é um To-do List desenvolvido com Angular, permitindo gerenciar tarefas com:

- Criação de tarefas
- Edição de tarefas
- Exclusão de tarefas
- Marcação de tarefas como concluídas
- Filtros: Todos, Ativos e Concluídos
- Feedblack via notificações

O projeto foi criado para demonstrar o bom uso de componentes, eventos e templates reativos no Angular.

## Tecnologias Utilizadas

- Angular
- TypeScript 
- SASS
- Node.js + Express (backend)

## Funcionalidades

- Criar novas tarefas
- Editar tarefas existentes
- Marcar/desmarcar como concluídas
- Fitrar tarefas: Todos, Ativos, Concluídos
- Limpar todas as tarefas concluídas

## Dependência da API
Este projeto depende de uma API backend desenvolvida em Node.js + Express para gerenciar as tarefas.

Link da API - https://github.com/davimilioli/to-do-list-api

### Requisitos
- A API deve estar rodando antes de iniciar o frontend
- Endpoints utilizados pelo frontend:
 - `GET /todo` → Listar todas as tarefas
 - `POST /todo` → Criar nova tarefa
 - `PUT /todo/:id` → Atualizar tarefa
 - `DELETE /todo/:id` → Excluir tarefa

>Obs: Se a API não estiver disponível, o frontend não conseguirá carregar, criar ou atualizar tarefas

## Pré-requisitos

- Node.js
- Angular

## Rodar o projeto

### 1. Instalar dependências
```bash
    npm install
```

### 2. Iniciar ambiente de desenvolvimento

```bash
    ng serve
```