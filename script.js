let expenses = [];

const personSelect = document.getElementById('person-select');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseTypeSelect = document.getElementById('expense-type');
const addExpenseBtn = document.getElementById('add-expense-btn');

addExpenseBtn.addEventListener('click', function() {
  const person = personSelect.value;
  const name = expenseNameInput.value;
  const amount = parseFloat(expenseAmountInput.value);
  const type = expenseTypeSelect.value;

  if (name === '' || isNaN(amount)) {
    alert('Please enter a valid expense name and amount.');
    return;
  }

  expenses.push({ person: person, name: name, amount: amount, type: type });

  expenseNameInput.value = '';
  expenseAmountInput.value = '';

  updateDisplay();
});

function updateDisplay() {
  updatePersonDisplay('Abhinandan');
  updatePersonDisplay('Anchal');
}

function updatePersonDisplay(person) {
  const list = document.getElementById(person + '-list');
  const totalEl = document.getElementById(person + '-total');

  // Filter only this person's expenses
  const personExpenses = expenses.filter(function(e) {
    return e.person === person;
  });

  // Rebuild their list
  list.innerHTML = '';
  personExpenses.forEach(function(e) {
    const li = document.createElement('li');
    li.textContent = e.name + ' (' + e.type + '): ₹' + e.amount.toFixed(2);
    list.appendChild(li);
  });

  // Calculate their total
  const total = personExpenses.reduce(function(sum, e) {
    return sum + e.amount;
  }, 0);

  totalEl.textContent = total.toFixed(2);
}