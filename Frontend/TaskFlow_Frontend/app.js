/*
 * TaskFlow frontend
 * Para testar a interface sem backend, mantenha DEMO_MODE = true.
 * Quando seu backend Python tiver uma API HTTP pronta, mude para false
 * e ajuste API_BASE e os caminhos em apiRequest() / taskApi abaixo.
 */

const DEMO_MODE = false;
const API_BASE = `http://${window.location.hostname}:8000`;


const STORAGE_KEY = "taskflow_demo_tasks_v1";
const $ = (selector) => document.querySelector(selector);

let tasks = [];
let currentView = "all";
let openMenuId = null;
let toastTimeout = null;

const demoSeed = [
  { id: 1, titulo: "Estudar funções em Python", descricao: "Revisar parâmetros, retorno e escopo.", prioridade: "alta", prazo: dateOffset(0), status: "pendente" },
  { id: 2, titulo: "Organizar o projeto TaskFlow", descricao: "Revisar pastas e nomes dos módulos.", prioridade: "média", prazo: dateOffset(2), status: "pendente" },
  { id: 3, titulo: "Ler 15 páginas de um livro", descricao: "Manter a rotina de leitura.", prioridade: "baixa", prazo: dateOffset(4), status: "concluída" },
  { id: 4, titulo: "Atualizar anotações", descricao: "Registrar o que aprendi hoje.", prioridade: "média", prazo: dateOffset(-1), status: "pendente" }
];

function dateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}
function normalizeStatus(status) {
  const value = String(status || "").toLowerCase().trim();
  return ["concluída", "concluida", "concluído", "concluido", "completed", "complete"].includes(value) ? "concluída" : "pendente";
}
function normalizeTask(task) {
  return {
    id: task.id,
    titulo: String(task.titulo ?? task.title ?? ""),
    descricao: String(task.descricao ?? task.description ?? ""),
    prioridade: String(task.prioridade ?? task.priority ?? "média").toLowerCase(),
    prazo: normalizeDate(task.prazo ?? task.deadline ?? ""),
    status: normalizeStatus(task.status)
  };
}
function normalizeDate(value) {
  if (!value) return "";
  const s = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const br = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (br) return `${br[3]}-${br[2]}-${br[1]}`;
  return s;
}
function dateToApi(value) {
  if (!value) return "";
  const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : value;
}
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[ch]);
}
function formatDate(value) {
  if (!value) return "Sem prazo";
  const parts = value.split("-");
  if (parts.length !== 3) return value;
  const d = new Date(Number(parts[0]), Number(parts[1])-1, Number(parts[2]));
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("pt-BR", {day:"2-digit", month:"short", year:"numeric"}).replace(".", "");
}
function dayDifference(value) {
  if (!value) return null;
  const [y,m,d] = value.split("-").map(Number);
  const due = new Date(y,m-1,d); due.setHours(0,0,0,0);
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.round((due-today)/86400000);
}

/* Adapter da API: estes caminhos são uma proposta inicial.
   Ajuste-os para combinar com as rotas que você criar no backend Python. */
