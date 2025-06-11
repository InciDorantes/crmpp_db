/* ESTRUCTURA DE LOS COMPONENTES DE LA MIR */
function capitalizarTexto(texto) {
  return texto
    .replace(/_/g, ' ')  // Reemplazar guiones bajos con espacios
    .replace(/\b\w/g, (letra) => letra.toUpperCase());  // Capitalizar la primera letra de cada palabra
}

//estructura de componentes
function generarEstructuraCompleta() {
  const estructura = {};
  const contenedorComponentes = document.getElementById('componentes-container');
  
  if (!contenedorComponentes) return estructura;

  // Recorrer todos los componentes
  const componentes = contenedorComponentes.querySelectorAll('[data-componente]');
  
  componentes.forEach(componente => {
    const componenteNum = componente.getAttribute('data-componente');
    estructura[`componente_${componenteNum}`] = {
      objetivo: componente.querySelector(`input[name="componente_${componenteNum}_objetivo"]`)?.value || '',
      indicadores: {},
      actividades: {}
    };

    // 1. Procesar INDICADORES DEL COMPONENTE
    const contenedorIndicadores = componente.querySelector(`#indicadores-componente-${componenteNum}`);
    if (contenedorIndicadores) {
      const indicadores = contenedorIndicadores.querySelectorAll('[data-indicador]');
      
      indicadores.forEach(indicador => {
        const indicadorNum = indicador.getAttribute('data-indicador');
        estructura[`componente_${componenteNum}`].indicadores[`indicador_${indicadorNum}`] = {
          nombre: indicador.querySelector(`input[name="componente_${componenteNum}_indicador_${indicadorNum}_nombre"]`)?.value || '',
          supuesto: indicador.querySelector(`input[name="componente_${componenteNum}_indicador_${indicadorNum}_supuesto"]`)?.value || '',
          medio: indicador.querySelector(`a[name="componente_${componenteNum}_indicador_${indicadorNum}_medio"]`)?.textContent || ''
        };
      });
    }

    // 2. Procesar ACTIVIDADES DEL COMPONENTE
    const contenedorActividades = componente.querySelector(`#actividades-componente-${componenteNum}`);
    if (contenedorActividades) {
      const actividades = contenedorActividades.querySelectorAll('[data-actividad]');
      
      actividades.forEach(actividad => {
        const actividadNum = actividad.getAttribute('data-actividad');
        estructura[`componente_${componenteNum}`].actividades[`actividad_${actividadNum}`] = {
          objetivo: actividad.querySelector(`input[name="componente_${componenteNum}_actividad_${actividadNum}_objetivo"]`)?.value || '',
          indicadores: {}
        };

        // 3. Procesar INDICADORES DE CADA ACTIVIDAD
        const contenedorIndicadoresActividad = actividad.querySelector(`#indicadores-actividad-${componenteNum}-${actividadNum}`);
        if (contenedorIndicadoresActividad) {
          const indicadoresActividad = contenedorIndicadoresActividad.querySelectorAll('[data-indicador-act]');
          
          indicadoresActividad.forEach(indicador => {
            const indicadorActNum = indicador.getAttribute('data-indicador-act');
            estructura[`componente_${componenteNum}`].actividades[`actividad_${actividadNum}`].indicadores[`indicador_${indicadorActNum}`] = {
              nombre: indicador.querySelector(`input[name="componente_${componenteNum}_actividad_${actividadNum}_indicador_${indicadorActNum}_nombre"]`)?.value || '',
              supuesto: indicador.querySelector(`input[name="componente_${componenteNum}_actividad_${actividadNum}_indicador_${indicadorActNum}_supuesto"]`)?.value || '',
              medio: indicador.querySelector(`a[name="componente_${componenteNum}_actividad_${actividadNum}_indicador_${indicadorActNum}_medio"]`)?.textContent || ''
            };
          });
        }
      });
    }
  });

  return estructura;
}
/* COMPONENTES */
//estructura
function extraerIndicadoresPorComponente() {
  const estructuraCompleta = generarEstructuraCompleta();
  const indicadoresPorComponente = {};
  
  // Recorrer todos los componentes
  for (const [componenteKey, componenteData] of Object.entries(estructuraCompleta)) {
    const componenteNum = componenteKey.replace('componente_', '');
    indicadoresPorComponente[`componente_${componenteNum}`] = {};
    
    // Extraer solo los indicadores directos del componente
    for (const [indicadorKey, indicadorData] of Object.entries(componenteData.indicadores)) {
      indicadoresPorComponente[`componente_${componenteNum}`][indicadorKey] = {
        nombre: indicadorData.nombre,
        supuesto: indicadorData.supuesto
      };
    }
  }
  
  return indicadoresPorComponente;
}

