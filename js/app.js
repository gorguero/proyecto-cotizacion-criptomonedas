//VARIABLES
const criptosSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');


//EVENTOS
document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();
    formulario.addEventListener('submit', submitFormulario);
    criptosSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change',  leerValor);
});

const busqueda = {
    moneda: '',
    criptomoneda: ''
}

const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
});

//FUNCIONES
function consultarCriptomonedas(){

    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then( criptomonedas => selectCriptos(criptomonedas) )

}

function selectCriptos(criptomonedas){

    criptomonedas.forEach( criptomoneda => {

        const { FullName, Name } = criptomoneda.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;

        criptosSelect.appendChild(option);

    });

}

function leerValor(e){
    busqueda[e.target.name] = e.target.value;
}

function submitFormulario(e){

    e.preventDefault();

    const {moneda, criptomoneda} = busqueda;

    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta('Ambos campos deben estar completos.')
        return;
    }

    consultarAPI();

}

function mostrarAlerta(mensaje){

    limpiarHTML();

    const existeAlerta = document.querySelector('.error');

    if(!existeAlerta){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
        divMensaje.textContent = mensaje;

        resultado.appendChild(divMensaje)

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

}

function consultarAPI(){

    const {moneda, criptomoneda} = busqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => mostrarCotizacion(cotizacion.DISPLAY[criptomoneda][moneda]));

}

function mostrarCotizacion(cotizacion){

    limpiarHTML();

    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `Precio actual: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `Precio más alto: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `Precio más bajo: <span>${LOWDAY}</span>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `Variación en las ultimas horas: <span>${CHANGEPCT24HOUR}%</span>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `Última actualizacion: <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);

}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner(){
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.appendChild(spinner);

}