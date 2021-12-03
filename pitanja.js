const novoPitanje = document.querySelector('#novo-pitanje');
const modalPozadina = document.querySelector('#modal-pozadina');
const tabelaPitanja = document.querySelector('.tabela-pitanja');
const closeModal = document.querySelector('#close-modal');
const sačuvajPitanje = document.querySelector('#dodaj-pitanje');
const formular = document.querySelector('#formular-pitanja');
const odgovor = document.querySelector('#odgovor');
const tekstPitanja = document.querySelector('#tekst-pitanja');
const kategorijaPitanja = document.querySelector('#kategorijaZaPitanja');
const vrijednostPitanja = document.querySelector('#vrijednost-pitanja');
const dodajOdgovor = document.querySelector('#dodajOdgovor');
const listaOdgovora = document.querySelector('#lista-odgovora');
const svaPitanja = document.querySelector('#sva-pitanja');
const tijeloTabele = document.querySelector('#tijelo-tabele');
const closeNavbar = document.querySelector('#close-navbar');
const answer = document.querySelector('#answer');
const trashRemoveAnswer = document.querySelector('.fa-trash-alt');

answer.addEventListener('click', e => {
  const markIcon = e.currentTarget.childNodes[1];
  console.log(e.target);
  if(e.target.classList.contains('correct-answer')) {
    e.target.classList.remove('correct-answer');
    e.target.classList.add('incorrect-answer');
    markIcon.classList.remove('fa-check');
    markIcon.classList.add('fa-times');
  } else {
    e.target.classList.remove('incorrect-answer');
    e.target.classList.add('correct-answer');
    markIcon.classList.remove('fa-times');
    markIcon.classList.add('fa-check');
  }
})

trashRemoveAnswer.addEventListener('click', e => {
  e.stopPropagation();
})

// navbar
const navbar = document.querySelector('#navbar');
const toggleNavbar = document.querySelector('#navbar-toggle');

if (!localStorage.hasOwnProperty('svaPitanja')) {
  localStorage.setItem('svaPitanja', JSON.stringify([]));
}

// Dijalog za brisanje
const dijalogZaBrisanje = document.querySelector('#dijalog-za-brisanje');
const potvrdiBrisanje = document.querySelector('#obriši');
const odustani = document.querySelector('#odustani-od-brisanja');
let elementZaBrisanje;

let listaPitanja = JSON.parse(localStorage.getItem('svaPitanja'));
let pitanje = {};
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

novoPitanje.addEventListener('click', () => {
  očistiPriGašenju();
  modalPozadina.classList.add('aktivan-modal');
});

modalPozadina.addEventListener('click', e => {
  e.target.classList.remove('aktivan-modal');
});

closeModal.addEventListener('click', () => {
  modalPozadina.classList.remove('aktivan-modal');
  očistiPriGašenju();
});

dodajOdgovor.addEventListener('click', () => {
  let mojBroj = Math.round(Math.random() * 1000000);
  let jedanOdgovor = {
    tekstOdgovora: odgovor.value,
    tačno: false,
    idOdgovora: mojBroj
  };
  odgovori.push(jedanOdgovor);
  pitanje.odgovori = odgovori;
  odgovor.value = '';
  listaOdgovora.innerHTML = '';
  poredajOdgovoreZaIzmjenu(odgovori);
});

svaPitanja.addEventListener('click', () => {
  tijeloTabele.innerHTML = '';
  loadTable();
});

