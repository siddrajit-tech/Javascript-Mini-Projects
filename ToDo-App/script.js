const addBtn = document.querySelector("#addBtn")
const deleteBtn = document.querySelector(".delete-btn")
const editBtn = document.querySelector(".edit-btn")
const todoInput = document.querySelector("#todoInput")
const template = document.querySelector("#todoTemplate")
const todoList = document.querySelector("#todoList")
const form = document.querySelector("#todoForm")
const emptyState = document.querySelector("#emptyState")
const totalTodosSpan = document.querySelector("#totalCount")
const activeTodosSpan = document.querySelector("#activeCount")
const completeTodosSpan = document.querySelector("#completedCount")
const deleteCompleteBtn = document.querySelector("#clearCompleted")
let todos = loadTodos()
renderTodos()

// Event Listeners

addBtn.addEventListener('click', addTodo)
form.addEventListener('submit', e => {
  e.preventDefault()
  addTodo()
})
todoList.addEventListener('click', e => {
  if(!e.target.classList.contains('delete-btn')) return
  deleteTodo(e)
})
todoList.addEventListener('change', e => {
  if (!e.target.matches(".checkbox")) return

  toggleComplete(e)
})
todoList.addEventListener('dblclick', e => {
  if(!e.target.classList.contains("todo-text")) return

  startEditing(e)
})
deleteCompleteBtn.addEventListener("click", deleteCompleteTodos)



//Functions
function addTodo() {
  const todoName = todoInput.value
  if (todoName.trim() === "") return

  const newTodo = {
    name: todoName,
    complete: false,
    id: Date.now().toString()
  }

  todos.push(newTodo)
  saveTodos()
  renderTodos()
  todoInput.value = ""
}

function deleteTodo(e) {
  const parent = e.target.closest(".todo-item")
  const todoId = parent.dataset.todoId

  
  parent.remove()
  todos = todos.filter(t => t.id !== todoId)
  saveTodos()
  renderTodos()
}

function deleteCompleteTodos() {
  const completedCount = todos.filter(todo => todo.complete).length
  const confirmed = confirm(`Delete ${completedCount} completed todo(s)?`)
  
  if (completedCount === 0) return

  if (confirmed) {
    todos = todos.filter(todo => todo.complete !== true)
    saveTodos()
    renderTodos()
  }
}

function toggleComplete(e) {

  const parent = e.target.closest(".todo-item")
  const todoId = parent.dataset.todoId

  const todo = todos.find(t => t.id === todoId)
  todo.complete = !todo.complete
  console.log(todo);
  
  saveTodos()
  renderTodos()
}

function startEditing(e) {
  const todoText = e.target
  const parent = e.target.closest(".todo-item")
  const todoId = parent.dataset.todoId
  const currentText = todoText.textContent

  const input = document.createElement("input")
  input.type = "text"
  input.value = currentText
  input.className = 'todo-edit-input'

  todoText.replaceWith(input)

  input.addEventListener("keydown", e => {
    if (e.key === 'Enter') {
      saveEdit(todoId, input.value.trim())
    }else if(e.key === 'Escape') {
      renderTodos()
    }
  })

  input.addEventListener("blur", () => {saveEdit(todoId, input.value.trim())
  })
}

function saveEdit(todoId, updatedText) {
  const todo = todos.find(t => t.id === todoId)
  todo.name = updatedText

  saveTodos()
  renderTodos()
}

function updateStats() {
  const total = todos.length
  const completed = todos.filter(todo => todo.complete).length
  const active = total - completed

  totalTodosSpan.textContent = total
  activeTodosSpan.textContent = active
  completeTodosSpan.textContent = completed
}

function renderTodos() {
  todoList.innerHTML = ""

  if(todos.length === 0) {
    emptyState.style.display = "block"
    todoList.appendChild(emptyState)
    return
  }

  emptyState.style.display = 'none'

  todos.forEach(todo => {
    const templateClone = template.content.cloneNode(true)

    const todoItem = templateClone.querySelector('.todo-item')
    const todoText = templateClone.querySelector(".todo-text")
    const checkbox = templateClone.querySelector('.checkbox')

    todoItem.dataset.todoId = todo.id
    todoText.innerText = todo.name
    checkbox.checked = todo.complete

    todoList.appendChild(templateClone)
  })
  
  updateStats()
}

function loadTodos() {
  const loadedTodos = localStorage.getItem("todos")
  return JSON.parse(loadedTodos) || []
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos))
}