const buttons = document.querySelectorAll('button');
const countries = document.querySelector('.countries');
const searchInput = document.querySelector('.searchInput');
const container = document.querySelector('.container');
const searchAndFilter = document.querySelector('.searchAndFilter');
const mdSize = window.matchMedia('(max-width: 1380px)');
const smSize = window.matchMedia('(max-width: 690px)');

regionEvent = () => {
  let a = document.querySelectorAll('a');
  a.forEach(a =>
    a.addEventListener('click', () => {
      filterByRegion(a.id);
    })
  );
};

buttons.forEach(button =>
  button.addEventListener('click', () => {
    if (button.id === 'btnFilter') {
      const dropContent = document
        .querySelector('.dropdown-content')
        .classList.toggle('show');
    }
    if (button.id === 'btnDarkMode') {
      document.querySelector('body').classList.toggle('darkMode');
    }
    if (button.id === 'btnHome') {
      countries.innerHTML = '';
      mainWindow();
    }
  })
);
mainWindow = async () => {
  try {
    let res = await (await fetch('https://restcountries.com/v3.1/all')).json();
    res.forEach(data => {
      const country = document.createElement('div');
      country.classList.add('country');
      country.innerHTML = `  
          <div class='flag' style="background:url(${
            data.flags.png
          }) no-repeat"></div>
          <div class='name'>${data.name.common}</div>
          <div class='population'><span class='title'>Population:</span> ${data.population.toLocaleString(
            'en-US'
          )}</div>
          <div class='region'><span class='title'>Region:</span> ${
            data.region
          }</div>
          <div class='capital'><span class='title'>Capital:</span> ${
            data.capital
          }</div>
        `;
      countries.appendChild(country);
      searchAndFilter.style.display = 'flex';
    });
  } catch (error) {
    alert(error);
  }
};

searchInput.addEventListener('keyup', e => {
  e.preventDefault();
  if (e.key === 'Enter') {
    singleCountry();
    searchInput.value = '';
  }
});

singleCountryHtml = data => {
  let borders = data.borders;
  let curr = data.currencies;
  let lang = data.languages;
  let languages = [];

  Object.values(curr).forEach(currency => {
    currName = currency.name;
  });
  Object.values(lang).forEach(language => {
    languages.push(language);
  });

  const singleCountry = document.createElement('div');
  singleCountry.classList.add('singleCountry');
  singleCountry.innerHTML = `
  <button class="btnBack" id="btnBack">
  <i class="fa-solid fa-arrow-left"></i> Back
  </button>
  <div class="countryData">
  <div class="countryFlag">
  <img src="${data.flags.png}" alt="" />
                </div>
                <div class="column1">
                 <div class="name">${data.name.common}</div>
                  <div class="nativeName">
                    <span class="title">Native name: </span>${
                      data.name.official
                    }
                  </div>
                  <div class="population">
                    <span class="title">Population: </span>${data.population.toLocaleString(
                      'en-US'
                    )}
                  </div>
                  <div class="region">
                    <span class="title">Region: </span>${data.region}
                  </div>
                  <div class="subRegion">
                    <span class="title">Sub Region: </span>${data.subregion}
                  </div>
                  <div class="capital">
                    <span class="title">Capital: </span>${data.capital}
                  </div>
                  <div class="borders">
                  <span class="title">Border Countries: </span>
                </div> 
                </div>
                <div class="column2">
                  <div class="topLevelDomain">
                    <span class="title">Top Level Domain: </span>${data.tld}
                  </div>
                  <div class="currencies">
                    <span class="title">Currencies: </span>${currName}
                  </div>
                  <div class="languages">
                    <span class="title">Languages: </span>${languages}
                  </div>
                </div>
              </div>
              `;

  bordCountries = document.createElement('div');
  bordCountries.classList.add('bordCountries');
  if (borders) {
    borders.forEach(border => {
      bordCountries.innerHTML += `
    <button class="btnBorders" id='${border}'>${border}</button>
    `;
    });
  } else {
    bordCountries.innerHTML += `
    `;
  }
  countries.innerHTML = '';
  searchAndFilter.style.display = 'none';
  container.appendChild(singleCountry);

  const button = document.querySelectorAll('button');
  button.forEach(button =>
    button.addEventListener('click', () => {
      if (button.id === 'btnBack') {
        countries.style.display = 'grid';
        container.removeChild(singleCountry);
        mainWindow();
      }
    })
  );

  const border = document.querySelector('.borders');
  border.appendChild(bordCountries);
  const btnBorder = document.querySelectorAll('.btnBorders');
  btnBorder.forEach(button =>
    button.addEventListener('click', () => {
      container.removeChild(singleCountry);
      filterByCode(button.id);
    })
  );
  if (smSize.matches) {
    searchAndFilter.style.cssText = 'display:none !important';
  }
};

singleCountry = async () => {
  try {
    let res = await (
      await fetch(`https://restcountries.com/v3.1/name/${searchInput.value}`)
    ).json();
    res.forEach(data => {
      singleCountryHtml(data);
    });
  } catch (error) {
    if (
      error ==
      `TypeError: res.forEach is not a function. (In 'res.forEach(data => {
      singleCountryHtml(data);
    })', 'res.forEach' is undefined)`
    ) {
      alert('Country maybe mispelled! Try Again :)');
    }
  }
};

filterByRegion = async target => {
  countries.innerText = '';
  let res = await (
    await fetch(`https://restcountries.com/v3.1/region/${target}`)
  ).json();
  res.forEach(data => {
    const country = document.createElement('div');
    country.classList.add('country');
    country.innerHTML = ` 
    
    <div class="flag" style="background: url(${data.flags.png}) no-repeat"></div>
    <div class="name">${data.name.common}</div>
    <div class="population">
    <span class="title">Population:</span> ${data.population}
    </div>
    <div class="region"><span class="title">Region:</span> ${data.region}</div>
    <div class="capital"><span class="title">Capital:</span> ${data.capital}</div>
    
    `;
    countries.appendChild(country);
  });
};

filterByCode = async target => {
  let res = await (
    await fetch(`https://restcountries.com/v3.1/alpha/${target}`)
  ).json();
  res.forEach(data => {
    singleCountryHtml(data);
  });
};
mainWindow();
regionEvent();
