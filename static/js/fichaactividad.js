/* ACTIVIDADES */
//Extrer estructura de indicadores de actividades
function extraerEstructuraActividades() {
  const estructuraCompleta = generarEstructuraCompleta();
  const estructuraActividades = {};
  
  // Recorrer todos los componentes
  for (const [componenteKey, componenteData] of Object.entries(estructuraCompleta)) {
    const componenteNum = componenteKey.split('_')[1];
    
    // Recorrer actividades de cada componente
    for (const [actividadKey, actividadData] of Object.entries(componenteData.actividades)) {
      const actividadNum = actividadKey.split('_')[1];
      const claveActividad = `actividad_${componenteNum}_${actividadNum}`;
      
      estructuraActividades[claveActividad] = {};
      
      // Recorrer indicadores de cada actividad
      for (const [indicadorKey, indicadorData] of Object.entries(actividadData.indicadores)) {
        const indicadorNum = indicadorKey.split('_')[1];
        const claveIndicador = `indicador_${componenteNum}_${actividadNum}_${indicadorNum}`;
        
        estructuraActividades[claveActividad][claveIndicador] = {
          nombre: indicadorData.nombre,
          supuesto: indicadorData.supuesto,
          medio: indicadorData.medio
        };
      }
    }
  }
  
  return estructuraActividades;
}

