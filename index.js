const newTestBtn = document.querySelector('#new-test');
const showAllTestsBtn = document.querySelector('#show-all-tests');
const testsForm = document.querySelector('#tests-form');
const testTitle = document.querySelector('#test-title');
const category = document.querySelector('#category');
const questionsChoices = document.querySelector('#questions-choices');
const testsTable = document.querySelector('#tests-table');
const closeModal = document.querySelector('#close-modal');
const modalBackground = document.querySelector('#modal-background');
const tableBody = document.querySelector('#table-body');
const dodajPitanjeUTest = document.querySelector('#dodaj-pitanje-u-test');
const sačuvajTest = document.querySelector('#sačuvaj-test');
const listaPitanjaUTestu = document.querySelector('#lista-pitanja-u-testu');
const closeNavbar = document.querySelector('#close-navbar');

// navbar
const navbar = document.querySelector('#navbar');
const toggleNavbar = document.querySelector('#navbar-toggle');

// Dijalog za brisanje
const dijalogZaBrisanje = document.querySelector('#dijalog-za-brisanje');
const potvrdiBrisanje = document.querySelector('#obriši');
const odustani = document.querySelector('#odustani-od-brisanja');
let elementZaBrisanje;

let jedanTest = {};
let pitanjaUnutarTesta = [];
let pitanjaIzBaze = JSON.parse(localStorage.getItem('svaPitanja')) || [];

closeNavbar.addEventListener('click', () => {
  navbar.classList.remove('visible');
});

toggleNavbar.addEventListener('click', () => {
  toggleNav();
});

function toggleNav() {
  navbar.classList.toggle('visible');
}

if (!localStorage.hasOwnProperty('sviTestovi')) {
  localStorage.setItem('sviTestovi', JSON.stringify([]));
}

let sviTestovi = JSON.parse(localStorage.getItem('sviTestovi'));

newTestBtn.addEventListener('click', () => {
  modalBackground.classList.add('aktivan-modal');
  questionsChoices.innerHTML = '';
  popuniSelectElement(pitanjaIzBaze);
});

function popuniSelectElement(pitanja) {
  pitanja.forEach((pitanje, index) => {
    let newOption = document.createElement('option');
    newOption.innerHTML = `Pitanje ${index + 1}`;
    questionsChoices.appendChild(newOption);
  });
}

showAllTestsBtn.addEventListener('click', () => {
  tableBody.innerHTML = '';
  loadTestsTable();
});

modalBackground.addEventListener('click', e => {
  e.target.classList.remove('aktivan-modal');
});

closeModal.addEventListener('click', () => {
  modalBackground.classList.remove('aktivan-modal');
  počistiSveUTestovima();
});

dodajPitanjeUTest.addEventListener('click', dodajPitanje);

function dodajPitanje() {
  listaPitanjaUTestu.innerHTML = '';
  let izabraniIndex = questionsChoices.selectedIndex;
  let jednoPitanje = pitanjaIzBaze[izabraniIndex];
  const mojNiz = pitanjaUnutarTesta.map(elem => elem.id);
  if(!mojNiz.includes(jednoPitanje.id) || pitanjaUnutarTesta.length === 0) pitanjaUnutarTesta.push(jednoPitanje);
  popuniPitanjaUListi(pitanjaUnutarTesta);
}

function pohraniTest() {
  jedanTest.spisakPitanja = pitanjaUnutarTesta;
  jedanTest.nazivTesta = testTitle.value;
  jedanTest.kategorijaTesta = category.value;
  jedanTest.id = Math.round(Math.random() * 100000000);
  listaPitanjaUTestu.innerHTML = '';
}

sačuvajTest.addEventListener('click', () => {
  if(testTitle.value === '' || testTitle.value === null) {
    pitanjaUnutarTesta = [];
    return;
  }
  pohraniTest();
  const nizId = sviTestovi.map(elem => elem.id);
  if(!nizId.includes(jedanTest.id)) sviTestovi.push(jedanTest);
  localStorage.setItem('sviTestovi', JSON.stringify(sviTestovi));
  jedanTest = {};
  pitanjaUnutarTesta = [];
  testsForm.reset();

});

