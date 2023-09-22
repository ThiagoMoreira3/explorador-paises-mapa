// Seleciona o botão de pesquisa e o campo de entrada de texto no HTML
let searchBtn = document.getElementById("search-btn");
let countryInp = document.getElementById("country-inp");

// Inicializa o mapa com uma visualização padrão
let map = L.map('map').setView([0, 0], 2);

// Inicializa uma variável para o marcador do mapa
let marker = null; // Inicialmente, não há marcador

// Adiciona um mapa de fundo usando a biblioteca Leaflet
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Adiciona um ouvinte de evento para o botão de pesquisa
searchBtn.addEventListener("click", () => {
    // Obtém o nome do país inserido pelo usuário
    let countryName = countryInp.value;

    // Monta a URL da API com base no nome do país
    let finalURL = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;
    console.log(finalURL);
    
    // Envia uma solicitação para a API e manipula a resposta
    fetch(finalURL)
        .then((response) => response.json())
        .then((data) => {
            // Atualiza o conteúdo da div "result" com informações sobre o país
            result.innerHTML = `
            <img src="${data[0].flags.svg}" class="flag-img">
            <h2>${data[0].name.common}</h2>
            <div class="wrapper">
            <div class="data-wrapper">
                <h4>Nome em Português:</h4>
                <span>${data[0].translations.por.common}</span>
            </div>
        </div>
            <div class="wrapper">
                <div class="data-wrapper">
                    <h4>Capital:</h4>
                    <span>${data[0].capital[0]}</span>
                </div>
            </div>
            <div class="wrapper">
                <div class="data-wrapper">
                    <h4>Continente:</h4>
                    <span>${data[0].continents[0]}</span>
                </div>
            </div>
            <div class="wrapper">
                <div class="data-wrapper">
                    <h4>População:</h4>
                    <span>${data[0].population}</span>
                </div>
            </div>
            <div class="wrapper">
                <div class="data-wrapper">
                    <h4>Latitude e longitude:</h4>
                    <span>${data[0].latlng[0]}, ${data[0].latlng[1]}</span>
                </div>
            </div>
            <div class="wrapper">
                <div class="data-wrapper">
                    <h4>Moeda:</h4>
                    <span>${
                    data[0].currencies[Object.keys(data[0].currencies)].name
                    } - ${Object.keys(data[0].currencies)[0]}</span>
                </div>
            </div>
            <div class="wrapper">
                <div class="data-wrapper">
                    <h4>Idioma(s):</h4>
                    <span>${Object.values(data[0].languages)
                    .toString()
                    .split(",")
                    .join(", ")}</span>
                </div>
            </div>
        `;

        // Verifica se já existe um marcador e o remove se existir
        if (marker) {
            marker.removeFrom(map);
        }

        // Move o mapa para as coordenadas do país após a pesquisa
        map.setView([data[0].latlng[0], data[0].latlng[1]], 4);

        // Adiciona um novo marcador na nova localização
        marker = L.marker([data[0].latlng[0], data[0].latlng[1]]).addTo(map)
            .openPopup();
    })
    .catch(() => {
        // Manipula erros, como campos vazios ou nomes de países inválidos
        if (countryName.length == 0) {
            result.innerHTML = `<h3>O campo de texto não pode ficar vazio.</h3>`;
        } else {
            result.innerHTML = `<h3>Insira um nome de país válido.</h3>`;
        }
    });
});
