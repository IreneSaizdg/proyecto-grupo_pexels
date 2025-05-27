// VARIABLES (elementos del DOM, objetos, arrays...) -> EVENTOS -> FUNCIONES -> INVOCACIONES(a funciones)

// LLAMADAS A API -> Filtros en el fetch: Categorias, Palabras, orientación, Cantidad de imagenes, 
// 2EndPoints: (búsqueda) https://api.pexels.com/v1/search    (imagen por id para favoritos) https://api.pexels.com/v1/photos/:id



/*PSEUDOCODE:

    Tarea:
    Filtro por orientación: 
    Añadir un filtro para seleccionar la orientación de las imágenes: Todas, Verticales, Horizontales.

    VARIABLES: 
    Elementos del DOM:
        - Select
    
    EVENTOS: 
        - Evento change en selector (cada vez que cambie de categoría se activará)

    FUNCIONES: 
        function buscar imagenes en servidor API 
        function filtrar imágenes por disposición (con una condicional? x3)
            - buscar imgs con disposición (todas/ vertical/ horizontal)
            https://api.pexels.com/v1/search?query=ocean&orientation=square
            https://api.pexels.com/v1/search?query=ocean&orientation=landscape
            https://api.pexels.com/v1/search?query=ocean&orientation=portrait
            
        function pintar imágenes con esa categoría

    INNVOCACIONES:
    

*/





//VARIABLES ------------------------------------------------------------------------>

//Elementos del DOM
const cardContainer = document.querySelector("#cardsContainer");
const fragment = document.createDocumentFragment();


const orientationFilter = document.querySelector("#orientationFilter")

//SearchInput ficticio
const searchInput = {
    value: "sea",
}


//EVENTOS ------------------------------------------------------------------------->


//Evento al cambiar la opción del selector (filtro por orientación)
orientationFilter.addEventListener("change", manageOrientationChange);


//Función para gestionar el cambio de orientación en el selector
async function manageOrientationChange(){
        const query = searchInput.value || "no hay query"; //Variable a asignar externamente para el query
        
        const selectedOrientation = orientationFilter.value; //La orientación seleccionada será igual que la del selector seleccionado 
        const orientationData = await filterByOrientation(query, selectedOrientation); //Llama a la función 
        fillGallery(orientationData); //Llena la galería en base a la data de orientación. 

        //console.log(event.target.value) //target es el elemento del selector seleccionado.
    }


//Función que hace la búsqueda por orientación 
async function filterByOrientation(query, orientation) {
    const orientationData = await getDataFromSearch(query, orientation); 
    return orientationData

    //Trae los datos de la API que busca por orientación (orientación determinada por los valores de las opciones del selector después en el evento).
}


    /*INTENTO 1 (dentro del evento):
        // const linkPortraitFilter = await getDataFromSearch(query, "portrait")
        // const linkLandscapeFilter = await getDataFromSearch(query, "landscape")
        // const linkSquareFilter = await getDataFromSearch(query, "square")

        // if (event.target.value === "portrait") {
        //     fillGallery(linkPortraitFilter)
        // }

        // if (event.target.value === "landscape") {
        //     fillGallery(linkLandscapeFilter)
        // }

        // else if (event.target.value === "square") {
        //     fillGallery(linkSquareFilter)
        // }*/

    /*INTENTO 2 (función externa):
        // async function filterByOrientation(event, query, orientation) {

        //     const linkFilter = await getDataFromSearch(query, orientation)

        //     if (event.target.value === "square") {
        //         fillGallery(linkFilter)
        //     }
        //     else if (event.target.value === "portrait") {
        //         fillGallery(linkFilter)
        //     }
        //     else if (event.target.value === "landscape") {
        //         fillGallery(linkFilter)
        //     }
        // }*/




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
const fillGallery = ({ photos }) => { //Desestructurado de (json.photos)
    cardContainer.innerHTML = ""; //Vacía el contenedor previamente
    photos.forEach(element => {
        //TODO: meter contenido de card.
        const photo = document.createElement("IMG") //Crea la etiqueta element
        photo.src = element.src.tiny; //jason.photos.src.tiny

        fragment.append(photo);//Crea un fragment
    });
    cardContainer.append(fragment)

}






//INVOCACIONES -------------------------------------------------------------------->

/**
 * Inicializa la galeria obteniendo los datos desde la API con getDataFromSearch.
 */
//PROVISIONAL
const init = async () => { //init -> Inicializa
    const dataAPI = await getDataFromSearch(searchInput.value, "square", null); //Llama a la API pasándo por parámetro el query, la orientación y las keywords.
    fillGallery(dataAPI)//Llena la galería
}

init()

