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
const fragment = document.createDocumentFragment();

const listCategory = document.querySelector("#categoryList");

const paginacion = document.querySelector("#pagination");

const fragment = document.createDocumentFragment();

const orientationFilter = document.querySelector("#orientationFilter")

// Ultima fetch realizada
let lastFetch = "";


// array de Categorias
const arrCategory = [
    { category: "ocean", name: "Oceano" },
    { category: "flower", name: "Flores" },
    { category: "nature", name: "Naturaleza" }
];

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


//Función para gestionar el cambio de orientación en el selector
async function manageOrientationChange() {
    const query = searchInput.value || "no hay query"; //Variable a asignar externamente para el query

    const selectedOrientation = orientationFilter.value; //La orientación seleccionada será igual que la del selector seleccionado 
    const orientationData = await getDataFromSearch(query, selectedOrientation); //Llama a la función 
    fillGallery(orientationData); //Llena la galería en base a la data de orientación. 

    //console.log(event.target.value) //target es el elemento del selector seleccionado.
}

//Evento para fetch categorias
listCategory.addEventListener("click", async (ev) => {
    if (ev.target.id === "ocean"){
        const dataAPI = await getDataFromSearch(ev.target.id, orientationFilter.value, null); //Llama a la API pasándo por parámetro el query, la orientación y las keywords.
        fillGallery(dataAPI)//Llena la galería
    }
    if (ev.target.id === "flower"){
        const dataAPI = await getDataFromSearch(ev.target.id, orientationFilter.value, null); //Llama a la API pasándo por parámetro el query, la orientación y las keywords.
        fillGallery(dataAPI)//Llena la galería
    }
    if (ev.target.id === "nature"){
        const dataAPI = await getDataFromSearch(ev.target.id, orientationFilter.value, null); //Llama a la API pasándo por parámetro el query, la orientación y las keywords.
        fillGallery(dataAPI)//Llena la galería
    }


})


//FUNCIONES ----------------------------------------------------------------------->
/**
 * Rellena la galería con la fotos obtenidas usando las keywords en el filtro.
 */
const filterByKeywords = async () => {
    searchButton.disabled = true;
    const filterVlue = wordFilter.value.trim();
    const dataAPI = await getDataFromSearch(filterVlue, "landscape", null);
    fillGallery(dataAPI);
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

    photoImg.src = photo.src.tiny;
    photoImg.alt = photo.alt
    title.textContent = photo.alt;

    favCheckbox.type = "checkbox";
    favCheckbox.id = "favoriteImgs";
    favCheckbox.name = "favoriteImgs";

    //Appends
    imgDiv.append(photoImg);
    favDiv.append(favCheckbox);

    cardArticle.append(imgDiv);
    cardArticle.append(title);
    cardArticle.append(favDiv);

    return cardArticle;
}

/**
 * Pinta las cards en la galeria.
 * @param {Object} -> Array con todos los datos de los objetos photos
 */

const fillGallery = (json) => { //Desestructurado de (json.photos)
    cardContainer.innerHTML = ""; //Vacía el contenedor previamente
    lastFetch = json;
    json.photos.forEach(element => {
        const card = createCard(element)
        fragment.append(card);
    });
    cardContainer.append(fragment)

}

// filterCategory --

const createCategory = () => {
    arrCategory.forEach(async (item, indez, array) => {
        const objImg = await getImgCat(item.category);
        const title = item.name;
        fillCategory([objImg, title, item.category]);
    })

}

const getImgCat = async (query, porPagina = 1) => {

    const myImg = `https://api.pexels.com/v1/search?query=${query}&per_page=${porPagina}`;
    let img = await getDataFromSearch(myImg);
    return img;

}


const fillCategory = ([objImg, title, category]) => {
    const article = document.createElement("ARTICLE");
    const divImg = document.createElement("DIV");
    const img = document.createElement("IMG");
    const titulo = document.createElement("H1");

    //console.log(ocean.photos[0].src.tiny);
    //console.log("imagen: ", imgOcean);
    img.setAttribute("id",category);
    article.setAttribute("id", `category${category}`);
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
    const dataAPI = await getDataFromSearch(searchInput.value, orientationFilter.value, null); //Llama a la API pasándo por parámetro el query, la orientación y las keywords.
    fillGallery(dataAPI)//Llena la galería
    createCategory(arrCategory); // filterCategory
}

init()

