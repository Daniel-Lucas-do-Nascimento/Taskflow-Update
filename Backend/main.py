from utills.arquivos import titulo,salvar_json
from time import sleep
while True:

    titulo('Taskflow')
    print('''[1] - Adicionar tarefa
[2] - Listar tarefas
[3] - Buscar tarefa
[4] - Editar tarefa
[5] - Concluir tarefa
[6] - Excluir tarefa
[7] - Ver extatísticas
[0] - Sair''')

    while True:
        try:
            opcao = int(input('Digite a opção desejada: '))
            if opcao < 0 or opcao > 7:
                print('Opção inválida. Digite novamente.')
            else:
                print('Processando.',end='')
                sleep(1)
                print('.',end='')
                sleep(1)
                print('.')
                sleep(1)
                break
        except ValueError:
            print('Opção inválida. Digite um número inteiro.')

    if opcao == 1:
        titulo('Adicionar Tarefa')
        from services.tarefas import adicionar_tarefa
        adicionar_tarefa()
        sleep(2)
    elif opcao == 2:
        titulo('Lista de Tarefas')
        from services.tarefas import listar_tarefas
        listar_tarefas()
        sleep(2)
    elif opcao == 3:
        titulo('Busca de Tarefas')
        from services.tarefas import buscar_tarefa
        buscar_tarefa()
        sleep(2)
    elif opcao == 4:
        titulo('Editar Tarefas')
        from services.tarefas import editar_tarefa
        editar_tarefa()
        sleep(2)
    elif opcao == 5:
        titulo('Concluir Tarefas')
        from services.tarefas import concluir_tarefa
        concluir_tarefa()
        sleep(2)
    elif opcao == 6:
        titulo('Excluir Tarefas')
        from services.tarefas import excluir_tarefa
        excluir_tarefa()
        sleep(2)
    elif opcao == 7:
        titulo('Estátistica')
        from services.tarefas import estatistica
        estatistica()
        sleep(2)
    elif opcao == 0:
        titulo('Logout')
        print('\033[31mATENCIOSAMENTE Taskflow!\033[m')
        sleep(2)
        break