//Generar los contenedores
function generarContenedoresActividades() {

  guardarEstadoCompletoAct(); 

  const estructura = extraerEstructuraActividades(); // tu objeto como actividad_1_1: { indicador_1_1_1: {...}, ... }
  const contenedorPrincipal = document.getElementById('estructura-actividad-container');

  // Limpiar contenedor existente
  contenedorPrincipal.innerHTML = '';

  // Iterar sobre cada actividad
  for (const [actividadKey, indicadores] of Object.entries(estructura)) {
    const [, compNum, actNum] = actividadKey.split('_');
    const objetivo = document.getElementsByName(`componente_${compNum}_actividad_${actNum}_objetivo`)[0].value;
    // Iterar sobre cada indicador dentro de la actividad
    for (const indicadorKey of Object.keys(indicadores)) {
      const partes = indicadorKey.split('_'); // ["indicador", "1", "1", "1"]
      const indNum = partes[3]; // número del indicador
      const indi = document.getElementsByName(`componente_${compNum}_actividad_${actNum}_indicador_${indNum}_nombre`)[0].value;
      // Crear contenedor para cada indicador
      const indicadorDiv = document.createElement('div');
      indicadorDiv.id = `contenedoract_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`;
      indicadorDiv.className = 'indicador-container card mb-3';

      // Establecer el título del contenedor
      indicadorDiv.innerHTML = `
       <div class="card-header py-1" style="background-color: #000000 !important; color: #FFFFFF !important">
        <h4>C${compNum} Actividad ${actNum} Indicador ${indNum}</h4>
      </div>
      <div class="card-body" id="contenedor_${compNum}_A_${actNum}_I_${indNum}">

      </div>
      `;
      // Agregar al contenedor principal
      contenedorPrincipal.appendChild(indicadorDiv);
      const fichaContainer = indicadorDiv.querySelector(`#contenedor_${compNum}_A_${actNum}_I_${indNum}`);
      fichaContainer.className= 'indicomponetes';
      const fichaHTML = generarEstructuraFichaAct(compNum, indNum ,actNum, indi, objetivo);  
      fichaContainer.innerHTML = fichaHTML;

      //select algoritmo
      const tipoIndSelectAct = document.getElementById(`tipo_indicador_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`);
      const tipoAlgSelectAct = document.getElementById(`tipo_algoritmo_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`);
      
      tipoIndSelectAct.addEventListener('change', function() {
        const selectedTipoIndAct = this.value; // Usamos this.value en lugar de tipoIndSelect.value
        
        let algoritmo = '';
        switch(selectedTipoIndAct) {
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
        
        tipoAlgSelectAct.textContent = algoritmo;
        // Guardamos el algoritmo en nuestro objeto
        generarContenedorVariablesAct(selectedTipoIndAct, compNum, actNum, indNum)

      });
    }
  }
  restaurarEstadoCompletoAct();
};

function generarEstructuraFichaAct(compNum, indNum, actNum,indi, objetivo){
  return `
  <br>
    <div class="ficha-contrainer">
        <div class="row" id = "ficha_uno_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" style: "width: 98% !important;">
          <div class="col-4"> 
            <strong>Objetivo: </strong>
          </div>
          <div class="col-8"> 
            <p><span style="color: #565656 !important;" id="objetivo_componente_${compNum}_actividad_${actNum}_indicador_${indNum}">${objetivo}</span></p>
          </div>
          <div class="col-4"> 
            <strong>Nombre del indicador: </strong>
          </div>
          <div class="col-8"> 
            <p><span style="color: #565656   !important;" id="indicador_componente_${compNum}_actividad_${actNum}_indicador_${indNum}"> ${indi}</span></p>
          </div>
        </div>
        <div class="row mb-3" style="margin-bottom: 0px !important; width: 98% !important;">
        <div class="col-12">
            <h5 style="color: white;">Metadatos del indicador</h5>
        </div>
      </div>
      <div class="row ficha" id = "ficha_dos_componente_${compNum}_actividad_${actNum}_indicador_${indNum}">
        <div class="col-4"> 
          <strong>Definición: </strong>
        </div>
        <div class="col-8"> 
          <input type="text" id="definicion_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" name="definicion_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" placeholder="Escribe la definición" style="border: none !important; width: 100%;">
        </div>
        <div class="col-4"> 
          <strong>Tipo de Indicador: </strong>
        </div>
        <div class="col-8"> 
          <select class="form-select" name="tipo_indicador_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" id="tipo_indicador_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" style="border: none !important; color: black !important; font-size: 1rem; padding-left: 0px !important;">
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
          <p id="tipo_algoritmo_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" ></p>
        </div>
        <div class="col-4"> 
          <strong>Periodicidad de calculo: </strong>
        </div>
        <div class="col-8"> 
          <select class="form-select" name="periocidadcalc_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" id="periocidadcalc_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" style="border: none !important; color: black !important; font-size: 1rem; padding-left: 0px !important;">
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
          <select class="form-select" name="tendencia_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" id="tendencia_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" style="border: none !important; color: black !important; font-size: 1rem; padding-left: 0px !important;">
            <option value="Ascendente">Ascendente</option>
            <option value="Descendente">Descendente</option>
            <option value="Constantes">Constantes</option>
          </select>
        </div>
        <div class="col-4"> 
          <strong>Ámbito de medición: </strong>
        </div>
        <div class="col-8"> 
          <select class="form-select" name="amed_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" id="amed_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" style="border: none !important; color: black !important; font-size: 1rem; padding-left: 0px !important;">
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
          <select class="form-select" name="dimdesp_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" id="dimdesp_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" style="border: none !important; color: black !important; font-size: 1rem; padding-left: 0px !important;">
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
      <div class="row ficha" id = "ficha_tres_componente_${compNum}_actividad_${actNum}_indicador_${indNum}">
        <div class="vars" id="variables_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" style="margin: 0xp !important; width: 98% !important;">
          <!-- Aqui irian las columnas-->
        </div>
      </div>
      <div class="row mb-3" style="margin-bottom: 0px !important; width: 98% !important;">
        <div class="col-12">
            <h5 style="color: white;">Línea base o valor de referencia</h5>
        </div>
      </div>
      <div class="row ficha" id = "ficha_cuatro_componente_${compNum}_actividad_${actNum}_indicador_${indNum}">
        <div class="vars" id="lbvr_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" style="margin: 0xp !important; width: 98% !important;">
          <!-- Aqui irian las columnas-->
        </div>
      </div>
      <div class="row mb-3" style="margin-bottom: 0px !important; width: 98% !important;">
        <div class="col-12">
            <h5 style="color: white;">Meta</h5>
        </div>
      </div>
      <div class="row ficha" id = "ficha_cinco_componente_${compNum}_actividad_${actNum}_indicador_${indNum}">
        <div class="vars" id="meta_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" style="margin: 0xp !important;">
          <!-- Aqui irian las columnas-->
        </div>
      </div>
      </div>
      `;
};

//Listeners de modificación de objetivo y nombre indicador
if (!window.inputsInicializadosTres) {
  window.inputsInicializadosTres = new Set();
}
document.addEventListener('input', function(event) {
  const target = event.target;
  const inputKey = target.name;
  const inputValue = target.value;

  // Usamos expresión regular para detectar los patrones válidos
  const patronValido = /^componente_\d+_actividad_\d+_(objetivo|indicador_\d+_nombre)$/;


  if (patronValido.test(inputKey)) {
    if (!window.inputsInicializadosTres.has(inputKey)) {
      generarContenedoresActividades();
      window.inputsInicializadosTres.add(inputKey); // <- Este paso es CLAVE
    }

    // Actualización de output
     let match;

    // Caso 1: componente_n_objetivo → objetivo_componente_n_indicador_x
    match = inputKey.match(/^componente_(\d+)_actividad_(\d+)_objetivo$/);
    if (match) {
      const n = match[1];
      const m = match[3];
      const outputs = document.querySelectorAll(`[id^="objetivo_componente_${n}_actividad_${m}_indicador_"]`);
      outputs.forEach(output => {
        output.textContent = inputValue;
      });
      return;
    }

    // Caso 2: componente_n_indicador_m_nombre → indicador_componente_n_indicador_m
    match = inputKey.match(/^componente_(\d+)_actividad_(\d+)_indicador_(\d+)_nombre$/);
    if (match) {
      const n = match[1];
      const m = match[2];
      const o = match[3];
      const matchingOutputId = `indicador_componente_${n}_actividad_${m}_indicador_${o}`;
      const correspondingOutput = document.getElementById(matchingOutputId);
      if (correspondingOutput) {
        correspondingOutput.textContent = inputValue;
      }}
}});

function generarContenedorVariablesAct(tipo, compNum, actNum, indNum){
  const tipoInd = document.getElementById(`tipo_indicador_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`)
  const variables_act = document.getElementById(`variables_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`);
  const lvbr_act = document.getElementById(`lbvr_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`);
  const meta_act = document.getElementById(`meta_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`);


  const actUnvarHTML = `
    <div class="row">
        <div class="col" style="background-color: gainsboro !important">
        Variable
        </div>
        <div class="col" style="background-color: gainsboro !important">
        Nombre
        </div>
        <div class="col" style="background-color: gainsboro !important">
        Medio de verificación
        </div>
    </div>
    <div class="row">
        <div class="col">
        B
        </div>
        <div class="col">
        <input type="text" id="name_b_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" name="name_b_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" placeholder="Escribe el nombre" style="border: none !important; width: 100%;">
        </div>
        <div class="col">
        <textarea type="text" id="mv_b_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" name="mv_b_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" placeholder="Escribe el/los medios de verificación" style="border: none !important; width: 100%;"></textarea>
        </div>
    </div>
  `;
  const actDosvarHTML= actUnvarHTML + `
  <div class="row">
      <div class="col">
      C
      </div>
      <div class="col">
       <input type="text" id="name_c_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" name="name_c_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" placeholder="Escribe el nombre" style="border: none !important; width: 100%;">
      </div>
      <div class="col">
       <textarea type="text" id="mv_c_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" name="mv_c_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" placeholder="Escribe el/los medios de verificación" style="border: none !important; width: 100%;"></textarea>
      </div>
    </div>
  `;
  const actTresvarHTML =  actDosvarHTML + `
  <div class="row">
      <div class="col">
      D
      </div>
      <div class="col">
       <input type="text" id="name_d_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" name="name_d_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" placeholder="Escribe el nombre" style="border: none !important; width: 100%;">
      </div>
      <div class="col">
       <a type="text" id="mv_d_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" name="mv_d_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" style="border: none !important; width: 100%;">N/A</a>
      </div>
  </div>
  `;
  function lbvrmeta (type, compNum, actNum, indNum){
    const contenedores = {};
    //VARIABLE B
    contenedores[`varB${type}`] = ` <div class="row">
          <div class="col" style="background-color: gainsboro !important">
          Variable
          </div>
          <div class="col" style="background-color: gainsboro !important">
          Valor
          </div>
          <div class="col" style="background-color: gainsboro !important">
          Unidad de medida
          </div>
          <div class="col" style="background-color: gainsboro !important">
          Fecha
          </div>
      </div>
      <div class="row">
          <div class="col">
          B
          </div>
          <div class="col">
          <input type="number" id="valor_b_${type}_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" name="valor_b_${type}_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" placeholder="0" style="border: none !important; width: 100%;">
          </div>
          <div class="col">
          <input type="text" id="um_b_${type}_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" name="um_b_${type}_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
          </div>
          <div class="col">
          <input type="date"  id="date_b_${type}_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" name="date_b_${type}_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" value="2024-06-01" style="border: none !important; width: 100%;">
          </div>
      </div>`;
    //VARIABLE C
    contenedores[`varC${type}`] = `
    <div class="row">
      <div class="col">
      C
      </div>
      <div class="col">
       <input type="number" id="valor_c_${type}_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" name="valor_c_${type}_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" placeholder="0" style="border: none !important; width: 100%;">
      </div>
      <div class="col">
       <input type="text" id="um_c_${type}_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" name="um_c_${type}_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
      </div>
      <div class="col">
       <input type="date"  id="date_c_${type}_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" name="date_c_${type}_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" value="2024-06-01" style="border: none !important; width: 100%;">
      </div>
    </div>
    `;
    //VARIABLE D
    contenedores[`varD${type}`]= `
    <div class="row">
        <div class="col">
        D
        </div>
        <div class="col">
        <input type="number" id="valor_d_${type}_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" name="valor_d_lbvr_${type}_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" placeholder="0" style="border: none !important; width: 100%;">
        </div>
        <div class="col">
        <input type="text" id="um_d_${type}_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" name="um_d_lbvr_${type}_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
        </div>
        <div class="col">
         <input type="date"  id="date_d_${type}_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" name="date_d_lbvr_${type}_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" value="2024-06-01" style="border: none !important; width: 100%;">
        </div>
    </div>
    `;
    //RESULTADO
    contenedores[`varRes${type}`] = `
    <div class="row">
        <div class="col">
        Meta
        </div>
        <div class="col">
          <p id="resultado_formula_${type}_componente_${compNum}_actividad_${actNum}_indicador_${indNum}">0</p> <!-- Este es un contenedor donde actualizaremos -->
        </div>
        <div class="col">
         <input type="text" id="result_${type}_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" name="result_${type}_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
        </div>
        <div class="col">
         <input type="date"  id="result_date_${type}_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" name="result_date_${type}_componente_${compNum}_actividad_${actNum}_indicador_${indNum}" value="2024-06-01" style="border: none !important; width: 100%;">
        </div>
    </div>
    `;

    return contenedores;
  };

  varsLBVR = lbvrmeta("lbvr", compNum, actNum, indNum);
  varsMETA = lbvrmeta("meta", compNum, actNum, indNum);
  
  const actUnvarlbvr = varsLBVR["varBlbvr"] + varsLBVR["varReslbvr"];
  const actDosvarlvbr = varsLBVR["varBlbvr"]+ varsLBVR["varClbvr"] + varsLBVR["varReslbvr"];
  const actTresvarlvbr = varsLBVR["varBlbvr"]+ varsLBVR["varClbvr"] + varsLBVR["varDlbvr"] + varsLBVR["varReslbvr"];

  const actUnvarmeta = varsMETA["varBmeta"] + varsMETA["varResmeta"];
  const actDosvarmeta = varsMETA["varBmeta"]+ varsMETA["varCmeta"] + varsMETA["varResmeta"];
  const actTresvarmeta = varsMETA["varBmeta"]+ varsMETA["varCmeta"] + varsMETA["varDmeta"] + varsMETA["varResmeta"]; 1

  //FORMULAS
  function formula_lvbr_act(){
    const selectedTipoInd = tipoInd.value;
    const valorb = parseFloat(document.getElementById(`valor_b_lbvr_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`)?.value) || 0;
    const valorc = parseFloat(document.getElementById(`valor_c_lbvr_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`)?.value) || 1;
    const valord = parseFloat(document.getElementById(`valor_d_lbvr_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`)?.value) || 0;

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

  function formula_meta_act(){
    const selectedTipoInd = tipoInd.value;
    const valorb = parseFloat(document.getElementById(`valor_b_meta_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`)?.value) || 0;
    const valorc = parseFloat(document.getElementById(`valor_c_meta_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`)?.value) || 1;
    const valord = parseFloat(document.getElementById(`valor_d_meta_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`)?.value) || 0;

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

  //SELECTED
  const selectedTipoInd = tipo;
    
  switch(selectedTipoInd) {
    case 'Tasa':
        variables_act.innerHTML = actTresvarHTML;
        lvbr_act.innerHTML = actTresvarlvbr;
        meta_act.innerHTML = actTresvarmeta;
        setupInputListeners(
            [`valor_b_lbvr_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`, `valor_c_lbvr_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`, `valor_d_lbvr_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`],
            [`valor_b_meta_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`, `valor_c_meta_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`, `valor_d_meta_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`]
        );
        break;
        
    case 'Indice':
        variables_act.innerHTML = actUnvarHTML;
        lvbr_act.innerHTML = actUnvarlbvr;
        meta_act.innerHTML = actUnvarmeta;
        setupInputListeners(
            [`valor_b_lbvr_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`],
            [`valor_b_meta_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`]
        );
        break;
        
    default:  // Caso por defecto (probablemente 'Porcentaje' u otro)
        variables_act.innerHTML = actDosvarHTML;
        lvbr_act.innerHTML = actDosvarlvbr;
        meta_act.innerHTML = actDosvarmeta;
        setupInputListeners(
            [`valor_b_lbvr_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`, `valor_c_lbvr_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`],
            [`valor_b_meta_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`, `valor_c_meta_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`]
        );
  }

   // Función auxiliar para evitar código repetitivo
   function setupInputListeners(lvbrInputs, metaInputs) {
    setTimeout(() => {
        lvbrInputs.forEach(id => {
            document.getElementById(id)?.addEventListener('input', actualizarResultadolvbrAct);
        });
        metaInputs.forEach(id => {
            document.getElementById(id)?.addEventListener('input', actualizarResultadoMetaAct);
        });
    }, 50);
}
  //Función de actualizarResultados 
  function actualizarResultadolvbrAct() {
    const resultado = formula_lvbr_act();
    document.getElementById(`resultado_formula_lbvr_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`).textContent = isNaN(resultado) ? '0' : resultado.toFixed(2);
  }
  function actualizarResultadoMetaAct() {
    const resultado = formula_meta_act();
    document.getElementById(`resultado_formula_meta_componente_${compNum}_actividad_${actNum}_indicador_${indNum}`).textContent = isNaN(resultado) ? '0' : resultado.toFixed(2);
  }
  
  agregarListenersMVAct()
};

//guardado
function guardarEstadoCompletoAct() {
  appStateAct.actividades = {
    indicadores: {},
    contenedores: {},
    fichas: {}
  };

  // 1. Guardar HTML de todos los contenedores principales
  document.querySelectorAll('[id^="contenedoract_componente_"]').forEach(componente => {
    const componenteId = componente.id;
    appStateAct.actividades.contenedores[componenteId] = componente.innerHTML;

    // 2. Buscar subcontenedores dentro del componente
    componente.querySelectorAll('[id^="contenedor_"]').forEach(subContenedor => {
      const subContenedorId = subContenedor.id;

      // 3. Buscar fichas dentro del subcontenedor
      subContenedor.querySelectorAll('.ficha-contrainer').forEach(ficha => {
        const fichaId = ficha.className + '_' + subContenedorId; // O usa ficha.dataset si tienes datos definidos

        // Inicializar objeto para la ficha si no existe
        if (!appStateAct.actividades.fichas[fichaId]) {
          appStateAct.actividades.fichas[fichaId] = {};
        }

        // 4. Guardar valores de inputs y textareas
        ficha.querySelectorAll('input, textarea, select').forEach(elemento => {
          const inputId = elemento.id;
          if (inputId) {
            appStateAct.actividades.fichas[fichaId][inputId] = elemento.value;
          }
        });

        ficha.querySelectorAll('[id]').forEach(element => {
          const elId = element.id;

          if (['INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName)) {
            appStateAct.actividades.indicadores[elId] = element.value;
          } else if (['DIV', 'P', 'SPAN'].includes(element.tagName)) {
            appStateAct.actividades.indicadores[elId] = element.textContent || element.innerHTML;
          }
        });
      });
    });
  });
};

//restaurar
function restaurarEstadoCompletoAct(){
  const indicadores = appStateAct.actividades.indicadores;

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
//eliminar
function eliminarIndicadorAct(tipo,compNum,actNum, indNum){
  if (tipo === "componente"){
    const ficha = document.querySelector(`[id^="contenedoract_componente_${compNum}_"]`);
    if (ficha) ficha.remove();
    reajustarIDsActividadesIndicadores(tipo, compNum,0,0);
  }
  else if (tipo === "actividad"){
    const ficha = document.querySelector(`[id^="contenedoract_componente_${compNum}_actividad_${actNum}_"]`);
    if (ficha) ficha.remove();
    reajustarIDsActividadesIndicadores(tipo, compNum, actNum,0);

  } else if (tipo === "indicador-act"){
    const ficha = document.querySelector(`[id^="contenedoract_componente_${compNum}_actividad_${actNum}_indicador_${indNum}"]`);
    if (ficha) ficha.remove();
    reajustarIDsActividadesIndicadores(tipo, compNum, actNum, indNum);
  }
}

//reajustar
function reajustarIDsActividadesIndicadores (tipo,compNumEliminado,actNumEliminado, indNumEliminado){
  const numFichas = ['ficha_uno', 'ficha_dos', 'ficha_tres', 'ficha_cuatro', 'ficha_cinco'];
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
  if (tipo === "componente"){
    const contenedores =  document.querySelectorAll(`[id^="contenedoract_componente_"]`);
    contenedores.forEach(contenedor =>{
      const segundo = contenedor.id.split("_")[2];
      if (segundo > compNumEliminado){

        //cambio de indicadores
        contenedor.querySelectorAll('*').forEach(element => {
          idsToChange.forEach(id => {
            if (element.id.startsWith(id.split('_componente_')[0])) {
              const newId = element.id.replace(/(_componente_)(\d+)(_actividad_\d+_indicador_\d+)/, function(match, prefix, compNum, suffix) {
                let newCompNum = parseInt(compNum) - 1;  // Restar 1 al compNum
                return prefix + newCompNum + suffix;  // Retornar el nuevo id
              });
              if (element.name === element.id) element.name = newId;
              element.id = newId;
            }
          });
        });

        //cambio de id="ficha_uno_componente_1_actividad_1_indicador_1"
        numFichas.forEach(nombreFicha => {
        const fichas = document.querySelectorAll(`[id^="${nombreFicha}_componente_"]`);
        fichas.forEach(ficha => {
          const partes = ficha.id.trim().split('_');
          const indiceComp = partes.findIndex(p => p === 'componente');
          if (indiceComp !== -1 && partes.length > indiceComp + 1) {

            const numActual = parseInt(partes[indiceComp + 1]);
            if (numActual > compNumEliminado) {  // ✅ Solo si es mayor
              partes[indiceComp + 1] = (numActual - 1).toString();
              const nuevoId = partes.join('_');
              ficha.id = nuevoId;
            }
          }
        });
      });

        //cambio contenedor_1_A_1_I_1
        const cont = document.querySelector(`[id^="contenedor_"]`)
        const contPartes = cont.id.trim().split('_');
        contPartes[1] = parseInt(contPartes[1]) - 1;
        cont.id = contPartes.join('_');
        //cambio en titulos
        contenedor.querySelectorAll('h4').forEach(h4 => {
          const partes = h4.textContent.trim().split(' ');  // ["C3", "Actividad", "1", "Indicador", "1"]
          // Extraer el número después de la "C", restar 1 y volver a construir
          const numero = parseInt(partes[0].substring(1));  // 3
          partes[0] = `C${numero - 1}`;  // "C2"
          h4.textContent = partes.join(' ');  // "C2 Actividad 1 Indicador 1"
        });
        //cambio de contenedor general
        const partes = contenedor.id.split('_');
        const resto = partes.slice(3).join('_');
        contenedor.id = `contenedoract_componente_${partes[2]-1}_${resto}`
      };
    });
  }
  else if (tipo === "actividad"){
    const contenedores = document.querySelectorAll(`[id^="contenedoract_componente_"]`);
    contenedores.forEach(contenedor => {
    const actividadNum = parseInt(contenedor.id.split("_")[4]);
    if (actividadNum > actNumEliminado) {
      // cambio de indicadores: componente_n_actividad_m_indicador_o
      contenedor.querySelectorAll('*').forEach(element => {
        idsToChange.forEach(id => {
          if (element.id.startsWith(id.split('_actividad_')[0])) {
            const oldId = element.id;
            const newId = oldId.replace(/(_actividad_)(\d+)(_indicador_\d+)/, function(match, prefix, actNum, suffix) {
              let newActNum = parseInt(actNum) - 1;
              return prefix + newActNum + suffix;
            });
            element.id = newId;
            if (element.name === oldId) element.name = newId;
          }
        });
      });

      // cambio de id="ficha_uno_componente_n_actividad_m_indicador_o"
      numFichas.forEach(nombreFicha => {
        const fichas = document.querySelectorAll(`[id^="${nombreFicha}_componente_"]`);
        fichas.forEach(ficha => {
          const partes = ficha.id.trim().split('_');
          const indiceAct = partes.findIndex(p => p === 'actividad');
          if (indiceAct !== -1 && partes.length > indiceAct + 1) {
            const numActual = parseInt(partes[indiceAct + 1]);
            partes[indiceAct + 1] = (numActual - 1).toString();
            ficha.id = partes.join('_');
          }
        });
      });

      // cambio contenedor_1_A_m_I_o
      const cont = document.querySelector(`[id^="contenedor_"]`);
      const contPartes = cont.id.trim().split('_');
      if (contPartes.length > 3) {
        contPartes[3] = parseInt(contPartes[3]) - 1;
        cont.id = contPartes.join('_');
      }

      // cambio en títulos <h4>: "C3 Actividad m Indicador o"
      contenedor.querySelectorAll('h4').forEach(h4 => {
        const partes = h4.textContent.trim().split(' ');  // ["C3", "Actividad", "1", "Indicador", "1"]
        if (partes[1] === "Actividad") {
          const numAct = parseInt(partes[2]);
          partes[2] = (numAct - 1).toString();
          h4.textContent = partes.join(' ');
        }
      });

      // cambio del ID del contenedor general: contenedoract_componente_n_actividad_m_indicador_o
      const partes = contenedor.id.split('_');
      const actividadIndex = partes.findIndex(p => p === 'actividad');
      if (actividadIndex !== -1 && partes.length > actividadIndex + 1) {
        const actActual = parseInt(partes[actividadIndex + 1]);
        partes[actividadIndex + 1] = (actActual - 1).toString();
        contenedor.id = partes.join('_');
      }
    }
  });


  } else if (tipo === "indicador-act"){
    const contenedores = document.querySelectorAll(`[id^="contenedoract_componente_"]`);
    contenedores.forEach(contenedor => {
      const numIndicador = parseInt(contenedor.id.split("_")[6]);
      if (numIndicador > indNumEliminado) {
    
        // cambio de id en elementos internos: componente_n_actividad_m_indicador_o
        contenedor.querySelectorAll('*').forEach(element => {
          idsToChange.forEach(id => {
            if (element.id.startsWith(id.split('_indicador_')[0])) {
              const oldId = element.id;
              const newId = oldId.replace(/(_indicador_)(\d+)/, function(match, prefix, indNum) {
                let newIndNum = parseInt(indNum) - 1;
                return prefix + newIndNum;
              });
              element.id = newId;
              if (element.name === oldId) element.name = newId;
            }
          });
        });
    
        // cambio de id="ficha_uno_componente_n_actividad_m_indicador_o"
        numFichas.forEach(nombreFicha => {
          const fichas = document.querySelectorAll(`[id^="${nombreFicha}_componente_"]`);
          fichas.forEach(ficha => {
            const partes = ficha.id.trim().split('_');
            const indiceInd = partes.findIndex(p => p === 'indicador');
            if (indiceInd !== -1 && partes.length > indiceInd + 1) {
              const numActual = parseInt(partes[indiceInd + 1]);
              partes[indiceInd + 1] = (numActual - 1).toString();
              ficha.id = partes.join('_');
            }
          });
        });
    
        // cambio contenedor_n_A_m_I_o
        const cont = document.querySelector(`[id^="contenedor_"]`);
        const contPartes = cont.id.trim().split('_');
        if (contPartes.length > 5) {
          contPartes[5] = parseInt(contPartes[5]) - 1;
          cont.id = contPartes.join('_');
        }
    
        // cambio en títulos <h4>: "C3 Actividad m Indicador o"
        contenedor.querySelectorAll('h4').forEach(h4 => {
          const partes = h4.textContent.trim().split(' ');  // ["C3", "Actividad", "1", "Indicador", "2"]
          const indIdx = partes.findIndex(p => p === "Indicador");
          if (indIdx !== -1 && partes.length > indIdx + 1) {
            const numInd = parseInt(partes[indIdx + 1]);
            partes[indIdx + 1] = (numInd - 1).toString();
            h4.textContent = partes.join(' ');
          }
        });
    
        // cambio del ID del contenedor general: contenedoract_componente_n_actividad_m_indicador_o
        const partes = contenedor.id.split('_');
        const indIndex = partes.findIndex(p => p === 'indicador');
        if (indIndex !== -1 && partes.length > indIndex + 1) {
          const oldNum = parseInt(partes[indIndex + 1]);
          partes[indIndex + 1] = (oldNum - 1).toString();
          contenedor.id = partes.join('_');
        }
      }
    });
    
  }

};


function agregarListenersMVAct() {
    // Selecciona solo los textareas con el patrón específico completo
    const textareas = document.querySelectorAll("textarea[id^='mv_b_componente_'], textarea[id^='mv_c_componente_']");
    const grupos = {};

    textareas.forEach(textarea => {
        // Buscamos específicamente el patrón con componente, actividad e indicador
        const match = textarea.id.match(/mv_[bc]_componente_(\d+)_actividad_(\d+)_indicador_(\d+)/);
        if (match) {
            const componente = match[1];
            const actividad = match[2];
            const indicador = match[3];
            const clave = `${componente}_${actividad}_${indicador}`;

            if (!grupos[clave]) {
                grupos[clave] = [];
            }

            grupos[clave].push(textarea);
        }
    });

    // Agregamos listeners por grupo
    Object.entries(grupos).forEach(([clave, textareasGrupo]) => {
        const [componente, actividad, indicador] = clave.split('_');

        textareasGrupo.forEach(textarea => {
            textarea.addEventListener("input", () => actualizarMedio(componente, actividad, indicador));
        });
    });

    function actualizarMedio(componente, actividad, indicador) {
        const idB = `mv_b_componente_${componente}_actividad_${actividad}_indicador_${indicador}`;
        const idC = `mv_c_componente_${componente}_actividad_${actividad}_indicador_${indicador}`;
        const nameDestino = `componente_${componente}_actividad_${actividad}_indicador_${indicador}_medio`;

        const textareaB = document.getElementById(idB);
        const textareaC = document.getElementById(idC);
        const destino = document.getElementsByName(nameDestino)[0];

        if (!destino) return;

        const valorB = textareaB ? textareaB.value.trim() : '';
        const valorC = textareaC ? textareaC.value.trim() : '';

        const lineasB = valorB.split('\n').map(l => l.trim()).filter(Boolean);
        const lineasC = valorC.split('\n').map(l => l.trim()).filter(Boolean);

        const todasLineas = [...lineasB, ...lineasC];
        const unicas = [...new Set(todasLineas)];

        destino.innerHTML = unicas.join('<br>');
    }
}

