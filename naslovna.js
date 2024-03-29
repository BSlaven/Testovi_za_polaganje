// navbar
const navbar = document.querySelector('#navbar');
const toggleNavbar = document.querySelector('#navbar-toggle');
const closeNavbar = document.querySelector('#close-navbar');

// user name form
const nameInput = document.querySelector('#name-input');
const form = document.querySelector('#form');
const currentUser = document.querySelector('#current-user');
const errorElement = document.querySelector('#error');

// all tests available
const allTestsElement = document.querySelector('#all-tests');
const testsBElement = document.querySelector('#tests-b');
const testsCElement = document.querySelector('#tests-c');
const testsFirstAidElement = document.querySelector('#tests-first-aid');

// Iz baze
const allTests = JSON.parse(localStorage.getItem('sviTestovi')) || [];
const testsB = allTests.filter(test => test.kategorijaTesta === 'B');
const testsC = allTests.filter(test => test.kategorijaTesta === 'C');
const testsFirsAid = allTests.filter(test => test.kategorijaTesta === 'Prva_pomoć');
let currentTest;
let selectedTestQuestions = [];
let questionIndex = 0;
let activeQuestionIndex = 0;

// Rješavanje testa
const startTestBtn = document.querySelector('#start-test-btn');
const testContainer = document.querySelector('#test-container');
const testTitleElement = document.querySelector('#test-title');
const currentTotalTestsElement = document.querySelector('#header-span');
const testContent = document.querySelector('#test-content');
const questionTextElement = document.querySelector('#question-text');
const answersContainer = document.querySelector('#answers-container');
const exitTestBtn = document.querySelector('#exit-test');
const endTestBtn = document.querySelector('#end-test-btn');
const nextQuestion = document.querySelector('#next');
const previousQuestion = document.querySelector('#previous');
let currentAnswers;
let trenutniInputi;
let mojIndeks;
let totalPointsWon = 0;

form.addEventListener('submit', e => {
  e.preventDefault();
  checkNameIsValid();
  enterNameHanlder();
});

toggleNavbar.addEventListener('click', () => {
  toggleNav();
});

closeNavbar.addEventListener('click', () => {
  navbar.classList.remove('visible');
});

function toggleNav() {
  navbar.classList.toggle('visible');
}

function checkNameIsValid() {
  let korisničkoIme = nameInput.value.trim();
  if (!korisničkoIme) showError();
}

function showError() {
  errorElement.textContent = 'Morate unijeti svoje ime!';
  errorElement.classList.add('error');
}

function enterNameHanlder() {
  if (!nameInput.value.trim()) return;
  errorElement.style.display = 'none';
  form.style.display = 'none';
  currentUser.style.display = 'block';
  currentUser.textContent = nameInput.value;
}

listAllTests(testsB, testsBElement);
listAllTests(testsC, testsCElement);
listAllTests(testsFirsAid, testsFirstAidElement);

function listAllTests(tests, polje) {
  tests.map(test => {
    let oneTest = document.createElement('div');
    oneTest.setAttribute('id', test.id);
    oneTest.classList.add(`test`, `test${test.kategorijaTesta}`);
    oneTest.textContent = test.nazivTesta;
    oneTest.addEventListener('click', e => {
      testClickHandler(e);
    })
    polje.appendChild(oneTest);
  });
}

allTestsElement.addEventListener('click', () => {
  if (!currentUser.textContent) showError();
});

function testClickHandler(element) {
  if (!currentUser.textContent) return;
  const id = +element.target.id;
  const selectedTest = allTests.find(test => test.id === id);
  currentTest = selectedTest;
  selectedTestQuestions = [...selectedTest.spisakPitanja];
  allTestsElement.style.display = 'none';
  startTestBtn.style.display = 'block';
}

startTestBtn.addEventListener('click', e => {
  e.target.style.display = 'none';
  testContainer.style.display = 'block';
  setupTestStructure(currentTest, selectedTestQuestions);
});

function setupTestStructure(test, listOfQuestions) {
  testTitleElement.textContent = test.nazivTesta;
  currentTotalTestsElement.textContent = `${questionIndex + 1}/${selectedTestQuestions.length}`;
  let currentQuestion = listOfQuestions[questionIndex];
  questionTextElement.textContent = currentQuestion.tekst;
  currentAnswers = currentQuestion.odgovori;
  listAnswersForOneQuestion(currentAnswers, answersContainer);
  setupAnswersInputs();
}

