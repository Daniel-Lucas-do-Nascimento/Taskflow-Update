
from flask import Flask, request, jsonify
from flask_cors import CORS

from utills.arquivos import ler_json, salvar_json, gerar_id

app = Flask(__name__)
CORS(app)


def status_para_frontend(status):
    if str(status).lower() in ["finalizado", "concluído", "concluido", "concluída", "concluida"]:
        return "concluída"
    return "pendente"


def status_para_backend(status):
    if str(status).lower() in ["concluída", "concluida", "concluído", "concluido", "finalizado"]:
        return "Finalizado"
    return "pendente"


def preparar_tarefa(tarefa):
    tarefa = tarefa.copy()
    tarefa["status"] = status_para_frontend(tarefa.get("status"))
    return tarefa


@app.get("/api/tarefas")
def listar_tarefas():
    return jsonify([preparar_tarefa(t) for t in ler_json()])


@app.post("/api/tarefas")
def adicionar_tarefa():
    dados = request.get_json(silent=True) or {}

    titulo = str(dados.get("titulo", "")).strip()
    if not titulo:
        return jsonify({"erro": "O título é obrigatório."}), 400

    tarefas = ler_json()

    tarefa = {
        "id": gerar_id(),
        "titulo": titulo,
        "descricao": str(dados.get("descricao", "")).strip(),
        "prioridade": str(dados.get("prioridade", "média")).strip().lower(),
        "prazo": str(dados.get("prazo", "")).strip(),
        "status": "pendente"
    }

    if tarefa["prioridade"] not in ["baixa", "média", "alta"]:
        return jsonify({"erro": "Prioridade inválida."}), 400

    tarefas.append(tarefa)
    salvar_json(tarefas)

    return jsonify(preparar_tarefa(tarefa)), 201


@app.put("/api/tarefas/<int:id_tarefa>")
def editar_tarefa(id_tarefa):
    dados = request.get_json(silent=True) or {}
    tarefas = ler_json()

    for i, tarefa in enumerate(tarefas):
        if tarefa["id"] == id_tarefa:
            titulo = str(dados.get("titulo", tarefa["titulo"])).strip()

            if not titulo:
                return jsonify({"erro": "O título é obrigatório."}), 400

            tarefa_atualizada = {
                "id": tarefa["id"],
                "titulo": titulo,
                "descricao": str(dados.get("descricao", tarefa["descricao"])).strip(),
                "prioridade": str(dados.get("prioridade", tarefa["prioridade"])).strip().lower(),
                "prazo": str(dados.get("prazo", tarefa["prazo"])).strip(),
                "status": tarefa["status"]
            }

            if tarefa_atualizada["prioridade"] not in ["baixa", "média", "alta"]:
                return jsonify({"erro": "Prioridade inválida."}), 400

            tarefas[i] = tarefa_atualizada
            salvar_json(tarefas)

            return jsonify(preparar_tarefa(tarefa_atualizada))

    return jsonify({"erro": "Tarefa não encontrada."}), 404


@app.patch("/api/tarefas/<int:id_tarefa>/status")
def alterar_status(id_tarefa):
    dados = request.get_json(silent=True) or {}
    status = dados.get("status")

    if status not in ["pendente", "concluída", "concluida"]:
        return jsonify({"erro": "Status inválido."}), 400

    tarefas = ler_json()

    for tarefa in tarefas:
        if tarefa["id"] == id_tarefa:
            tarefa["status"] = status_para_backend(status)
            salvar_json(tarefas)
            return jsonify(preparar_tarefa(tarefa))

    return jsonify({"erro": "Tarefa não encontrada."}), 404


@app.delete("/api/tarefas/<int:id_tarefa>")
def excluir_tarefa(id_tarefa):
    tarefas = ler_json()

    novas_tarefas = [
        tarefa for tarefa in tarefas
        if tarefa["id"] != id_tarefa
    ]

    if len(novas_tarefas) == len(tarefas):
        return jsonify({"erro": "Tarefa não encontrada."}), 404

    salvar_json(novas_tarefas)
    return "", 204


if __name__ == "__main__":
    app.run(debug=True, port=8000)
