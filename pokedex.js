fetch("https://pokeapi.co/api/v2/pokemon?limit=150")
  .then((response) => response.json())
  .then(readPokedex);

const container = document.getElementById("listPokemon");

const namePokemonInput = document.getElementById("namePokemon");
const searchButton = document.getElementById("search");
const pagePokemon = document.getElementById("pagePokemons");
let pokemonData = null;
let pokemonDataBegin = null;
let currentPage = 0;
let totalPages =0;
  

searchButton.addEventListener("click", searchClicked);


function searchClicked() {
  container.classList.remove("one-card");
  const searchPokemon = namePokemonInput.value.toLowerCase();
  container.innerHTML = "";

  const pokemonFiltered = [];

  pokemonData.results.forEach((element) => {
    if (element.name.includes(searchPokemon)) {
      pokemonFiltered.push(element);
    }
  });

if (pokemonFiltered.length === 0) {
    const errorMsg = document.createElement("p");
    errorMsg.textContent = "No Pokemon found with that name...";
    errorMsg.className = "error-message";
    container.appendChild(errorMsg);
  } else {

  printPokemon(pokemonFiltered);
  }
};

namePokemonInput.addEventListener("input", () => {
  const searchPokemon = namePokemonInput.value.toLowerCase();
  if (searchPokemon === "") {
    container.innerHTML = "";
    container.classList.remove("one-card");
    const begin = currentPage * 15;
    const end = begin + 15;
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

    card.addEventListener("click", () => {
      
      
      if (info.hasChildNodes()) {
        info.innerHTML = "";
        card.classList.remove("expanded");
        card.classList.add("closing");
        container.classList.remove("one-card");

        
        setTimeout(() => {
            card.classList.remove("closing"); 
        }, 500);
        return;
      }
      card.classList.add("expanded");
      container.classList.add("one-card");

      fetch("https://pokeapi.co/api/v2/pokemon/" + idPokemon + "/")
        .then((response) => response.json())
        .then((data) => {
            
          console.log(data);


          const typeColors = {
            fire: '#E62829',      
            grass: '#509C34',     
            electric: '#D8B600',  
            water: '#2980EF',     
            ground: '#A89050',    
            rock: '#A38C21',      
            fairy: '#FDB9E9',     
            poison: '#A040A0',    
            bug: '#729F3F',       
            dragon: '#5060E1',    
            psychic: '#F366B9',   
            flying: '#3DC7EF',    
            fighting: '#C22E28',  
            normal: '#A8A77A',    
            ice: '#3DCEF3',       
            ghost: '#7B62A3',     
            steel: '#9EB7B8'
          };
        
          const attributes = ["weight", "height", "types", "abilities","stats"];

          attributes.forEach(attribute => {
            const newElement = document.createElement("div");
            newElement.classList.add("stat-item");
            newElement.classList.add("stat-" + attribute);

            if (attribute === "types") {

              newElement.textContent = "Types: "

              newElement.classList.add("types-container");
              
              data.types.forEach((item) => {
                    const typeName = item.type.name
                    const span = document.createElement("span");
                    span.textContent = typeName;
                    span.classList.add("type-badge");
                    span.style.backgroundColor = typeColors[typeName] || '#666';
                    newElement.appendChild(span);

                  }); 

            } else if(attribute ==="stats"){
              const title = document.createElement("p");
              title.textContent = "Stats:";
              title.classList.add("stats-title");
              newElement.appendChild(title);

              const statsContainer = document.createElement("div");
              statsContainer.classList.add("stats-grid");

              data.stats.forEach(stat => {
                  const statText = document.createElement("p");
  
                  

                  statText.textContent = stat.stat.name.replace(/-/g," ") + ": " + stat.base_stat;
                  statText.classList.add("stat-text");
                  statsContainer.appendChild(statText);
              });
              newElement.appendChild(statsContainer);


            }
            
            else {

              let valueData = "";
            
              if (attribute === "abilities") {
              valueData = data.abilities.map(item => item.ability.name).join(", ");
            } else {
              valueData = data[attribute];
            }

            newElement.textContent = attribute + ": " + valueData;
            }
            info.appendChild(newElement);
          });

          const movesButton = document.createElement("button");
          movesButton.classList.add("button-learnMoves");
          movesButton.innerText = "Learn moves";
          info.appendChild(movesButton);

          movesButton.addEventListener("click", (event) => {
            event.stopPropagation();

            const existingList= movesButton.nextElementSibling;
            if (movesButton.nextElementSibling && movesButton.nextElementSibling.className === "moves-text") {
              existingList.innerHTML = "";
              existingList.remove();
              return;
            }
            //const moves = data.moves.map(item => item.move.name).join(", ");
            const movesList = document.createElement("ul");
            //const textMoves = document.createElement("p");
            movesList.className = "moves-text"; 

            data.moves.forEach(item =>{
              const moveItem = document.createElement("li")
              moveItem.textContent = item.move.name.replace(/-/g," ");
              movesList.appendChild(moveItem);
            });

            movesList.addEventListener("click", (e) => e.stopPropagation());
            info.appendChild(movesList);
          });
          
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
  totalPages = Math.ceil(pokemonData.results.length / 15);
  changePage(0);
  /*
  printPokemon(pokemonDataBegin);

  const pageSize = Math.ceil(pokemonData.results.length / 15)

  for (let index = 0; index < pageSize; index++) {
    const listPokemonbutton = document.createElement("button");
    listPokemonbutton.classList.add ("page-number-button");

    listPokemonbutton.innerText = index + 1
    pagePokemon.appendChild(listPokemonbutton);

    listPokemonbutton.addEventListener("click", () => {
      container.classList.remove("one-card")
      currentPage = index;
      container.innerHTML = "";
      let begin = index * 15;
      let end = begin + 15;

      const partPokemon = pokemonData.results.slice(begin, end);
      printPokemon(partPokemon);
    });
  }*/
}

function changePage(pageIndex){
  if (pageIndex< 0 || pageIndex > totalPages) return;
  
  currentPage = pageIndex;

  container.classList.remove("one-card");
  container.innerHTML = "";

  const begin = currentPage * 15;
  const end = begin + 15;
    
  printPokemon(pokemonData.results.slice(begin, end));
  updatePagination();
}

function updatePagination(){
pagePokemon.innerHTML = "";

const prevButton = document.createElement("button");
  prevButton.innerText = "<";
  prevButton.classList.add("page-number-button");
  if (currentPage === 0) prevButton.disabled = true;
  prevButton.addEventListener("click", () => changePage(currentPage - 1));
  pagePokemon.appendChild(prevButton);

  let start = Math.max(0, currentPage - 2);
  let end = Math.min(totalPages, start + 5);
  
  if (end - start < 5) {
      start = Math.max(0, end - 5);
  }

  for (let i = start; i < end; i++) {
    const btn = document.createElement("button");
    btn.innerText = i + 1;
    btn.classList.add("page-number-button");


  if (i === currentPage) {
    btn.classList.add("active")
    }

    btn.addEventListener("click", () => changePage(i));
    pagePokemon.appendChild(btn);
  }

  const nextButton = document.createElement("button");
  nextButton.innerText = ">";
  nextButton.classList.add("page-number-button");
  if (currentPage === totalPages - 1) nextButton.disabled = true;
  nextButton.addEventListener("click", () => changePage(currentPage + 1));
  pagePokemon.appendChild(nextButton);

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
