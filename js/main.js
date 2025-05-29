// VARIABLES (elementos del DOM, objetos, arrays...) -> EVENTOS -> FUNCIONES -> INVOCACIONES(a funciones)

// LLAMADAS A API -> Filtros en el fetch: Categorias, Palabras, orientación, Cantidad de imagenes, 
// 2EndPoints: (búsqueda) https://api.pexels.com/v1/search    (imagen por id para favoritos) https://api.pexels.com/v1/photos/:id



/*PSEUDOCODE:

*/


/* Categorias

    3 categorias -> 3 divs
    fetch de una imagen por categoria
    pintar imagen y titulo
*/


//VARIABLES ------------------------------------------------------------------------>

//Elementos del DOM
const cardContainer = document.querySelector("#cardsContainer");

const wordFilter = document.querySelector("#wordFilter");
const searchButton = document.querySelector("#searchButton")

const listCategory = document.querySelector("#categoryList");

const paginacion = document.querySelector("#pagination");

const fragment = document.createDocumentFragment();

const orientationFilter = document.querySelector("#orientationFilter")

const favoritesButton = document.querySelector("#favoritesButton");
//Esto deberia de ser una variable de entorno
const API_KEY = "yyWlCwJBhQa7uDLshqAo4lPIdhSd00VEz6p5vuix6srVMfJTnXEdiEYv";
const URL_BASE = "https://api.pexels.com/v1/"

// Ultima fetch realizada
let lastFetch = "";


// array de Categorias
const arrCategory = [
    { category: "ocean", name: "Oceano" },
    { category: "flower", name: "Flores" },
    { category: "nature", name: "Naturaleza" }
];

let lastQuery = "";


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
        const title = card.querySelector("h4").textContent;
        const img = card.querySelector("img").src;
        const checked = ev.target.checked

        if (checked) {
            saveInLocalStorage(cardId, title, img);
        } else {
            deleteInLocalStorage(cardId);
        }
    }
})




favoritesButton.addEventListener("click", (eve) => {
    // get Datos from 
    // obtengo los datos del localStorage. Luego pinto los datos
    const favoritesArray = JSON.parse(localStorage.getItem("favoritesArray")) || [];
    console.log("favorites: " + favoritesArray)
    fillGallery(favoritesArray)

})


//FUNCIONES ----------------------------------------------------------------------->
/**
 * Obtiene el array de imágenes favoritas desde el localStorage.
 * @returns {Array} - Devuelve el array de objetos de imágenes favoritas,
 *                    o un array vacío si no hay nada guardado.
 */
const getFavoritesArray = () => {
    return JSON.parse(localStorage.getItem("favoritesArray")) || [];
}

/**
 * Guarda un conjunto de imágenes favoritas en el localStorage.
 * @param  {...any} elements - Una lista de objetos que representan imágenes favoritas.
 */
const setFavoritesArray = (...elements) => {
    localStorage.setItem("favoritesArray", JSON.stringify(elements));
}


//Función para gestionar el cambio de orientación en el selector
async function manageOrientationChange() {
    const selectedOrientation = orientationFilter.value; //La orientación seleccionada será igual que la del selector seleccionado 
    const orientationData = await getDataFromSearch(lastQuery, selectedOrientation); //Llama a la función 
    fillGallery(orientationData.photos); //Llena la galería en base a la data de orientación. 

    //console.log(event.target.value) //target es el elemento del selector seleccionado.
}


/**
 * Guarda una imagen en la seccion de favoritos dentro de  local storage.
 * @param {number} id - Identificador único de la imagen.
 * @param {string} title - Título o descripción alternativa de la imagen.
 * @param {string} image - URL de la imagen (formato pequeño).
 */
const saveInLocalStorage = (id, title, image) => {
    const imgObject = {
        id: id,
        alt: title,
        src: { tiny: image }
    }
    const favoritesArray = getFavoritesArray();
    setFavoritesArray(...favoritesArray, imgObject);
}


//Evento para fetch categorias
listCategory.addEventListener("click", async (ev) => {
    if (ev.target.matches(".categoryFilter")) {
        const dataAPI = await getDataFromSearch(ev.target.id, orientationFilter.value); //Llama a la API pasándo por parámetro el query, la orientación y las keywords.
        fillGallery(dataAPI.photos)//Llena la galería
    }
})


