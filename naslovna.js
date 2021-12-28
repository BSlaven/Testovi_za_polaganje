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
let totalPoints = 0;

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
  if(!korisničkoIme) showError();
}

function showError() {
  errorElement.textContent = 'Morate unijeti svoje ime!';
  errorElement.classList.add('error');
}

function enterNameHanlder() {
  if(!nameInput.value.trim()) return;
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
  if(!currentUser.textContent) showError();
});

function testClickHandler(element) {
  if(!currentUser.textContent) return;
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
  answersContainer.innerHTML = '';
  testTitleElement.textContent = test.nazivTesta;
  currentTotalTestsElement.textContent = `${questionIndex + 1}/${selectedTestQuestions.length}`;
  let currentQuestion = listOfQuestions[questionIndex];
  questionTextElement.textContent = currentQuestion.tekst;
  currentAnswers = currentQuestion.odgovori;
  listAnswersForOneQuestion(currentAnswers, answersContainer);
  testContent.appendChild(questionTextElement);
  testContent.appendChild(answersContainer);
  setupAnswersInput();
}

function setupAnswersInput() {
  if(questionIndex < activeQuestionIndex) {
    trenutniInputi = testContent.querySelectorAll('[type="checkbox"]');
    trenutniInputi.forEach(input => {
      input.disabled = true;
      const trenutniLabeli = testContent.querySelectorAll('label');
      trenutniLabeli.forEach((elem, index) => {
        elem.classList.add(trenutniInputi[index].dataset.tačno === 'true' ? 'zelena-pozadina-odgovora' : 'crvena-pozadina-odgovora');
      });
    });
  }
}

function listAnswersForOneQuestion(sviOdgovori, polje) {
  sviOdgovori.map(odgovor => {
    let labelZaOdgovor = document.createElement('label');
    let inputZaOdgovor = document.createElement('input');
    let spanZaOdgovor = document.createElement('span');
    labelZaOdgovor.textContent = `${odgovor.tekstOdgovora}`;
    labelZaOdgovor.setAttribute('for', odgovor.idOdgovora);
    labelZaOdgovor.classList.add('label-odgovora');
    inputZaOdgovor.setAttribute('type', 'checkbox');
    inputZaOdgovor.setAttribute('id', odgovor.idOdgovora);
    inputZaOdgovor.setAttribute('data-tačno', odgovor.tačno)
    inputZaOdgovor.classList.add('input-odgovora');
    spanZaOdgovor.classList.add('span-odgovora');
    labelZaOdgovor.prepend(spanZaOdgovor);
    labelZaOdgovor.prepend(inputZaOdgovor);
    polje.appendChild(labelZaOdgovor);
  });
}

exitTestBtn.addEventListener('click', () => {
  window.location.reload();
});

function dodajOdgovore() {
  const { questionValue, allCorrect } = getQuestionValue();
  const izabraniOdgovori = getCorrectAnswers();
  obračunajBodove(allCorrect, izabraniOdgovori, questionValue);
}

function getQuestionValue() {
  const mojaPitanja = [...currentTest.spisakPitanja];
  let trenutnoPitanje = mojaPitanja[questionIndex];
  const questionValue = +trenutnoPitanje.vrijednostPitanja;
  const allCorrect = trenutnoPitanje.odgovori.filter(elem => elem.tačno)
  return { questionValue, allCorrect }
}

function getCorrectAnswers() {
  trenutniInputi = testContent.querySelectorAll('[type="checkbox"]');
  let izabraniOdgovori = [];
  trenutniInputi.forEach(mojInput => {
    if(mojInput.checked) izabraniOdgovori.push(mojInput);
  });
  return izabraniOdgovori;
}

function obračunajBodove(svi, izabrani, vrijednost) {
  if(svi.length === izabrani.length && izabrani.every(elem => elem.dataset.tačno === 'true')) {
    totalPoints += vrijednost;
  }
}

nextQuestion.addEventListener('click', next => {
  (questionIndex === activeQuestionIndex) ? dodajOdgovore() : null;
  if((questionIndex + 1) >= selectedTestQuestions.length) {
    endTestBtn.style.display = 'block';
    e.target.disabled = true;
    previousQuestion.disabled = true;
    return;
  }
  testContent.innerHTML = '';
  (questionIndex !== activeQuestionIndex) ? questionIndex++ : increaseBothIndeces();
  setupTestStructure(currentTest, selectedTestQuestions);
});

function increaseBothIndeces() {
  questionIndex++;
  activeQuestionIndex++;
}

previousQuestion.addEventListener('click', () => {
  if(questionIndex <= 0) return;
  trenutniInputi = testContent.querySelectorAll('[type="checkbox"]');
  testContent.innerHTML = '';
  questionIndex--;
  setupTestStructure(currentTest, selectedTestQuestions);
});

endTestBtn.addEventListener('click', () => {
  testContainer.style.display = 'none';
  izračunajPrikažiRezultat();
});

function izračunajPrikažiRezultat() {
  let ukupnoBodova = currentTest.spisakPitanja.map(pitanje => parseInt(pitanje.vrijednostPitanja)).reduce((acc, inc) => acc + inc);
  const procenatOsvojenihBodova = Math.round((totalPoints / ukupnoBodova) * 100);
  prikažiRezultateTesta(ukupnoBodova, totalPoints, procenatOsvojenihBodova);
}

function prikažiRezultateTesta(ukupno, osvojeno, procenat) {
  const prikazRezultata = document.querySelector('#prikaz-rezultata');
  const porukaKorisniku = document.querySelector('#poruka-korisniku');

  prikazRezultata.textContent = `Osvojenih bodova ${osvojeno}, od ukupno ${ukupno}. Procenat tačnosti je: ${procenat}.`
  porukaKorisniku.classList.add(procenat >= 95 ? 'zelena-poruka' : 'crvena-poruka')
  porukaKorisniku.textContent = procenat >= 95 ? `Položili ste test!` : `Niste položili test!`
}
