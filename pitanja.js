const newQuestionBtn = document.querySelector('#new-question');
const showQuestionsBtn = document.querySelector('#show-all-questions');
const questionsTable = document.querySelector('#questions-table');
const tableBody = document.querySelector('#table-body');
const modalBackground = document.querySelector('#modal-background');
const closeModal = document.querySelector('#close-modal');
const questionsForm = document.querySelector('#questions-form');
const questionTextElement = document.querySelector('#question-text');
const categoryElement = document.querySelector('#question-category');
const answerElement = document.querySelector('#answer-input');
const questionValueElement = document.querySelector('#question-value');
const addAnswerBtn = document.querySelector('#add-answer-btn');
const listOfAnswers = document.querySelector('#answers-list');

// navbar
const navbar = document.querySelector('#navbar');
const closeNavbar = document.querySelector('#close-navbar');
const toggleNavbar = document.querySelector('#navbar-toggle');

// Dijalog za brisanje
const deleteDialog = document.querySelector('#delete-dialog');
const confirmDelete = document.querySelector('#confirm-delete');
const rejectDelete = document.querySelector('#reject-delete');

let listOfQuestions = JSON.parse(localStorage.getItem('allQuestions')) || [];
let questionToDelete;
let odgovori = [];

closeNavbar.addEventListener('click', () => {
  navbar.classList.remove('visible');
});

toggleNavbar.addEventListener('click', () => {
  toggleNav();
});

function toggleNav() {
  navbar.classList.toggle('visible');
}

newQuestionBtn.addEventListener('click', () => {
  clearAfterFinish();
  modalBackground.classList.add('active-modal');
});

modalBackground.addEventListener('click', e => {
  e.target.classList.remove('active-modal');
});

closeModal.addEventListener('click', e => {
  e.stopPropagation();
  modalBackground.classList.remove('active-modal');
  clearAfterFinish();
});

addAnswerBtn.addEventListener('click', () => {
  if(!answerElement.value.trim()) return;
  let mojBroj = Math.round(Math.random() * 100000000);
  let jedanOdgovor = {
    tekstOdgovora: answerElement.value.trim(),
    tačno: false,
    idOdgovora: mojBroj
  };
  odgovori.push(jedanOdgovor);
  answerElement.value = '';
  listOfAnswers.innerHTML = '';
  poredajOdgovoreZaIzmjenu(odgovori);
});

showQuestionsBtn.addEventListener('click', () => {
  tableBody.innerHTML = '';
  loadTable();
});

function loadTable() {
  let myQuestions = [...listOfQuestions];
  myQuestions.map((myQuestion, indeks) => {
    let row = tableBody.insertRow(-1);
    row.setAttribute('id', myQuestion.id);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let editEl = createEditElement();
    let deleteEl = createDeleteElement();
    cell1.innerHTML = indeks + 1;
    cell2.innerHTML = myQuestion.tekst;
    cell3.appendChild(editEl);
    cell3.appendChild(deleteEl);
    questionsTable.appendChild(tableBody);
  });
}

function createEditElement() {
  let editEl = document.createElement('i');
  editEl.classList.add('fas', 'fa-pen');
  editEl.addEventListener('click', e => {
    e.stopPropagation();
    listOfAnswers.innerHTML = '';
    const questionToDelete = e.target;
    const question = selectQuestion(questionToDelete, listOfQuestions);
    odgovori = question.odgovori;
    questionsForm.dataSetCurr = question.id;
    popuniFormular(question);
    poredajOdgovoreZaIzmjenu(odgovori);
    modalBackground.classList.add('active-modal');
  })
  return editEl;
}

function createDeleteElement() {
  let deleteEl = document.createElement('i');
  deleteEl.classList.add('fas', 'fa-trash');
  deleteEl.addEventListener('click', e => {
    e.stopPropagation();
    questionToDelete = e.target;
    deleteDialog.style.display = 'grid'
  })
  return deleteEl;
}

function selectQuestion(element, questions) {
  const id = +element.parentNode.parentNode.id;
  let selectedQuestion = questions.find(question => question.id === id);
  return selectedQuestion;
}