//Contenedores generales
function crearContenedoresOrganizados() {
  guardarEstadoCompletoComp();

  const estructura = extraerIndicadoresPorComponente(); // Obtener estructura dict
  const mainContainer = document.getElementById('estructura-componente-container');

  if (!mainContainer) {
    console.error('No se encontró el contenedor principal');
    return;
  }

  // Limpiar contenido anterior si es necesario
  mainContainer.innerHTML = '';

  // Iterar sobre los componentes en la estructura
  Object.entries(estructura).forEach(([componenteKey, indicadores]) => {
    const objetivo = document.getElementsByName(`${componenteKey}_objetivo`)[0].value;
    // Crear contenedor del componente
    const componenteDiv = document.createElement('div');
    componenteDiv.id = `contenedor_${componenteKey}`;
    componenteDiv.className = 'componente-item card mb-3';
    componenteDiv.innerHTML = `
      <div class="card-header" style="background-color: #000000 !important; color: #FFFFFF !important">
        <h4>${capitalizarTexto(componenteKey.replace('_', ' '))}</h4>
      </div>
      <div class="card-body" id="indicadores_${componenteKey}">
      </div>
    `;

    // Agregar el componente al contenedor principal
    mainContainer.appendChild(componenteDiv);

    const contenidoComponente = componenteDiv.querySelector(`#indicadores_${componenteKey}`);

    // Iterar sobre los indicadores del componente
    Object.entries(indicadores).forEach(([indicadorKey, datos]) => {
      const indi = datos.nombre;
      const indicadorDiv = document.createElement('div');
      indicadorDiv.className = 'indicador-item card mb-3';
      indicadorDiv.id = `contenedor_${componenteKey}_${indicadorKey}`;
      indicadorDiv.innerHTML = `
        <div class="card-header py-1" style ="background-color: #515151 !important; color: #ffffff !important">
        <h6>${capitalizarTexto(indicadorKey.replace('_', ' '))}</h6>
        </div>
        <div id="${indicadorKey}">
          <!-- aqui inicia la ficha-->
        </div>
      `;

      // Agregar el indicador al componente
      contenidoComponente.appendChild(indicadorDiv);

       // Crear la ficha dinámicamente con JS (en lugar de inyectar <script>)
      const fichaContainer = indicadorDiv.querySelector(`#${indicadorKey}`);
      fichaContainer.className= 'indicomponetes';
      const fichaHTML = generarEstructuraFicha(componenteKey, indicadorKey, indi, objetivo);  // debe devolver un string HTML válido
      fichaContainer.innerHTML = fichaHTML;

      const tipoIndSelectComp = document.getElementById(`tipo_indicador_${componenteKey}_${indicadorKey}`);
      const tipoAlgSelectComp = document.getElementById(`tipo_algoritmo_${componenteKey}_${indicadorKey}`);

      tipoIndSelectComp.addEventListener('change', function() {
        const selectedTipoIndComp = this.value; // Usamos this.value en lugar de tipoIndSelect.value
        
        let algoritmo = '';
        switch(selectedTipoIndComp) {
          case 'Porcentaje':
            algoritmo = 'A = (B/C) * 100';
            break;
          case 'Variacion':
            algoritmo = 'A = ((B-C)/C) * 100';
            break;
          case 'Razon':
            algoritmo = 'A = B / C';
            break;
          case 'Tasa':
            algoritmo = 'A = (B/C) * D'; 
            break;
          case 'Promedio':
            algoritmo = 'A = SUM B / C'; 
            break;
          case 'Diferencia':
            algoritmo = 'A = B - C'; 
            break;
          case 'Indice':
            algoritmo = 'A = A'; 
            break;
          default:
            algoritmo = 'Seleccione un valor';
        }
        
        tipoAlgSelectComp.textContent = algoritmo;
        // Guardamos el algoritmo en nuestro objeto
        generarContenedorVariables(selectedTipoIndComp, componenteKey, indicadorKey)

      });

    });
  });
  
 restaurarEstadoCompletoComp();
 //funcion de event listenes para poner el mv en la mir
};

