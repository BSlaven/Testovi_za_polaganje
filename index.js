const newTestBtn = document.querySelector("#new-test");
const showAllTestsBtn = document.querySelector("#show-all-tests");
const testsForm = document.querySelector("#tests-form");
const testTitle = document.querySelector("#test-title");
const category = document.querySelector("#category");
const questionsChoices = document.querySelector("#questions-choices");
const testsTable = document.querySelector("#tests-table");
const closeModal = document.querySelector("#close-modal");
const modalBackground = document.querySelector("#modal-background");
const tableBody = document.querySelector("#table-body");
const addQuestionToTest = document.querySelector("#add-question");
const saveTestBtn = document.querySelector("#save-test");
const listOfQuestions = document.querySelector("#list-of-questions");
const closeNavbar = document.querySelector("#close-navbar");

// navbar
const navbar = document.querySelector("#navbar");
const toggleNavbar = document.querySelector("#navbar-toggle");

// Dijalog za brisanje
const deleteDialog = document.querySelector("#delete-dialog");
const confirmDeleteBtn = document.querySelector("#confirm-delete");
const rejectDeleteBtn = document.querySelector("#reject-delete");
let testElementToDelete;

let questionsInsideOneTest = [];
let questionsFromDB = JSON.parse(localStorage.getItem("allQuestions")) || [];

closeNavbar.addEventListener("click", () => {
  navbar.classList.remove("visible");
});

toggleNavbar.addEventListener("click", () => {
  toggleNav();
});

function toggleNav() {
  navbar.classList.toggle("visible");
}

let sviTestovi = JSON.parse(localStorage.getItem("sviTestovi")) || [];

newTestBtn.addEventListener("click", () => {
  modalBackground.classList.add("active-modal");
  questionsChoices.innerHTML = "";
  fillSelectElement(questionsFromDB);
});

function fillSelectElement(questions) {
  questions.forEach((pitanje, index) => {
    let newOption = document.createElement("option");
    newOption.innerHTML = `Pitanje ${index + 1}`;
    questionsChoices.appendChild(newOption);
  });
}

showAllTestsBtn.addEventListener("click", () => {
  tableBody.innerHTML = "";
  loadTestsTable();
});

modalBackground.addEventListener("click", (e) => {
  e.target.classList.remove("active-modal");
});

closeModal.addEventListener("click", () => {
  modalBackground.classList.remove("active-modal");
  clearEverythingAfterFinish();
});

addQuestionToTest.addEventListener("click", addQuestion);

function addQuestion() {
  let selectedIndex = questionsChoices.selectedIndex;
  let oneQuestion = questionsFromDB[selectedIndex];
  const arrayOfIDs = questionsInsideOneTest.map((elem) => elem.id);
  if (arrayOfIDs.includes(oneQuestion.id)) return;
  listOfQuestions.innerHTML = "";
  questionsInsideOneTest.push(oneQuestion);
  setQuestionsInList(questionsInsideOneTest);
}

function createOneTest() {
  const oneTest = {
    spisakPitanja: questionsInsideOneTest,
    nazivTesta: testTitle.value,
    kategorijaTesta: category.value,
    id: Math.round(Math.random() * 100000000),
  };
  return oneTest;
}

function storeTest(test) {
  const arrayOfIDs = sviTestovi.map((elem) => elem.id);
  if (!arrayOfIDs.includes(test.id)) {
    sviTestovi.push(test);
  } else {
    const testIndex = sviTestovi.findIndex((elem) => elem.id === test.id);
    sviTestovi.splice(testIndex, 1, test);
  }
  localStorage.setItem("sviTestovi", JSON.stringify(sviTestovi));
}

saveTestBtn.addEventListener("click", () => {
  if (!testTitle.value) return;
  const oneTest = createOneTest();
  if (testsForm.dataSetCurr) {
    oneTest.id = testsForm.dataSetCurr;
  }
  storeTest(oneTest);
  listOfQuestions.innerHTML = "";
  questionsInsideOneTest = [];
  testsForm.dataSetCurr = "";
  testsForm.reset();
});

function createEditElement() {
  let editEl = document.createElement("i");
  editEl.classList.add("fas", "fa-pen");
  editEl.addEventListener("click", (e) => {
    e.stopPropagation();
    editTestClickHandler(e);
  });
  return editEl;
}

function editTestClickHandler(e) {
  testElementToDelete = e.target;
  const oneTest = selectOneTest(testElementToDelete, sviTestovi);
  testsForm.dataSetCurr = oneTest.id;
  questionsInsideOneTest = oneTest.spisakPitanja;
  testTitle.value = oneTest.nazivTesta;
  category.value = oneTest.kategorijaTesta;
  questionsChoices.innerHTML = "";
  listOfQuestions.innerHTML = "";
  setQuestionsInList(questionsInsideOneTest);
  fillSelectElement(questionsFromDB);
  modalBackground.classList.add("active-modal");
}

function createDeleteElement() {
  let deleteEl = document.createElement("i");
  deleteEl.classList.add("fas", "fa-trash");
  deleteEl.addEventListener("click", e => {
    e.stopPropagation();
    testElementToDelete = e.target;
    deleteDialog.style.display = "grid";
  });
  return deleteEl;
}

function selectOneTest(element, array) {
  const id = +element.parentNode.parentNode.id;
  const selectedTest = array.find(elem => elem.id === id);
  return selectedTest;
}

function setQuestionsInList(questions) {
  questions.map(question => {
    selectQuesionFromTest(question, listOfQuestions);
  });
}

function selectQuesionFromTest(question, list) {
  const oneQuestion = createListItemElement(question);
  list.appendChild(oneQuestion);
}

function createListItemElement(pitanje) {
  let listItem = document.createElement("li");
  listItem.classList.add("answer");
  listItem.textContent = pitanje.tekst;
  listItem.setAttribute("id", pitanje.id);
  listItem.addEventListener("dblclick", (e) => {
    removeQuestionFromList(pitanje.id);
    listOfQuestions.innerHTML = "";
    setQuestionsInList(questionsInsideOneTest);
  });
  return listItem;
}

function removeQuestionFromList(id) {
  questionsInsideOneTest = questionsInsideOneTest.filter(
    (pitanje) => pitanje.id !== id
  );
}

function loadTestsTable() {
  sviTestovi.map((test, indeks) => {
    let row = tableBody.insertRow(-1);
    row.setAttribute("id", test.id);
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

function potvrdiBrisanjeElementa(element) {
  const selectedId = +element.parentNode.parentNode.id;
  sviTestovi = sviTestovi.filter((test) => test.id !== selectedId);
  element.parentNode.parentNode.remove();
}

confirmDeleteBtn.addEventListener("click", () => {
  potvrdiBrisanjeElementa(testElementToDelete);
  localStorage.setItem("sviTestovi", JSON.stringify(sviTestovi));
  deleteDialog.style.display = "none";
});

rejectDeleteBtn.addEventListener("click", () => {
  deleteDialog.style.display = "none";
});

function clearEverythingAfterFinish() {
  listOfQuestions.innerHTML = "";
  questionsChoices.innerHTML = "";
  questionsInsideOneTest = [];
  testsForm.dataSetCurr = '';
  testsForm.reset();
}