function loadTable() {
  let mojaPitanja = [...listaPitanja];
  mojaPitanja.map((mojePitanje, indeks) => {
    let row = tijeloTabele.insertRow(-1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let izmjeni = document.createElement('a');
    let obriši = document.createElement('a');
    izmjeniObriši(izmjeni, obriši);
    cell1.innerHTML = indeks + 1;
    cell2.innerHTML = mojePitanje.tekst;
    cell3.appendChild(izmjeni);
    cell3.appendChild(obriši);
    tabelaPitanja.appendChild(tijeloTabele);
  });
}

function izmjeniObriši(elem1, elem2) {
  elem1.setAttribute('href', '#');
  elem1.classList.add('link1');
  elem1.textContent = 'Izmjeni';
  elem2.setAttribute('href', '#');
  elem2.classList.add('link2');
  elem2.textContent = 'Obriši';
  elem1.addEventListener('click', e => {
    listaOdgovora.innerHTML = '';
    elementZaBrisanje = e.target;
    pitanje = izaberiOdgovoreIzPitanja(elementZaBrisanje, listaPitanja);
    odgovori = pitanje.odgovori;
    popuniFormular(pitanje);
    poredajOdgovoreZaIzmjenu(odgovori);
    modalPozadina.classList.add('aktivan-modal');
  });
  elem2.addEventListener('click', e => {
    elementZaBrisanje = e.target;
    dijalogZaBrisanje.style.display = 'grid';
  });
}

function izaberiOdgovoreIzPitanja(element, pitanja) {
  const tekstZaPoređenje = element.parentNode.parentNode.children[1].innerText;
  let izabranoPitanje = pitanja.filter(pitanje => pitanje.tekst === tekstZaPoređenje);
  return izabranoPitanje[0];
}

function popuniFormular(pitanje) {
  tekstPitanja.value = pitanje.tekst;
  kategorijaPitanja.value = pitanje.kategorija;
}

function poredajOdgovoreZaIzmjenu(odgovori) {
  odgovori.map(odgovor => {
    kreirajUrediJedanOdgovor(odgovor, listaOdgovora);
  });
}

function kreirajUrediJedanOdgovor(odgovor, lista) {
  let jedanOdgovor = document.createElement('li');
  jedanOdgovor.classList.add('odgovor');
  jedanOdgovor.classList.add(odgovor.tačno ? 'tačanOdgovor' : 'netačanOdgovor');
  jedanOdgovor.textContent = odgovor.tekstOdgovora;
  jedanOdgovor.setAttribute('id', odgovor.idOdgovora);
  let spanZaOdgovor = document.createElement('span');
  spanZaOdgovor.innerHTML = '&times;';
  spanZaOdgovor.addEventListener('click', e => {
    const identifikacija = Number(e.target.parentNode.id);
    odgovori = izbaciOdgovorIzListe(identifikacija);
    listaOdgovora.innerHTML = '';
    poredajOdgovoreZaIzmjenu(odgovori);
  });
  jedanOdgovor.prepend(spanZaOdgovor);
  lista.appendChild(jedanOdgovor);
}

function izbaciOdgovorIzListe(identifikacija) {
  return odgovori.filter(odgovor => odgovor.idOdgovora !== identifikacija);
}

function potvrdiBrisanjeElementa(element, nizZaPoređenje) {
  const tekstZaPoređenje = element.parentNode.parentNode.children[1].innerText;
  return nizZaPoređenje.filter(elem => elem.tekst !== tekstZaPoređenje);
}

potvrdiBrisanje.addEventListener('click', () => {
  listaPitanja = potvrdiBrisanjeElementa(elementZaBrisanje, listaPitanja);
  localStorage.setItem('svaPitanja', JSON.stringify(listaPitanja));
  tijeloTabele.innerHTML = '';
  loadTable();
  dijalogZaBrisanje.style.display = 'none';
});

odustani.addEventListener('click', () => {
  dijalogZaBrisanje.style.display = 'none';
});

formular.addEventListener('submit', e => {
  e.preventDefault();
  popuniPitanje();
  const nizId = listaPitanja.map(elem => elem.id);
  if(!nizId.includes(pitanje.id)) listaPitanja.push(pitanje);
  localStorage.setItem('svaPitanja', JSON.stringify(listaPitanja));
  očistiPriGašenju();
});

function popuniPitanje() {
  pitanje.id = Math.round(Math.random() * 100000000);
  pitanje.kategorija = kategorijaPitanja.value;
  pitanje.tekst = tekstPitanja.value;
  pitanje.odgovori = odgovori;
  pitanje.vrijednostPitanja = vrijednostPitanja.value;
}

function očistiPriGašenju() {
  pitanje = {};
  odgovori = [];
  listaOdgovora.innerHTML = '';
  formular.reset();
}
