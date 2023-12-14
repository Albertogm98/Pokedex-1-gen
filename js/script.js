document.addEventListener('DOMContentLoaded', function () {
    // Lógica para cargar todos los Pokémon y mostrarlos en tarjetas
    loadAllPokemon();
});

function _applyFilters() {
    // Mostrar la pantalla de carga al aplicar los filtros
    document.getElementById('loadingScreen').classList.remove('loaded');

    // Agregar un pequeño retraso para permitir que la pantalla de carga se muestre
    setTimeout(() => {
        const pokemonList = document.getElementById("pokemonList");
        pokemonList.innerHTML = "";

        // Mostrar la lista filtrada
        const filteredPokemon = filterPokemon(window.pokemonList);
        if (filteredPokemon.length > 0) {
            for (const pokemon of filteredPokemon) {
                loadPokemonDetails(pokemon);
            }
        } else {
            // Mostrar mensaje de que no se encontraron Pokémon
            const noPokemonAlert = document.createElement("div");
            noPokemonAlert.classList.add("alert", "alert-warning", "mt-3");
            noPokemonAlert.textContent = "No se han encontrado Pokémon que coincidan con los filtros.";
            pokemonList.appendChild(noPokemonAlert);
        }

        // Ocultar la pantalla de carga cuando los datos estén listos
        setTimeout(() => {
            document.getElementById('loadingScreen').classList.add('loaded');
        }, 1200);

    }, 100); // Puedes ajustar el valor del tiempo de espera según sea necesario
}

async function loadAllPokemon() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        const data = await response.json();

        window.pokemonList = data.results;

        for (const pokemon of window.pokemonList) {
            await loadPokemonDetails(pokemon);
        }

        // Ocultar la pantalla de carga cuando los datos estén listos
        setTimeout(() => {
            document.getElementById('loadingScreen').classList.add('loaded');
        }, 2000);
        
    } catch (error) {
        console.error("Error al cargar los Pokémon:", error);
    }
}

async function loadPokemonDetails(pokemon) {
    try {
        const response = await fetch(pokemon.url);
        const data = await response.json();

        const urlParts = pokemon.url.split('/');
        const order = urlParts[urlParts.length - 2]; // Obtener el penúltimo elemento
        const name = data.name;
        const hp = data.stats[0].base_stat;
        const attack = data.stats[1].base_stat;
        const defense = data.stats[2].base_stat;
        const imageUrl = data.sprites.front_default; // Obtener la URL de la imagen frontal del Pokémon

        addPokemonCard(order, name, hp, attack, defense, imageUrl);
    } catch (error) {
        console.error("Error al cargar los detalles del Pokémon:", error);
    }
}

function addPokemonCard(order, name, hp, attack, defense, imageUrl) {
    const pokemonList = document.getElementById("pokemonList");

    // Aplicar clases de color según los valores de estadísticas
    const hpClass = getColorClass(hp);
    const attackClass = getColorClass(attack);
    const defenseClass = getColorClass(defense);

    const card = document.createElement("div");
    card.classList.add("col-md-3", "mb-4");

    card.innerHTML = `
        <div class="card">
            <img src="${imageUrl}" class="card-img-top mx-auto" alt="${name}">
            <div class="card-body">
                <h5 class="m-0 mb-2 card-title text-center">#${order} ${name}</h5>
                <p class="m-0 p-1 card-text"><i class="fa-solid fa-heart text-danger"></i> 
                    <span>${hp}</span>
                    <div class="progress">
                    <div class="progress-bar ${hpClass} progress-bar-fine" role="progressbar" style="width: ${(defense / 134) * 100}%;" aria-valuenow="${defense}" aria-valuemin="0" aria-valuemax="134"></div>                    </div>
                </p>
                <p class="m-0 p-1 card-text"><img class="m-0 icono-stats" src="img/espada.png"/> 
                    <span>${attack}</span>
                    <div class="progress">
                    <div class="progress-bar ${attackClass} progress-bar-fine" role="progressbar" style="width: ${(attack / 134) * 100}%;" aria-valuenow="${attack}" aria-valuemin="0" aria-valuemax="134"></div>                    </div>
                </p>
                <p class="m-0 p-1 card-text"><img class="m-0 icono-stats" src="img/escudo.png"/>
                    <span>${defense}</span>
                    <div class="progress">
                        <div class="progress-bar ${defenseClass} progress-bar-fine" role="progressbar" style="width: ${(defense / 134) * 100}%;" aria-valuenow="${defense}" aria-valuemin="0" aria-valuemax="134"></div>
                    </div>
                </p>
            </div>
        </div>
    `;

    pokemonList.appendChild(card);
}


// Función para obtener la clase de color según el valor de la estadística
function getColorClass(statValue) {
    if (statValue < 40) {
        return "bg-danger"; // Rojo
    } else if (statValue < 70) {
        return "bg-warning"; // Amarillo
    } else {
        return "bg-success"; // Verde
    }
}


function filterPokemon(pokemonList) {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const numberInput = document.getElementById('pokemonNumber').value;

    return pokemonList.filter(pokemon => {
        const nameMatch = pokemon.name.toLowerCase().startsWith(searchInput);
        
        // Obtener el número de la Pokedex desde la URL del Pokémon
        const urlParts = pokemon.url.split('/');
        const pokemonNumber = urlParts[urlParts.length - 2]; // Obtener el penúltimo elemento
        const numberMatch = numberInput === "" || parseInt(numberInput) === parseInt(pokemonNumber);

        return nameMatch && numberMatch;
    });
}
