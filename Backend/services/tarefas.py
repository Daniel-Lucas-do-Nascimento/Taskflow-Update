def adicionar_tarefa():
    from utills.arquivos import gerar_id,salvar_json,ler_json,validar_titulo,validar_prazo, validar_prioridade
    dados2 = ler_json()
    titulo = validar_titulo()
    descricao = input('Digite a descrição da tarefa: ')
    prioridade = validar_prioridade()
    prazo = validar_prazo()   
    dados = {'id': gerar_id(),
            'titulo' : titulo,
            'descricao' : descricao,
            'prioridade' : prioridade,
            'prazo' : prazo,
            'status' : 'pendente'}
    dados2.append(dados)
    salvar_json(dados2)

def listar_tarefas():
    from utills.arquivos import ler_json,escrever_tarefa
    dados = ler_json()
    for tarefa in dados:
        escrever_tarefa(tarefa)
        

def buscar_tarefa():
    from utills.arquivos import ler_json,escrever_tarefa
    dados = ler_json()
    verificador = False
    while True:
        try:
          busca_id = int(input('Digite o ID da tarefa que desefa buscar: ')) 
          break
        except ValueError:
            print('ID inválido. Digite um número inteiro.')
    for tarefas in dados:
        if tarefas['id'] == busca_id:
            escrever_tarefa(tarefas)
            verificador = True
            break
    if verificador == False:
        print('Tarefa não encontrada.')

def editar_tarefa():
    from utills.arquivos import ler_json,salvar_json,escrever_tarefa,validar_titulo,validar_prioridade,validar_prazo,titulo
    dados = ler_json()
    verificador = False
    while True:
        try:
            editar = int(input('Digite o ID da tarefa que deseja editar: '))
            c = -1
            for tarefas in dados:
                c = c + 1
                if tarefas['id'] == editar:
                    escrever_tarefa(tarefas)
                    titulo('Edite sua tarefa agora')
                    novo_titulo = validar_titulo()
                    descricao = input('Digite a descrição: ')
                    prioridade = validar_prioridade()
                    prazo = validar_prazo()
                    tarefa ={'id':tarefas['id'],
                            'titulo':novo_titulo,
                            'descricao': descricao,
                            'prioridade':prioridade,
                            'prazo':prazo,
                            'status':tarefas['status']}
                    dados[c] = tarefa
                    salvar_json(dados)
                    verificador = True
                    break
            break
        except ValueError:
            print('ID inválido. Digite um número inteiro.')
    if verificador == False:
        print('Tarefa não encontrada.')


def concluir_tarefa():
    from utills.arquivos import ler_json,salvar_json
    dados = ler_json()
    verificador = False
    c = -1
    while True:
        try:
            concluir = int(input('Digite o ID da tarefa que deseja concluir: '))
            break
        except ValueError:
            print('ID inválido. Digite novamente!')
    for tarefas in dados:
        c += 1
        if tarefas['id'] == concluir:
            tarefas['status'] = 'Finalizado'
            dados[c] = tarefas
            salvar_json(dados)
            verificador = True
            print('Tarefa concluida com sucesso!')
            break
    if verificador == False:
        print('ID não encontrado!')

def excluir_tarefa():
    from utills.arquivos import ler_json,salvar_json
    dados = ler_json()
    verificador = False
    while True:
        try:
            excluir = int(input('Digite o ID da tarefa que você deseja excluir: '))
            break
        except ValueError:
            print('ID inválido. Digite novamente!')
    for tarefas in dados:
        if tarefas['id'] == excluir:
            dados.remove(tarefas)
            salvar_json(dados)
            print('Tarefa excluida com sucesso!')
            verificador = True
            break
    if verificador == False:
        print('ID não encontrado!')


def estatistica():
    from utills.arquivos import ler_json
    tarefas_pendentes = 0
    tarefas_finalizadas = 0
    dados = ler_json()
    for tarefas in dados:
        if tarefas['status'].lower() == 'pendente':
            tarefas_pendentes += 1
        elif tarefas['status'].lower() == 'finalizado':
            tarefas_finalizadas += 1
    print(f'Tarefas Pendentes:{tarefas_pendentes}')
    print(f'Tarefas Finalizadas:{tarefas_finalizadas}')
    print(f'Total de Tarefas Cadastradas:{tarefas_pendentes + tarefas_finalizadas}')
    



           