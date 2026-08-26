const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyETDZZ3klcZdBYwLpoAWkjOcxxXBT7ouv6EsHYoUldiITYFqSxsLALMtFe8KH3V6UC/exec';

let expenses = [];

const personSelect = document.getElementById('person-select');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseTypeSelect = document.getElementById('expense-type');
const addExpenseBtn = document.getElementById('add-expense-btn');

// Load existing expenses when the page opens
fetch(SHEET_URL, { cache: 'no-store' })
  .then(function(response) { return response.json(); })
  .then(function(data) {
    expenses = data;
    updateDisplay();
  })
  .catch(function(error) {
    console.error('Error loading expenses:', error);
  });

addExpenseBtn.addEventListener('click', function() {
  const person = personSelect.value;
  const name = expenseNameInput.value;
  const amount = parseFloat(expenseAmountInput.value);
  const type = expenseTypeSelect.value;

  if (name === '' || isNaN(amount)) {
    alert('Please enter a valid expense name and amount.');
    return;
  }

  const newExpense = { person: person, name: name, amount: amount, type: type };

  // Send it to Google Sheets
  fetch(SHEET_URL, {
    method: 'POST',
    body: JSON.stringify(newExpense)
  })
    .then(function() {
      expenses.push(newExpense);
      updateDisplay();
    })
    .catch(function(error) {
      console.error('Error saving expense:', error);
    });

  expenseNameInput.value = '';
  expenseAmountInput.value = '';
});

function updateDisplay() {
  updatePersonDisplay('Abhinandan');
  updatePersonDisplay('Anchal');
}

function updatePersonDisplay(person) {
  const list = document.getElementById(person + '-list');
  const totalEl = document.getElementById(person + '-total');

  const personExpenses = expenses.filter(function(e) {
    return e.person === person;
  });

  list.innerHTML = '';
  personExpenses.forEach(function(e) {
    const li = document.createElement('li');
    li.textContent = e.name + ' (' + e.type + '): ₹' + parseFloat(e.amount).toFixed(2);
    list.appendChild(li);
  });

  const total = personExpenses.reduce(function(sum, e) {
    return sum + parseFloat(e.amount);
  }, 0);

  totalEl.textContent = total.toFixed(2);
}