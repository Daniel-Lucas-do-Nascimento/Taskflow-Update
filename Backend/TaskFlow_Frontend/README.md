# TaskFlow — Frontend

Interface web responsiva em HTML, CSS e JavaScript puro para o projeto TaskFlow.

## 1. Testar agora (sem backend)

1. Extraia o ZIP.
2. Abra `index.html` no navegador. Se preferir, use a extensão **Live Server** no VS Code.
3. A interface começa em modo de demonstração (`DEMO_MODE = true` no início de `app.js`).
4. As tarefas de demonstração ficam salvas no `localStorage` do navegador. Isso é apenas para testar a interface, não é o JSON do seu backend Python.

## 2. Conectar ao backend Python

Seu backend atual precisa expor uma **API HTTP**. Funções Python como `adicionar_tarefa()` e `ler_json()` não podem ser chamadas diretamente pelo navegador. Você pode manter suas funções e criar uma camada HTTP que as utilize.

No arquivo `app.js`, ajuste:
- `DEMO_MODE = false`
- `API_BASE = "http://127.0.0.1:8000"` para o endereço/porta em que sua API rodar.
- Os caminhos e os formatos da API no objeto `taskApi`, se forem diferentes dos exemplos abaixo.

### Contrato de API sugerido

| Método | Rota | Função |
|---|---|---|
| `GET` | `/api/tarefas` | Retorna uma lista de tarefas |
| `POST` | `/api/tarefas` | Cria uma tarefa e retorna a tarefa criada |
| `PUT` | `/api/tarefas/{id}` | Atualiza os campos da tarefa |
| `PATCH` | `/api/tarefas/{id}/status` | Atualiza o status; corpo `{"status":"concluída"}` ou `{"status":"pendente"}` |
| `DELETE` | `/api/tarefas/{id}` | Exclui a tarefa; pode retornar HTTP 204 |

Formato de exemplo:
```json
[
  {
    "id": 1,
    "titulo": "Estudar Python",
    "descricao": "Revisar funções",
    "prioridade": "alta",
    "prazo": "20/10/2026",
    "status": "pendente"
  }
]
```

A lista pode vir diretamente como array JSON ou como `{ "tarefas": [...] }`. O frontend entende ambos.

## 3. Atenção ao formato da data

O campo HTML de data fornece `AAAA-MM-DD`. Este frontend converte para `DD/MM/AAAA` ao enviar `POST` e `PUT`, porque esse é o formato previsto para seu projeto Python. Ao receber dados, aceita ambos os formatos.

## 4. CORS

Se o frontend e a API estiverem em portas diferentes, o backend precisará permitir CORS para a origem do frontend. Se usar FastAPI, isso é configurado com `CORSMiddleware`. Não desative segurança de CORS indiscriminadamente em produção.

## 5. O que a interface já tem

- Dashboard com totais, pendentes, concluídas e percentual de progresso
- Criar, editar, excluir e concluir tarefas
- Busca por título/descrição
- Filtro de prioridade
- Ordenação por prazo, prioridade ou título
- Validação básica de título, prioridade e data
- Layout adaptado para computador e celular

## Limite importante

O frontend não se conecta diretamente ao arquivo `dados/tarefas.json`. A comunicação deve acontecer por uma API Python. As rotas acima são uma proposta de contrato; se seu backend tiver outras funções/rotas, o adaptador `taskApi` deve ser ajustado para elas.
