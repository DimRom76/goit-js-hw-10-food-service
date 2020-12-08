import './styles.css';
import menuTemplates from './templates/item.hbs';
import ingradientTemplates from './templates/ingradients.hbs';
import itemMenu from './menu.json';

const STORAGE_THEME = 'theme';
const ALL_INGRADIENTS = 'Все';
const Theme = {
  LIGHT: 'light-theme',
  DARK: 'dark-theme',
};

const refs = {
  switcherTheme: document.getElementById('theme-switch-toggle'),
  listMenu: document.querySelector('.js-menu'),
  listIngradienst: document.querySelector('.js-ingradients'),
  body: document.querySelector('body'),
  menuContainer: document.querySelector('.menu-container'),
};

refs.switcherTheme.addEventListener('change', onChangeTheme);
refs.menuContainer.addEventListener('click', onClickMenuContainer);

function setStorageTheme(currentTheme) {
  localStorage.setItem(STORAGE_THEME, currentTheme);
}

function setTheme(darkThem) {
  //сбросим все классы на боди
  for (let key in Theme) {
    refs.body.classList.remove(Theme[key]);
  }

  const currentTheme = darkThem ? Theme.DARK : Theme.LIGHT;

  refs.body.classList.add(currentTheme);
  setStorageTheme(currentTheme);
}

function onChangeTheme(e) {
  setTheme(e.target.checked);
}

function getStorageTheme() {
  if (localStorage.getItem(STORAGE_THEME) === Theme.DARK) {
    refs.switcherTheme.checked = true;
  }
  setTheme(refs.switcherTheme.checked);
}

getStorageTheme();

function onClickMenuContainer(e) {
  const filterMenu = e.target;
  if (filterMenu.nodeName !== 'LI') {
    return;
  }

  setMenuByFilter(filterMenu.textContent);
}

function setMenuByFilter(filterMenu) {
  let currentMenu = [];
  if (filterMenu === ALL_INGRADIENTS) {
    currentMenu = itemMenu.slice();
  } else {
    currentMenu = itemMenu.filter(el =>
      el.ingredients.includes(filterMenu.trim()),
    );
  }

  const menu = menuTemplates(currentMenu);
  refs.listMenu.innerHTML = '';
  refs.listMenu.insertAdjacentHTML('beforeend', menu);

  setFilterMenu(currentMenu);
}

function setFilterMenu(currentMenu) {
  const ingrad = currentMenu
    .reduce((newArray, { ingredients }) => {
      const newIngradient = ingredients.filter(el => !newArray.includes(el));
      return [...newArray, ...newIngradient];
    }, [])
    .sort();

  const ingradientsFilter = ingradientTemplates([ALL_INGRADIENTS, ...ingrad]);
  refs.listIngradienst.innerHTML = '';
  refs.listIngradienst.insertAdjacentHTML('beforeend', ingradientsFilter);
}

setMenuByFilter(ALL_INGRADIENTS);
