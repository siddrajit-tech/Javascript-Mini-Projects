const addBtn = document.querySelector("#addBtn")
const deleteBtn = document.querySelector(".delete-btn")
const todoInput = document.querySelector("#todoInput")
const template = document.querySelector("#todoTemplate")
const todoList = document.querySelector("#todoList")
const form = document.querySelector("#todoForm")
const emptyState = document.querySelector("#emptyState")
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
  
}

function loadTodos() {
  const loadedTodos = localStorage.getItem("todos")
  return JSON.parse(loadedTodos) || []
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos))
}