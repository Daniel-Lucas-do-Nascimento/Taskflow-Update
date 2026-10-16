# TaskFlow — Gerenciador de Tarefas 2.0

O **TaskFlow** é uma aplicação de gerenciamento de tarefas desenvolvida com Python, Flask, HTML, CSS e JavaScript. O projeto permite organizar atividades, definir prioridades e prazos, acompanhar o progresso e gerenciar tarefas por meio de uma interface web responsiva.

O objetivo do projeto é praticar desenvolvimento de software, organização de código, criação de APIs REST e integração entre frontend e backend.

## Funcionalidades

- Criar, listar, editar e excluir tarefas.
- Definir título e descrição para cada tarefa.
- Classificar tarefas por prioridade: baixa, média ou alta.
- Definir prazo para cada atividade.
- Marcar tarefas como pendentes ou concluídas.
- Pesquisar tarefas por título ou descrição.
- Filtrar e ordenar tarefas.
- Visualizar estatísticas e progresso das atividades.
- Utilizar uma interface adaptada para computadores e celulares.
- Armazenar as tarefas em um arquivo JSON por meio do backend Python.

## Tecnologias utilizadas

### Backend
- Python
- Flask
- Flask-CORS
- JSON para armazenamento de dados

### Frontend
- HTML5
- CSS3
- JavaScript
- Live Server para desenvolvimento local

## Estrutura do projeto

```text
TaskFlow/
├── backend/
│   ├── api.py
|   |--main.py
│   ├── dados/
│   │   └── tarefas.json
│   └── utills/
│       └── arquivos.py
│
├── Frontend/
│   └── TaskFlow_Frontend/
│       ├── index.html
│       ├── styles.css
│       └── app.js
│
├── .gitignore
└── README.md
```

## Requisitos

Para executar o projeto localmente, você precisa de:

- Python instalado.
- Visual Studio Code ou outro editor de código.
- Extensão Live Server no VS Code.
- Navegador atualizado.

## Como instalar e executar

### 1. Baixar o projeto

Clone o repositório ou baixe os arquivos para o computador.

Se estiver utilizando Git:

```bash
git clone URL_DO_REPOSITORIO
cd TaskFlow
```

Substitua `URL_DO_REPOSITORIO` pelo endereço real do repositório.

### 2. Instalar as dependências

No terminal, na pasta raiz do projeto, execute:

```bash
python -m pip install Flask Flask-CORS
```

### 3. Iniciar o backend

Execute:

```bash
python backend/api.py
```

O servidor disponibiliza a API na porta `8000`.

Para verificar se está funcionando, abra:

`http://127.0.0.1:8000/api/tarefas`

A resposta esperada é uma lista de tarefas em formato JSON.

Mantenha o terminal do backend aberto durante a utilização do sistema.

### 4. Iniciar o frontend

No VS Code, abra o arquivo `Frontend/TaskFlow_Frontend/index.html`.

Clique com o botão direito e selecione **Open with Live Server**.

O navegador abrirá o frontend. O endereço normalmente utiliza a porta `5500`, mas pode variar conforme a configuração do Live Server.

### 5. Conectar o frontend ao backend

No arquivo `Frontend/TaskFlow_Frontend/app.js`, configure o modo de demonstração como desativado:

```javascript
const DEMO_MODE = false;
```

Para permitir que o frontend utilize automaticamente o host pelo qual foi aberto, a configuração da API pode ser:

```javascript
const API_BASE = `http://${window.location.hostname}:8000`;
```

Essa configuração pressupõe que o backend esteja acessível no mesmo host e na porta `8000`.

Se o frontend estiver em modo de demonstração, as operações podem utilizar o armazenamento local do navegador em vez da API Python.

## API REST

O backend disponibiliza os seguintes endpoints:

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/tarefas` | Lista as tarefas |
| POST | `/api/tarefas` | Cria uma tarefa |
| PUT | `/api/tarefas/{id}` | Edita uma tarefa |
| PATCH | `/api/tarefas/{id}/status` | Altera o status |
| DELETE | `/api/tarefas/{id}` | Exclui uma tarefa |

### Exemplo de tarefa

```json
{
  "id": 1,
  "titulo": "Estudar Python",
  "descricao": "Revisar funções e módulos",
  "prioridade": "alta",
  "prazo": "20/10/2026",
  "status": "pendente"
}
```

## Armazenamento de dados

As tarefas são armazenadas no arquivo JSON configurado pelo backend. As operações realizadas pela API leem e atualizam esses dados.

O arquivo JSON permite persistência local simples durante o desenvolvimento, mas não substitui um banco de dados para aplicações maiores ou com vários usuários simultâneos.

## Acessar pelo celular

É possível testar o frontend em um celular conectado à mesma rede Wi-Fi do computador.

1. Descubra o IPv4 do computador executando `ipconfig` no Windows.
2. Configure o Live Server para aceitar conexões pela rede local.
3. Abra no celular o endereço formado pelo IP do computador, pela porta do Live Server e pelo caminho do frontend.
4. Verifique se o Flask está acessível pela rede e se o Firewall permite as conexões necessárias.

O endereço `0.0.0.0` pode ser utilizado como endereço de escuta do servidor, mas não deve ser digitado na barra do navegador.

## Status do projeto

Em desenvolvimento.

Novas funcionalidades e melhorias poderão ser adicionadas conforme a evolução do projeto.

## Autor

Desenvolvido como projeto de aprendizado do curso de desenvolvimento de software, frontend feito com a ajuda da I.A, backend feito totalmete pelo próprio autor.

