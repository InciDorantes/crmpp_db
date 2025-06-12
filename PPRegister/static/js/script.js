/* Aqui estan formato 8, formato 10 */

/* CARACTERÍSTICAS DE BIENES Y SERVICIOS*/
let contador = 1;

function agregarB() {
  contador++;
  const original = document.getElementById("bos-conteiner");
  const clon = original.cloneNode(true);

  clon.classList.add("position-relative");

  const campos = clon.querySelectorAll("input, textarea");
  campos.forEach((campo) => {
    const name = campo.getAttribute("name");
    if (name) {
      const nuevoName = name.replace(/_\d+$/, `_${contador}`);
      campo.setAttribute("name", nuevoName);
      campo.value = "";
    }
  });

  const botonExistente = clon.querySelector(".btn-eliminar");
  if (botonExistente) botonExistente.remove();

  const btnEliminar = document.createElement("button");
  btnEliminar.textContent = "×";
  btnEliminar.type = "button";
  btnEliminar.className = "btn btn-danger btn-sm btn-eliminar";
  btnEliminar.style.position = "absolute";
  btnEliminar.style.top = "10px";
  btnEliminar.style.right = "10px";
  btnEliminar.style.borderRadius = "50%";
  btnEliminar.style.width = "30px";
  btnEliminar.style.height = "30px";
  btnEliminar.style.padding = "0";

  btnEliminar.onclick = () => {
    clon.remove();
    reenumerarCampos();
  };

  clon.appendChild(btnEliminar);

  document.getElementById("contenedores-bys").appendChild(clon);
  reenumerarCampos(); // opcional, por si quieres mantener consistencia
}