async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `Erro HTTP ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}
const taskApi = {
  async list() {
    if (DEMO_MODE) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) return JSON.parse(saved).map(normalizeTask);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoSeed));
      return demoSeed.map(normalizeTask);
    }
    const data = await apiRequest("/api/tarefas");
    return (Array.isArray(data) ? data : data.tarefas || []).map(normalizeTask);
  },
  async create(task) {
    if (DEMO_MODE) {
      const saved = tasks.slice();
      const newTask = { ...task, id: saved.reduce((max,t) => Math.max(max, Number(t.id)||0), 0)+1 };
      saved.unshift(newTask); saveDemo(saved); return newTask;
    }
    return normalizeTask(await apiRequest("/api/tarefas", {
      method: "POST",
      body: JSON.stringify({ ...task, prazo: dateToApi(task.prazo) })
    }));
  },
  async update(id, task) {
    if (DEMO_MODE) {
      const updated = { ...tasks.find(t => String(t.id) === String(id)), ...task, id };
      saveDemo(tasks.map(t => String(t.id) === String(id) ? updated : t));
      return updated;
    }
    return normalizeTask(await apiRequest(`/api/tarefas/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify({ ...task, prazo: dateToApi(task.prazo) })
    }));
  },
  async remove(id) {
    if (DEMO_MODE) { saveDemo(tasks.filter(t => String(t.id) !== String(id))); return; }
    return apiRequest(`/api/tarefas/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
  async toggle(id, status) {
    if (DEMO_MODE) {
      saveDemo(tasks.map(t => String(t.id) === String(id) ? { ...t, status } : t));
      return;
    }
    // Ajuste este PATCH ao formato que sua API Python aceitar.
    return apiRequest(`/api/tarefas/${encodeURIComponent(id)}/status`, {
      method: "PATCH", body: JSON.stringify({ status })
    });
  }
};
function saveDemo(nextTasks) {
  tasks = nextTasks.map(normalizeTask);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function setToday() {
  $("#today-label").textContent = new Date().toLocaleDateString("pt-BR", {weekday:"short", day:"2-digit", month:"short", year:"numeric"}).replace(".", "");
}
function currentTasks() {
  const query = $("#search-input").value.trim().toLocaleLowerCase("pt-BR");
  const priority = $("#priority-filter").value;
  const sort = $("#sort-select").value;
  let list = tasks.filter(task => {
    const viewMatch = currentView === "all" ||
      (currentView === "pending" && task.status !== "concluída") ||
      (currentView === "completed" && task.status === "concluída");
    const searchMatch = !query || `${task.titulo} ${task.descricao}`.toLocaleLowerCase("pt-BR").includes(query);
    const priorityMatch = priority === "all" || task.prioridade === priority;
    return viewMatch && searchMatch && priorityMatch;
  });
  const priorityRank = { alta: 0, "média": 1, baixa: 2 };
  if (sort === "deadline") list.sort((a,b) => (a.prazo || "9999").localeCompare(b.prazo || "9999"));
  else if (sort === "priority") list.sort((a,b) => (priorityRank[a.prioridade] ?? 9) - (priorityRank[b.prioridade] ?? 9));
  else if (sort === "title") list.sort((a,b) => a.titulo.localeCompare(b.titulo, "pt-BR"));
  else list.sort((a,b) => Number(b.id)-Number(a.id));
  return list;
}
function updateStats() {
  const completed = tasks.filter(t => t.status === "concluída").length;
  const pending = tasks.length - completed;
  const progress = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  $("#stat-total").textContent = tasks.length;
  $("#stat-pending").textContent = pending;
  $("#stat-completed").textContent = completed;
  $("#stat-progress").textContent = progress;
  $("#progress-fill").style.width = `${progress}%`;
  $("#nav-all-count").textContent = tasks.length;
  $("#nav-pending-count").textContent = pending;
  $("#nav-completed-count").textContent = completed;
}
function renderTasks() {
  const list = currentTasks();
  const tbody = $("#task-list");
  tbody.innerHTML = list.map(task => {
    const completed = task.status === "concluída";
    const priority = ["alta","média","baixa"].includes(task.prioridade) ? task.prioridade : "média";
    const diff = dayDifference(task.prazo);
    const dateClass = !completed && diff !== null && diff < 0 ? "overdue" : (!completed && diff === 0 ? "today" : "");
    return `<tr class="${completed ? "is-completed" : ""}">
      <td><div class="task-title-cell">
        <button class="task-check ${completed ? "checked" : ""}" data-action="toggle" data-id="${escapeHtml(task.id)}" aria-label="${completed ? "Marcar como pendente" : "Concluir tarefa"}">${completed ? "✓" : ""}</button>
        <div><div class="task-title-text">${escapeHtml(task.titulo)}</div>${task.descricao ? `<div class="task-description">${escapeHtml(task.descricao)}</div>` : ""}</div>
      </div></td>
      <td><span class="priority-pill priority-${priority}">${priority[0].toLocaleUpperCase("pt-BR") + priority.slice(1)}</span></td>
      <td><span class="deadline ${dateClass}">${escapeHtml(formatDate(task.prazo))}${dateClass === "overdue" ? " · atrasada" : dateClass === "today" ? " · hoje" : ""}</span></td>
      <td><span class="status-pill ${completed ? "status-concluida" : "status-pendente"}">${completed ? "Concluída" : "Pendente"}</span></td>
      <td class="row-actions"><button class="row-action-button" data-action="menu" data-id="${escapeHtml(task.id)}" aria-label="Ações da tarefa">···</button>
        ${String(openMenuId) === String(task.id) ? `<div class="action-menu">
          <button data-action="edit" data-id="${escapeHtml(task.id)}">Editar tarefa</button>
          <button data-action="toggle" data-id="${escapeHtml(task.id)}">${completed ? "Marcar pendente" : "Concluir tarefa"}</button>
          <button class="delete-action" data-action="delete" data-id="${escapeHtml(task.id)}">Excluir tarefa</button>
        </div>` : ""}
      </td>
    </tr>`;
  }).join("");
  const isEmpty = list.length === 0;
  $("#empty-state").hidden = !isEmpty;
  $("#task-list").closest("table").style.display = isEmpty ? "none" : "table";
  $("#results-count").textContent = `${list.length} ${list.length === 1 ? "tarefa" : "tarefas"}`;
  $("#clear-search").hidden = !$("#search-input").value;
  if (isEmpty) {
    const hasTasks = tasks.length > 0;
    $("#empty-title").textContent = hasTasks ? "Nenhuma tarefa encontrada" : "Seu próximo passo começa aqui";
    $("#empty-description").textContent = hasTasks ? "Tente mudar a busca ou os filtros para encontrar uma tarefa." : "Adicione sua primeira tarefa e comece a organizar seu progresso.";
    $("#empty-create").style.display = hasTasks ? "none" : "inline-flex";
  }
  updateStats();
}
function setView(view) {
  currentView = view;
  const labels = {all:"Todas as tarefas", pending:"Pendentes", completed:"Concluídas"};
  $("#breadcrumb-view").textContent = labels[view];
  $("#page-title").innerHTML = `${labels[view]}<span class="heading-period">.</span>`;
  document.querySelectorAll(".nav-item").forEach(btn => btn.classList.toggle("active", btn.dataset.view === view));
  renderTasks();
}
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2700);
}
function openModal(task = null) {
  $("#task-form").reset();
  $("#task-id").value = task ? task.id : "";
  $("#modal-title").textContent = task ? "Editar tarefa" : "Criar nova tarefa";
  $("#save-task").innerHTML = task ? "Salvar alterações <span>→</span>" : "Salvar tarefa <span>→</span>";
  $("#task-title").value = task?.titulo || "";
  $("#task-description").value = task?.descricao || "";
  $("#task-priority").value = task?.prioridade || "média";
  $("#task-deadline").value = task?.prazo || dateOffset(1);
  $("#form-error").hidden = true;
  $("#modal-backdrop").hidden = false;
  document.body.style.overflow = "hidden";
  setTimeout(() => $("#task-title").focus(), 50);
}
function closeModal() {
  $("#modal-backdrop").hidden = true;
  document.body.style.overflow = "";
}
function validateForm(title, deadline) {
  if (!title.trim()) return "O título não pode ficar vazio.";
  if (title.trim().length > 100) return "O título deve ter no máximo 100 caracteres.";
  if (!deadline) return "Informe um prazo para a tarefa.";
  const [y,m,d] = deadline.split("-").map(Number);
  const date = new Date(y,m-1,d);
  if (date.getFullYear() !== y || date.getMonth() !== m-1 || date.getDate() !== d) return "Informe uma data válida.";
  return "";
}
async function refreshTasks() {
  tasks = await taskApi.list();
  renderTasks();
}
async function handleFormSubmit(event) {
  event.preventDefault();
  const title = $("#task-title").value;
  const description = $("#task-description").value.trim();
  const priority = $("#task-priority").value.toLowerCase();
  const deadline = $("#task-deadline").value;
  const error = validateForm(title, deadline);
  if (error) {
    $("#form-error").textContent = error;
    $("#form-error").hidden = false;
    return;
  }
  if (!["baixa","média","alta"].includes(priority)) {
    $("#form-error").textContent = "Selecione uma prioridade válida.";
    $("#form-error").hidden = false;
    return;
  }
  const id = $("#task-id").value;
  const task = { titulo: title.trim(), descricao: description, prioridade: priority, prazo: deadline, status: id ? (tasks.find(t => String(t.id) === String(id))?.status || "pendente") : "pendente" };
  const saveButton = $("#save-task");
  saveButton.disabled = true;
  try {
    if (id) await taskApi.update(id, task);
    else await taskApi.create(task);
    await refreshTasks();
    closeModal();
    showToast(id ? "Tarefa atualizada com sucesso." : "Tarefa criada com sucesso.");
  } catch (error) {
    $("#form-error").textContent = `Não foi possível salvar: ${error.message}`;
    $("#form-error").hidden = false;
  } finally {
    saveButton.disabled = false;
  }
}
async function handleTaskAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  const task = tasks.find(t => String(t.id) === String(id));
  if (!task) return;
  try {
    if (action === "menu") {
      openMenuId = String(openMenuId) === String(id) ? null : id;
      renderTasks();
    } else if (action === "edit") {
      openMenuId = null; renderTasks(); openModal(task);
    } else if (action === "toggle") {
      const nextStatus = task.status === "concluída" ? "pendente" : "concluída";
      await taskApi.toggle(id, nextStatus);
      await refreshTasks();
      showToast(nextStatus === "concluída" ? "Tarefa concluída. Bom trabalho!" : "Tarefa marcada como pendente.");
    } else if (action === "delete") {
      if (!confirm(`Excluir a tarefa "${task.titulo}"? Essa ação não pode ser desfeita.`)) return;
      await taskApi.remove(id);
      openMenuId = null;
      await refreshTasks();
      showToast("Tarefa excluída.");
    }
  } catch (error) {
    showToast(`Erro: ${error.message}`);
  }
}
function bindEvents() {
  document.querySelectorAll(".nav-item").forEach(button => button.addEventListener("click", () => setView(button.dataset.view)));
  $("#open-create").addEventListener("click", () => openModal());
  $("#empty-create").addEventListener("click", () => openModal());
  $("#close-modal").addEventListener("click", closeModal);
  $("#cancel-modal").addEventListener("click", closeModal);
  $("#modal-backdrop").addEventListener("click", e => { if (e.target === $("#modal-backdrop")) closeModal(); });
  $("#task-form").addEventListener("submit", handleFormSubmit);
  $("#task-list").addEventListener("click", handleTaskAction);
  $("#search-input").addEventListener("input", renderTasks);
  $("#priority-filter").addEventListener("change", renderTasks);
  $("#sort-select").addEventListener("change", renderTasks);
  $("#clear-search").addEventListener("click", () => { $("#search-input").value = ""; renderTasks(); });
  document.addEventListener("click", event => {
    if (openMenuId !== null && !event.target.closest(".row-actions")) { openMenuId = null; renderTasks(); }
  });
  document.addEventListener("keydown", event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault(); $("#search-input").focus();
    }
    if (event.key === "Escape" && !$("#modal-backdrop").hidden) closeModal();
  });
}
async function init() {
  setToday();
  bindEvents();
  try {
    await refreshTasks();
  } catch (error) {
    $("#task-list").innerHTML = "";
    $("#empty-state").hidden = false;
    $("#empty-title").textContent = "Não foi possível carregar as tarefas";
    $("#empty-description").textContent = `${error.message}. Confira a conexão com o backend.`;
    $("#task-list").closest("table").style.display = "none";
  }
}
document.addEventListener("DOMContentLoaded", init);