function generarEstructuraFicha(componente, indicador, indi, objetivo){
  return `
  <br>
    <div class="ficha-contrainer">
        <div class="row" id = "ficha_uno_${componente}_${indicador}" style: "width: 98% !important;">
          <div class="col-4"> 
            <strong>Objetivo: </strong>
          </div>
          <div class="col-8"> 
            <p><span style="color: #565656 !important;" id="objetivo_${componente}_${indicador}">${objetivo}</span></p>
          </div>
          <div class="col-4"> 
            <strong>Nombre del indicador: </strong>
          </div>
          <div class="col-8"> 
            <p><span style="color: #565656   !important;" id="indicador_${componente}_${indicador}"> ${indi}</span></p>
          </div>
        </div>
        <div class="row mb-3" style="margin-bottom: 0px !important; width: 98% !important;">
        <div class="col-12">
            <h5 style="color: white;">Metadatos del indicador</h5>
        </div>
      </div>
      <div class="row ficha" id = "ficha_dos_${componente}_${indicador}">
        <div class="col-4"> 
          <strong>Definición: </strong>
        </div>
        <div class="col-8"> 
          <input type="text" id="definicion_${componente}_${indicador}" name="definicion_${componente}_${indicador}" placeholder="Escribe la definición" style="border: none !important; width: 100%;">
        </div>
        <div class="col-4"> 
          <strong>Tipo de Indicador: </strong>
        </div>
        <div class="col-8"> 
          <select class="form-select" name="tipo_indicador_${componente}_${indicador}" id="tipo_indicador_${componente}_${indicador}" style="border: none !important; color: black !important; font-size: 1rem; padding-left: 0px !important;">
            <option value="Porcentaje">Porcentaje</option>
            <option value="Tasa">Tasa</option>
            <option value="Variacion">Variación porcentual</option>
            <option value="Razon">Razón</option>
            <option value="Promedio">Promedio</option>
            <option value="Diferencia">Diferencia</option>
            <option value="Indice">Índice</option>
          </select>
        </div>
        <div class="col-4"> 
          <strong>Tipo de algoritmo: </strong>
        </div>
        <div class="col-8"> 
          <p id="tipo_algoritmo_${componente}_${indicador}" ></p>
        </div>
        <div class="col-4"> 
          <strong>Periodicidad de calculo: </strong>
        </div>
        <div class="col-8"> 
          <select class="form-select" name="periocidadcalc_${componente}_${indicador}" id="periocidadcalc_${componente}_${indicador}" style="border: none !important; color: black !important; font-size: 1rem; padding-left: 0px !important;">
            <option value="Mensual">Mensual</option>
            <option value="Bimestral">Bimestral</option>
            <option value="Trimestral">Trimestral</option>
            <option value="Semestral">Semestral</option>
            <option value="Anual">Anual</option>
            <option value="Bianual">Bianual</option>
            <option value="Trianual">Trianual</option>
            <option value="Quinquenal">Quinquenal</option>
            <option value="Sexenal">Sexenal</option>
          </select>
        </div>
        <div class="col-4"> 
          <strong>Tendencia: </strong>
        </div>
        <div class="col-8"> 
          <select class="form-select" name="tendencia_${componente}_${indicador}" id="tendencia_${componente}_${indicador}" style="border: none !important; color: black !important; font-size: 1rem; padding-left: 0px !important;">
            <option value="Ascendente">Ascendente</option>
            <option value="Descendente">Descendente</option>
            <option value="Constantes">Constantes</option>
          </select>
        </div>
        <div class="col-4"> 
          <strong>Ámbito de medición: </strong>
        </div>
        <div class="col-8"> 
          <select class="form-select" name="amed_${componente}_${indicador}" id="amed_${componente}_${indicador}" style="border: none !important; color: black !important; font-size: 1rem; padding-left: 0px !important;">
            <option>Resultados a largo plazo</option>
            <option>Resultado de mediano plazo</option>
            <option>Resultados de corto plazo</option>
            <option>Servicios/bienes</option>
            <option>Actividades</option>
            <option>Insumos</option>
          </select>
        </div>
        <div class="col-4"> 
          <strong>Dimensión del desempeño: </strong>
        </div>
        <div class="col-8"> 
          <select class="form-select" name="dimdesp_${componente}_${indicador}" id="dimdesp_${componente}_${indicador}" style="border: none !important; color: black !important; font-size: 1rem; padding-left: 0px !important;">
            <option>Eficacia</option>
            <option>Eficiencia</option>
            <option>Calidad</option>
            <option>Economía</option>
          </select>
        </div>
      </div>
            <div class="row mb-3" style="margin-bottom: 0px !important; width: 98% !important;">
      <div class="col-12">
          <h5 style="color: white;">Variables</h5>
      </div>
      </div>
      <div class="row ficha" id = "ficha_tres_${componente}_${indicador}">
        <div class="vars" id="variables_${componente}_${indicador}" style="margin: 0xp !important; width: 98% !important;">
          <!-- Aqui irian las columnas-->
        </div>
      </div>
      <div class="row mb-3" style="margin-bottom: 0px !important; width: 98% !important;">
        <div class="col-12">
            <h5 style="color: white;">Línea base o valor de referencia</h5>
        </div>
      </div>
      <div class="row ficha" id = "ficha_cuatro_${componente}_${indicador}">
        <div class="vars" id="lbvr_${componente}_${indicador}" style="margin: 0xp !important; width: 98% !important;">
          <!-- Aqui irian las columnas-->
        </div>
      </div>
      <div class="row mb-3" style="margin-bottom: 0px !important; width: 98% !important;">
        <div class="col-12">
            <h5 style="color: white;">Meta</h5>
        </div>
      </div>
      <div class="row ficha" id = "ficha_cinco_${componente}_${indicador}">
        <div class="vars" id="meta_${componente}_${indicador}" style="margin: 0xp !important;">
          <!-- Aqui irian las columnas-->
        </div>
      </div>
      </div>
      `;
};

