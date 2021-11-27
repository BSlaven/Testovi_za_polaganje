const noviTest = document.querySelector('#novi-test');
const prikažiSveTestove = document.querySelector('#svi-testovi');
const kategorija = document.querySelector('#kategorija');
const izborPitanja = document.querySelector('#izbor-pitanja');
const nazivTesta = document.querySelector('#naziv-testa');
const tabelaTestova = document.querySelector('#tabela-testova');
const closeModal = document.querySelector('#close-modal');
const modalPozadinaTestova = document.querySelector('#modal-pozadina');
const formularTestova = document.querySelector('#formular-testova');
const tijeloTabeleTestova = document.querySelector('#tijelo-tabele-testova');
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

noviTest.addEventListener('click', () => {
  modalPozadinaTestova.classList.add('aktivan-modal');
  popuniSelectElement(pitanjaIzBaze);
});

function popuniSelectElement(pitanja) {
  pitanja.forEach((pitanje, index) => {
    let newOption = document.createElement('option');
    newOption.innerHTML = `Pitanje ${index + 1}`;
    izborPitanja.appendChild(newOption);
  });
}

prikažiSveTestove.addEventListener('click', () => {
  tijeloTabeleTestova.innerHTML = '';
  loadTestsTable();
});

modalPozadinaTestova.addEventListener('click', e => {
  e.target.classList.remove('aktivan-modal');
});

closeModal.addEventListener('click', () => {
  modalPozadinaTestova.classList.remove('aktivan-modal');
  počistiSveUTestovima();
});

dodajPitanjeUTest.addEventListener('click', dodajPitanje);

function dodajPitanje() {
  listaPitanjaUTestu.innerHTML = '';
  let izabraniIndex = izborPitanja.selectedIndex;
  let jednoPitanje = pitanjaIzBaze[izabraniIndex];
  const mojNiz = pitanjaUnutarTesta.map(elem => elem.id);
  if(!mojNiz.includes(jednoPitanje.id) || pitanjaUnutarTesta === []) pitanjaUnutarTesta.push(jednoPitanje);
  popuniPitanjaUListi(pitanjaUnutarTesta);
}

function pohraniTest() {
  jedanTest.spisakPitanja = pitanjaUnutarTesta;
  jedanTest.nazivTesta = nazivTesta.value;
  jedanTest.kategorijaTesta = kategorija.value;
  jedanTest.id = Math.round(Math.random() * 100000000);
  listaPitanjaUTestu.innerHTML = '';
}

sačuvajTest.addEventListener('click', () => {
  if(nazivTesta.value === '' || nazivTesta.value === null) {
    pitanjaUnutarTesta = [];
    return;
  }
  pohraniTest();
  const nizId = sviTestovi.map(elem => elem.id);
  if(!nizId.includes(jedanTest.id)) sviTestovi.push(jedanTest);
  localStorage.setItem('sviTestovi', JSON.stringify(sviTestovi));
  jedanTest = {};
  pitanjaUnutarTesta = [];
  formularTestova.reset();
});

function izmjeniObrišiTestove(elem1, elem2) {
  elem1.setAttribute('href', '#');
  elem1.classList.add('link1');
  elem1.textContent = 'Izmjeni';
  elem2.setAttribute('href', '#');
  elem2.classList.add('link2');
  elem2.textContent = 'Obriši';
  elem1.addEventListener('click', e => {
    elementZaBrisanje = e.target;
    jedanTest = izaberiTestZaIzmjenu(elementZaBrisanje, sviTestovi)
    pitanjaUnutarTesta = jedanTest.spisakPitanja;
    nazivTesta.value = jedanTest.nazivTesta;
    kategorija.value = jedanTest.kategorijaTesta;
    popuniPitanjaUListi(pitanjaUnutarTesta);
    popuniSelectElement(pitanjaIzBaze);
    modalPozadinaTestova.classList.add('aktivan-modal');
  });
  elem2.addEventListener('click', e => {
    elementZaBrisanje = e.target;
    dijalogZaBrisanje.style.display = 'grid';
  });
}

function izaberiTestZaIzmjenu(element, niz) {
  const tekst = element.parentNode.parentNode.children[1].innerText;
  const izabraniTest = niz.filter(elem => elem.nazivTesta === tekst);
  return izabraniTest[0];
}

function popuniPitanjaUListi(pitanja) {
  pitanja.map(pitanje => {
    izradiJednoPitanjeTesta(pitanje, listaPitanjaUTestu);
  });
}

function izradiJednoPitanjeTesta(pitanje, lista) {
  const jednoPitanje = document.createElement('li');
  jednoPitanje.classList.add('odgovor');
  jednoPitanje.textContent = pitanje.tekst;
  jednoPitanje.setAttribute('id', pitanje.id);
  let spanZaPitanje = document.createElement('span');
  spanZaPitanje.innerHTML = '&times;';
  spanZaPitanje.addEventListener('click', e => {
    let identifikacija = Number(e.target.parentNode.id);
    pitanjaUnutarTesta = izbaciPitanjeIzListe(identifikacija);
    listaPitanjaUTestu.innerHTML = '';
    popuniPitanjaUListi(pitanjaUnutarTesta);
  })
  jednoPitanje.prepend(spanZaPitanje);
  lista.appendChild(jednoPitanje);
}

function izbaciPitanjeIzListe(identifikacija) {
  return pitanjaUnutarTesta.filter(pitanje => pitanje.id !== identifikacija);
}

function loadTestsTable() {
  sviTestovi.map((test, indeks) => {
    let row = tijeloTabeleTestova.insertRow(-1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let izmjeni = document.createElement('a');
    let obriši = document.createElement('a');
    izmjeniObrišiTestove(izmjeni, obriši);
    cell1.innerHTML = indeks + 1;
    cell2.innerText = test.nazivTesta;
    cell3.innerHTML = test.kategorijaTesta;
    cell4.appendChild(izmjeni);
    cell4.appendChild(obriši);
    tabelaTestova.appendChild(tijeloTabeleTestova);
  });
}

function potvrdiBrisanjeElementa(element, nizZaPoređenje) {
  const tekstZaPoređenje = element.parentNode.parentNode.children[1].innerText;
  console.log(sviTestovi[0].nazivTesta.length);
  return nizZaPoređenje.filter(elem => elem.nazivTesta !== tekstZaPoređenje);
}

potvrdiBrisanje.addEventListener('click', () => {
  sviTestovi = potvrdiBrisanjeElementa(elementZaBrisanje, sviTestovi);
  localStorage.setItem('sviTestovi', JSON.stringify(sviTestovi));
  tijeloTabeleTestova.innerHTML = '';
  loadTestsTable();
  dijalogZaBrisanje.style.display = 'none';
});

odustani.addEventListener('click', () => {
  dijalogZaBrisanje.style.display = 'none';
});

function počistiSveUTestovima() {
  listaPitanjaUTestu.innerHTML = '';
  izborPitanja.innerHTML = '';
  jedanTest = {};
  pitanjaUnutarTesta = [];
  formularTestova.reset();
}