function popuniFormular(pitanje) {
  questionTextElement.value = pitanje.tekst;
  categoryElement.value = pitanje.kategorija;
  questionValueElement.value = pitanje.vrijednostPitanja;
}

function poredajOdgovoreZaIzmjenu(odgovori) {
  odgovori.map(odgovor => {
    kreirajJedanOdgovor(odgovor, listOfAnswers);
  });
}

function kreirajJedanOdgovor(odgovor, lista) {
  let markIcon = createAnswerIcon('mark');
  if(odgovor.tačno) {
    markIcon.classList.remove('fa-times');
    markIcon.classList.add('fa-check');
  }
  let trashIcon = createAnswerIcon('trash');
  let listItem = createListItemElement(odgovor, markIcon);
  trashIcon.addEventListener('click', e => {
    e.stopPropagation();
    const id = +e.target.parentNode.id;
    odgovori = odgovori.filter(odgovor => odgovor.idOdgovora !== id);
    e.target.parentNode.remove();
  });
  listItem.appendChild(markIcon);
  listItem.appendChild(trashIcon);
  lista.appendChild(listItem);
}

function potvrdiBrisanjeElementa(element) {
  const id = +element.parentNode.parentNode.id;
  listOfQuestions = listOfQuestions.filter(elem => elem.id !== id);
}

confirmDelete.addEventListener('click', () => {
  potvrdiBrisanjeElementa(questionToDelete);
  tableBody.innerHTML = '';
  loadTable();
  deleteDialog.style.display = 'none';
  localStorage.setItem('allQuestions', JSON.stringify(listOfQuestions));
});
rejectDelete.addEventListener('click', () => {
  deleteDialog.style.display = 'none';
});

questionsForm.addEventListener('submit', e => {
  e.preventDefault();
  const question = popuniPitanje();
  const curr = e.target.dataSetCurr;
  if(!curr) {
    listOfQuestions.push(question);
  } else {
    const id = listOfQuestions.findIndex(elem => elem.id === curr);
    listOfQuestions.splice(id, 1, question);
  }
  clearAfterFinish();
  localStorage.setItem('allQuestions', JSON.stringify(listOfQuestions));
  e.target.dataSetCurr = '';
});

function popuniPitanje() {
  const question = {
    id: Math.round(Math.random() * 100000000),
    kategorija: categoryElement.value,
    tekst: questionTextElement.value,
    odgovori: odgovori,
    vrijednostPitanja: questionValueElement.value
  }
  return question;
}

function clearAfterFinish() {
  odgovori = [];
  listOfAnswers.innerHTML = '';
  questionsForm.reset();
}

function createAnswerIcon(name, correct) {
  let myIcon = document.createElement('i');
  myIcon.classList.add('fas');
  myIcon.classList.add(name === 'trash' ? 'fa-trash-alt' : 'fa-times');
  return myIcon;
}

function createListItemElement(odgovor, icon) {
  let listItem = document.createElement('li');
  listItem.classList.add('answer');
  listItem.classList.add(odgovor.tačno ? 'correct-answer' : 'incorrect-answer');
  listItem.textContent = odgovor.tekstOdgovora;
  listItem.setAttribute('id', odgovor.idOdgovora);
  listItem.addEventListener('click', e => {
    toggleAnswerClasses(e, icon);
    setCorrectOrNot(odgovor.idOdgovora);
  })
  return listItem;
}

function toggleAnswerClasses(e, icon) {
  if(e.target.classList.contains('correct-answer')) {
    e.target.classList.remove('correct-answer');
    e.target.classList.add('incorrect-answer');
    icon.classList.remove('fa-check');
    icon.classList.add('fa-times');
  } else {
    e.target.classList.remove('incorrect-answer');
    e.target.classList.add('correct-answer');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-check');
  }
}

function setCorrectOrNot(id) {
  const answer = odgovori.find(odgovor => odgovor.idOdgovora === id);
  answer.tačno = !answer.tačno;
}
