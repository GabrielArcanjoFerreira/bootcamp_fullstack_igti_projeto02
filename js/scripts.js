let globalUsers = [];
let globalFilteredUsers = [];

let inputText = null;
let buttonSearch = null;
let preLoader = null;
let digestUsers = null;
let divUsers = null;
let divEstatistics = null;

const CONSTANT_URL_API_USERS =
  'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo';

async function start() {
  await getUsers();
  getElementsAndEvents();
  activateControls();

  render();
}

start();

async function getUsers() {
  const response = await fetch(CONSTANT_URL_API_USERS);
  const responseJSON = await response.json();

  globalUsers = responseJSON.results.map((user) => {
    const { login, name, dob, gender, picture } = user;

    return {
      id: login.uid,
      name: name.first + ' ' + name.last,
      age: dob.age,
      gender: gender,
      avatar: picture.thumbnail,
    };
  });

  globalUsers.sort((itemA, itemB) => {
    return itemA.name.localeCompare(itemB.name);
  });
}

function getElementsAndEvents() {
  inputText = document.querySelector('#text-input');
  buttonSearch = document.querySelector('#button-search');
  preLoader = document.querySelector('#spinner');
  digestUsers = document.querySelector('#digest-result-users');
  divUsers = document.querySelector('#users');
  divEstatistics = document.querySelector('#estatisticas');

  buttonSearch.addEventListener('click', handleSearchClick);
  inputText.addEventListener('keyup', handleSearchClick);
}

function activateControls() {
  preLoader.classList.add('hide');
  inputText.disabled = false;
  buttonSearch.classList.remove('disabled');
}

function handleSearchClick(event) {
  if (event.key === 'Enter' || typeof event.key === 'undefined') {
    if (inputText.value !== '') {
      globalFilteredUsers = globalUsers.filter((user) => {
        return user.name.toLowerCase().includes(inputText.value.toLowerCase());
      });
    } else {
      globalFilteredUsers = [];
    }

    render();
  }
}

function render() {
  if (globalFilteredUsers.length === 0) {
    digestUsers.innerHTML = `
      <h5 class="digest">Nenhum usuário filtrado</h5>
    `;
    divUsers.innerHTML = '';

    divEstatistics.innerHTML = `
      <h5 class="digest">Nada a ser exibido</h5>
    `;
  } else {
    digestUsers.innerHTML = `
      <h5 class="digest">${globalFilteredUsers.length} usuário(s) encontrado(s)<br><br></h5>
    `;

    let usersList = '<div>';

    usersList +=
      globalFilteredUsers
        .map((user) => {
          const { name, age, avatar } = user;
          return `
        <div style="margin: 10px;">
          <img src=${avatar} alt=${name} style="margin-left: 40px; margin-right: 10px"> ${name}, ${age} anos
        </div>
      `;
        })
        .join('') + '</div>';

    divUsers.innerHTML = usersList;

    let quantityMens = 0;
    let quantityWomens = 0;
    let avaregeAge = 0;
    let sumAge = 0;

    globalFilteredUsers.forEach((user, index) => {
      if (user.gender === 'female') {
        quantityWomens++;
      } else {
        quantityMens++;
      }
      sumAge += user.age;
    });

    avaregeAge = sumAge / globalFilteredUsers.length;

    divEstatistics.innerHTML = `
      <ul style="padding: 25px;">
        <li><strong>Total de homens: </strong>${quantityMens}</li>
        <li><strong>Total de mulheres: </strong>${quantityWomens}</li>
        <li><strong>Soma das idades: </strong>${sumAge}</li>
        <li><strong>Média das idades: </strong>${avaregeAge.toFixed(2)}</li>
      </ul>
    `;
  }
}