function reenumerarCampos() {
  const contenedores = document.querySelectorAll("#contenedores-bys > .card");
  contenedores.forEach((contenedor, index) => {
    const numero = index + 1;
    const campos = contenedor.querySelectorAll("input, textarea");
    campos.forEach((campo) => {
      const name = campo.getAttribute("name");
      if (name) {
        const nuevoName = name.replace(/_\d+$/, `_${numero}`);
        campo.setAttribute("name", nuevoName);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {

  // Verificamos si hay datos guardados
  if (bienesServiciosGuardados && bienesServiciosGuardados.length > 0) {


    // Comprobamos si ya hay un contenedor base en el DOM
    const contenedorBase = document.getElementById("bos-conteiner-1");

    // Si el contenedor base ya existe, lo llenamos con los datos del primer registro
    if (contenedorBase) {
      const bien1 = bienesServiciosGuardados[0];  // Obtenemos el primer bien
      // Rellenamos los campos con los datos del primer bien
      contenedorBase.querySelector("#bos").value = bien1.bien || "";
      contenedorBase.querySelector("#desc").value = bien1.descripcion || "";
      contenedorBase.querySelector("#crit").value = bien1.criterio_calidad || "";
      contenedorBase.querySelector("#criteo").value = bien1.criterio || "";

      // Agregamos los demás registros si existen
      bienesServiciosGuardados.slice(1).forEach((bien, index) => {
        agregarBien(bien, index + 2);
      });
    } else {
      // Si no existe el contenedor base, lo agregamos primero y luego los demás
      agregarBien(bienesServiciosGuardados[0], 1);
      bienesServiciosGuardados.slice(1).forEach((bien, index) => {
        agregarBien(bien, index + 2);
      });
    }
  } 

  // Lógica para agregar un contenedor vacío cuando se hace clic en el botón
  document.getElementById("agregar-btn").addEventListener("click", () => {
    agregarBien(null, bienesServiciosGuardados.length + 1);  // Para que no sobrescriba ningún índice
  });
});

// Función para agregar un bien o contenedor
function agregarBien(bien = null, index = 1) {
  // Creamos el contenedor vacío (sin necesidad de clonar)
  const clon = document.createElement("div");
  clon.classList.add("card", "mb-3");  // Añadimos las clases de diseño
  clon.id = `bos-conteiner-${index}`; // Aseguramos un ID único para cada contenedor
  clon.style.marginBottom = "1rem"; // Le damos margen inferior

  // Cuerpo del contenedor
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  // Creamos los campos del formulario
  const bienDiv = document.createElement("div");
  bienDiv.classList.add("mb-3");
  const bienLabel = document.createElement("label");
  bienLabel.classList.add("form-label");
  bienLabel.innerHTML = "Bien o servicio";
  const bienInput = document.createElement("input");
  bienInput.type = "text";
  bienInput.classList.add("form-control");
  bienInput.id = "bos";
  bienInput.name = `bien_${index}`;
  bienInput.placeholder = "Bien o servicio";
  if (bien) bienInput.value = bien.bien || "";  // Rellenamos si tenemos datos

  bienDiv.appendChild(bienLabel);
  bienDiv.appendChild(bienInput);

  // Creamos el campo descripción
  const descDiv = document.createElement("div");
  descDiv.classList.add("mb-3");
  const descLabel = document.createElement("label");
  descLabel.classList.add("form-label");
  descLabel.innerHTML = "Descripción del bien o servicio";
  const descTextarea = document.createElement("textarea");
  descTextarea.rows = 3;
  descTextarea.cols = 60;
  descTextarea.classList.add("form-control");
  descTextarea.id = "desc";
  descTextarea.name = `descr_${index}`;
  descTextarea.placeholder = "Descripción";
  if (bien) descTextarea.value = bien.descripcion || "";  // Rellenamos si tenemos datos

  descDiv.appendChild(descLabel);
  descDiv.appendChild(descTextarea);

  // Creamos el campo criterios de calidad
  const critDiv = document.createElement("div");
  critDiv.classList.add("mb-3");
  const critLabel = document.createElement("label");
  critLabel.classList.add("form-label");
  critLabel.innerHTML = "Criterios de calidad";
  const critTextarea = document.createElement("textarea");
  critTextarea.rows = 3;
  critTextarea.cols = 60;
  critTextarea.classList.add("form-control");
  critTextarea.id = "crit";
  critTextarea.name = `critcalidad_${index}`;
  critTextarea.placeholder = "Criterios de calidad";
  if (bien) critTextarea.value = bien.criterio_calidad || "";  // Rellenamos si tenemos datos

  critDiv.appendChild(critLabel);
  critDiv.appendChild(critTextarea);

  // Campo de Criterios para la entrega oportuna
  const criteoDiv = document.createElement("div");
  criteoDiv.classList.add("mb-3");
  const criteoLabel = document.createElement("label");
  criteoLabel.classList.add("form-label");
  criteoLabel.innerHTML = "Criterios para determinar la entrega oportuna";
  const criteoTextarea = document.createElement("textarea");
  criteoTextarea.rows = 3;
  criteoTextarea.cols = 60;
  criteoTextarea.classList.add("form-control");
  criteoTextarea.id = "criteo";
  criteoTextarea.name = `criteo_${index}`;
  criteoTextarea.placeholder = "Criterios Entrega oportuna";
  if (bien) criteoTextarea.value = bien.criterio || "";  // Rellenamos si tenemos datos

  criteoDiv.appendChild(criteoLabel);
  criteoDiv.appendChild(criteoTextarea);

  // Añadimos todo el contenido al cardBody
  cardBody.appendChild(bienDiv);
  cardBody.appendChild(descDiv);
  cardBody.appendChild(critDiv);
  cardBody.appendChild(criteoDiv);

  // Añadimos el body al contenedor
  clon.appendChild(cardBody);

  // Crear el botón de eliminar para cada clon
  const btnEliminar = document.createElement("button");
  btnEliminar.textContent = "×";
  btnEliminar.type = "button";
  btnEliminar.className = "btn btn-danger btn-sm btn-eliminar";
  btnEliminar.style.position = "absolute";
  btnEliminar.style.top = "10px";
  btnEliminar.style.right = "10px";
  btnEliminar.style.borderRadius = "50%";
  btnEliminar.style.width = "30px";
  btnEliminar.style.height = "30px";
  btnEliminar.style.padding = "0";
  btnEliminar.onclick = () => {
    clon.remove();
    reenumerarCampos();
  };

  clon.appendChild(btnEliminar);

  // Finalmente, agregamos el contenedor al contenedor principal
  document.getElementById("contenedores-bys").appendChild(clon);
}


/* MATRIZ DE INDICADORES */
/* Generador de indicadores por proposito */
let contadorIndicadorProp =2;
function agregarIndicadorProposito() {
  const IndiID= contadorIndicadorProp++;
  const container = document.getElementById("indicadores-proposito");

  // Crear nuevo bloque
  const div = document.createElement("div");
  div.classList.add("indicador-block", "mb-3", "p-3", "border", "rounded");
  div.style.backgroundColor = "#f8f9fa";
  div.id= `bloque_indicadoresproposito_${IndiID}`

  div.innerHTML = `
    <div class="row">
      <div class="col-md-12 text-end">
        <button type="button" class="btn btn-danger btn-sm mb-2" id="botonEIP" onclick="eliminarIndicador(${IndiID})">Eliminar</button>
      </div>
    </div>
    <label style="color: black !important;">Indicador ${IndiID}:</label>
    <input type="text" class="form-control mb-2" name="proposito_indicador_${IndiID}">
    <label style="color: black !important;" >Supuesto ${IndiID}:</label>
    <input type="text" class="form-control mb-2" name="proposito_supuesto_${IndiID}">

    <label style="color: black !important; display: block; margin-bottom: 0px !important;" >Medio de Verificación ${IndiID}:</label>
    <a style="color: gray !important; font-size: 0.8rem;  display: block;" ><i>En este campo se visualizará lo capturado en el formato 11</i></a><br>
    <a type="text" name="proposito_mverificacion_${IndiID}" id="proposito_mverificacion_${IndiID}"></a>
    </div>
  `;

  container.appendChild(div);
  //actualizarNombres();
  actualizarContenedorIndicadores();
}

document.addEventListener("DOMContentLoaded", function(){
 const btn = document.getElementById('');
});

function eliminarIndicador(IndiID) {
  // No permitir eliminar el primer elemento (ID 1)
  console.log("se detecto el click", IndiID)
  if (IndiID === 1) return;
  
  const indicador = document.getElementById(`bloque_indicadoresproposito_${IndiID}`);
  if (indicador) {
    indicador.remove();
    reindexarIndicadores();
    eliminarFichaIndicadorP(IndiID);
  }
}

function reindexarIndicadores() {
  const container = document.getElementById("indicadores-proposito");
  const blocks = container.querySelectorAll("[id^='bloque_indicadoresproposito_']");
  
  // Empezamos desde 1 para el primer elemento (que no se puede eliminar)
  let newIndex = 2;
  
  blocks.forEach((block) => {
    const currentId = parseInt(block.id.split('_')[2]);
    
    // Solo reindexamos si el ID actual no coincide con el nuevo índice
    if (currentId !== newIndex) {
      // Actualizar ID del bloque
      block.id = `bloque_indicadoresproposito_${newIndex}`;
      
      // Actualizar todos los elementos dentro del bloque
      updateBlockElements(block, newIndex);
    }
    
    // Incrementar el índice para el próximo bloque
    newIndex++;
  });
  
  // Actualizar el contador para nuevas creaciones
  contadorIndicadorProp = newIndex;
}

function updateBlockElements(block, newIndex) {
  // Actualizar etiquetas
  const labels = block.querySelectorAll("label");
  labels.forEach(label => {
    const texto = label.textContent.trim();
    if (texto.startsWith("Indicador")) {
      label.textContent = `Indicador ${newIndex}:`;
    } else if (texto.startsWith("Supuesto")) {
      label.textContent = `Supuesto ${newIndex}:`;
    } else if (texto.startsWith("Medio")) {
      label.textContent = `Medio de Verificación ${newIndex}:`;
    }
  });
  
  // Actualizar inputs
  const inputs = block.querySelectorAll("input");
  inputs.forEach(input => {
    if (input.name.includes('proposito_indicador_')) {
      input.name = `proposito_indicador_${newIndex}`;
    } else if (input.name.includes('proposito_supuesto_')) {
      input.name = `proposito_supuesto_${newIndex}`;
    }
  });
  
  // Actualizar medio de verificación
  const medioVerif = block.querySelector("[id^='proposito_mverificacion_']");
  if (medioVerif) {
    medioVerif.id = `proposito_mverificacion_${newIndex}`;
    medioVerif.name = `proposito_mverificacion_${newIndex}`;
  }
  
  // Actualizar botón de eliminar
  const botonEliminar = block.querySelector(".btn-danger");
  if (botonEliminar) {
    botonEliminar.setAttribute('onclick', `eliminarIndicador(${newIndex})`);
  }
}

/* Componentes - actividades */
const IndicadoresCountActividad = {};

let componenteCount = 1;
let indicadoresCount = { 1: 1 };
let actividadesCount = { 1: 1 };
let indicadoresActividadCount = {
  1: { 1: 1 }, // Componente 1, Actividad 1 tiene 1 indicador
};

function agregarComponente() {
  componenteCount++;
  indicadoresCount[componenteCount] = 1;
  actividadesCount[componenteCount] = 0; // Inicializamos en 0 porque agregaremos una actividad por defecto
  
  actualizarContador('componente', componenteCount);

  const container = document.getElementById("componentes-container");

  const card = document.createElement("div");
  card.className = "card mb-4";
  card.setAttribute("data-componente", componenteCount);

  card.innerHTML = `
    <div class="card-header bg-secondary text-white d-flex justify-content-between">
      <h5>Componente ${componenteCount}</h5>
      <button type="button" class="btn-close btn-close-white" aria-label="Eliminar" onclick="eliminarComponente(this)"></button>
    </div>
    <div class="card-body">
      <label>Objetivo del componente:</label>
      <input type="text" class="form-control mb-3" name="componente_${componenteCount}_objetivo">

      <h6>Indicadores del Componente</h6>
      <div id="indicadores-componente-${componenteCount}">
        <div class="mb-3 border p-2 bg-light" data-indicador="1">
          <label style="color: black !important;">Indicador 1:</label>
          <input type="text" class="form-control mb-2" name="componente_${componenteCount}_indicador_1_nombre">
          <label style="color: black !important;">Supuesto 1:</label>
          <input type="text" class="form-control mb-2" name="componente_${componenteCount}_indicador_1_supuesto">
          <label style="color: black !important; display: block; margin-bottom: 0px !important;">Medio de verificación 1:</label>
          <a style="color: gray !important; font-size: 0.8rem;  display: block;" ><i>En este campo se visualizará lo capturado en el formato 11</i></a><br>
          <a type="text" name="componente_${componenteCount}_indicador_1_medio"></a>
        </div>
      </div>
      <button type="button" class="btn btn-sm btn-success mb-3" id="botonAIC" onclick="agregarIndicador(${componenteCount})">+ Indicador</button>

      <h6>Actividades</h6>
      <div id="actividades-componente-${componenteCount}"></div>
      <button type="button" class="btn btn-sm btn-warning" id="botonAA" onclick="agregarActividad(${componenteCount})">+ Actividad</button>
    </div>
  `;

  container.insertBefore(card, container.lastElementChild);
  // Agregar una actividad por defecto con su indicador
  agregarActividad(componenteCount);
  crearContenedoresOrganizados();
  generarContenedoresActividades();
}

function agregarIndicador(componenteNum) {
  const indicadoresContainer = document.getElementById(`indicadores-componente-${componenteNum}`);
  indicadoresCount[componenteNum]++;
  const indNum = indicadoresCount[componenteNum];

  const div = document.createElement("div");
  div.className = "mb-3 border p-2 bg-light";
  div.setAttribute("data-indicador", indNum);
  div.innerHTML = `
    <div class="col-md-12 text-end">
      <button type="button" class="btn btn-danger btn-sm mb-2" aria-label="Eliminar" onclick="eliminarElemento(this, 'indicador', ${componenteNum})">Eliminar</button>
    </div>
    <label style="color: black !important">Indicador ${indNum}:</label>
    <input type="text" class="form-control mb-2" name="componente_${componenteNum}_indicador_${indNum}_nombre">
     <label style="color: black !important">Supuesto ${indNum}:</label>
    <input type="text" class="form-control mb-2" name="componente_${componenteNum}_indicador_${indNum}_supuesto">

    <label style="color: black !important; display: block; margin-bottom: 0px !important;">Medio de verificación ${indNum}:</label><br>
    <a style="color: gray !important; font-size: 0.8rem;  display: block;" ><i>En este campo se visualizará lo capturado en el formato 11</i></a><br>
    <a type="text" name="componente_${componenteNum}_indicador_${indNum}_medio"></a>
  `;
  indicadoresContainer.appendChild(div);

  crearContenedoresOrganizados();
}

/* Actualizar contador */
function actualizarContador(tipo, componenteNum, actNum) {
  // Inicialización segura
  if (!window.indicadoresActividadCount) {
    window.indicadoresActividadCount = {};
  }

  switch (tipo) {
    case 'componente':
      if (!indicadoresActividadCount[componenteNum]) {
        indicadoresActividadCount[componenteNum] = {};
      }
      break;

    case 'actividad':
      if (!indicadoresActividadCount[componenteNum]) {
        indicadoresActividadCount[componenteNum] = {};
      }
      // Inicializa en 1 para el indicador por defecto
      indicadoresActividadCount[componenteNum][actNum] = 1;
      break;

    case 'indicador':
      // Asegura que exista la estructura
      if (!indicadoresActividadCount[componenteNum]) {
        indicadoresActividadCount[componenteNum] = {};
      }
      if (!indicadoresActividadCount[componenteNum][actNum]) {
        // Si no existe, inicializa en 1 (para el caso donde se agregue manualmente sin actividad previa)
        indicadoresActividadCount[componenteNum][actNum] = 1;
      }
      
      // Incrementa el contador (el primer incremento llevará 1 → 2)
      indicadoresActividadCount[componenteNum][actNum]++;
      break;
  }
}

/* Agregar actividad */
const indActNumCount = {};
function agregarActividad(componenteNum) {
  // Asegurar que existe el contador para el componente
  if (!indActNumCount[componenteNum]) {
    indActNumCount[componenteNum] = {};
  }
   // Si es el componente 1, que empiece desde la actividad 2 pero si el compoennte es 2 o mas que inicie desde la actividad 11
   if (!actividadesCount[componenteNum]) {
    if (componenteNum === 1) {
      actividadesCount[componenteNum] = 1; // Próxima actividad será 2
    } else { // Componente 2, 3, etc.
      actividadesCount[componenteNum] = 0; // Próxima actividad será 11
    }
  }
  // Incrementar contador (la próxima actividad será 2, 3, etc.)
  actividadesCount[componenteNum]++;
  const actNum = actividadesCount[componenteNum];
  // Inicializar contador de indicadores para ESTA actividad
  indActNumCount[componenteNum][actNum] = 1; // Indicador por defecto
  const actividadesContainer = document.getElementById(`actividades-componente-${componenteNum}`);
  const div = document.createElement("div");
  div.className = "mb-3 border p-2 bg-light";
  div.style="background-color: #cdcaca !important;  border-radius: 0.5rem !important;"
  div.setAttribute("data-actividad", actNum);
  div.innerHTML = `
    <div class="row">
      <div class="col-md-6 text-start"> 
        <h6><strong>Actividad ${componenteNum}.${actNum}</strong></h6>
      </div>
      <div class="col-md-6 text-end">
        <button type="button" style ="width: 8rem !important" class="btn btn-danger btn-sm mb-2" onclick="eliminarElemento(this, 'actividad', ${componenteNum},${actNum} )">Eliminar</button>
      </div>
    </div>
    <label>Objetivo:</label>
    <input type="text" class="form-control mb-2" name="componente_${componenteNum}_actividad_${actNum}_objetivo">

    <div class="mb-3 border p-2 bg-light" data-indicador="C${componenteNum}_A${actNum}" id="indicadores-actividad-${componenteNum}-${actNum}" style="background-color: #cdcaca !important;  border-radius: 0.5rem !important;">
      <div data-indicador-act ="1" >
        <label>Indicador 1:</label>
        <input type="text" class="form-control mb-2" name="componente_${componenteNum}_actividad_${actNum}_indicador_1_nombre">
        <label>Supuesto 1:</label>
        <input type="text" class="form-control mb-2" name="componente_${componenteNum}_actividad_${actNum}_indicador_1_supuesto">
        <label style="color: gray !important; display: block; margin-bottom: 0px !important;">Medio de verificación 1:</label>
        <a style="color: gray !important; font-size: 0.8rem;  display: block;" ><i>En este campo se visualizará lo capturado en el formato 11</i></a><br>
        <a type="text" name="componente_${componenteNum}_actividad_${actNum}_indicador_1_medio"></a>
      </div>
      </div>
    <button type="button" class="btn btn-sm btn-success  mt-2" onclick="agregarIndicadorActividad(${componenteNum}, ${actNum})">Agregar Indicador</button>
  `;
  actividadesContainer.appendChild(div);

  generarContenedoresActividades();
}

function agregarIndicadorActividad(componenteNum, actividadNum) {

  // Verificación en profundidad
  if (!indActNumCount[componenteNum]) {
    console.warn(`Componente ${componenteNum} no existe. Inicializando...`);
    indActNumCount[componenteNum] = {};
  }
  if (!indActNumCount[componenteNum][actividadNum]) {
    console.warn(`Actividad ${componenteNum} no existe en componente ${actividadNum}. Inicializando...`);
    indActNumCount[componenteNum][actividadNum] = 1; // Inicia en 1 para indicador por defecto
  }
  
  // Incrementar contador
  indActNumCount[componenteNum][actividadNum]++;
  const IndActNum = indActNumCount[componenteNum][actividadNum];

  const container = document.getElementById(`indicadores-actividad-${componenteNum}-${actividadNum}`);
  const div = document.createElement("div");
  div.className = "border p-2 mt-2";
  div.setAttribute("data-indicador-act", IndActNum);
  div.innerHTML = `
  <div class="row">
      <div class="col-md-12 text-end">
        <button type="button" class="btn btn-danger btn-sm mb-2" onclick="eliminarElemento(this, 'indicador-act', ${componenteNum}, ${actividadNum})">Eliminar</button>
      </div>
    </div>
    <label>Indicador ${IndActNum}:</label>
    <input type="text" class="form-control mb-2" name="componente_${componenteNum}_actividad_${actividadNum}_indicador_${IndActNum}_nombre">
    <label>Supuesto ${IndActNum}:</label>
    <input type="text" class="form-control mb-2" name="componente_${componenteNum}_actividad_${actividadNum}_indicador_${IndActNum}_supuesto">
      <label style="color: gray !important; display: block; margin-bottom: 0px !important;" >Medio de verificación ${IndActNum}:</label>
      <a style="color: gray !important; font-size: 0.8rem;  display: block;" ><i>En este campo se visualizará lo capturado en el formato 11</i></a><br>
      <a type="text" name="componente_${componenteNum}_actividad_${actividadNum}_indicador_${IndActNum}_medio"></a>
  `;
  container.appendChild(div);

  generarContenedoresActividades();
}

/* Sección de eliminación */
function eliminarComponente(btn) {
  const card = btn.closest(".card");
  const componenteNum = parseInt(card.getAttribute("data-componente"));
  card.remove();

  // Reorganizar los componentes restantes
  const componentesContainer = document.getElementById("componentes-container");
  const componentes = componentesContainer.querySelectorAll('.card[data-componente]');
  
  // Actualizar contadores globales
  delete indicadoresCount[componenteNum];
  delete actividadesCount[componenteNum];
  componenteCount = componentes.length;

  // Renumerar componentes restantes
  componentes.forEach((componente, index) => {
    const newCompNum = index + 1;
    const oldCompNum = parseInt(componente.getAttribute("data-componente"));
    
    if (oldCompNum !== newCompNum) {
      // Actualizar atributo data-componente
      componente.setAttribute('data-componente', newCompNum);
      
      // Actualizar título del componente
      const titulo = componente.querySelector('.card-header h5');
      if (titulo) {
        titulo.textContent = `Componente ${newCompNum}`;
      }
      
      // Actualizar nombres de campos del componente
      const compInputs = componente.querySelectorAll('input[name^="componente_"]');
      compInputs.forEach(input => {
        input.name = input.name.replace(
          /componente_\d+/,
          `componente_${newCompNum}`
        );
      });
      
      // Actualizar IDs de contenedores
      ['indicadores-componente', 'actividades-componente'].forEach(prefix => {
        const oldId = `${prefix}-${oldCompNum}`;
        const element = componente.querySelector(`#${oldId}`);
        if (element) {
          element.id = `${prefix}-${newCompNum}`;
        }
      });
      
      // Actualizar botones
      const buttons = componente.querySelectorAll('button[onclick*="Componente"]');
      buttons.forEach(button => {
        button.setAttribute('onclick', button.getAttribute('onclick')
          .replace(/\(\d+\)/g, `(${newCompNum})`));
      });

      //actualizar boton de agregar indicador
      const botonAI = componente.querySelectorAll("[id^='botonAIC']");
      botonAI.forEach(button =>{
        button.setAttribute('onclick', `agregarIndicador(${newCompNum})` )
      })
      
      //actualizar boton de agregar actividad
      const botonAA = componente.querySelectorAll("[id^='botonAA']");
      botonAA.forEach(button =>{
        button.setAttribute('onclick', `agregarActividad(${newCompNum})` )
      })

      // Actualizar contadores específicos de este componente
      if (indicadoresCount[oldCompNum]) {
        indicadoresCount[newCompNum] = indicadoresCount[oldCompNum];
        delete indicadoresCount[oldCompNum];
      }
      
      if (actividadesCount[oldCompNum]) {
        actividadesCount[newCompNum] = actividadesCount[oldCompNum];
        delete actividadesCount[oldCompNum];
      }
      
      // Reorganizar actividades dentro de este componente
      const actividadesContainer = componente.querySelector(`div[id^="actividades-componente-"]`);
      if (actividadesContainer) {
        const actividades = actividadesContainer.querySelectorAll('div[data-actividad]');
        actividades.forEach((actividad, actIndex) => {
          const newActNum = actIndex + 1;
          
          // Actualizar título de actividad
          const actTitulo = actividad.querySelector('h6 strong');
          if (actTitulo) {
            actTitulo.textContent = `Actividad ${newCompNum}.${newActNum}`;
          }
          
          // Actualizar nombres de campos de actividad
          const actInputs = actividad.querySelectorAll('input');
          actInputs.forEach(input => {
            input.name = input.name
              .replace(/componente_\d+_actividad_\d+/, `componente_${newCompNum}_actividad_${newActNum}`)
              .replace(/componente_\d+_/, `componente_${newCompNum}_`);
          });
          
          // Actualizar botones de actividad
          const actButtons = actividad.querySelectorAll('button[onclick*="eliminarElemento"], button[onclick*="agregarIndicadorActividad"]');
          actButtons.forEach(button => {
            const onclickAttr = button.getAttribute('onclick');
            if (onclickAttr) {
              let newOnclick = onclickAttr
                .replace(/\(\d+, \d+\)/g, `(${newCompNum}, ${newActNum})`)
                .replace(/\(\d+\)/g, `(${newCompNum})`);
              button.setAttribute('onclick', newOnclick);
            }
          });
          
          // Actualizar contenedor de indicadores de actividad
          const indicadoresAct = actividad.querySelector('div[id^="indicadores-actividad-"]');
          if (indicadoresAct) {
            indicadoresAct.id = `indicadores-actividad-${newCompNum}-${newActNum}`;
            indicadoresAct.setAttribute('data-indicador', `C${newCompNum}_A${newActNum}`);
          }
        });
      }
    }
  });
  eliminarFichaComponente(componenteNum); //para la ficha componente 

  eliminarIndicadorAct("componente",componenteNum,0, 0) //de aquisale el error
};
/*eliminar actividades e indicadores de los componentes*/
function eliminarElemento(btn, tipo, componenteNum, actividadNum = null) {
  const div = btn.closest("div[data-" + tipo + "]");
  
  if (tipo === "actividad") {
    // Verificar si es una actividad fija
    if (actividadNum === 1) {
      alert("La Actividad 1 no puede ser eliminada");
      return;
    }
    
    // Eliminar del contador de indicadores de actividad si existe
    if (indicadoresActividadCount[componenteNum]?.[actividadNum]) {
      delete indicadoresActividadCount[componenteNum][actividadNum];

      eliminarIndicadorAct("actividad",componenteNum,actividadNum, 0) //de aquisale el error
    }
    
    div.remove();
    reorganizarActividades(componenteNum);
  } 
  else if (tipo === "indicador") {
    const indicadorNum = parseInt(div.getAttribute('data-indicador')); 

    indicadoresCount[componenteNum]--;
    div.remove();
    reorganizarNombres(`indicadores-componente-${componenteNum}`, `componente_${componenteNum}_indicador`);

    eliminarFichaIndicadorC(componenteNum, indicadorNum); 
  }   
  else if (tipo === "indicador-act") {
    const indNum = parseInt(div.getAttribute('data-indicador-act')); 

    div.remove();

    reorganizarIndicadoresActividad(componenteNum, actividadNum);
    eliminarIndicadorAct("indicador-act",componenteNum,actividadNum, indNum)
  }
}

//Función para reorganizar todos los indicadores de los componentes
function reorganizarTodosIndicadores(componenteNum) {
  const actividadesContainer = document.getElementById(`actividades-componente-${componenteNum}`);
  if (!actividadesContainer) return;
  
  const actividades = actividadesContainer.querySelectorAll('div[data-actividad]');
  
  actividades.forEach(actividad => {
    const actividadNum = parseInt(actividad.getAttribute('data-actividad'));
    reorganizarIndicadoresActividad(componenteNum, actividadNum);
  });
}

function reorganizarActividades(componenteNum) {
  const container = document.getElementById(`actividades-componente-${componenteNum}`);
  if (!container) return;

  // Obtener todas las actividades excepto la fija (1) si es componente 1
  const actividades = Array.from(container.querySelectorAll('div[data-actividad]'))
    .filter(act => componenteNum !== 1 || parseInt(act.getAttribute('data-actividad')) !== 1)
    .sort((a, b) => {
      const aNum = parseInt(a.getAttribute('data-actividad'));
      const bNum = parseInt(b.getAttribute('data-actividad'));
      return aNum - bNum;
    });

  // Reindexar actividades comenzando desde 2 para componente 1, desde 1 para otros
  let nuevoNumBase = componenteNum === 1 ? 2 : 1;
  let contadorActividades = componenteNum === 1 ? 1 : 0; // Contador incluyendo fija

  actividades.forEach((actividad, index) => {
    const nuevoNum = nuevoNumBase + index;
    const viejoNum = parseInt(actividad.getAttribute('data-actividad'));

    if (viejoNum !== nuevoNum) {
      // Actualizar atributo data-actividad
      actividad.setAttribute('data-actividad', nuevoNum);

      // Actualizar contenido de la actividad
      actualizarContenidoActividad(actividad, componenteNum, viejoNum, nuevoNum);

      // Actualizar contadores de indicadores si existen
      if (indActNumCount[componenteNum] && indActNumCount[componenteNum][viejoNum]) {
        indActNumCount[componenteNum][nuevoNum] = indActNumCount[componenteNum][viejoNum];
        delete indActNumCount[componenteNum][viejoNum];
      }
    }
    contadorActividades++;
  });

  // Actualizar contador global
  actividadesCount[componenteNum] = contadorActividades;
}

function actualizarContenidoActividad(actividad, componenteNum, viejoNum, nuevoNum) {
  // Actualizar título
  const titulo = actividad.querySelector('h6 strong');
  if (titulo) {
    titulo.textContent = `Actividad ${componenteNum}.${nuevoNum}`;
  }

  // Actualizar botón de eliminar
  const botonEliminar = actividad.querySelector('button.btn-danger');
  if (botonEliminar) {
    botonEliminar.setAttribute('onclick', `eliminarElemento(this, 'actividad', ${componenteNum}, ${nuevoNum})`);
  }

  // Actualizar names de inputs principales
  const inputsPrincipales = actividad.querySelectorAll('input[name*="_actividad_"]');
  inputsPrincipales.forEach(input => {
    input.name = input.name.replace(
      `componente_${componenteNum}_actividad_${viejoNum}`,
      `componente_${componenteNum}_actividad_${nuevoNum}`
    );
  });

  // Actualizar contenedor de indicadores
  const indicadoresContainer = actividad.querySelector('div[data-indicador]');
  if (indicadoresContainer) {
    indicadoresContainer.id = `indicadores-actividad-${componenteNum}-${nuevoNum}`;
    indicadoresContainer.setAttribute('data-indicador', `C${componenteNum}_A${nuevoNum}`);
  }

  // Actualizar botón de agregar indicadores
  const botonAgregarIndicador = actividad.querySelector('button.btn-success');
  if (botonAgregarIndicador) {
    botonAgregarIndicador.setAttribute('onclick', `agregarIndicadorActividad(${componenteNum}, ${nuevoNum})`);
  }

  // Actualizar todos los indicadores dentro de esta actividad
  const inputsIndicadores = actividad.querySelectorAll('input[name*="_indicador_"], a[name*="_indicador_"]');
  inputsIndicadores.forEach(input => {
    input.name = input.name.replace(
      `componente_${componenteNum}_actividad_${viejoNum}_indicador`,
      `componente_${componenteNum}_actividad_${nuevoNum}_indicador`
    );
    
    if (input.tagName === 'A') {
      input.id = input.id.replace(
        `componente_${componenteNum}_actividad_${viejoNum}_indicador`,
        `componente_${componenteNum}_actividad_${nuevoNum}_indicador`
      );
    }
  });
}

//Función para reorgnizar los indicadores de las actividades
function reorganizarIndicadoresActividad(componenteNum, actividadNum) {
  const container = document.getElementById(`indicadores-actividad-${componenteNum}-${actividadNum}`);
  if (!container) return;

  // Obtener todos los indicadores (el 1 es fijo, los demás son dinámicos)
  const indicadorFijo = container.querySelector('div[data-indicador-act="1"]');
  const indicadoresDinamicos = Array.from(container.querySelectorAll('div[data-indicador-act]:not([data-indicador-act="1"])'))
    .sort((a, b) => {
      const aNum = parseInt(a.getAttribute('data-indicador-act'));
      const bNum = parseInt(b.getAttribute('data-indicador-act'));
      return aNum - bNum;
    });

  // Primera pasada: renumerar los dinámicos comenzando desde 2
  indicadoresDinamicos.forEach((indicador, index) => {
    const newIndNum = index + 2; // Comenzar desde 2
    indicador.setAttribute('data-indicador-act', newIndNum);
  });

  // Segunda pasada: actualizar contenido de todos los dinámicos
  indicadoresDinamicos.forEach((indicador, index) => {
    const newIndNum = index + 2;
    
    // Actualizar labels
    const labels = indicador.querySelectorAll("label");
    labels.forEach(label => {
      label.textContent = label.textContent.replace(
        /(Indicador|Supuesto|Medio de verificación)\s*\d+:/gi, 
        `$1 ${newIndNum}:`
      );
    });
    
    // Actualizar inputs y enlace
    const inputs = indicador.querySelectorAll('input, a');
    inputs.forEach(input => {
      // Actualizar name
      input.name = input.name.replace(
        /(componente_\d+_actividad_\d+_indicador_)\d+(_[a-z]+)/,
        `$1${newIndNum}$2`
      );
      
      // Actualizar id si es el elemento <a>
      if (input.tagName.toLowerCase() === 'a') {
        input.id = input.id.replace(
          /(componente_\d+_actividad_\d+_indicador_)\d+(_medio)/,
          `$1${newIndNum}$2`
        );
      }
    });
    
    // Actualizar botón de eliminar
    const botonEliminar = indicador.querySelector('button[onclick*="eliminarElemento"]');
    if (botonEliminar) {
      botonEliminar.setAttribute('onclick', 
        `eliminarElemento(this, 'indicador-act', ${componenteNum}, ${actividadNum})`);
    }
  });

  // Actualizar el contador global correctamente
  if (!indicadoresActividadCount[componenteNum]) {
    indicadoresActividadCount[componenteNum] = {};
  }
  
  // El contador debe ser: 1 (fijo) + cantidad de dinámicos
  const totalIndicadores = 1 + indicadoresDinamicos.length;
  indicadoresActividadCount[componenteNum][actividadNum] = totalIndicadores;

  // Asegurarnos que el próximo indicador comience correctamente
  if (indicadoresDinamicos.length === 0) {
    // Si no hay dinámicos, el próximo debe ser 2
    indActNumCount[componenteNum][actividadNum] = 1;
  } else {
    // Si hay dinámicos, continuar la secuencia
    indActNumCount[componenteNum][actividadNum] = totalIndicadores;
  }
}
//reorganizar nombres para indicadores de componente
function reorganizarNombres(containerId, namePrefix) {
  const extract = namePrefix.match(/_(\d+)_/);
  const componenteNum = parseInt(extract[1]);
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Obtener todos los indicadores y ordenarlos por su número actual
  const indicadores = Array.from(container.querySelectorAll('div[data-indicador]'))
    .sort((a, b) => {
      const aNum = parseInt(a.getAttribute('data-indicador'));
      const bNum = parseInt(b.getAttribute('data-indicador'));
      return aNum - bNum;
    });
  
  // Primero actualizamos los números en los atributos data-indicador
  indicadores.forEach((indicador, index) => {
    const newIndNum = index + 1;
    indicador.setAttribute('data-indicador', newIndNum);
  });
  
  // Luego actualizamos todos los contenidos basados en los nuevos números
  indicadores.forEach((indicador, index) => {
    const newIndNum = index + 1;
    
    // Actualizar los labels
    const labels = indicador.querySelectorAll("label");
    labels.forEach(label => {
      label.textContent = label.textContent.replace(
        /(Indicador|Supuesto|Medio de verificación)\s*\d+:/gi, 
        `$1 ${newIndNum}:`
      );
    });
    
    // Actualizar los inputs y el enlace
    const inputs = indicador.querySelectorAll('input, a');
    inputs.forEach(input => {
      // Actualizar name
      input.name = input.name.replace(
        new RegExp(`${namePrefix}_\\d+_`, 'g'),
        `${namePrefix}_${newIndNum}_`
      );
      
      // Actualizar id si es el elemento <a>
      if (input.tagName.toLowerCase() === 'a') {
        input.id = input.id.replace(
          new RegExp(`${namePrefix}_\\d+_medio`),
          `${namePrefix}_${newIndNum}_medio`
        );
      }
    });
    
    // Actualizar el botón de eliminar
    const botonEliminar = indicador.querySelector('button[onclick*="eliminarElemento"]');
    if (botonEliminar) {
      const onclick = botonEliminar.getAttribute('onclick');
      botonEliminar.setAttribute('onclick', 
        onclick.replace(
          /eliminarElemento\(([^,]+),\s*'indicador',\s*\d+\)/,
          `eliminarElemento($1, 'indicador', ${componenteNum})`
        )
      );
    }
  });
  
  // Actualizar el contador de indicadores
  indicadoresCount[componenteNum] = indicadores.length;
};

