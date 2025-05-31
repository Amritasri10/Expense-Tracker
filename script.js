const balanceEl = document.getElementById('balance');
const moneyPlusEl = document.getElementById('money-plus');
const moneyMinusEl = document.getElementById('money-minus');
const listEl = document.getElementById('list');
const form = document.getElementById('form');
const textInput = document.getElementById('text');
const typeInput = document.getElementById('type');
const amountInput = document.getElementById('amount');
const container = document.querySelector('.container');

// Transactions array
let transactions = [];

// Function to add a transaction
function addTransaction(e) {
  e.preventDefault();

  const text = textInput.value.trim();
  const type = typeInput.value;
  const amount = +amountInput.value;

  if (text === '' || isNaN(amount) || amount <= 0) {
    alert('Please enter valid text and amount (> 0)');
    return;
  }

  // Create transaction object with unique id
  const transaction = {
    id: generateID(),
    text,
    type,
    amount
  };

  transactions.push(transaction);
  updateLocalStorage();
  addTransactionDOM(transaction);
  updateValues();
  clearInputs();
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 1000000);
}

// Add transaction to DOM list
function addTransactionDOM(transaction) {
  const sign = transaction.type === 'expense' ? '-' : '+';
  const item = document.createElement('li');

  // Add class based on transaction type
  item.classList.add(transaction.type === 'expense' ? 'expense' : 'income');

  item.innerHTML = `
    ${transaction.text} <span>${sign}$${transaction.amount.toFixed(2)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  listEl.appendChild(item);
}

// Update income, expense and balance
function updateValues() {
  const amounts = transactions.map(txn => txn.type === 'expense' ? -txn.amount : txn.amount);

  const total = amounts.reduce((acc, item) => acc + item, 0);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0);
  const expense = amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0);

  balanceEl.innerText = `$${total.toFixed(2)}`;
  moneyPlusEl.innerText = `$${income.toFixed(2)}`;
  moneyMinusEl.innerText = `$${Math.abs(expense).toFixed(2)}`;

  updateTheme(total);
}

// Remove transaction by id
function removeTransaction(id) {
  transactions = transactions.filter(txn => txn.id !== id);
  updateLocalStorage();
  init();
}

// Clear input fields after adding
function clearInputs() {
  textInput.value = '';
  amountInput.value = '';
}

// Update theme color based on balance
function updateTheme(balance) {
  container.classList.remove('theme-green', 'theme-red');
  balanceEl.classList.remove('theme-green', 'theme-red');

  if (balance > 0) {
    container.classList.add('theme-green');
    balanceEl.classList.add('theme-green');
  } else if (balance < 0) {
    container.classList.add('theme-red');
    balanceEl.classList.add('theme-red');
  }
}

// Save transactions array to localStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initialize app
function init() {
  const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

  if (localStorageTransactions !== null) {
    transactions = localStorageTransactions;
  }

  listEl.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// Event listener for form submit
form.addEventListener('submit', addTransaction);

// Run initial setup
init();
