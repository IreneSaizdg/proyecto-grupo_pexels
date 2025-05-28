// VARIABLES (elementos del DOM, objetos, arrays...) -> EVENTOS -> FUNCIONES -> INVOCACIONES(a funciones)

// LLAMADAS A API -> Filtros en el fetch: Categorias, Palabras, orientación, Cantidad de imagenes, 
// 2EndPoints: (búsqueda) https://api.pexels.com/v1/search    (imagen por id para favoritos) https://api.pexels.com/v1/photos/:id



/*PSEUDOCODE:

*/





//VARIABLES ------------------------------------------------------------------------>

//Elementos del DOM
const cardContainer = document.querySelector("#cardsContainer");
const wordFilter = document.querySelector("#wordFilter");
const searchButton = document.querySelector("#searchButton")
const fragment = document.createDocumentFragment();
const favoriteButton = document.querySelector("#favoriteButton");

const orientationFilter = document.querySelector("#orientationFilter")

//SearchInput ficticio
const searchInput = {
    value: "sea",
}


//EVENTOS ------------------------------------------------------------------------->

searchButton.addEventListener("click", (ev) => {
    filterByKeywords();
})


//Evento al cambiar la opción del selector (filtro por orientación)
orientationFilter.addEventListener("change", manageOrientationChange);

cardContainer.addEventListener("click", (ev) => {
    if (ev.target.matches(".favoriteCheckbox")) {
        const card = ev.target.parentElement.parentElement;
        const cardId = card.id;
        const title = card.querySelector("h1").textContent;
        const img = card.querySelector("img").src;
        const checked = ev.target.checked

        // console.log("checkbox: ", card.id)
        if (checked) {
            saveInLocalStorage(cardId, title, img);
        } else {
            deleteInLocalStorage(cardId);
        }

    }
})




//Función para gestionar el cambio de orientación en el selector
async function manageOrientationChange() {
    const query = searchInput.value || "no hay query"; //Variable a asignar externamente para el query

    const selectedOrientation = orientationFilter.value; //La orientación seleccionada será igual que la del selector seleccionado 
    const orientationData = await getDataFromSearch(query, selectedOrientation); //Llama a la función 
    fillGallery(orientationData.photos); //Llena la galería en base a la data de orientación. 

    //console.log(event.target.value) //target es el elemento del selector seleccionado.
}

favoriteButton.addEventListener("click", (eve) => {
    // get Datos from 
    // obtengo los datos del localStorage. Luego pinto los datos
    const favoritesArray = JSON.parse(localStorage.getItem("favoritesArray")) || [];
    fillGallery(favoritesArray)

})


//FUNCIONES ----------------------------------------------------------------------->


const saveInLocalStorage = (id, title, image) => {
    const imgObject = {
        id: id,
        alt: title,
        src: { tiny: image }
    }
    const favoritesArray = JSON.parse(localStorage.getItem("favoritesArray")) || [];
    console.log(favoritesArray)
    favoritesArray.push(imgObject);
    localStorage.setItem("favoritesArray", JSON.stringify(favoritesArray))

}

const deleteInLocalStorage = (id) => {
    const favoritesArray = JSON.parse(localStorage.getItem("favoritesArray")) || [];
    const favoritesArrayFiltered = favoritesArray.filter(element => {
        return element.id != id;
    })
    console.log(favoritesArrayFiltered)
    localStorage.setItem("favoritesArray", JSON.stringify(favoritesArrayFiltered))
}

/**
 * Rellena la galería con la fotos obtenidas usando las keywords en el filtro.
 */
const filterByKeywords = async () => {
    searchButton.disabled = true;
    const filterVlue = wordFilter.value.trim();
    const dataAPI = await getDataFromSearch(filterVlue, "landscape", null);
    fillGallery(dataAPI.photos);
    searchButton.disabled = false;
}


/**
 * Obtener datos con el uso del endpoint Search.
 * @param {string} query 
 * @param {string} orientation 
 * @param {Array} words 
 * @returns {Object}g
 */
const getDataFromSearch = async (query, orientation, words) => {
    const myString = `https://api.pexels.com/v1/search?query=${query}&orientation=${orientation}`;
    return await obtainDataFromAPI(myString); //Cuando invocamos esta función invoca también obtainDataFromAPI con nuestra nueva URL. 
}

/**
 * Realiza un fetch a la API de pexels con una url.
 * @param {string} url a utilizar en la llamada a la api.
 * @returns {Object} información devuelta por la llamada a la api.
 */
const obtainDataFromAPI = async (url) => {//Esta función se repite y queda automatizada.
    try {
        const dataAPI = await fetch(url, {//Fetch necesita ("URL", {objeto con los ajustes de petición})
            headers: {
                Authorization: "yyWlCwJBhQa7uDLshqAo4lPIdhSd00VEz6p5vuix6srVMfJTnXEdiEYv" //Authorization es un objeto
            }
        })
        if (dataAPI.ok) {
            const json = await dataAPI.json(); // El método .json() devuelve una promesa, por eso hay que poner el await.
            return json;
        } else {
            throw "No se consiguieron las imágenes solicitadas" //Error (mandar a catch)
        }

    } catch (error) {
        console.log(error); //Coje la info del throw
    }

}
const createCard = (photo) => {
    //Creas los elementos.
    const cardArticle = document.createElement("ARTICLE");
    const imgDiv = document.createElement("DIV");
    const photoImg = document.createElement("IMG");
    const title = document.createElement("H1");
    const favDiv = document.createElement("DIV");
    const favCheckbox = document.createElement("INPUT");
    //Asignas los valores de los elementos.
    cardArticle.classList.add("card");
    cardArticle.id = photo.id;

    photoImg.src = photo.src.tiny;
    photoImg.alt = photo.alt
    title.textContent = photo.alt;

    favCheckbox.type = "checkbox";
    favCheckbox.id = "favoriteImgs";
    favCheckbox.name = "favoriteImgs";
    favCheckbox.classList.add("favoriteCheckbox")
    const favoritesArray = JSON.parse(localStorage.getItem("favoritesArray")) || [];
    const cardExistInFavorite = favoritesArray.find(element => {
        return Number(element.id) === photo.id;
    });
    console.log(cardExistInFavorite);
    favCheckbox.checked = cardExistInFavorite

    //Appends
    imgDiv.append(photoImg);
    favDiv.append(favCheckbox);

    cardArticle.append(imgDiv);
    cardArticle.append(title);
    cardArticle.append(favDiv);

    // console.log(photo);
    return cardArticle;
}

/**
 * Pinta las cards en la galeria.
 * @param {Object} -> Array con todos los datos de los objetos photos
 */
const fillGallery = (photos) => { //Desestructurado de (json.photos)
    cardContainer.innerHTML = ""; //Vacía el contenedor previamente
    photos.forEach(element => {
        const card = createCard(element)
        fragment.append(card);
    });
    cardContainer.append(fragment)

}






//INVOCACIONES -------------------------------------------------------------------->

/**
 * Inicializa la galeria obteniendo los datos desde la API con getDataFromSearch.
 */
//PROVISIONAL
const init = async () => { //init -> Inicializa
    const dataAPI = await getDataFromSearch(searchInput.value, orientationFilter.value, null); //Llama a la API pasándo por parámetro el query, la orientación y las keywords.
    fillGallery(dataAPI.photos)//Llena la galería
}

init()