if (!window.inputsInicializadosDos) {
  window.inputsInicializadosDos = new Set();
}
//AddEvent para que cuando se modifiquen los inputs se ejecute la función 
document.addEventListener('input', function(event) {
  const target = event.target;
  const inputKey = target.name;
  const inputValue = target.value;

  // Usamos expresión regular para detectar los patrones válidos
  const patronValido = /^componente_\d+_(objetivo|indicador_\d+_nombre)$/;


  if (patronValido.test(inputKey)) {
    if (!window.inputsInicializadosDos.has(inputKey)) {
      crearContenedoresOrganizados();
      window.inputsInicializadosDos.add(inputKey); // <- Este paso es CLAVE
    }

    // Actualización de output
     let match;

    // Caso 1: componente_n_objetivo → objetivo_componente_n_indicador_x
    match = inputKey.match(/^componente_(\d+)_objetivo$/);
    if (match) {
      const n = match[1];
      const outputs = document.querySelectorAll(`[id^="objetivo_componente_${n}_indicador_"]`);
      outputs.forEach(output => {
        output.textContent = inputValue;
      });
      return;
    }

    // Caso 2: componente_n_indicador_m_nombre → indicador_componente_n_indicador_m
    match = inputKey.match(/^componente_(\d+)_indicador_(\d+)_nombre$/);
    if (match) {
      const n = match[1];
      const m = match[2];
      const matchingOutputId = `indicador_componente_${n}_indicador_${m}`;
      const correspondingOutput = document.getElementById(matchingOutputId);
      if (correspondingOutput) {
        correspondingOutput.textContent = inputValue;
      }}
}});

