// VARIABLES (elementos del DOM, objetos, arrays...) -> EVENTOS -> FUNCIONES -> INVOCACIONES(a funciones)


/*PSEUDOCODE:
    
*/

// LLAMADAS A API -> Filtros en el fetch: Categorias, Palabras, orientación, Cantidad de imagenes, 
//2EndPoints: (búsqueda) https://api.pexels.com/v1/search    (imagen por id para favoritos) https://api.pexels.com/v1/photos/:id

/* Categorias

    3 categorias -> 3 divs
    fetch de una imagen por categoria
    pintar imagen y titulo
*/


//VARIABLES ------------------------------------------------------------------------>

//Elementos del DOM
const cardContainer = document.querySelector("#cardsContainer");

const listCategory = document.querySelector("#categoryList");

const paginacion = document.querySelector("#pagination");

const fragment = document.createDocumentFragment();

// Ultima fetch realizada
let lastFetch = "";

// array de Categorias
const arrCategory = [
    {category: "ocean", name:"Oceano"},
    {category: "flower", name: "Flores"},
    {category: "nature", name: "Naturaleza"}
];


//EVENTOS ------------------------------------------------------------------------->



//FUNCIONES ----------------------------------------------------------------------->
/**
 * Obtener datos con el uso del endpoint Search.
 * @param {string} query 
 * @param {string} orientation 
 * @param {Array} words 
 * @returns 
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
            console.log("LastFetch: ", lastFetch);
            console.log("json", json.next_page);
            return json;
        } else {
            throw "No se consiguieron las imágenes solicitadas" //Error (mandar a catch)
        }

    } catch (error) {
        console.log(error); //Coje la info del throw
    }

}


/**
 * Pinta las cards en la galeria.
 * @param {Object} -> Array con todos los datos de los objetos photos
 */
const fillGallery = (json) => { // Desestructurado de (json.photos)
    cardContainer.innerHTML = ""; //Vacía el contenedor previamente
    json.photos.forEach(element => {
        lastFetch = json;
        //TODO: meter contenido de card.
        const photo = document.createElement("IMG")
        photo.src = element.src.tiny;
        fragment.append(photo);
    });
    cardContainer.append(fragment)

}

// filterCategory --

const createCategory = () => {
    arrCategory.forEach(async(item, indez, array) => {
        const objImg = await getImgCat(item.category);
        const title = item.name;
        fillCategory([objImg, title]);
    })

}

const getImgCat = async (query, porPagina = 1) => {

    const myImg = `https://api.pexels.com/v1/search?query=${query}&per_page=${porPagina}`;
    let img = await getDataFromSearch(myImg);
    //console.log("getImgZ: ", img);
    return img;

}


const fillCategory = ([objImg, title]) => {
    //listCategory.innerHTML = "";
    console.log("Category", objImg);
    const article = document.createElement("ARTICLE");
    const divImg = document.createElement("DIV");
    const img = document.createElement("IMG");
    const titulo = document.createElement("H1");

    //console.log(ocean.photos[0].src.tiny);
    //console.log("imagen: ", imgOcean);
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
    const dataAPI = await getDataFromSearch("ocean", "landscape", null); //Llama a la API pasándo por parámetro el query, la orientación y las keywords.
    fillGallery(dataAPI)//Llena la galería
    createCategory(arrCategory); // filterCategory
}

init()