/**
 * Elimina una imagen del local storage usando su ID.
 * @param {Number} id - Identificador de la imagen a eliminar.
 */
const deleteInLocalStorage = (id) => {
    const favoritesArray = JSON.parse(localStorage.getItem("favoritesArray")) || [];
    const favoritesArrayFiltered = favoritesArray.filter(element => {
        return element.id != id;
    })
    setFavoritesArray(...favoritesArrayFiltered);
}

/**
 * Rellena la galería con la fotos obtenidas usando las keywords en el filtro.
 */
const filterByKeywords = async () => {
    searchButton.disabled = true;
    const filterVlue = wordFilter.value.trim();
    const dataAPI = await getDataFromSearch(filterVlue, "landscape");
    fillGallery(dataAPI.photos);
    lastFetch = dataAPI;
    searchButton.disabled = false;
}


/**
 * Obtener datos con el uso del endpoint Search.
 * @param {string} query 
 * @param {string} orientation 
 * @param {Array} words 
 * @returns {Object}g
 */
const getDataFromSearch = async (query, orientation, perPage = 16) => {
    lastQuery = query;
    console.log(orientation)
    const myString = `${URL_BASE}search?query=${query}&orientation=${orientation}&per_page=${perPage}`;
    return await obtainDataFromAPI(myString); //Cuando invocamos esta función invoca también obtainDataFromAPI con nuestra nueva URL. 
}


/**
 * Obtener datos con el uso del endpoint photo.
 * @param {number} id identificador de la imagen a buscar.
 * @returns 
 */
const getDataFromPhoto = async (id) => {
    const myString = `${URL_BASE}photo?id=${id}`;
    return await obtainDataFromAPI(myString);
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
                Authorization: API_KEY //Authorization es un objeto
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
    const title = document.createElement("H4");
    const favDiv = document.createElement("DIV");
    const favCheckbox = document.createElement("INPUT");
    const favP = document.createElement("P");
    //Asignas los valores de los elementos.

    cardArticle.classList.add("cardArticle");

    cardArticle.classList.add("card");
    cardArticle.id = photo.id;


    photoImg.src = photo.src.tiny;
    photoImg.alt = photo.alt
    title.textContent = photo.alt;

    favCheckbox.type = "checkbox";

    favCheckbox.id = "favImgs";
    favCheckbox.name = "favImgs";
    favCheckbox.classList.add("favCheckbox");
    favDiv.classList.add("favDiv");
    favP.textContent = "añadir a favoritos";

    favCheckbox.classList.add("favoriteCheckbox")
    const favoritesArray = JSON.parse(localStorage.getItem("favoritesArray")) || [];
    const cardExistInFavorite = favoritesArray.find(element => {
        return element.id == photo.id;
    });
    favCheckbox.checked = cardExistInFavorite


    //Appends
    imgDiv.append(photoImg);
    favDiv.append(favP, favCheckbox);

    cardArticle.append(imgDiv, title, favDiv);

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

// filterCategory --

const createCategory = () => {
    arrCategory.forEach(async (item, indez, array) => {
        const objImg = await getDataFromSearch(item.category, orientationFilter, 1)
        const title = item.name;
        fillCategory([objImg, title, item.category]);
    })

}


const fillCategory = ([objImg, title, category]) => {
    const article = document.createElement("ARTICLE");
    const divImg = document.createElement("DIV");
    const img = document.createElement("IMG");
    const titulo = document.createElement("H3");

    article.setAttribute("id", `category${category}`);
    article.classList.add("categoryCard");
    divImg.classList.add("imgDiv");
    img.setAttribute("id", category);
    img.classList.add("categoryFilter");
    img.setAttribute("src", objImg.photos[0].src.tiny);
    titulo.innerHTML = title;

    divImg.append(img);
    article.append(divImg, titulo)
    fragment.append(article);
    listCategory.append(fragment);

}


//INVOCACIONES -------------------------------------------------------------------->

/**
 * Inicializa la galeria obteniendo los datos desde la API con getDataFromSearch.
 */
//PROVISIONAL
const init = async () => { //init -> Inicializa
    createCategory(arrCategory);
    const dataAPI = await getDataFromSearch(arrCategory[0].category, orientationFilter.value); //Llama a la API pasándo por parámetro el query, la orientación y las keywords.
    fillGallery(dataAPI.photos)//Llena la galería
    // filterCategory

}

init()