function generarContenedorVariables(tipo, componente,indicador){
  //contenedores en los que se va a insertar
  const tipoInd = document.getElementById(`tipo_indicador_${componente}_${indicador}`)
  const variables_comp = document.getElementById(`variables_${componente}_${indicador}`);
  const lvbr_comp = document.getElementById(`lbvr_${componente}_${indicador}`);
  const meta_comp = document.getElementById(`meta_${componente}_${indicador}`);

  //Los HTML
  //HTML VARIABLES
  const compUnvarHTML = `
  <div class="row" style:"display:flex">
      <div class="col" style="flex: 0 0 20%;  background-color: gainsboro !important">
      Variable
      </div>
      <div class="col" style="flex: 1; background-color: gainsboro !important">
      Nombre
      </div>
      <div class="col" style="flex: 1; background-color: gainsboro !important">
      Medio de verificación
      </div>
  </div>
  <div class="row"  style:"display:flex">
      <div class="col" style="flex: 0 0 20%;">
      B
      </div>
      <div class="col" style="flex: 1;">
       <input type="text" id="name_b_${componente}_${indicador}" name="name_b_${componente}_${indicador}" placeholder="Escribe el nombre" style="border: none !important; width: 100%; height:100%;">
      </div>
      <div class="col" style="flex: 1;">
       <textarea type="text" id="mv_b_${componente}_${indicador}" name="mv_b_${componente}_${indicador}" placeholder="Escribe el/los medios de verificación" style="border: none !important; width: 100%;"></textarea>
      </div>
  </div>
  `;
  const compDosvarHTML= compUnvarHTML + `
  <div class="row" style:"display:flex">
      <div class="col"  style="flex: 0 0 20%;">
      C
      </div>
      <div class="col" style="flex: 1;">
       <input type="text" id="name_c_${componente}_${indicador}" name="name_c_${componente}_${indicador}" placeholder="Escribe el nombre" style="border: none !important; width: 100%; height:100%;">
      </div>
      <div class="col" style="flex: 1;">
       <textarea type="text" id="mv_c_${componente}_${indicador}" name="mv_c_${componente}_${indicador}" placeholder="Escribe el/los medios de verificación" style="border: none !important; width: 100%;"></textarea>
      </div>
    </div>
  `;
  const compTresvarHTML =  compDosvarHTML + `
  <div class="row" style:"display:flex">
      <div class="col" style="flex: 0 0 20%;">
      D
      </div>
      <div class="col" style="flex: 1;">
       <input type="text" id="name_d_${componente}_${indicador}" name="name_d_${componente}_${indicador}" placeholder="Escribe el nombre" style="border: none !important; width: 100%; height:100%;">
      </div>
      <div class="col" style="flex: 1;">
       <a type="text" id="mv_d_${componente}_${indicador}" name="mv_d_${componente}_${indicador}" style="border: none !important; width: 100%;">N/A</a>
      </div>
  </div>
  `;
  //FUNCION PARA LBVR O TEMA 
  function lbvrmeta (type, componente, indicador){
    const contenedores = {};
    //VARIABLE B
    contenedores[`varB${type}`] = ` <div class="row" style:"display:flex">
          <div class="col" style="flex: 0 0 20%; background-color: gainsboro !important">
          Variable
          </div>
          <div class="col" style="flex: 1; background-color: gainsboro !important">
          Valor
          </div>
          <div class="col" style="flex: 1; background-color: gainsboro !important">
          Unidad de medida
          </div>
          <div class="col" style="flex: 1; background-color: gainsboro !important">
          Fecha
          </div>
      </div>
      <div class="row" style:"display:flex">
          <div class="col" style="flex: 0 0 20%;">
          B
          </div>
          <div class="col" style="flex: 1;">
          <input type="number" id="valor_b_${type}_${componente}_${indicador}" name="valor_b_${type}_${componente}_${indicador}" placeholder="0" style="border: none !important; width: 100%;">
          </div>
          <div class="col" style="flex: 1;">
          <input type="text" id="um_b_${type}_${componente}_${indicador}" name="um_b_${type}_${componente}_${indicador}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
          </div>
          <div class="col" style="flex: 1;">
          <input type="date"  id="date_b_${type}_${componente}_${indicador}" name="date_b_${type}_${componente}_${indicador}" value="2024-06-01" style="border: none !important; width: 100%;">
          </div>
      </div>`;
    //VARIABLE C
    contenedores[`varC${type}`] = `
    <div class="row" style:"display:flex">
      <div class="col" style="flex: 0 0 20%;">
      C
      </div>
      <div class="col" style="flex: 1;">
       <input type="number" id="valor_c_${type}_${componente}_${indicador}" name="valor_c_${type}_${componente}_${indicador}" placeholder="0" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
       <input type="text" id="um_c_${type}_${componente}_${indicador}" name="um_c_${type}_${componente}_${indicador}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
       <input type="date"  id="date_c_${type}_${componente}_${indicador}" name="date_c_${type}_${componente}_${indicador}" value="2024-06-01" style="border: none !important; width: 100%;">
      </div>
    </div>
    `;
    //VARIABLE D
    contenedores[`varD${type}`]= `
    <div class="row" style:"display:flex">
        <div class="col" style="flex: 0 0 20%;">
        D
        </div>
        <div class="col" style="flex: 1;">
        <input type="number" id="valor_d_${type}_${componente}_${indicador}" name="valor_d_lbvr_${type}_${componente}_${indicador}" placeholder="0" style="border: none !important; width: 100%;">
        </div>
        <div class="col" style="flex: 1;">
        <input type="text" id="um_d_${type}_${componente}_${indicador}" name="um_d_lbvr_${type}_${componente}_${indicador}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
        </div>
        <div class="col" style="flex: 1;">
         <input type="date"  id="date_d_${type}_${componente}_${indicador}" name="date_d_lbvr_${type}_${componente}_${indicador}" value="2024-06-01" style="border: none !important; width: 100%;">
        </div>
    </div>
    `;
    //RESULTADO
    contenedores[`varRes${type}`] = `
    <div class="row" style:"display:flex">
        <div class="col" style="flex: 0 0 20%;">
        Meta
        </div>
        <div class="col" style="flex: 1;">
          <p id="resultado_formula_${type}_${componente}_${indicador}">0</p> <!-- Este es un contenedor donde actualizaremos -->
        </div>
        <div class="col" style="flex: 1;">
         <input type="text" id="result_${type}_${componente}_${indicador}" name="result_${type}_${componente}_${indicador}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
        </div>
        <div class="col" style="flex: 1;">
         <input type="date"  id="result_date_${type}_${componente}_${indicador}" name="result_date_${type}_${componente}_${indicador}" value="2024-06-01" style="border: none !important; width: 100%;">
        </div>
    </div>
    `;

    return contenedores;
  };
  varsLBVR = lbvrmeta("lbvr", componente, indicador);
  varsMETA = lbvrmeta("meta", componente, indicador);
  
  const compUnvarlbvr = varsLBVR["varBlbvr"] + varsLBVR["varReslbvr"];
  const compDosvarlvbr = varsLBVR["varBlbvr"]+ varsLBVR["varClbvr"] + varsLBVR["varReslbvr"];
  const compTresvarlvbr = varsLBVR["varBlbvr"]+ varsLBVR["varClbvr"] + varsLBVR["varDlbvr"] + varsLBVR["varReslbvr"];

  const compUnvarmeta = varsMETA["varBmeta"] + varsMETA["varResmeta"];
  const compDosvarmeta = varsMETA["varBmeta"]+ varsMETA["varCmeta"] + varsMETA["varResmeta"];
  const compTresvarmeta = varsMETA["varBmeta"]+ varsMETA["varCmeta"] + varsMETA["varDmeta"] + varsMETA["varResmeta"];

  //FORMULAS
  function formula_lvbr_comp(){
    const selectedTipoInd = tipoInd.value;
    const valorb = parseFloat(document.getElementById(`valor_b_lbvr_${componente}_${indicador}`)?.value) || 0;
    const valorc = parseFloat(document.getElementById(`valor_c_lbvr_${componente}_${indicador}`)?.value) || 1;
    const valord = parseFloat(document.getElementById(`valor_d_lbvr_${componente}_${indicador}`)?.value) || 0;

    let resultado = 0;

    if (selectedTipoInd === 'Porcentaje') {
        resultado = (valorb / valorc) * 100;
    } else if (selectedTipoInd === 'Variacion') {
        resultado = ((valorb - valorc) / valorc) * 100;
    } else if (selectedTipoInd === 'Razon') {
        resultado = valorb / valorc;
    } else if (selectedTipoInd === 'Tasa') {
        resultado = (valorb / valorc) * valord;
    } else if (selectedTipoInd === 'Promedio') {
        resultado = valorb / valorc;
    } else if (selectedTipoInd === 'Diferencia') {
        resultado = valorb - valorc;
    } else if (selectedTipoInd === 'Indice') {
        resultado = valorb;
    } else {
        resultado = 0;
    }
    return resultado;
  };

  function formula_meta_comp(){
    const selectedTipoInd = tipoInd.value;
    const valorb = parseFloat(document.getElementById(`valor_b_meta_${componente}_${indicador}`)?.value) || 0;
    const valorc = parseFloat(document.getElementById(`valor_c_meta_${componente}_${indicador}`)?.value) || 1;
    const valord = parseFloat(document.getElementById(`valor_d_meta_${componente}_${indicador}`)?.value) || 0;

    let resultado = 0;

    if (selectedTipoInd === 'Porcentaje') {
        resultado = (valorb / valorc) * 100;
    } else if (selectedTipoInd === 'Variacion') {
        resultado = ((valorb - valorc) / valorc) * 100;
    } else if (selectedTipoInd === 'Razon') {
        resultado = valorb / valorc;
    } else if (selectedTipoInd === 'Tasa') {
        resultado = (valorb / valorc) * valord;
    } else if (selectedTipoInd === 'Promedio') {
        resultado = valorb / valorc;
    }  else if (selectedTipoInd === 'Diferencia') {
        resultado = valorb - valorc;
    } else if (selectedTipoInd === 'Indice') {
        resultado = valorb;
    } else {
        resultado = 0;
    }
    return resultado;
  };

  //SELECTED
  const selectedTipoInd = tipo;
    
  switch(selectedTipoInd) {
    case 'Tasa':
        variables_comp.innerHTML = compTresvarHTML;
        lvbr_comp.innerHTML = compTresvarlvbr;
        meta_comp.innerHTML = compTresvarmeta;
        setupInputListeners(
            [`valor_b_lbvr_${componente}_${indicador}`, `valor_c_lbvr_${componente}_${indicador}`, `valor_d_lbvr_${componente}_${indicador}`],
            [`valor_b_meta_${componente}_${indicador}`, `valor_c_meta_${componente}_${indicador}`, `valor_d_meta_${componente}_${indicador}`]
        );
        break;
        
    case 'Indice':
        variables_comp.innerHTML = compUnvarHTML;
        lvbr_comp.innerHTML = compUnvarlbvr;
        meta_comp.innerHTML = compUnvarmeta;
        setupInputListeners(
            [`valor_b_lbvr_${componente}_${indicador}`],
            [`valor_b_meta_${componente}_${indicador}`]
        );
        break;
        
    default:  // Caso por defecto (probablemente 'Porcentaje' u otro)
        variables_comp.innerHTML = compDosvarHTML;
        lvbr_comp.innerHTML = compDosvarlvbr;
        meta_comp.innerHTML = compDosvarmeta;
        setupInputListeners(
            [`valor_b_lbvr_${componente}_${indicador}`, `valor_c_lbvr_${componente}_${indicador}`],
            [`valor_b_meta_${componente}_${indicador}`, `valor_c_meta_${componente}_${indicador}`]
        );
  }

   // Función auxiliar para evitar código repetitivo
   function setupInputListeners(lvbrInputs, metaInputs) {
    setTimeout(() => {
        lvbrInputs.forEach(id => {
            document.getElementById(id)?.addEventListener('input', actualizarResultadolvbrComp);
        });
        metaInputs.forEach(id => {
            document.getElementById(id)?.addEventListener('input', actualizarResultadoMetaComp);
        });
    }, 0);
  }
  //Función de actualizarResultados 
  function actualizarResultadolvbrComp() {
    const resultado = formula_lvbr_comp();
    document.getElementById(`resultado_formula_lbvr_${componente}_${indicador}`).textContent = isNaN(resultado) ? '0' : resultado.toFixed(2);
  }
  function actualizarResultadoMetaComp() {
    const resultado = formula_meta_comp();
    document.getElementById(`resultado_formula_meta_${componente}_${indicador}`).textContent = isNaN(resultado) ? '0' : resultado.toFixed(2);
  }
  agregarListenersMVComp()
};


