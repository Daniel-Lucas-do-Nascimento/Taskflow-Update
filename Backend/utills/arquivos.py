import json
def titulo(texto):
    print('=' * 40)
    print(texto.center(40))
    print('=' * 40)

def ler_json():
    with open('dados/tarefas.json' , 'r') as arq:
        return json.load(arq)

def salvar_json(dados):
    with open('dados/tarefas.json', 'w') as arq:
        json.dump(dados,arq, indent = 4,ensure_ascii = False)

def gerar_id():
    dados = ler_json()
    maiorid = 0
    if len(dados) > 0:
        for cont in dados:
            if cont['id'] > maiorid:
                maiorid = cont['id']
        return maiorid + 1
    else:
        return 1

def validar_titulo():
    while True:
        titulo = input('Digite o título da tarefa: ')
        if titulo.strip() == '':
            print('Título inválido. Digite novamente.')
        else:
            return titulo
            break

def validar_prioridade():
    while True:
        prioridade = input('Digite a prioridade da tarefa (baixa, média, alta): ')
        if prioridade.lower() not in ['baixa', 'média' , 'alta']:
            print('Prioridade inválida. Digite novamente.')
        else:
            return prioridade
            break

def validar_prazo():
    import datetime
    while True:
        prazo = input('Data limite (dd/mm/aaaa): ')
        try:
            datetime.datetime.strptime(prazo, '%d/%m/%Y')
            return prazo
            break
        except ValueError:
            print('Data inválida. Digite novamente.')


def escrever_tarefa(tarefa):
    print(f"""\nID: {tarefa['id']}
Título: {tarefa['titulo']}
Descrição: {tarefa['descricao']}
Prioridade: {tarefa['prioridade']}
Prazo: {tarefa['prazo']}
Status: {tarefa['status']}""")
            