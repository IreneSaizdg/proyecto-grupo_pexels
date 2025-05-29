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

//Paginación
const paginacion = document.querySelector("#pagination");
const actualPagina = document.querySelector("#actualPage");

const fragment = document.createDocumentFragment();

const orientationFilter = document.querySelector("#orientationFilter")

// Ultima fetch realizada
let lastFetch = "";
let category = "";


// array de Categorias
const arrCategory = [
    { category: "ocean", name: "Oceano" },
    { category: "people", name: "Personas" },
    { category: "nature", name: "Naturaleza" }
];

//SearchInput ficticio
const searchInput = {
    value: "sea",
}



//EVENTOS ------------------------------------------------------------------------->

/* searchButton.addEventListener("click", (ev) => {
    filterByKeywords();
}) */



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
    if (ev.target.id === arrCategory[0].category){
        const dataAPI = await getDataFromSearch(ev.target.id, orientationFilter.value, null); //Llama a la API pasándo por parámetro el query, la orientación y las keywords.
        fillGallery(dataAPI)//Llena la galería
    }
    if (ev.target.id === arrCategory[1].category){
        const dataAPI = await getDataFromSearch(ev.target.id, orientationFilter.value, null); //Llama a la API pasándo por parámetro el query, la orientación y las keywords.
        fillGallery(dataAPI)//Llena la galería
    }
    if (ev.target.id === arrCategory[2].category){
        const dataAPI = await getDataFromSearch(ev.target.id, orientationFilter.value, null); //Llama a la API pasándo por parámetro el query, la orientación y las keywords.
        fillGallery(dataAPI)//Llena la galería
    }
})

// Evento paginación
/**
 * Evento para detectar los botones de paginación y realice la acción pertinente (Siguiente Pagina, Pagina anterior, Primera pagina, Ultima pagina)
 */
paginacion.addEventListener("click", (ev) => {
    if (ev.target.id === "nextPage"){
        if (lastFetch.next_page){
            nextPage(lastFetch);
        } else {
            ev.target.disabled;
        }
    }
    if (ev.target.id === "beforePage"){
        if (lastFetch.prev_page){
            prevPage(lastFetch);
        }else {
            ev.target.disabled;
        }
    }
    if (ev.target.id === "firstPage"){
        firstPage(lastFetch);
    }
    if (ev.target.id === "lastPage"){
        lastPage(lastFetch);
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
const getDataFromSearch = async (query, orientation = "landscape", page = 1,  words) => {
    const myString = `https://api.pexels.com/v1/search?query=${query}&orientation=${orientation}&page=${page}`;
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
        actualPagina.innerHTML = json.page;
        fragment.append(card);
    });
    cardContainer.append(fragment)

}

// filterCategory --
/**
 * Crear y pinta las categorias. 
 * Dentro recorremos el array arrCategoria con las categorias que queremos añadir.
 */
const createCategory = () => {
    arrCategory.forEach(async (item, indez, array) => {
        const objImg = await getImgCat(item.category);
        const title = item.name;
        fillCategory([objImg, title, item.category]);
    })

}
/**
 * Llamamos a getDataFromSearch para recorrer del API los datos necesarios para pintar la categoria.
 * @param {String} query Categoria de la que será la imagen
 * @param {Number} porPagina Número de objetos (imagenes) por pagina
 * @returns Retorna el objeto (imagen) de la llamada de la API.
 */
const getImgCat = async (query, porPagina = 1) => {

    const myImg = `https://api.pexels.com/v1/search?query=${query}&per_page=${porPagina}`;
    let img = await getDataFromSearch(myImg);
    category = query;
    return img;

}

/**
 * Crea y pinta todos los elementos.
 * @param {Array} param0 [objImg] => Recive el objeto (imagen). [title] => Titulo de la categoria. [category] => query que interpreta la API
 */
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

// Paginación
/**
 * Pasa a la siguiente pagina de imagenes y pinta en el DOM
 * @param {Object} json Objeto actual por la cual sacaremos la siguiente pagina
 */
const nextPage = async (json) => {
    console.log("next page: ", json);
    const fetch = await obtainDataFromAPI(json.next_page);
    actualPagina.innerHTML = json.page+1;
    fillGallery(fetch);
}
/**
 * Pasa a la anterior pagina de imagenes y pinta en el DOM
 * @param {Object} json Objeto actual por la cual sacaremos la pagina anterior
 */
const prevPage = async (json) => {
    //console.log("prev page: ", json);
    const fetch = await obtainDataFromAPI(json.prev_page);
    actualPagina.innerHTML = json.page-1;
    fillGallery(fetch);
}
/**
 * Pasa a la primera pagina de imagenes y pinta en el DOM
 * @param {Object} json Objeto actual por la cual sacaremos la primera pagina
 */
const firstPage = async (json) => {
    //console.log("first page: ", json);
    const url = `https://api.pexels.com/v1/search?query=${category}`
    const fetch = await getDataFromSearch(url);
    actualPagina.innerHTML = 1;
    //console.log("first: ", fetch);
    fillGallery(fetch);
}
/**
 * Pasa a la ultima pagina de imagenes y pinta en el DOM
 * @param {Object} json Objeto actual por la cual sacaremos la ultima pagina
 */
const lastPage = async (json) => {
    //console.log("first page: ", json);
    const total = json.total_results;
    const pagina = total / json.per_page;
    const url = `https://api.pexels.com/v1/search?query=${category}&page=${pagina}`;
    const fetch = await getDataFromSearch(url);
    actualPagina.innerHTML = pagina;
    //console.log("first: ", fetch);
    fillGallery(fetch);
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

