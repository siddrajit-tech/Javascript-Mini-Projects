const form = document.querySelector('#transactionForm');
const transactionsList = document.querySelector('#transactionsList');
const template = document.querySelector('#transactionTemplate')

let transactions = getTransactions()
renderTransactions()
setupFilterButtons()
updateStats()

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTransaction(e)
  form.reset()
})
transactionsList.addEventListener("click", e => {
  if(!e.target.matches(".btn-delete")) return

  deleteTransaction(e)
})


function addTransaction(e) {
  const buttonClicked = e.submitter

  const transactionType = buttonClicked.dataset.type
  const description = form.querySelector('#description');
  const amount = form.querySelector('#amount');
  const category = form.querySelector('#category');
  const date = form.querySelector('#date');

  const transaction = {
    id: Date.now(),
    description: description.value,
    amount: parseFloat(amount.value),
    category: category.value,
    date: date.value,
    type: transactionType,
  }

  transactions.push(transaction);


  saveTransactions()
  renderTransactions()
  console.log(transactions);
}

function deleteTransaction(e) {
  const transactionItem = e.target.closest(".transaction-item")
  const transactionId = transactionItem.dataset.id
  
  transactions = transactions.filter(transaction => {
    return transaction.id !== Number(transactionId)
  })

  saveTransactions()
  renderTransactions()
  
}

function updateStats() {
  const balanceEl = document.querySelector("#totalBalance")
  const expenseEl = document.querySelector("#totalExpenses")
  const incomeEl = document.querySelector("#totalIncome")

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalBalance = totalIncome - totalExpense

  incomeEl.textContent = `$${totalIncome.toFixed(2)}`
  expenseEl.textContent = `$${totalExpense.toFixed(2)}`
  balanceEl.textContent = `$${totalBalance.toFixed(2)}`
}

function setupFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {

      filterButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      const filterValue = e.target.dataset.filter;
      renderTransactions(filterValue);
    });
  });
}

function renderTransactions(filter = "all") {
  transactionsList.innerHTML = '';

  let transactionsToShow;

  if (filter === "all") {
    transactionsToShow = transactions
  }else if(filter === "income" || filter === "expense") {
    transactionsToShow = transactions.filter(t => t.type === filter)
  }else{
    transactionsToShow = transactions.filter(t => t.category === filter)
  }

  if (transactionsToShow.length === 0) {
    transactionsList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No transactions found</p>';
    updateStats();
    return;
  }

  transactionsToShow.forEach(transaction => {

    const templateClone = template.content.cloneNode(true);

    const transactionItem = templateClone.querySelector('.transaction-item');
    const descriptionArea = templateClone.querySelector('.description');
    const amountArea = templateClone.querySelector('.transaction-amount');
    const detailsArea = templateClone.querySelector('.details');

    transactionItem.dataset.id = transaction.id;
    transactionItem.classList.add(transaction.type);

    descriptionArea.textContent = transaction.description;

    const sign = transaction.type === "income" ? '+' : '-';
    amountArea.textContent = `${sign}$${transaction.amount.toFixed(2)}`;
    amountArea.classList.add(transaction.type);

    detailsArea.textContent = `${transaction.category} • ${transaction.date}`;

    transactionsList.appendChild(templateClone);
  })

  updateStats()
}

function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions))
}

function getTransactions() {
  const loadedTransactions = localStorage.getItem("transactions")
  return JSON.parse(loadedTransactions) || []
}