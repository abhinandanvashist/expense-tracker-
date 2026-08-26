
// ==========================================
// GOOGLE SHEETS API URL
// ==========================================
// Replace this with your NEW Google Apps Script
// Web App URL ending in /exec
//
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyETDZZ3klcZdBYwLpoAWkjOcxxXBT7ouv6EsHYoUldiITYFqSxsLALMtFe8KH3V6UC/exec';


// ==========================================
// EXPENSE DATA
// ==========================================

let expenses = [];


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const personSelect = document.getElementById('person-select');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseTypeSelect = document.getElementById('expense-type');
const addExpenseBtn = document.getElementById('add-expense-btn');


// ==========================================
// LOAD EXISTING EXPENSES
// ==========================================

function loadExpenses() {

  fetch(SHEET_URL, {
    method: 'GET',
    cache: 'no-store'
  })

    .then(function(response) {

      if (!response.ok) {
        throw new Error('Unable to connect to Google Sheets.');
      }

      return response.json();
    })

    .then(function(data) {

      // Make sure we received an array
      if (!Array.isArray(data)) {
        throw new Error('Invalid data received from Google Sheets.');
      }

      expenses = data;

      updateDisplay();
    })

    .catch(function(error) {

      console.error('Error loading expenses:', error);

      alert(
        'Could not load your expenses from Google Sheets. ' +
        'Please check your Google Apps Script URL and deployment settings.'
      );

    });
}


// ==========================================
// ADD NEW EXPENSE
// ==========================================

addExpenseBtn.addEventListener('click', function() {

  const person = personSelect.value;
  const name = expenseNameInput.value.trim();
  const amount = parseFloat(expenseAmountInput.value);
  const type = expenseTypeSelect.value;


  // ------------------------------------------
  // VALIDATION
  // ------------------------------------------

  if (name === '') {

    alert('Please enter an expense name.');

    expenseNameInput.focus();

    return;
  }


  if (isNaN(amount) || amount <= 0) {

    alert('Please enter a valid expense amount.');

    expenseAmountInput.focus();

    return;
  }


  // ------------------------------------------
  // CREATE EXPENSE OBJECT
  // ------------------------------------------

  const newExpense = {

    person: person,

    name: name,

    amount: amount,

    type: type

  };


  // ------------------------------------------
  // DISABLE BUTTON WHILE SAVING
  // ------------------------------------------

  const originalButtonText = addExpenseBtn.textContent;

  addExpenseBtn.disabled = true;

  addExpenseBtn.textContent = 'Saving...';


  // ------------------------------------------
  // SEND DATA TO GOOGLE SHEETS
  // ------------------------------------------

  fetch(SHEET_URL, {

    method: 'POST',

    body: JSON.stringify(newExpense)

  })

    .then(function(response) {

      if (!response.ok) {

        throw new Error(
          'Google Sheets returned an error.'
        );

      }

      return response.json();

    })

    .then(function(result) {

      console.log('Google Sheets response:', result);


      // ----------------------------------------
      // CHECK IF SAVE WAS SUCCESSFUL
      // ----------------------------------------

      if (!result.success) {

        throw new Error(
          result.error || 'Expense could not be saved.'
        );

      }


      // ----------------------------------------
      // ONLY ADD TO LOCAL LIST AFTER
      // GOOGLE SHEETS CONFIRMS SUCCESS
      // ----------------------------------------

      expenses.push(newExpense);

      updateDisplay();


      // ----------------------------------------
      // CLEAR INPUTS
      // ----------------------------------------

      expenseNameInput.value = '';

      expenseAmountInput.value = '';


      // Put cursor back into expense name
      expenseNameInput.focus();

    })

    .catch(function(error) {

      console.error('Error saving expense:', error);

      alert(
        'Could not save the expense to Google Sheets. ' +
        'Please try again.'
      );

    })

    .finally(function() {

      // ----------------------------------------
      // RESTORE BUTTON
      // ----------------------------------------

      addExpenseBtn.disabled = false;

      addExpenseBtn.textContent = originalButtonText;

    });

});


// ==========================================
// UPDATE ENTIRE DISPLAY
// ==========================================

function updateDisplay() {

  updatePersonDisplay('Abhinandan');

  updatePersonDisplay('Anchal');

}


// ==========================================
// UPDATE INDIVIDUAL PERSON
// ==========================================

function updatePersonDisplay(person) {

  const list = document.getElementById(
    person + '-list'
  );

  const totalEl = document.getElementById(
    person + '-total'
  );


  // ------------------------------------------
  // GET EXPENSES FOR THIS PERSON
  // ------------------------------------------

  const personExpenses = expenses.filter(function(e) {

    return e.person === person;

  });


  // ------------------------------------------
  // CLEAR CURRENT LIST
  // ------------------------------------------

  list.innerHTML = '';


  // ------------------------------------------
  // DISPLAY EXPENSES
  // ------------------------------------------

  personExpenses.forEach(function(e) {

    const li = document.createElement('li');


    const amount = parseFloat(e.amount);


    li.textContent =
      e.name +
      ' (' +
      e.type +
      '): ₹' +
      amount.toFixed(2);


    list.appendChild(li);

  });


  // ------------------------------------------
  // CALCULATE TOTAL
  // ------------------------------------------

  const total = personExpenses.reduce(
    function(sum, e) {

      const amount = parseFloat(e.amount);

      if (isNaN(amount)) {
        return sum;
      }

      return sum + amount;

    },
    0
  );


  // ------------------------------------------
  // DISPLAY TOTAL
  // ------------------------------------------

  totalEl.textContent = total.toFixed(2);

}


// ==========================================
// LOAD DATA WHEN PAGE OPENS
// ==========================================

loadExpenses();