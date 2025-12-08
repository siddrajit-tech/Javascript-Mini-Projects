const addBtn = document.querySelector("#addBtn")
const todoInput = document.querySelector("#todoInput")
const template = document.querySelector("#todoTemplate")
const todoList = document.querySelector("#todoList")
let todos = []
todos.forEach(todo => renderTodo(todo))


addBtn.addEventListener('click', () => {
  const todoName = todoInput.value
  renderTodo(todoName)
  todos.push(todoName)
})

function renderTodo(todoName) {
  const templateClone = template.content.cloneNode(true)
  const todoValue = templateClone.querySelector(".todo-text")
  todoValue.innerText = todoName
  todoList.appendChild(templateClone)
}