function setupAnswersInputs() {
  if (questionIndex === activeQuestionIndex) return;
  trenutniInputi = testContent.querySelectorAll('[type="checkbox"]');
  trenutniInputi.forEach(input => {
    input.disabled = true;
    const trenutniLabeli = testContent.querySelectorAll('label');
    trenutniLabeli.forEach((elem, index) => {
      elem.classList.add(trenutniInputi[index].dataset.tačno === 'true' ? 'correct-green-element' : 'incorrect-red-element');
    });
  });
}

function listAnswersForOneQuestion(answers, element) {
  element.innerHTML = '';
  answers.map(answer => {
    const input = createAnswerInput(answer);
    const label = createAnswerLabel(answer);
    label.prepend(input);
    element.appendChild(label);
  });
}

function createAnswerInput(answer) {
  let input = document.createElement('input');
  input.setAttribute('type', 'checkbox');
  input.setAttribute('id', answer.idOdgovora);
  input.classList.add('answer-input');
  input.dataset.tačno = answer.tačno;
  return input;
}

function createAnswerSpan() {
  let span = document.createElement('span');
  span.classList.add('answer-span');
  return span;
}

function createAnswerLabel(answer) {
  let label = document.createElement('label');
  label.textContent = answer.tekstOdgovora;
  label.setAttribute('for', answer.idOdgovora);
  label.classList.add('answer-label');
  const span = createAnswerSpan();
  label.prepend(span);
  return label;
}

exitTestBtn.addEventListener('click', () => {
  window.location.reload();
});

function dodajOdgovore() {
  const { questionValue, allCorrect } = questionValueAndCorrectAnswers()
  const izabraniOdgovori = getCheckedInputs();
  obračunajBodove(allCorrect, izabraniOdgovori, questionValue);
}

function questionValueAndCorrectAnswers() {
  const trenutnoPitanje = currentTest.spisakPitanja[questionIndex];
  const questionValue = +trenutnoPitanje.vrijednostPitanja;
  const allCorrect = trenutnoPitanje.odgovori.filter(elem => elem.tačno)
  return { questionValue, allCorrect }
}

function getCheckedInputs() {
  const trenutniInputi = [...testContent.querySelectorAll('[type="checkbox"]')];
  const izabraniOdgovori = trenutniInputi.filter(input => input.checked);
  return izabraniOdgovori;
}

function obračunajBodove(svi, izabrani, vrijednost) {
  if (svi.length === izabrani.length && izabrani.every(elem => elem.dataset.tačno === 'true')) {
    totalPointsWon += vrijednost;
  }
}

nextQuestion.addEventListener('click', e => {
  if (questionIndex === activeQuestionIndex) dodajOdgovore();
  if ((questionIndex + 1) >= selectedTestQuestions.length) {
    endTestBtn.style.display = 'block';
    e.target.disabled = true;
    previousQuestion.disabled = true;
    return;
  }
  (questionIndex !== activeQuestionIndex) ? questionIndex++ : increaseBothIndeces();
  setupTestStructure(currentTest, selectedTestQuestions);
});

function increaseBothIndeces() {
  questionIndex++;
  activeQuestionIndex++;
}

previousQuestion.addEventListener('click', () => {
  if (questionIndex <= 0) return;
  trenutniInputi = testContent.querySelectorAll('[type="checkbox"]');
  questionIndex--;
  setupTestStructure(currentTest, selectedTestQuestions);
});

endTestBtn.addEventListener('click', () => {
  testContainer.style.display = 'none';
  calculateAndDisplayPoints();
});

function calculateAndDisplayPoints() {
  const pointsInTest = currentTest.spisakPitanja
    .map(question => question.vrijednostPitanja)
    .reduce((acc, inc) => acc + inc);
  const percentageWon = Math.round((totalPointsWon / pointsInTest) * 100);
  displayResults(pointsInTest, totalPointsWon, percentageWon);
}

function displayResults(ukupno, osvojeno, procenat) {
  const prikazRezultata = document.querySelector('#prikaz-rezultata');
  const porukaKorisniku = document.querySelector('#poruka-korisniku');

  prikazRezultata.textContent = `Osvojenih bodova ${osvojeno}, od ukupno ${ukupno}. Procenat tačnosti je: ${procenat}.`
  porukaKorisniku.classList.add(procenat >= 95 ? 'zelena-poruka' : 'crvena-poruka')
  porukaKorisniku.textContent = procenat >= 95 ? `Položili ste test!` : `Niste položili test!`
}