//guardado
function guardarEstadoCompletoComp() {
  appStateComp.componentes = { indicadores: {}, contenedores: {}, fichas: {} };

  // 1. Guardar variables de todos los componentes e indicadores
  document.querySelectorAll('[id^="contenedor_componente_"]').forEach(componente => {
    const componenteId = componente.id;

    // Guardamos el HTML del contenedor del componente completo
    appStateComp.componentes.contenedores[componenteId] = componente.innerHTML;

    // Recorremos cada contenedor de indicador dentro del componente
    componente.querySelectorAll(`[id^="${componenteId}_indicador_"]`).forEach(indicador => {
      const indicadorId = indicador.id;

      // Guardamos el HTML del contenedor de este indicador
      appStateComp.componentes.contenedores[indicadorId] = indicador.innerHTML;

      // Guardamos cada variable dentro del indicador
      indicador.querySelectorAll('[id]').forEach(element => {
        const elId = element.id;

        if (['INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName)) {
          appStateComp.componentes.indicadores[elId] = element.value;
        } else if (['DIV', 'P', 'SPAN'].includes(element.tagName)) {
          appStateComp.componentes.indicadores[elId] = element.textContent || element.innerHTML;
        }
      });
    });
  });
}
//restaurado
function restaurarEstadoCompletoComp() {
  const indicadores = appStateComp.componentes.indicadores;
  const contenedores = appStateComp.componentes.contenedores;

  // Restaurar valores de los campos (inputs, selects, textareas)
  for (const id in indicadores) {
    if (!indicadores.hasOwnProperty(id)) continue;

    const valor = indicadores[id];
    const elemento = document.getElementById(id);

    if (elemento) {
      const tag = elemento.tagName.toLowerCase();

      if (tag === 'input' || tag === 'textarea') {
        elemento.value = valor;
      } else if (tag === 'select') {
        const opciones = Array.from(elemento.options).map(opt => opt.value);
        if (opciones.includes(valor)) {
          elemento.value = valor;

          const necesitaChange = (
            id.startsWith('tipo_indicador_componente_') 
          );

          if (necesitaChange) {
            elemento.dispatchEvent(new Event('change'));
          }
        }
      }
    }
  }

}

//reajustar
function reajustarIDsComponentesIndicadores(tipo, numeroEliminado) {
  const idsToChange = [
    "objetivo", "indicador", "definicion", "tipo_indicador", "tipo_algoritmo", 
    "periocidadcalc", "tendencia", "amed", "dimdesp",
    "name_b", "name_c", "name_d",
    "mv_b", "mv_c", "mv_d",
    "valor_b_lbvr", "valor_c_lbvr", "valor_d_lbvr",
    "um_b_lbvr", "um_c_lbvr", "um_d_lbvr",
    "date_b_lbvr", "date_c_lbvr", "date_d_lbvr",
    "valor_b_meta", "valor_c_meta", "valor_d_meta",
    "um_b_meta", "um_c_meta", "um_d_meta",
    "date_b_meta", "date_c_meta", "date_d_meta",
    "ficha_uno"
  ];
  const numFichas = ['ficha_uno', 'ficha_dos', 'ficha_tres', 'ficha_cuatro', 'ficha_cinco'];

  idsToChange.forEach(baseId => {
    const elements = document.querySelectorAll(`[id^="${baseId}_componente_"]`);
    elements.forEach(el => {
      const match = el.id.match(/^(.+)_componente_(\d+)(?:_indicador_(\d+))?$/);
      if (match) {
        const prefix = match[1];
        let compNum = parseInt(match[2], 10);
        let indNum = match[3] ? parseInt(match[3], 10) : null;

        let newCompNum = compNum;
        let newIndNum = indNum;

        if (tipo === 'componente' && compNum > numeroEliminado) {
          newCompNum = compNum - 1;
        } else if (tipo === 'indicador' && compNum === numeroEliminado && indNum !== null && indNum > numeroEliminado) {
          newIndNum = indNum - 1;
        } else {
          return;
        }

        let newId = `${prefix}_componente_${newCompNum}`;
        if (newIndNum !== null) newId += `_indicador_${newIndNum}`;

        el.id = newId;
        if (el.name) el.name = newId;
      }
    });
  });

  if (tipo === 'componente') {
    // Etapa 1: temporalmente renombrar todos para evitar colisiones
    const contenedoresSinIndicador = Array.from(
      document.querySelectorAll('[id^="contenedor_componente_"]:not([id*="_indicador_"])')
    );

    const contenedoresConIndicador = Array.from(
      document.querySelectorAll('[id^="contenedor_componente_"][id*="_indicador_"]')
    );

    const indicadoresContainers = Array.from(
      document.querySelectorAll('[id^="indicadores_componente_"]')
    );
  
    // Etapa 2: hacer el ajuste restando 1
    contenedoresSinIndicador.forEach(contenedor => {
      const segundo = contenedor.id.split("_")[2];
      if (segundo > numeroEliminado){
        contenedor.id = `contenedor_componente_${segundo-1}`};
    });

    contenedoresConIndicador.forEach(contenedor => {
      const segundo = contenedor.id.split("_")[2];
      const indi = contenedor.id.split("_")[4];
      if (segundo > numeroEliminado){
        contenedor.id = `contenedor_componente_${segundo-1}_indicador_${indi}`}
    });
  
    indicadoresContainers.forEach(contenedor => {
      const segundo = contenedor.id.split("_")[2];
      if (segundo > numeroEliminado){
        contenedor.id = `indicadores_componente_${segundo-1}`};
    });
  }  
  //faltan los ids de las fichas para componente e indicador "ficha_uno_componente_n_indicador_n"
}

//eliminar
function eliminarFichaComponente(componenteNum) {
  // Elimina el componente visualmente
  const ficha = document.getElementById(`contenedor_componente_${componenteNum}`);
  if (ficha) ficha.remove();

  // Reajusta IDs y names
  reajustarIDsComponentesIndicadores("componente", componenteNum);

  // Reajusta títulos visibles
  const componentes = document.querySelectorAll('[id^="contenedor_componente_"]');

  componentes.forEach((comp, i) => {
    const titulo = comp.querySelector('h4');
    if (!titulo) {
      console.warn("No se encontró <h4> en:", comp);
      return; // continuar con el siguiente
    }

    const partes = titulo.textContent.trim().split(" ");
    const segundo = parseInt(partes[1], 10);
    if (segundo > componenteNum) {
      titulo.textContent = `Componente ${segundo - 1}`;
    }
  });
}

function eliminarFichaIndicadorC(componenteNum, indicadorNum) {
  // Elimina el indicador visualmente
  const ficha = document.getElementById(`contenedor_componente_${componenteNum}_indicador_${indicadorNum}`);
  if (ficha) ficha.remove();

  // Reajusta IDs y names de los indicadores siguientes del mismo componente
  reajustarIDsComponentesIndicadores("indicador", componenteNum);

  // Reajusta títulos visibles
  const indicadores = document.querySelectorAll(`[id^="contenedor_componente_${componenteNum}_indicador_"]`);
  indicadores.forEach((ind, index) => {
    const indIndex = index + 1;
    ind.id = `contenedor_componente_${componenteNum}_indicador_${indIndex}`;
    const titulo = ind.querySelector('h6');
    if (titulo) titulo.textContent = `Indicador ${indIndex}`;
  });
}

function agregarListenersMVComp() {
  const textareas = document.querySelectorAll("textarea[id^='mv_b_componente_'], textarea[id^='mv_c_componente_']");

  const grupos = {};

  textareas.forEach(textarea => {
      const match = textarea.id.match(/mv_[bc]_componente_(\d+)_indicador_(\d+)/);
      if (match) {
          const componente = match[1];
          const indicador = match[2];
          const clave = `${componente}_${indicador}`;

          if (!grupos[clave]) {
              grupos[clave] = [];
          }

          grupos[clave].push(textarea);
      }
  });

  Object.entries(grupos).forEach(([clave, textareasGrupo]) => {
      const [componente, indicador] = clave.split('_');

      textareasGrupo.forEach(textarea => {
          textarea.addEventListener("input", () => actualizarMedio(componente, indicador));
      });
  });

  function actualizarMedio(componente, indicador) {
      const idB = `mv_b_componente_${componente}_indicador_${indicador}`;
      const idC = `mv_c_componente_${componente}_indicador_${indicador}`;
      const nameDestino = `componente_${componente}_indicador_${indicador}_medio`;

      const textareaB = document.getElementById(idB);
      const textareaC = document.getElementById(idC);
      const destino = document.getElementsByName(nameDestino)[0];

      if (!destino) return;

      const valorB = textareaB ? textareaB.value.trim() : '';
      const valorC = textareaC ? textareaC.value.trim() : '';

      const lineasB = valorB.split('\n').map(l => l.trim()).filter(l => l);
      const lineasC = valorC.split('\n').map(l => l.trim()).filter(l => l);

      const todasLineas = [...lineasB, ...lineasC];
      const unicas = [...new Set(todasLineas)];

      destino.innerHTML = unicas.join('<br>');
  }
}