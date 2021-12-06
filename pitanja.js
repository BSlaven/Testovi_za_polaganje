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
  očistiPriGašenju();
});

closeModal.addEventListener('click', e => {
  e.stopPropagation();
  modalPozadina.classList.remove('aktivan-modal');
  očistiPriGašenju();
});

dodajOdgovor.addEventListener('click', () => {
  let mojBroj = Math.round(Math.random() * 100000000);
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
    let editEl = createEditElement();
    let deleteEl = createDeleteElement();
    cell1.innerHTML = indeks + 1;
    cell2.innerHTML = mojePitanje.tekst;
    cell3.appendChild(editEl);
    cell3.appendChild(deleteEl);
    tabelaPitanja.appendChild(tijeloTabele);
  });
}

function createEditElement() {
  let editEl = document.createElement('i');
  editEl.classList.add('fas', 'fa-pen');
  editEl.addEventListener('click', e => {
    e.stopPropagation();
    listaOdgovora.InnerHTML = '';
    elementZaBrisanje = e.target;
    pitanje = izaberiOdgovoreIzPitanja(elementZaBrisanje, listaPitanja);
    odgovori = pitanje.odgovori;
    popuniFormular(pitanje);
    poredajOdgovoreZaIzmjenu(odgovori);
    modalPozadina.classList.add('aktivan-modal');
  })
  return editEl;
}

function createDeleteElement() {
  let deleteEl = document.createElement('i');
  deleteEl.classList.add('fas', 'fa-trash');
  deleteEl.addEventListener('click', e => {
    e.stopPropagation();
    elementZaBrisanje = e.target;
    dijalogZaBrisanje.style.display = 'grid'
  })
  return deleteEl;
}

function izaberiOdgovoreIzPitanja(element, pitanja) {
  const tekstZaPoređenje = element.parentNode.parentNode.children[1].innerText;
  let izabranoPitanje = pitanja.filter(pitanje => pitanje.tekst === tekstZaPoređenje);
  return izabranoPitanje[0];
}

function popuniFormular(pitanje) {
  tekstPitanja.value = pitanje.tekst;
  kategorijaPitanja.value = pitanje.kategorija;
  vrijednostPitanja.value = pitanje.vrijednostPitanja;
}

function poredajOdgovoreZaIzmjenu(odgovori) {
  odgovori.map(odgovor => {
    kreirajJedanOdgovor(odgovor, listaOdgovora);
  });
}

function kreirajJedanOdgovor(odgovor, lista) {
  let markIcon = createAnswerIcon('mark');
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

function createAnswerIcon(name) {
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
    setCorrectOrNot(odgovor.idOdgovora);
  })
  return listItem;
}

function setCorrectOrNot(id) {
  const answer = odgovori.find(odgovor => odgovor.idOdgovora === id);
  answer.tačno = !answer.tačno;
}
