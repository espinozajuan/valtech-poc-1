// getting necessary DOM objects
const searchInp = document.querySelector('.search-inp'); //Search input
const sortByInp = document.querySelector('.sort-by-inp'); //Sort by input
const curPageFirstUserSerialSpan = document.querySelector('.cur-page-first-user-serail'); //Show 1-XX candidates
const curPageLastUserSerialSpan = document.querySelector('.cur-page-last-user-serail'); //Show X-10 candidates
const totalUsersCountSpan = document.querySelector('.total-users-count'); // total users count
const usersItemsUl = document.querySelector('.users-items'); // users info list
const pageItemsUl = document.querySelector('.page-items'); // pagination

// init necessary variables
let mainData = [], mainDataAltered = [], curPageNo = 1;
const PER_PAGE_MAX_USERS_COUNT = 10, PAGE_COUNT_IN_PAGINATION = 5;

// render cur page first user serial, cur page last user serial and total users count
const renderFilterResultsInfo = () => {
  curPageFirstUserSerialSpan.innerText = ((curPageNo - 1) * PER_PAGE_MAX_USERS_COUNT) + 1;
  curPageLastUserSerialSpan.innerText = Math.min(curPageNo * PER_PAGE_MAX_USERS_COUNT, mainDataAltered.length);
  totalUsersCountSpan.innerText = mainDataAltered.length;
}

// render users into users items list
const renderUsers = () => {
  usersItemsUl.innerHTML = '';
  let usersItemsHtml = '';

  mainDataAltered.forEach((user, idx) => {
    if(idx < (curPageNo - 1) * PER_PAGE_MAX_USERS_COUNT || idx >= curPageNo * PER_PAGE_MAX_USERS_COUNT) return;

    usersItemsHtml += 
    `<li class="users-item">
      <img src="${user.picture.medium}" alt="${user.name.first} ${user.name.last}" class="user-img">
      <h5 class="user-full-name">${user.name.first} ${user.name.last}</h5>
      <span class="user-location">📍 ${user.location.city}, ${user.location.state}, ${user.location.country}</span>
      <span class="user-email">📧 ${user.email}</span>
      <span class="user-date">🕔 ${user.registered.age}Y AGO<span class="user-heart">❤</span></span>
    
      </li>`;
  });

  usersItemsUl.innerHTML = usersItemsHtml;
}

// render pagination
const renderPagination = () => {
  const totalPages = Math.ceil(mainDataAltered.length / PER_PAGE_MAX_USERS_COUNT);
  const startPageOfPagination = curPageNo;
  const lastPageOfPagination = Math.min(curPageNo + PAGE_COUNT_IN_PAGINATION - 1, totalPages);

  pageItemsUl.innerHTML = '';
  let pageItemsUlHtml = '';

  if(curPageNo - 1 >= 1) pageItemsUlHtml += '<li class="page-item"><</li>';
  for(let i = startPageOfPagination; i <= lastPageOfPagination; i++) pageItemsUlHtml += `<li class="page-item ${i == curPageNo ? 'active' : ''}">${i}</li>`;
  if(curPageNo + 1 <= totalPages) pageItemsUlHtml += '<li class="page-item">></li>';

  pageItemsUl.innerHTML = pageItemsUlHtml;

  const pageItems = document.querySelectorAll('.page-item');
  pageItems.forEach(pageItem => pageItem.addEventListener('click', curPageHandler));
}

// handle current page click
const curPageHandler = e => {
  if(e.target.innerText == '<') curPageNo--;
  else if(e.target.innerText == '>') curPageNo++;
  else curPageNo = Number(e.target.innerText);

  renderFilterResultsInfo();
  renderUsers();
  renderPagination();
}

// filter main data
const filterMainData = () => {
  const searchedWord = searchInp.value.trim();
  const sortType = sortByInp.value.trim();

  // filter by word
  mainDataAltered = mainData.filter(user => user.name.first.toLowerCase().indexOf(searchedWord.toLowerCase()) != -1 || user.name.last.toLowerCase().indexOf(searchedWord.toLowerCase()) != -1 || `${user.name.first.toLowerCase()} ${user.name.last.toLowerCase()}`.indexOf(searchedWord.toLowerCase()) != -1);
  // filter by sort type
  if(sortType == 'asc') {
    mainDataAltered.sort((x, y) => `${x.name.first} ${x.name.last}` > `${y.name.first} ${y.name.last}`? 1 : -1);
  } else {
    mainDataAltered.sort((x, y) => `${x.name.first} ${x.name.last}` > `${y.name.first} ${y.name.last}`? -1 : 1);
  }

  renderFilterResultsInfo();
  renderUsers();
  renderPagination();
}

// init main data array on page load
const initMainData = () => {
  fetch('https://www.mockachino.com/a71b232c-218e-4d/users')
  .then(res => res.json())
  .then(data => {
    mainData = mainDataAltered = data.results;
    filterByWordHandler();
  })
  .catch(err => console.log(err));
}

// filter by word handler
const filterByWordHandler = () => {
  curPageNo = 1;
  filterMainData();
}

window.addEventListener('load', initMainData);
searchInp.addEventListener('input', filterByWordHandler);
sortByInp.addEventListener('change', filterMainData);

//thanks for checking my code ( ͡° ͜ʖ ͡°)
