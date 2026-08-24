// Keep track of all expenses in a list
let expenses = [];

// Grab references to the HTML elements we'll need to update
const incomeInput = document.getElementById('income');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const addExpenseBtn = document.getElementById('add-expense-btn');
const expenseList = document.getElementById('expense-list');
const totalExpensesEl = document.getElementById('total-expenses');
const remainingBalanceEl = document.getElementById('remaining-balance');

// Run this function whenever the "Add Expense" button is clicked
addExpenseBtn.addEventListener('click', function() {
  const name = expenseNameInput.value;
  const amount = parseFloat(expenseAmountInput.value);

  // Don't add empty or invalid expenses
  if (name === '' || isNaN(amount)) {
    alert('Please enter a valid expense name and amount.');
    return;
  }

  // Add the new expense to our list
  expenses.push({ name: name, amount: amount });

  // Clear the input boxes for the next entry
  expenseNameInput.value = '';
  expenseAmountInput.value = '';

  updateDisplay();
});

// Also recalculate whenever income changes
incomeInput.addEventListener('input', updateDisplay);

function updateDisplay() {
  // Rebuild the expense list on the page
  expenseList.innerHTML = '';
  expenses.forEach(function(expense) {
    const li = document.createElement('li');
    li.textContent = expense.name + ': $' + expense.amount.toFixed(2);
    expenseList.appendChild(li);
  });

  // Calculate total expenses
  const total = expenses.reduce(function(sum, expense) {
    return sum + expense.amount;
  }, 0);

  // Calculate remaining balance
  const income = parseFloat(incomeInput.value) || 0;
  const remaining = income - total;

  // Update the numbers on the page
  totalExpensesEl.textContent = total.toFixed(2);
  remainingBalanceEl.textContent = remaining.toFixed(2);
}