function createEditElement() {
  let editEl = document.createElement('i');
  editEl.classList.add('fas', 'fa-pen');
  editEl.addEventListener('click', e => {
    e.stopPropagation();
    editTestClickHandler(e);
  });
  return editEl;
}

function editTestClickHandler(e) {
  elementZaBrisanje = e.target;
  jedanTest = izaberiTestZaIzmjenu(elementZaBrisanje, sviTestovi)
  pitanjaUnutarTesta = jedanTest.spisakPitanja;
  testTitle.value = jedanTest.nazivTesta;
  category.value = jedanTest.kategorijaTesta;
  questionsChoices.innerHTML = '';
  listaPitanjaUTestu.innerHTML = '';
  popuniPitanjaUListi(pitanjaUnutarTesta);
  popuniSelectElement(pitanjaIzBaze);
  modalBackground.classList.add('aktivan-modal');
}

function createDeleteElement() {
  let deleteEl = document.createElement('i');
  deleteEl.classList.add('fas', 'fa-trash');
  deleteEl.addEventListener('click', e => {
    e.stopPropagation();
    elementZaBrisanje = e.target;
    dijalogZaBrisanje.style.display = 'grid';
  })
  return deleteEl;
}

function izaberiTestZaIzmjenu(element, niz) {
  const id = element.parentNode.parentNode.id;
  const izabraniTest = niz.filter(elem => elem.id === id);
  return izabraniTest;
}

function popuniPitanjaUListi(pitanja) {
  pitanja.map(pitanje => {
    izradiJednoPitanjeTesta(pitanje, listaPitanjaUTestu);
  });
}

function izradiJednoPitanjeTesta(pitanje, lista) {
  let jednoPitanje = createListItemElement(pitanje);
  lista.appendChild(jednoPitanje);
}

function createListItemElement(pitanje) {
  let listItem = document.createElement('li');
  listItem.classList.add('answer');
  listItem.textContent = pitanje.tekst;
  listItem.setAttribute('id', pitanje.id);
  listItem.addEventListener('dblclick', e => {
    izbaciPitanjeIzListe(pitanje.id);
    listaPitanjaUTestu.innerHTML = '';
    popuniPitanjaUListi(pitanjaUnutarTesta);
  });
  return listItem;
}

function izbaciPitanjeIzListe(id) {
  pitanjaUnutarTesta = pitanjaUnutarTesta.filter(pitanje => pitanje.id !== id);
}

function loadTestsTable() {
  sviTestovi.map((test, indeks) => {
    let row = tableBody.insertRow(-1);
    row.setAttribute('id', test.id);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    const editEl = createEditElement();
    const deleteEl = createDeleteElement();
    cell1.innerHTML = indeks + 1;
    cell2.textContent = test.nazivTesta;
    cell3.textContent = test.kategorijaTesta;
    cell4.appendChild(editEl);
    cell4.appendChild(deleteEl);
    testsTable.appendChild(tableBody);
  });
}

function potvrdiBrisanjeElementa(element, nizZaPoređenje) {
  const selectedId = +element.parentNode.parentNode.id;
  return nizZaPoređenje.filter(elem => elem.id !== selectedId);
}

potvrdiBrisanje.addEventListener('click', () => {
  // sviTestovi = potvrdiBrisanjeElementa(elementZaBrisanje, sviTestovi);
  // localStorage.setItem('sviTestovi', JSON.stringify(sviTestovi));
  // tableBody.innerHTML = '';
  // loadTestsTable();
  // dijalogZaBrisanje.style.display = 'none';
});

odustani.addEventListener('click', () => {
  dijalogZaBrisanje.style.display = 'none';
});

function počistiSveUTestovima() {
  listaPitanjaUTestu.innerHTML = '';
  questionsChoices.innerHTML = '';
  jedanTest = {};
  pitanjaUnutarTesta = [];
  testsForm.reset();
}
