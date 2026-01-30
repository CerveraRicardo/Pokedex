fetch("https://pokeapi.co/api/v2/pokemon?limit=150")
  .then((response) => response.json())
  .then(readPokedex);

const container = document.getElementById("listPokemon");
listPokemon.classList.add = "ListPokemon";

const namePokemonInput = document.getElementById("namePokemon");
const searchButton = document.getElementById("search");
const pagePokemon = document.getElementById("pagePokemons");
let pokemonData = null;
let pokemonDataBegin = null;
let currentPage = 0;

searchButton.addEventListener("click", searchClicked);

function searchClicked() {
  const searchPokemon = namePokemonInput.value.toLowerCase();
  container.innerHTML = "";

  const pokemonFiltered = [];

  pokemonData.results.forEach((element) => {
    if (element.name.includes(searchPokemon)) {
      pokemonFiltered.push(element);
    }
  });

  printPokemon(pokemonFiltered);
};

namePokemonInput.addEventListener("input", () => {
  const searchPokemon = namePokemonInput.value.toLowerCase();
  if (searchPokemon === "") {
    container.innerHTML = "";
    const begin = currentPage * 20;
    const end = begin + 20;
    printPokemon(pokemonData.results.slice(begin, end));
    return
  }
});

function printPokemon(pokemons) {
  pokemons.forEach((element, index) => {
    
    console.log(element);
    
    const card = document.createElement('div');
    card.className = "pokemon-card";

    const part = element.url.split('/');
    let idPokemon = part[6];
    
    console.log(idPokemon)

    const pokemon = document.createElement('p');
    pokemon.textContent = element.name;
    pokemon.className = "title-name";

    const image = document.createElement('img');
    image.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + idPokemon +".png";
    const info = document.createElement("div");

    image.addEventListener("click", () => {
      
      if (info.hasChildNodes()) {
        return;
      }

      fetch("https://pokeapi.co/api/v2/pokemon/" + idPokemon + "/")
        .then((response) => response.json())
        .then((data) => {
            
          console.log(data);

          const attributes = ["weight", "height", "types", "abilities"];

          attributes.forEach(attribute => {
            const newElement = document.createElement("p");
            
            newElement.classList.add("stat-item");
            newElement.classList.add("stat-" + attribute);

            let valueData = "";

            if (attribute === "types") {
              valueData = data.types.map(item => item.type.name).join(", ");
            } else if (attribute === "abilities") {
              valueData = data.abilities.map(item => item.ability.name).join(", ");
            } else {
              valueData = data[attribute];
            }

            newElement.textContent = attribute + ": " + valueData;
            info.appendChild(newElement);
          });

          const movesButton = document.createElement("button");
          movesButton.classList.add("button-learnMoves");
          movesButton.innerText = "Learn moves";
          
          movesButton.addEventListener("click", () => {
            if (movesButton.nextElementSibling && movesButton.nextElementSibling.className === "moves-text") {
              return;
            }
            const moves = data.moves.map(item => item.move.name).join(", ");
            
            const textMoves = document.createElement("p");
            textMoves.className = "moves-text"; 
            textMoves.textContent = "Moves: " + moves;
            
            info.appendChild(textMoves);
          });

          info.appendChild(movesButton);
        });
    });


    card.appendChild(pokemon);
    card.appendChild(image);
    card.appendChild(info);

    container.appendChild(card);
  });
}

function readPokedex(data) {
  console.log(data);
  
  pokemonData = data;
  pokemonDataBegin = pokemonData.results.slice(0, 15);

  printPokemon(pokemonDataBegin);

  const pageSize = Math.ceil(pokemonData.results.length / 15)

  for (let index = 0; index < pageSize; index++) {
    const listPokemonbutton = document.createElement("button");
    listPokemonbutton.classList.add ("page-number-button");

    listPokemonbutton.innerText = index + 1
    pagePokemon.appendChild(listPokemonbutton);

    listPokemonbutton.addEventListener("click", () => {
      currentPage = index;
      container.innerHTML = "";
      let begin = index * 15;
      let end = begin + 15;

      const partPokemon = pokemonData.results.slice(begin, end);
      printPokemon(partPokemon);
    });
  }
}


//1.flex
//2.utilizar flex para que los pokemons se muestren en filas de 3
//subir repositorio a git



// Mostrar en el navegador los nombres de los pokemones


// Buscar si hay una forma de  usar https://pokeapi.co/api/v2/pokemon y que ademas de los nombres retorne la imagen
//sin usar 150 fetch


// Una vez que encuentres como obtener la imagen, muestra el nombre del pokemon con la imagen
// Recuerda que tienes que agregar el html que quieres modificar en el index.html. Lo puedes modificar usando el document.getElementByiD



//poner saur salgan todos.
//crear una funcion 
// 
/**
   * 
   * si escribiste "vasur"
   * 
   * pokemonFiltered = [
   * 
   *  {name: "bulvasur", url: ....},
    *  {name: "ivasur", url: ....},
   *  {name: "venasur", url: ....},

   * ]


  printPokemon(pokemonFiltered)
   */



    /*let idPokemon = index + 1
    const pokemon = document.createElement('p'); 
  
    pokemon.textContent = element.name;
  
    const image = document.createElement('img');
    image.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+ idPokemon + '.png';

    container.appendChild(pokemon);
    container.appendChild(image);
    */
