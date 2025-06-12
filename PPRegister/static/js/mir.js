/* FICHA FIN Y PROPOSITO */
/* ESTRUCTURA FIN */
function obtenerEstructuraFin(){
  const objetivo = document.querySelector('input[name="fin_objetivo"]').value;
  const indicador = document.querySelector('input[name="fin_indicador"]').value;
  const supuestos = document.querySelector('input[name="fin_supuestos"]').value;
  const medio_verificacion = document.querySelector('a[name="fin_verificacion"]').textContent;

  const estructura = {
      fin: {
        objetivo: objetivo,
        indicador: indicador,
        supuestos: supuestos,
        medio_verificacion: medio_verificacion
      }
    };
  return estructura;
};

/* ESTRUCTURA DE PROPOSITO */
  function obtenerEstructuraProposito() {
    // Obtener el objetivo del propósito
    const objetivo = document.querySelector('input[name="proposito_objetivo"]').value;
    
    // Obtener todos los bloques de indicadores
    const indicadoresBlocks = document.querySelectorAll('.indicador-block');
    
    // Crear el objeto de indicadores
    const indicadores = {};
    
    // Contador para los indicadores (comienza en 1)
    let contador = 1;
    
    // Recorrer cada bloque de indicador
    indicadoresBlocks.forEach(block => {
      // Obtener los valores del indicador actual
      const nombre = block.querySelector(`input[name="proposito_indicador_${contador}"]`).value;
      const supuesto = block.querySelector(`input[name="proposito_supuesto_${contador}"]`).value;
      const medio = block.querySelector('a[type="text"]').textContent.trim();
      
      // Agregar al objeto de indicadores
      indicadores[contador] = {
        name: nombre,
        supuesto: supuesto,
        medio: medio
      };
      
      contador++;
    });
    
    // Crear la estructura final
    const estructura = {
      proposito: {
        objetivo: objetivo,
        totalIndicadores: indicadoresBlocks.length,
        indicadores: indicadores
      }
    };
    
    return estructura;
}
  
/* FICHA DE INDICADORES */
/* NIVEL - FIN */
 //mostrar lo de la MIR en el indicador
const objetivo = document.getElementById("fin_objetivo");
const salida_objetivo = document.getElementById("objetivo_fin");
  
const indicador = document.getElementById("fin_indicador");
const salida_indicador = document.getElementById("indicador_fin");


objetivo.addEventListener('input', function(){
salida_objetivo.textContent = objetivo.value;
})

indicador.addEventListener('input', function(){
salida_indicador.textContent = indicador.value;
})

//select de tipo de algoritmo
const tipoIndSelect = document.getElementById('fin_tipo_indicador');
const tipoAlgSelect = document.getElementById('fin_tipo_algoritmo');


//contenedores de variables
const UnvarHTML = `
        <div class="row" style="display: flex;">
            <div class="col" style="flex: 0 0 20%; background-color: gainsboro !important;">
            Variable
            </div>
            <div class="col" style="flex: 1; !important; background-color: gainsboro!important;">
            Nombre
            </div>
            <div class="col" style="flex: 1; !important; background-color: gainsboro !important;">
            Medio de verificación
            </div>
        </div>
        <div class="row" style="display: flex;">
            <div class="col" style="flex: 0 0 20%;  !important;">
            B
            </div>
            <div class="col" style="flex: 1;!important;">
             <input type="text" id="fin_name_b" name="fin_name_b" placeholder="Escribe el nombre" style="border: none !important; width: 100%; height:100%;  height:100%;">
            </div>
            <div class="col" style="flex: 1; !important;">
             <textarea type="text" id="fin_mv_b" name="fin_mv_b" placeholder="Escribe el/los medios de verificación" style="border: none !important; width: 100%;"></textarea>
            </div>
        </div>
  `;
const DosvarHTML = `
        <div class="row" style="display: flex;"> 
            <div class="col" style="flex: 0 0 20%; background-color: gainsboro !important;">
            Variable
            </div>
            <div class="col" style="flex: 1; background-color: gainsboro !important;">
            Nombre
            </div>
            <div class="col" style="flex: 1; background-color: gainsboro !important;">
            Medio de verificación
            </div>
        </div>
        <div class="row" style="display: flex;">
            <div class="col" style="flex: 0 0 20%;">
            B
            </div>
            <div class="col" style="flex: 1;">
             <input type="text" id="fin_name_b" name="fin_name_b" placeholder="Escribe el nombre" style="border: none !important; width: 100%; height:100%;  height:100%;">
            </div>
            <div class="col" style="flex: 1;">
             <textarea type="text" id="fin_mv_b" name="fin_mv_b" placeholder="Escribe el/los medios de verificación" style="border: none !important; width: 100%;"></textarea>
            </div>
        </div>
        <div class="row" style="display: flex;">
            <div class="col" style="flex: 0 0 20%;">
            C
            </div>
            <div class="col" style="flex: 1;">
             <input type="text" id="fin_name_c" name="fin_name_c" placeholder="Escribe el nombre" style="border: none !important; width: 100%; height:100%; height:100%;">
            </div>
            <div class="col" style="flex: 1;">
             <textarea type="text" id="fin_mv_c" name="fin_mv_c" placeholder="Escribe el/los medios de verificación" style="border: none !important; width: 100%;"></textarea>
            </div>
        </div>
  `;
const TresvarHTML = `
  <div class="row" style="display: flex;">
      <div class="col" style="flex: 0 0 20%; background-color: gainsboro !important;">
      Variable
      </div>
      <div class="col" style=" flex: 1; background-color: gainsboro !important;">
      Nombre
      </div>
      <div class="col" style=" flex: 1; background-color: gainsboro !important;">
      Medio de verificación
      </div>
  </div>
  <div class="row" style="display: flex;">
      <div class="col" style="flex: 0 0 20%;">
      B
      </div>
      <div class="col"  style="flex: 1;">
       <input type="text" id="fin_name_b" name="fin_name_b" placeholder="Escribe el nombre" style="border: none !important; width: 100%; height:100%;">
      </div>
      <div class="col"  style="flex: 1;">
       <textarea type="text" id="fin_mv_b" name="fin_mv_b" placeholder="Escribe el/los medios de verificación" style="border: none !important; width: 100%;"></textarea>
      </div>
  </div>
  <div class="row" style="display: flex;">
      <div class="col" style="flex: 0 0 20%;">
      C
      </div>
      <div class="col">
       <input type="text" id="fin_name_c" name="fin_name_c" placeholder="Escribe el nombre" style="border: none !important; width: 100%; height:100%;">
      </div>
      <div class="col">
       <textarea type="text" id="fin_mv_c" name="fin_mv_c" placeholder="Escribe el/los medios de verificación" style="border: none !important; width: 100%;"></textarea>
      </div>
  </div>
  <div class="row" style="display: flex;">
    <div class="col" style="flex: 0 0 20%;">
    D
    </div>
    <div class="col" style="flex: 1;">
     <input type="text" id="fin_name_d" name="fin_name_d" placeholder="Escribe el nombre" style="border: none !important; width: 100%; height:100%;">
    </div>
    <div class="col" style="flex: 1;">
     <a type="text" id="fin_mv_d" name="fin_mv_d" style="border: none !important; width: 100%;">N/A</a>
    </div>
</div>
`;
//contenedores de variables Linea Base
const UnvarHTML_lbvr = `
        <div class="row" tyle="display: flex;">
            <div class="col" style="flex: 0 0 20%; background-color: gainsboro !important;">
            Variable
            </div>
            <div class="col" style="flex: 1; background-color: gainsboro !important;">
            Valor
            </div>
            <div class="col" style="flex: 1; background-color: gainsboro !important;">
            Unidad de medida
            </div>
            <div class="col" style="flex: 1; background-color: gainsboro !important;">
            Fecha
            </div>
        </div>
        <div class="row" style="display: flex;">
            <div class="col" style="flex: 0 0 20%;">
            B
            </div>
            <div class="col" style="flex: 1;">
             <input type="number" id="fin_valor_b_lbvr" name="fin_valor_b_lbvr" placeholder="0" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="text" id="fin_um_b_lbvr" name="fin_um_b_lbvr" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="date"  id="fin_date_b_lbvr" name="fin_date_b_lbvr" value="2024-06-01" style="border: none !important; width: 100%;">
            </div>
        </div>
        <div class="row" style="display: flex;">
            <div class="col"  style="flex: 0 0 20%;">
            Línea o base valor de referencia
            </div>
            <div class="col" style="flex: 1;">
              <p id="resultado_formula_lvbr">0</p> <!-- Este es un contenedor donde actualizaremos -->
            </div>
            <div class="col" style="flex: 1;">
             <input type="text" id="fin_result_um_lbvr" name="fin_result_um_lbvr" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="date"  id="fin_result_date_lbvr" name="fin_result_date_lbvr" value="2024-06-01" style="border: none !important; width: 100%;">
            </div>
        </div>
  `;
const DosvarHTML_lbvr = `
        <div class="row" style="display: flex;">
            <div class="col" style="flex: 0 0 20%; background-color: gainsboro !important;">
            Variable
            </div>
            <div class="col" style="flex: 1; background-color: gainsboro !important;">
            Valor
            </div>
            <div class="col" style="flex: 1; background-color: gainsboro !important;">
            Unidad de medida
            </div>
            <div class="col" style="flex: 1; background-color: gainsboro !important;">
            Fecha
            </div>
        </div>
        <div class="row" style="display: flex;">
            <div class="col"style="flex: 0 0 20%;">
            B
            </div>
            <div class="col" style="flex: 1;">
             <input type="number" id="fin_valor_b_lbvr" name="fin_valor_b_lbvr" placeholder="0" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="text" id="fin_um_b_lbvr" name="fin_um_b_lbvr" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="date"  id="fin_date_b_lbvr" name="fin_date_b_lbvr" value="2024-06-01" style="border: none !important; width: 100%;">
            </div>
        </div>
        <div class="row" style="display: flex;">
            <div class="col" style="flex: 0 0 20%;">
            C
            </div>
            <div class="col" style="flex: 1;">
             <input type="number" id="fin_valor_c_lbvr" name="fin_valor_c_lbvr" placeholder="0" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="text" id="fin_um_c_lbvr" name="fin_um_c_lbvr" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="date"  id="fin_date_c_lbvr" name="fin_date_c_lbvr" value="2024-06-01" style="border: none !important; width: 100%;">
            </div>
        </div>
        <div class="row" style="display: flex;">
            <div class="col" style="flex: 0 0 20%;">
            Línea o base valor de referencia
            </div>
            <div class="col" style="flex: 1;">
              <p id="resultado_formula_lvbr">0</p> <!-- Este es un contenedor donde actualizaremos -->
            </div>
            <div class="col" style="flex: 1;">
             <input type="text" id="fin_result_um_lbvr" name="fin_result_um_lbvr" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="date"  id="fin_result_date_lbvr" name="fin_result_date_lbvr" value="2024-06-01" style="border: none !important; width: 100%;">
            </div>
        </div>
  `;
const TresvarHTML_lbvr = `
        <div class="row" style="display: flex;">
            <div class="col" style="flex: 0 0 20%; background-color: gainsboro !important;">
            Variable
            </div>
            <div class="col" style="flex: 1; background-color: gainsboro !important;">
            Valor
            </div>
            <div class="col" style="flex: 1; background-color: gainsboro !important;">
            Unidad de medida
            </div>
            <div class="col" style="flex: 1; background-color: gainsboro !important;">
            Fecha
            </div>
        </div>
        <div class="row" style="display: flex;">
            <div class="col" style="flex: 0 0 20%;">
            B
            </div>
            <div class="col" style="flex: 1;">
             <input type="number" id="fin_valor_b_lbvr" name="fin_valor_b_lbvr" placeholder="0" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="text" id="fin_um_b_lbvr" name="fin_um_b_lbvr" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="date"  id="fin_date_b_lbvr" name="fin_date_b_lbvr" value="2024-06-01" style="border: none !important; width: 100%;">
            </div>
        </div>
        <div class="row" style="display: flex;">
            <div class="col" style="flex: 0 0 20%;">
            C
            </div>
            <div class="col" style="flex: 1;">
             <input type="number" id="fin_valor_c_lbvr" name="fin_valor_c_lbvr" placeholder="0" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="text" id="fin_um_c_lbvr" name="fin_um_c_lbvr" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="date"  id="fin_date_c_lbvr" name="fin_date_c_lbvr" value="2024-06-01" style="border: none !important; width: 100%;">
            </div>
        </div>
        <div class="row" style="display: flex;">
            <div class="col" style="flex: 0 0 20%;">
            D
            </div>
            <div class="col" style="flex: 1;">
            <input type="number" id="fin_valor_d_lbvr" name="fin_valor_d_lbvr" placeholder="0" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
            <input type="text" id="fin_um_d_lbvr" name="fin_um_d_lbvr" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="date"  id="fin_date_d_lbvr" name="fin_date_d_lbvr" value="2024-06-01" style="border: none !important; width: 100%;">
            </div>
        </div>
        <div class="row" style="display: flex;">
            <div class="col" style="flex: 0 0 20%;">
            Línea o base valor de referencia
            </div>
            <div class="col" style="flex: 1;">
              <p id="resultado_formula_lvbr">0</p> <!-- Este es un contenedor donde actualizaremos -->
            </div>
            <div class="col" style="flex: 1;">
             <input type="text" id="fin_result_um_lbvr" name="fin_result_um_lbvr" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="date"  id="fin_result_date_lbvr" name="fin_result_date_lbvr" value="2024-06-01" style="border: none !important; width: 100%;">
            </div>
        </div>
`;
//contenedores de variables Meta
const UnvarHTML_meta = `
        <div class="row" style="display: flex;">
            <div class="col" style="flex: 0 0 20%; background-color: gainsboro !important;">
            Variable
            </div>
            <div class="col" style="flex: 1; background-color: gainsboro !important;">
            Valor
            </div>
            <div class="col" style="flex: 1; background-color: gainsboro !important;">
            Unidad de medida
            </div>
            <div class="col" style="flex: 1; background-color: gainsboro !important;">
            Fecha
            </div>
        </div>
        <div class="row" style="display: flex;">
            <div class="col" style="flex: 0 0 20%;">
            B
            </div>
            <div class="col" style="flex: 1;">
             <input type="number" id="fin_valor_b_meta" name="fin_valor_b_meta" placeholder="0" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="text" id="fin_um_b_meta" name="fin_um_b_meta" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="date"  id="fin_date_b_meta" name="fin_date_b_meta" value="2024-06-01" style="border: none !important; width: 100%;">
            </div>
        </div>
        <div class="row" style="display: flex;">
            <div class="col" style="flex: 0 0 20%;">
            Meta
            </div>
            <div class="col" style="flex: 1;">
              <p id="resultado_formula_meta">0</p> <!-- Este es un contenedor donde actualizaremos -->
            </div>
            <div class="col" style="flex: 1;">
             <input type="text" id="fin_result_um_meta" name="fin_result_um_meta" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="date"  id="fin_result_date_meta" name="fin_result_date_meta" value="2024-06-01" style="border: none !important; width: 100%;">
            </div>
        </div>
  `;
const DosvarHTML_meta = `
        <div class="row" style="display: flex;">
            <div class="col" style="flex: 0 0 20%; background-color: gainsboro !important;">
            Variable
            </div>
            <div class="col" style="flex: 1; background-color: gainsboro !important;">
            Valor
            </div>
            <div class="col" style="flex: 1; background-color: gainsboro !important;">
            Unidad de medida
            </div>
            <div class="col" style="flex: 1; background-color: gainsboro !important;">
            Fecha
            </div>
        </div>
        <div class="row" style="display: flex;">
            <div class="col" style="flex: 0 0 20%;">
            B
            </div>
            <div class="col" style="flex: 1;">
             <input type="number" id="fin_valor_b_meta" name="fin_valor_b_meta" placeholder="0" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="text" id="fin_um_b_meta" name="fin_um_b_meta" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="date"  id="fin_date_b_meta" name="fin_date_b_meta" value="2024-06-01" style="border: none !important; width: 100%;">
            </div>
        </div>
        <div class="row" style="display: flex;">
            <div class="col" style="flex: 0 0 20%;">
            C
            </div>
            <div class="col" style="flex: 1;">
             <input type="number" id="fin_valor_c_meta" name="fin_valor_c_meta" placeholder="0" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="text" id="fin_um_c_meta" name="fin_um_c_meta" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="date"  id="fin_date_c_meta" name="fin_date_c_meta" value="2024-06-01" style="border: none !important; width: 100%;">
            </div>
        </div>
        <div class="row" style="display: flex;">
            <div class="col" style="flex: 0 0 20%;">
            Meta
            </div>
            <div class="col" style="flex: 1;">
              <p id="resultado_formula_meta">0</p> <!-- Este es un contenedor donde actualizaremos -->
            </div>
            <div class="col" style="flex: 1;">
             <input type="text" id="fin_result_um_meta" name="fin_result_um_meta" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="date"  id="fin_result_date_meta" name="fin_result_date_meta" value="2024-06-01" style="border: none !important; width: 100%;">
            </div>
        </div>
  `;
const TresvarHTML_meta = `
        <div class="row" style="display: flex;">
            <div class="col" style="flex: 0 0 20%; background-color: gainsboro !important;">
            Variable
            </div>
            <div class="col" style="flex: 1; background-color: gainsboro !important;">
            Valor
            </div>
            <div class="col" style="flex: 1; background-color: gainsboro !important;">
            Unidad de medida
            </div>
            <div class="col" style="flex: 1; background-color: gainsboro !important;">
            Fecha
            </div>
        </div>
        <div class="row" style="display: flex;">
            <div class="col" style="flex: 0 0 20%;">
            B
            </div>
            <div class="col" style="flex: 1;">
             <input type="number" id="fin_valor_b_meta" name="fin_valor_b_meta" placeholder="0" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="text" id="fin_um_b_meta" name="fin_um_b_meta" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="date"  id="fin_date_b_meta" name="fin_date_b_meta" value="2024-06-01" style="border: none !important; width: 100%;">
            </div>
        </div>
        <div class="row" style="display: flex;">
            <div class="col" style="flex: 0 0 20%;">
            C
            </div>
            <div class="col" style="flex: 1;">
             <input type="number" id="fin_valor_c_meta" name="fin_valor_c_meta" placeholder="0" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="text" id="fin_um_c_meta" name="fin_um_c_meta" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="date"  id="fin_date_c_meta" name="fin_date_c_meta" value="2024-06-01" style="border: none !important; width: 100%;">
            </div>
        </div>
        <div class="row" style="display: flex;">
            <div class="col" style="flex: 0 0 20%;">
            D
            </div>
            <div class="col" style="flex: 1;">
            <input type="number" id="fin_valor_d_meta" name="fin_valor_d_meta" placeholder="0" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
            <input type="text" id="fin_um_d_meta" name="fin_um_d_meta" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="date"  id="fin_date_d_meta" name="fin_date_d_meta" value="2024-06-01" style="border: none !important; width: 100%;">
            </div>
        </div>
        <div class="row" style="display: flex;">
            <div class="col" style="flex: 0 0 20%;">
            Meta
            </div>
            <div class="col" style="flex: 1;">
              <p id="resultado_formula_meta">0</p> <!-- Este es un contenedor donde actualizaremos -->
            </div>
            <div class="col" style="flex: 1;">
             <input type="text" id="fin_result_um_meta" name="fin_result_um_meta" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
            </div>
            <div class="col" style="flex: 1;">
             <input type="date"  id="fin_result_date_meta" name="fin_result_date_meta" value="2024-06-01" style="border: none !important; width: 100%;">
            </div>
        </div>
`;

//Insertar contenedores
const variables = document.getElementById('fin_variables');

function actualizarAlgoritmoYVariables() {
    const selectedTipoInd = tipoIndSelect.value;

    // Mostrar fórmula
    if (selectedTipoInd === 'Porcentaje') {
      tipoAlgSelect.innerText = 'A = (B/C) * 100';
    } else if (selectedTipoInd === 'Variacion') {
      tipoAlgSelect.innerText = 'A = ((B-C)/C) * 100';
    } else if (selectedTipoInd === 'Razon') {
      tipoAlgSelect.innerText = 'A = B / C';
    } else if (selectedTipoInd === 'Tasa') {
      tipoAlgSelect.innerText = 'A = (B/C) * D'; 
    } else if (selectedTipoInd === 'Promedio') {
      tipoAlgSelect.innerText = 'A = SUM B / C'; 
    }else if (selectedTipoInd === 'Diferencia') {
      tipoAlgSelect.innerText = 'A = B-C'; 
    } else if (selectedTipoInd === 'Indice') {
      tipoAlgSelect.innerText = 'A = A'; 
    } else {
      tipoAlgSelect.innerText = 'A = A';
    }

    // Mostrar contenedores de variables
    if (selectedTipoInd === 'Tasa') {
        variables.innerHTML = TresvarHTML;
    } else if (selectedTipoInd === 'Indice' ||
              selectedTipoInd === 'Lugar' ||
              selectedTipoInd === 'Conteo' ||
              selectedTipoInd === 'Nivel' ||
              selectedTipoInd === 'promedio_variaciones' ||
              selectedTipoInd === 'promedio_tresaños' ||
              selectedTipoInd === 'Sumatoria') {
        variables.innerHTML = UnvarHTML;
    } else {
        variables.innerHTML = DosvarHTML;
    }

    if (selectedTipoInd === 'Tasa') {
        lbvr.innerHTML = TresvarHTML_lbvr;
        setTimeout(() => {
            const inputs = ['fin_valor_b_lbvr', 'fin_valor_c_lbvr', 'fin_valor_d_lbvr'];
            inputs.forEach(id => {
                document.getElementById(id).addEventListener('input', actualizarResultado);
            });
        }, 0);
    }else if (selectedTipoInd === 'Indice' ||
              selectedTipoInd === 'Lugar' ||
              selectedTipoInd === 'Conteo' ||
              selectedTipoInd === 'Nivel' ||
              selectedTipoInd === 'promedio_variaciones' ||
              selectedTipoInd === 'promedio_tresaños' ||
              selectedTipoInd === 'Sumatoria') {
        lbvr.innerHTML = UnvarHTML_lbvr;
        setTimeout(() => {
            const inputs = ['fin_valor_b_lbvr'];
            inputs.forEach(id => {
                document.getElementById(id).addEventListener('input', actualizarResultado);
            });
        }, 0);
    }else {
        lbvr.innerHTML = DosvarHTML_lbvr;
        setTimeout(() => {
            const inputs = ['fin_valor_b_lbvr', 'fin_valor_c_lbvr'];
            inputs.forEach(id => {
                document.getElementById(id).addEventListener('input', actualizarResultado);
            });
        }, 0);
      }
    if (selectedTipoInd === 'Tasa') {
        meta.innerHTML = TresvarHTML_meta;
        setTimeout(() => {
            const inputs = ['fin_valor_b_meta', 'fin_valor_c_meta', 'fin_valor_d_meta'];
            inputs.forEach(id => {
                document.getElementById(id).addEventListener('input', actualizarResultadoMeta);
            });
        }, 0);
    }else if (selectedTipoInd === 'Indice' ||
              selectedTipoInd === 'Lugar' ||
              selectedTipoInd === 'Nivel' ||
              selectedTipoInd === 'promedio_variaciones' ||
              selectedTipoInd === 'promedio_tresaños' ||
              selectedTipoInd === 'Sumatoria') {
        meta.innerHTML = UnvarHTML_meta;
        setTimeout(() => {
            const inputs = ['fin_valor_b_meta'];
            inputs.forEach(id => {
                document.getElementById(id).addEventListener('input', actualizarResultadoMeta);
            });
        }, 0);
    }else {
        meta.innerHTML = DosvarHTML_meta;
        setTimeout(() => {
            const inputs = ['fin_valor_b_meta', 'fin_valor_c_meta'];
            inputs.forEach(id => {
                document.getElementById(id).addEventListener('input', actualizarResultadoMeta);
            });
        }, 0);
      }   

    agregarListeners();
}

tipoIndSelect.addEventListener('change', actualizarAlgoritmoYVariables);
document.addEventListener('DOMContentLoaded', actualizarAlgoritmoYVariables);

function agregarListeners() {
    const inputUno = document.getElementById("fin_mv_b");
    const inputDos = document.getElementById("fin_mv_c");
    const finVerificacion = document.getElementById("fin_verificacion");

    // Verificamos si los inputs existen, y si es así, les agregamos el event listener
    if (inputUno) {
        inputUno.addEventListener("input", actualizarFinVerificacion);
    }
    if (inputDos) {
        inputDos.addEventListener("input", actualizarFinVerificacion);
    }

    // Función para actualizar el texto en <a>
    function actualizarFinVerificacion() {
        const valorUno = inputUno ? inputUno.value.trim() : '';
        const valorDos = inputDos ? inputDos.value.trim() : '';
        
        let textoFinal = "";
    
        if (valorUno || valorDos) {
            // Separar las líneas por saltos de línea
            const lineasUno = valorUno.split('\n').map(l => l.trim()).filter(l => l);
            const lineasDos = valorDos.split('\n').map(l => l.trim()).filter(l => l);
    
            // Combinar ambas listas
            const todasLineas = [...lineasUno, ...lineasDos];
    
            // Crear un conjunto (Set) para eliminar duplicados
            const unicas = [...new Set(todasLineas)];
    
            // Unirlas usando <br> para que aparezcan en distintas líneas en el <a>
            textoFinal = unicas.join('<br>');
        }
    
        finVerificacion.innerHTML = textoFinal;
    }
    
}

//linea de acción
function formula_lbvr() { 
    const selectedTipoInd = tipoIndSelect.value;
    const valorb = parseFloat(document.getElementById('fin_valor_b_lbvr')?.value) || 0;
    const valorc = parseFloat(document.getElementById('fin_valor_c_lbvr')?.value) || 1;
    const valord = parseFloat(document.getElementById('fin_valor_d_lbvr')?.value) || 0;

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
    } else if (selectedTipoInd === 'Indice' ||
              selectedTipoInd === 'Lugar' ||
              selectedTipoInd === 'Nivel' ||
              selectedTipoInd === 'promedio_variaciones' ||
              selectedTipoInd === 'promedio_tresaños' ||
              selectedTipoInd === 'Sumatoria') {
        resultado = valorb;
    } else {
        resultado = 0;
    }

    return resultado;
}

  //Insertar contenedores
const lbvr = document.getElementById('fin_lbvr');

// Actualizar el resultado en vivo
function actualizarResultado() {
    const resultado = formula_lbvr();
    document.getElementById('resultado_formula_lvbr').textContent = isNaN(resultado) ? '0' : resultado.toFixed(2);
}

//meta
function formula_meta() { 
    const selectedTipoInd = tipoIndSelect.value;
    const valorb = parseFloat(document.getElementById('fin_valor_b_meta')?.value) || 0;
    const valorc = parseFloat(document.getElementById('fin_valor_c_meta')?.value) || 1;
    const valord = parseFloat(document.getElementById('fin_valor_d_meta')?.value) || 0;

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
    } else if (selectedTipoInd === 'Indice' ||
              selectedTipoInd === 'Lugar' ||
              selectedTipoInd === 'Nivel' ||
              selectedTipoInd === 'promedio_variaciones' ||
              selectedTipoInd === 'promedio_tresaños' ||
              selectedTipoInd === 'Sumatoria') {
        resultado = valorb;
    } else {
        resultado = 0;
    }

    return resultado;
}

const meta = document.getElementById('fin_meta');

function actualizarResultadoMeta() {
    document.getElementById('resultado_formula_meta').textContent = isNaN(resultado) ? '0' : resultado.toFixed(2);
}

/* NIVEL - PROPOSITO */
//ficha general de indicador
function actualizarContenedorIndicadores() {
 
  guardarEstadoCompleto();

  // 2. Generar nueva estructura
  const contenedorPadre = document.getElementById('estructura-proposito-container');
  const estructuraProposito = obtenerEstructuraProposito();
  const indicadores = estructuraProposito.proposito.indicadores;
  contenedorPadre.innerHTML = '';

  const objetivo = estructuraProposito.proposito.objetivo;

  Object.keys(indicadores).forEach(key =>{
    const indicador = indicadores[key]; 
    const divIndicador = document.createElement('div');
    divIndicador.id = `proposito_indicador_${key}`;
    divIndicador.className = 'mt-4 p-3 border rounded ficha_proposito'

    divIndicador.innerHTML=`
      <div class="ficha-contrainer">
        <h4 id="numindic_${key}"><strong>Indicador ${key}</strong></h4>
        <div class="row proposito" id = "ficha_proposito_uno_${key}">
          <div class="col-4"> 
            <strong>Objetivo: </strong>
          </div>
          <div class="col-8"> 
            <p><span style="color: #565656 !important;" id="objetivo_proposito_${key}">${objetivo}</span></p>
          </div>
          <div class="col-4"> 
            <strong>Nombre del indicador: </strong>
          </div>
          <div class="col-8"> 
            <p><span style="color: #565656   !important;" id="indicador_proposito_${key}"> ${indicador.name}</span></p>
          </div>
        </div>
        <div class="row mb-3" style="margin-bottom: 0px !important;">
        <div class="col-12">
            <h5 style="color: white;">Metadatos del indicador</h5>
        </div>
      </div>
      <div class="row ficha" id = "ficha_proposito_dos_${key}">
        <div class="col-4"> 
          <strong>Definición: </strong>
        </div>
        <div class="col-8"> 
          <input type="text" id="proposito_definicion_${key}" name="proposito_definicion_${key}" placeholder="Escribe la definición" style="border: none !important; width: 100%;">
        </div>
        <div class="col-4"> 
          <strong>Tipo de Indicador: </strong>
        </div>
        <div class="col-8"> 
          <select class="form-select" name="proposito_tipo_indicador_${key}" id="proposito_tipo_indicador_${key}" style="border: none !important; color: black !important; font-size: 1rem; padding-left: 0px !important;">
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
          <p id="proposito_tipo_algoritmo_${key}" ></p>
        </div>
        <div class="col-4"> 
          <strong>Periodicidad de calculo: </strong>
        </div>
        <div class="col-8"> 
          <select class="form-select" name="proposito_periocidadcalc_${key}" id="proposito_periocidadcalc_${key}" style="border: none !important; color: black !important; font-size: 1rem; padding-left: 0px !important;">
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
          <select class="form-select" name="proposito_tendencia_${key}" id="proposito_tendencia_${key}" style="border: none !important; color: black !important; font-size: 1rem; padding-left: 0px !important;">
            <option value="Ascendente">Ascendente</option>
            <option value="Descendente">Descendente</option>
            <option value="Constantes">Constantes</option>
          </select>
        </div>
        <div class="col-4"> 
          <strong>Ámbito de medición: </strong>
        </div>
        <div class="col-8"> 
          <select class="form-select" name="proposito_amed_${key}" id="proposito_amed_${key}" style="border: none !important; color: black !important; font-size: 1rem; padding-left: 0px !important;">
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
          <select class="form-select" name="proposito_dimdesp_${key}" id="proposito_dimdesp_${key}" style="border: none !important; color: black !important; font-size: 1rem; padding-left: 0px !important;">
            <option>Eficacia</option>
            <option>Eficiencia</option>
            <option>Calidad</option>
            <option>Economía</option>
          </select>
        </div>
      </div>
            <div class="row mb-3" style="margin-bottom: 0px !important;">
      <div class="col-12">
          <h5 style="color: white;">Variables</h5>
      </div>
      </div>
      <div class="row ficha" id = "ficha_proposito_tres_${key}">
        <div class="vars" id="proposito_variables_${key}" style="margin: 0xp !important;">
          <!-- Aqui irian las columnas-->
        </div>
      </div>
      <div class="row mb-3" style="margin-bottom: 0px !important;">
        <div class="col-12">
            <h5 style="color: white;">Línea base o valor de referencia</h5>
        </div>
      </div>
      <div class="row ficha" id = "ficha_proposito_cuatro_${key}">
        <div class="vars" id="proposito_lbvr_${key}" style="margin: 0xp !important;">
          <!-- Aqui irian las columnas-->
        </div>
      </div>
      <div class="row mb-3" style="margin-bottom: 0px !important;">
        <div class="col-12">
            <h5 style="color: white;">Meta</h5>
        </div>
      </div>
      <div class="row ficha" id = "ficha_proposito_cinco_${key}">
        <div class="vars" id="proposito_meta_${key}" style="margin: 0xp !important;">
          <!-- Aqui irian las columnas-->
        </div>
      </div>
      </div>
    `;
    contenedorPadre.appendChild(divIndicador);
  
    const tipoIndSelectProp = document.getElementById(`proposito_tipo_indicador_${key}`);
    const tipoAlgSelectProp = document.getElementById(`proposito_tipo_algoritmo_${key}`);


    // 2. Configurar el evento change para guardar el algoritmo
    tipoIndSelectProp.addEventListener('change', function() {
      const selectedTipoIndProp = this.value; // Usamos this.value en lugar de tipoIndSelect.value
      
      let algoritmo = '';
      switch(selectedTipoIndProp) {
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
      
      tipoAlgSelectProp.textContent = algoritmo;
      // Guardamos el algoritmo en nuestro objeto
      contenedoresVariables(key)
    });

  });

  restaurarEstadoCompleto();
};

//pasar datos de la MIR a la ficha
if (!window.inputsInicializados) {
  window.inputsInicializados = new Set();
}
document.addEventListener('input', function(event) {
  const target = event.target;

  if (target.matches('input[name^="proposito_indicador_"], input[name="proposito_objetivo"]')) {
    const inputKey = target.name;
    const inputValue = target.value;
    
    if (!window.inputsInicializados.has(inputKey)) {
      actualizarContenedorIndicadores();
      window.inputsInicializados.add(inputKey); // <- Este paso es CLAVE
    }

    // Actualización de output
    let matchingOutputId = '';
    if (inputKey.startsWith('proposito_indicador_')) {
      matchingOutputId = inputKey.replace('proposito_indicador_', 'indicador_proposito_');
    } else if (inputKey === 'proposito_objetivo') {
      matchingOutputId = 'objetivo_proposito'; // Ajusta según tu HTML
    }

    const correspondingOutput = document.getElementById(matchingOutputId);
    if (correspondingOutput) {
      correspondingOutput.textContent = inputValue;
    }
  }
});


function reajustarIDs(IndiID) {
  // Primero, obtenemos todas las fichas y las almacenamos en un array
  const fichas = document.querySelectorAll('[id^="proposito_indicador_"]'); // Fichas con ID proposito_indicador_n
  let siguienteId = null; // Variable para el siguiente ID que se asignará

  // Reajustamos las fichas
  fichas.forEach(ficha => {
      const match = ficha.id.match(/^proposito_indicador_(\d+)$/);  // Extraemos el número del ID de la ficha
      if (match) {
          const idFicha = parseInt(match[1]);
          if (idFicha > IndiID) {
              // Si el número de la ficha es mayor que el IndiID, actualizar su ID
              ficha.id = `proposito_indicador_${idFicha - 1}`; // Desplazamos el ID
              // Actualizamos el estado en appState
              appState.proposito.fichas[ficha.id] = appState.proposito.fichas[`proposito_indicador_${idFicha}`];
              delete appState.proposito.fichas[`proposito_indicador_${idFicha}`];  // Eliminar el antiguo ID
          }
      }
  });
  // Lista de ids que se deben reajustar, con el patrón para encontrar el número
  const idsToChange = [
    "ficha_proposito_uno",
    "ficha_proposito_tres",
    "ficha_proposito_dos",
    "ficha_proposito_cuatro",
    "ficha_proposito_cinco",
    "proposito_variables",
    "proposito_lbvr",
    "proposito_meta",
    "objetivo_proposito",
    "indicador_proposito",
    "proposito_definicion",
    "proposito_tipo_indicador",
    "proposito_tipo_algoritmo",
    "proposito_periocidadcalc",
    "proposito_tendencia",
    "proposito_amed",
    "proposito_dimdesp",
    "proposito_name_b",
    "proposito_name_c",
    "proposito_name_d",
    "proposito_mv_b",
    "proposito_mv_c",
    "proposito_mv_d",
    "proposito_valor_b_lbvr",
    "proposito_valor_c_lbvr",
    "proposito_valor_d_lbvr",
    "proposito_um_b_lbvr",
    "proposito_um_c_lbvr",
    "proposito_um_d_lbvr",
    "proposito_valor_b_meta",
    "proposito_valor_c_meta",
    "proposito_valor_d_meta",
    "proposito_um_b_meta",
    "proposito_um_c_meta",
    "proposito_um_d_meta",
    "proposito_date_b_lbvr",
    "proposito_date_c_lbvr",
    "proposito_date_d_lbvr",
    "proposito_date_b_meta",
    "proposito_date_c_meta",
    "proposito_date_d_meta",
    "resultado_formula_lvbr_prop",
    "proposito_result_um_lbvr",
    "proposito_result_date_lbvr",
    "resultado_formula_meta_prop",
    "proposito_result_um_meta",
    "proposito_result_date_meta"
  ];

  // Iteramos sobre cada patrón de id
  idsToChange.forEach(baseId => {
      // Buscar todos los elementos con el patrón `baseId_X` donde X es un número
      const elements = document.querySelectorAll(`[id^='${baseId}_']`);
      
      elements.forEach(element => {
          const match = element.id.match(/(\d+)$/); // Busca el número al final del id
          if (match) {
              const number = parseInt(match[1], 10);
              if (number > IndiID) {
                  const newNumber = number - 1;
                  const newId = `${baseId}_${newNumber}`;
                  const newName = newId;

                  // Reajustar el id y el name del elemento
                  element.id = newId;
                  if (element.name) {
                      element.name = newName;
                  }
              }
          }
      });
  });
  // Ahora, actualizamos el texto en los h4 que contienen 'numindic_${key}'
  const h4Elements = document.querySelectorAll('[id^="numindic_"]'); // Encuentra todos los h4s con ID numindic_${key}
  h4Elements.forEach(h4 => {
      const match = h4.id.match(/^numindic_(\d+)$/);  // Extraemos el número del ID
      if (match) {
          let key = parseInt(match[1]);
          if (key > IndiID) {
              // Cambiamos el ID del h4 y el texto
              h4.id = `numindic_${key - 1}`; // Actualizamos el ID
              h4.innerHTML = `<strong>Indicador ${key - 1}</strong>`; // Actualizamos el texto
          }
      }
  });
};
function eliminarFichaIndicadorP(IndiID) {
  // 1. Primero elimina el DOM (pero no toques appState aún)
  const fichaDOM = document.getElementById(`proposito_indicador_${IndiID}`);
  if (fichaDOM) {
    fichaDOM.remove();
  }

  // 2. Reajustar los IDs del DOM y los 'name' relacionados
  reajustarIDs(IndiID);

  // 3. Reajustar el estado appState
  const nuevaFichas = {};
  Object.keys(appState.proposito.fichas).forEach(key => {
    const match = key.match(/^proposito_indicador_(\d+)$/);
    if (match) {
      const id = parseInt(match[1]);
      if (id > IndiID) {
        const nuevoKey = `proposito_indicador_${id - 1}`;
        nuevaFichas[nuevoKey] = appState.proposito.fichas[key];
      } else if (id < IndiID) {
        nuevaFichas[key] = appState.proposito.fichas[key];
      }
      // No copiamos el que tenía IndiID (porque fue eliminado)
    }
  });
  appState.proposito.fichas = nuevaFichas;

  // 4. Guardar el nuevo estado
  guardarEstadoCompleto();
}


//Funciones para guardar los datos
function guardarEstadoCompleto() {
   // 1. Limpiar estado previo
   appState.proposito = { indicadores: {}, contenedores: {} , fichas:{}};

   // 2. Guardar TODOS los elementos con ID que comience con "proposito_"
   document.querySelectorAll('[id^="proposito_"]').forEach(element => {
     // Para formularios (inputs, selects, textareas)
     if (['INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName)) {
       appState.proposito.indicadores[element.id] = element.value;
     }
     // Para elementos de texto (p, div, etc.)
     else if (['P', 'DIV', 'SPAN'].includes(element.tagName)) {
       appState.proposito.indicadores[element.id] = element.textContent || element.innerHTML;
     }
   });
 
   // 3. Guardar HTML completo de contenedores dinámicos
   const tiposContenedores = ['variables', 'lbvr', 'meta'];
   tiposContenedores.forEach(tipo => {
     document.querySelectorAll(`[id^="proposito_${tipo}_"]`).forEach(contenedor => {
       if (contenedor.id) {
         appState.proposito.contenedores[contenedor.id] = contenedor.innerHTML;
       }
     });
   });

   //4. guardar las fichas
  document.querySelectorAll('[id^="proposito_indicador_"]').forEach(ficha => {
    // Guardamos la estructura HTML de cada ficha en appState bajo la clave ficha.id
    appState.proposito.fichas[ficha.id] = ficha.outerHTML;  // outerHTML incluye toda la estructura HTML
  });
 }
//mediofunciona
function restaurarEstadoCompleto() {appState.proposito.fi
  const indicadores = appState.proposito.indicadores;
  const contenedores = appState.proposito.contenedores;

  // Restaurar contenedores (fragmentos HTML guardados)
  for (const contenedorId in contenedores) {
    if (!contenedores.hasOwnProperty(contenedorId)) continue;

    const htmlGuardado = contenedores[contenedorId];
    const contenedorElemento = document.getElementById(contenedorId);

    if (contenedorElemento) {
      contenedorElemento.innerHTML = htmlGuardado;
    } else {
      console.warn(`No se encontró el contenedor con el ID: ${contenedorId}`);
    }
  }

  // Restaurar valores de los campos (inputs, selects, textareas) dentro de los contenedores ya restaurados
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

          // Detectamos si este select requiere disparar un evento change
          const necesitaChange = (
            id.startsWith('proposito_tipo_indicador_') ||
            id.startsWith('otro_select_importante_')
          );

          if (necesitaChange) {
            elemento.dispatchEvent(new Event('change'));
          }
        }
      } 
    }
  }

}


//Contenedores de variables
function contenedoresVariables(numIndicador){
  // Guardar estado actual antes de cambiar

  //Codigo de generación
  const tipoInd = document.getElementById(`proposito_tipo_indicador_${numIndicador}`)
  //contenedores en los que se va a insertar
  const variables_prop = document.getElementById(`proposito_variables_${numIndicador}`);
  const lvbr_prop = document.getElementById(`proposito_lbvr_${numIndicador}`);
  const meta_prop = document.getElementById(`proposito_meta_${numIndicador}`);

  //Los HTML
    //HTML VARIABLES
const propUnvarHTML = `
  <div class="row" style:"display:flex">
      <div class="col" style="flex: 0 0 20%; background-color: gainsboro !important;">
      Variable
      </div>
      <div class="col" style="flex: 1; background-color: gainsboro !important;">
      Nombre
      </div>
      <div class="col" style="flex: 1; background-color: gainsboro !important; ">
      Medio de verificación
      </div>
  </div>
  <div class="row" style:"display:flex">
      <div class="col" style="flex: 0 0 20%;">
      B
      </div>
      <div class="col" style="flex: 1;">
       <input type="text" id="proposito_name_b_${numIndicador}" name="proposito_name_b_${numIndicador}" placeholder="Escribe el nombre" style="border: none !important; width: 100%; height:100%;">
      </div>
      <div class="col" style="flex: 1;">
       <textarea type="text" id="proposito_mv_b_${numIndicador}" name="proposito_mv_b_${numIndicador}" placeholder="Escribe el/los medios de verificación" style="border: none !important; width: 100%;"></textarea>
      </div>
  </div>
`;
const propDosvarHTML = `
  <div class="row" style:"display:flex">
    <div class="col" style="flex: 0 0 20%; background-color: gainsboro !important">
    Variable
    </div>
    <div class="col" style="flex: 1; background-color: gainsboro !important">
    Nombre
    </div>
    <div class="col" style="flex: 1; background-color: gainsboro !important">
    Medio de verificación
    </div>
  </div>
  <div class="row" style:"display:flex">
    <div class="col" style="flex: 0 0 20%;">
    B
    </div>
    <div class="col" style="flex: 1;">
     <input type="text" id="proposito_name_b_${numIndicador}" name="proposito_name_b_${numIndicador}" placeholder="Escribe el nombre" style="border: none !important; width: 100%; height:100%;">
    </div>
    <div class="col" style="flex: 1;">
     <textarea type="text" id="proposito_mv_b_${numIndicador}" name="proposito_mv_b_${numIndicador}" placeholder="Escribe el/los medios de verificación" style="border: none !important; width: 100%;"></textarea>
    </div>
  </div>
  <div class="row" style:"display:flex">
    <div class="col" style="flex: 0 0 20%;">
    C
    </div>
    <div class="col" style="flex: 1;">
     <input type="text" id="proposito_name_c_${numIndicador}" name="proposito_name_c_${numIndicador}" placeholder="Escribe el nombre" style="border: none !important; width: 100%; height:100%;">
    </div>
    <div class="col" style="flex: 1;">
     <textarea type="text" id="proposito_mv_c_${numIndicador}" name="proposito_mv_c_${numIndicador}" placeholder="Escribe el/los medios de verificación" style="border: none !important; width: 100%;"></textarea>
    </div>
  </div>
 `;
const propTresvarHTML = `
  <div class="row" style:"display:flex">
      <div class="col" style="flex: 0 0 20%; background-color: gainsboro !important">
      Variable
      </div>
      <div class="col" style="flex: 1; background-color: gainsboro !important">
      Nombre
      </div>
      <div class="col" style="flex: 1; background-color: gainsboro !important">
      Medio de verificación
      </div>
  </div>
  <div class="row" style:"display:flex">
      <div class="col" style="flex: 0 0 20%;">
      B
      </div>
      <div class="col" style="flex: 1;">
       <input type="text" id="proposito_name_b_${numIndicador}" name="proposito_name_b_${numIndicador}" placeholder="Escribe el nombre" style="border: none !important; width: 100%;  height:100%;">
      </div>
      <div class="col" style="flex: 1;">
       <textarea type="text" id="proposito_mv_b_${numIndicador}" name="proposito_mv_b_${numIndicador}" placeholder="Escribe el/los medios de verificación" style="border: none !important; width: 100%;"></textarea>
      </div>
  </div>
  <div class="row" style:"display:flex">
      <div class="col" style="flex: 0 0 20%;">
      C
      </div>
      <div class="col" style="flex: 1;">
       <input type="text" id="proposito_name_c_${numIndicador}" name="proposito_name_c_${numIndicador}" placeholder="Escribe el nombre" style="border: none !important; width: 100%;  height:100%;">
      </div>
      <div class="col" style="flex: 1;">
       <textarea type="text" id="proposito_mv_c_${numIndicador}" name="proposito_mv_c_${numIndicador}" placeholder="Escribe el/los medios de verificación" style="border: none !important; width: 100%;"></textarea>
      </div>
  </div>
  <div class="row" style:"display:flex">
    <div class="col" style="flex: 0 0 20%;">
    D
    </div>
    <div class="col" style="flex: 1;">
     <input type="text" id="proposito_name_d_${numIndicador}" name="proposito_name_d_${numIndicador}" placeholder="Escribe el nombre" style="border: none !important; width: 100%; height:100%;">
    </div>
    <div class="col" style="flex: 1;">
     <a type="text" id="proposito_mv_d_${numIndicador}" name="proposito_mv_d_${numIndicador}" style="border: none !important; width: 100%;">N/A</a>
    </div>
</div>
`;
  //HTML LVBR
const propUnvarlvbr = `
  <div class="row" style:"display:flex">
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
       <input type="number" id="proposito_valor_b_lbvr_${numIndicador}" name="proposito_valor_b_lbvr_${numIndicador}" placeholder="0" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
       <input type="text" id="proposito_um_b_lbvr_${numIndicador}" name="proposito_um_b_lbvr_${numIndicador}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
       <input type="date"  id="proposito_date_b_lbvr_${numIndicador}" name="proposito_date_b_lbvr_${numIndicador}" value="2024-06-01" style="border: none !important; width: 100%;">
      </div>
  </div>
  <div class="row" style:"display:flex">
      <div class="col" style="flex: 0 0 20%;">
      Línea o base valor de referencia
      </div>
      <div class="col" style="flex: 1;">
        <p id="resultado_formula_lvbr_prop_${numIndicador}">0</p> <!-- Este es un contenedor donde actualizaremos -->
      </div>
      <div class="col" style="flex: 1;">
       <input type="text" id="proposito_result_um_lbvr_${numIndicador}" name="proposito_result_um_lbvr_${numIndicador}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
       <input type="date"  id="proposito_result_date_lbvr_${numIndicador}" name="proposito_result_date_lbvr_${numIndicador}" value="2024-06-01" style="border: none !important; width: 100%;">
      </div>
  </div>
`;
const propDosvarlvbr = `
  <div class="row" style:"display:flex">
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
     <input type="number" id="proposito_valor_b_lbvr_${numIndicador}" name="proposito_valor_b_lbvr_${numIndicador}" placeholder="0" style="border: none !important; width: 100%;">
    </div>
    <div class="col" style="flex: 1;">
     <input type="text" id="proposito_um_b_lbvr_${numIndicador}" name="proposito_um_b_lbvr_${numIndicador}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
    </div>
    <div class="col" style="flex: 1;">
     <input type="date"  id="proposito_date_b_lbvr_${numIndicador}" name="proposito_date_b_lbvr_${numIndicador}" value="2024-06-01" style="border: none !important; width: 100%;">
    </div>
  </div>
  <div class="row" style:"display:flex">
    <div class="col" style="flex: 0 0 20%;">
    C
    </div>
    <div class="col" style="flex: 1;">
     <input type="number" id="proposito_valor_c_lbvr_${numIndicador}" name="proposito_valor_c_lbvr_${numIndicador}" placeholder="0" style="border: none !important; width: 100%;">
    </div>
    <div class="col" style="flex: 1;">
     <input type="text" id="proposito_um_c_lbvr_${numIndicador}" name="proposito_um_c_lbvr_${numIndicador}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
    </div>
    <div class="col" style="flex: 1;">
     <input type="date"  id="proposito_date_c_lbvr_${numIndicador}" name="proposito_date_c_lbvr_${numIndicador}" value="2024-06-01" style="border: none !important; width: 100%;">
    </div>
  </div>
  <div class="row" style:"display:flex">
    <div class="col" style="flex: 0 0 20%;">
    Línea o base valor de referencia
    </div>
    <div class="col" style="flex: 1;">
      <p id="resultado_formula_lvbr_prop_${numIndicador}">0</p> <!-- Este es un contenedor donde actualizaremos -->
    </div>
    <div class="col" style="flex: 1;">
     <input type="text" id="proposito_result_um_lbvr_${numIndicador}" name="proposito_result_um_lbvr_${numIndicador}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
    </div>
    <div class="col" style="flex: 1;">
     <input type="date"  id="proposito_result_date_lbvr_${numIndicador}" name=proposito_result_date_lbvr_${numIndicador}" value="2024-06-01" style="border: none !important; width: 100%;">
    </div>
  </div>
  `;
const propTresvarlvbr = `
  <div class="row" style:"display:flex">
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
       <input type="number" id="proposito_valor_b_lbvr_${numIndicador}" name="proposito_valor_b_lbvr_${numIndicador}" placeholder="0" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
       <input type="text" id="proposito_um_b_lbvr_${numIndicador}" name="proposito_um_b_lbvr_${numIndicador}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
       <input type="date"  id="proposito_date_b_lbvr_${numIndicador}" name="proposito_date_b_lbvr_${numIndicador}" value="2024-06-01" style="border: none !important; width: 100%;">
      </div>
  </div>
  <div class="row" style:"display:flex">
      <div class="col" style="flex: 0 0 20%;">
      C
      </div>
      <div class="col" style="flex: 1;">
       <input type="number" id="proposito_valor_c_lbvr_${numIndicador}" name="proposito_valor_c_lbvr_${numIndicador}" placeholder="0" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
       <input type="text" id="proposito_um_c_lbvr_${numIndicador}" name="proposito_um_c_lbvr_${numIndicador}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
       <input type="date"  id="proposito_date_c_lbvr_${numIndicador}" name="proposito_date_c_lbvr_${numIndicador}" value="2024-06-01" style="border: none !important; width: 100%;">
      </div>
  </div>
  <div class="row" style:"display:flex">
      <div class="col" style="flex: 0 0 20%;">
      D
      </div>
      <div class="col" style="flex: 1;">
      <input type="number" id="proposito_valor_d_lbvr_${numIndicador}" name="proposito_valor_d_lbvr_${numIndicador}" placeholder="0" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
      <input type="text" id="proposito_um_d_lbvr_${numIndicador}" name="proposito_um_d_lbvr_${numIndicador}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
       <input type="date"  id="proposito_date_d_lbvr_${numIndicador}" name="proposito_date_d_lbvr_${numIndicador}" value="2024-06-01" style="border: none !important; width: 100%;">
      </div>
  </div>
  <div class="row" style:"display:flex">
      <div class="col" style="flex: 0 0 20%;">
      Línea o base valor de referencia
      </div>
      <div class="col" style="flex: 1;">
        <p id="resultado_formula_lvbr_prop_${numIndicador}">0</p> <!-- Este es un contenedor donde actualizaremos -->
      </div>
      <div class="col" style="flex: 1;">
       <input type="text" id="proposito_result_um_lbvr_${numIndicador}" name="proposito_result_um_lbvr_${numIndicador}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
       <input type="date"  id="proposito_result_date_lbvr_${numIndicador}" name="proposito_result_date_lbvr_${numIndicador}" value="2024-06-01" style="border: none !important; width: 100%;">
      </div>
  </div>
`;
  //HTML META
const propUnvarmeta = `
  <div class="row" style:"display:flex">
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
       <input type="number" id="proposito_valor_b_meta_${numIndicador}" name="proposito_valor_b_meta_${numIndicador}" placeholder="0" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
       <input type="text" id="proposito_um_b_meta_${numIndicador}" name="proposito_um_b_meta_${numIndicador}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
       <input type="date"  id="proposito_date_b_meta_${numIndicador}" name="proposito_date_b_meta_${numIndicador}" value="2024-06-01" style="border: none !important; width: 100%;">
      </div>
  </div>
  <div class="row" style:"display:flex">
      <div class="col" style="flex: 0 0 20%;">
      Meta
      </div>
      <div class="col" style="flex: 1;">
        <p id="resultado_formula_meta_prop_${numIndicador}">0</p> <!-- Este es un contenedor donde actualizaremos -->
      </div>
      <div class="col" style="flex: 1;">
       <input type="text" id="proposito_result_um_meta_${numIndicador}" name="proposito_result_um_meta_${numIndicador}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
       <input type="date"  id="proposito_result_date_meta_${numIndicador}" name="proposito_result_date_meta_${numIndicador}" value="2024-06-01" style="border: none !important; width: 100%;">
      </div>
  </div>
`;

const propDosvarmeta = `
  <div class="row" style:"display:flex">
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
       <input type="number" id="proposito_valor_b_meta_${numIndicador}" name="proposito_valor_b_meta_${numIndicador}" placeholder="0" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
       <input type="text" id="proposito_um_b_meta_${numIndicador}" name="proposito_um_b_meta_${numIndicador}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
       <input type="date"  id="proposito_date_b_meta_${numIndicador}" name="proposito_date_b_meta_${numIndicador}" value="2024-06-01" style="border: none !important; width: 100%;">
      </div>
  </div>
  <div class="row" style:"display:flex">
      <div class="col" style="flex: 0 0 20%;">
      C
      </div>
      <div class="col" style="flex: 1;">
       <input type="number" id="proposito_valor_c_meta_${numIndicador}" name="proposito_valor_c_meta_${numIndicador}" placeholder="0" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
       <input type="text" id="proposito_um_c_meta_${numIndicador}" name="proposito_um_c_meta_${numIndicador}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
       <input type="date"  id="proposito_date_c_meta_${numIndicador}" name="proposito_date_c_meta_${numIndicador}" value="2024-06-01" style="border: none !important; width: 100%;">
      </div>
  </div>
  <div class="row" style:"display:flex">
      <div class="col" style="flex: 0 0 20%;">
      Meta
      </div>
      <div class="col" style="flex: 1;">
        <p id="resultado_formula_meta_prop_${numIndicador}">0</p> <!-- Este es un contenedor donde actualizaremos -->
      </div>
      <div class="col" style="flex: 1;">
       <input type="text" id="proposito_result_um_meta_${numIndicador}" name="proposito_result_um_meta_${numIndicador}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
       <input type="date"  id="proposito_result_date_meta_${numIndicador}" name="proposito_result_date_meta_${numIndicador}" value="2024-06-01" style="border: none !important; width: 100%;">
      </div>
  </div>
`;
const propTresvarmeta = `
  <div class="row" style:"display:flex">
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
       <input type="number" id="proposito_valor_b_meta_${numIndicador}" name="proposito_valor_b_meta_${numIndicador}" placeholder="0" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
       <input type="text" id="proposito_um_b_meta_${numIndicador}" name="proposito_um_b_meta_${numIndicador}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
       <input type="date"  id="proposito_date_b_meta_${numIndicador}" name="proposito_date_b_meta_${numIndicador}" value="2024-06-01" style="border: none !important; width: 100%;">
      </div>
  </div>
  <div class="row" style:"display:flex">
      <div class="col" style="flex: 0 0 20%;">
      C
      </div>
      <div class="col" style="flex: 1;">
       <input type="number" id="proposito_valor_c_meta_${numIndicador}" name="proposito_valor_c_meta_${numIndicador}" placeholder="0" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
       <input type="text" id="proposito_um_c_meta_${numIndicador}" name="proposito_um_c_meta_${numIndicador}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
       <input type="date"  id="proposito_date_c_meta_${numIndicador}" name="proposito_date_c_meta_${numIndicador}" value="2024-06-01" style="border: none !important; width: 100%;">
      </div>
  </div>
  <div class="row" style:"display:flex">
      <div class="col" style="flex: 0 0 20%;">
      D
      </div>
      <div class="col" style="flex: 1;">
      <input type="number" id="proposito_valor_d_meta_${numIndicador}" name="proposito_valor_d_meta_${numIndicador}" placeholder="0" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
      <input type="text" id="proposito_um_d_meta_${numIndicador}" name="proposito_um_d_meta_${numIndicador}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
       <input type="date"  id="proposito_date_d_meta_${numIndicador}" name="proposito_date_d_meta_${numIndicador}" value="2024-06-01" style="border: none !important; width: 100%;">
      </div>
  </div>
  <div class="row" style:"display:flex">
      <div class="col" style="flex: 0 0 20%;">
      Meta
      </div>
      <div class="col" style="flex: 1;">
        <p id="resultado_formula_meta_prop_${numIndicador}">0</p> <!-- Este es un contenedor donde actualizaremos -->
      </div>
      <div class="col" style="flex: 1;">
       <input type="text" id="proposito_result_um_meta_${numIndicador}" name="proposito_result_um_meta_${numIndicador}" placeholder="Escribe la unidad de medida" style="border: none !important; width: 100%;">
      </div>
      <div class="col" style="flex: 1;">
       <input type="date"  id="proposito_result_date_meta_${numIndicador}" name="proposito_result_date_meta_${numIndicador}" value="2024-06-01" style="border: none !important; width: 100%;">
      </div>
  </div>
`;

  //Funciones para las formulas
  function formula_lvbr_prop(){
    const selectedTipoInd = tipoInd.value;
    const valorb = parseFloat(document.getElementById(`proposito_valor_b_lbvr_${numIndicador}`)?.value) || 0;
    const valorc = parseFloat(document.getElementById(`proposito_valor_c_lbvr_${numIndicador}`)?.value) || 1;
    const valord = parseFloat(document.getElementById(`proposito_valor_d_lbvr_${numIndicador}`)?.value) || 0;

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
    } else if (selectedTipoInd === 'Indice') {
        resultado = valorb;
    }else if (selectedTipoInd === 'Diferencia') {
        resultado = valorb - valorc;
    } else {
        resultado = 0;
    }

    return resultado;
  };

  function formula_meta_prop(){
    const selectedTipoInd = tipoInd.value;
    const valorb = parseFloat(document.getElementById(`proposito_valor_b_meta_${numIndicador}`)?.value) || 0;
    const valorc = parseFloat(document.getElementById(`proposito_valor_c_meta_${numIndicador}`)?.value) || 1;
    const valord = parseFloat(document.getElementById(`proposito_valor_d_meta_${numIndicador}`)?.value) || 0;

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

  const selectedTipoInd = tipoInd.value;
    
  switch(selectedTipoInd) {
    case 'Tasa':
        variables_prop.innerHTML = propTresvarHTML;
        lvbr_prop.innerHTML = propTresvarlvbr;
        meta_prop.innerHTML = propTresvarmeta;
        setupInputListeners(
            [`proposito_valor_b_lbvr_${numIndicador}`, `proposito_valor_c_lbvr_${numIndicador}`, `proposito_valor_d_lbvr_${numIndicador}`],
            [`proposito_valor_b_meta_${numIndicador}`, `proposito_valor_c_meta_${numIndicador}`, `proposito_valor_d_meta_${numIndicador}`]
        );
        break;
        
    case 'Indice':
        variables_prop.innerHTML = propUnvarHTML;
        lvbr_prop.innerHTML = propUnvarlvbr;
        meta_prop.innerHTML = propUnvarmeta;
        setupInputListeners(
            [`proposito_valor_b_lbvr_${numIndicador}`],
            [`proposito_valor_b_meta_${numIndicador}`]
        );
        break;
        
    default:  // Caso por defecto (probablemente 'Porcentaje' u otro)
        variables_prop.innerHTML = propDosvarHTML;
        lvbr_prop.innerHTML = propDosvarlvbr;
        meta_prop.innerHTML = propDosvarmeta;
        setupInputListeners(
            [`proposito_valor_b_lbvr_${numIndicador}`, `proposito_valor_c_lbvr_${numIndicador}`],
            [`proposito_valor_b_meta_${numIndicador}`, `proposito_valor_c_meta_${numIndicador}`]
        );
  }

  // Función auxiliar para evitar código repetitivo
  function setupInputListeners(lvbrInputs, metaInputs) {
      setTimeout(() => {
          lvbrInputs.forEach(id => {
              document.getElementById(id)?.addEventListener('input', actualizarResultadolvbrProp);
          });
          metaInputs.forEach(id => {
              document.getElementById(id)?.addEventListener('input', actualizarResultadoMetaProp);
          });
      }, 0);
  }
  //Función de actualizarResultados 
  function actualizarResultadolvbrProp() {
    const resultado = formula_lvbr_prop();
    document.getElementById(`resultado_formula_lvbr_prop_${numIndicador}`).textContent = isNaN(resultado) ? '0' : resultado.toFixed(2);
  }
  function actualizarResultadoMetaProp() {
    const resultado = formula_meta_prop();
    document.getElementById(`resultado_formula_meta_prop_${numIndicador}`).textContent = isNaN(resultado) ? '0' : resultado.toFixed(2);
  }
  agregarListenersMVProp();

};

//aqui se pondra la función de agregar medio de verificación
function agregarListenersMVProp(){
    const inputs = document.querySelectorAll("textarea[id^='proposito_mv_b_'], textarea[id^='proposito_mv_c_']");
    const grupos = {};

    // Agrupa los inputs por su sufijo numérico
    inputs.forEach(input => {
        const match = input.id.match(/proposito_mv_[bc]_(\d+)/);
        if (match) {
            const numero = match[1];  // Ej: "1", "2", etc.
            if (!grupos[numero]) {
                grupos[numero] = [];
            }
            grupos[numero].push(input);
        }
    });

    // Por cada grupo, añadir listener y lógica de actualización
    Object.entries(grupos).forEach(([numero, inputsGrupo]) => {
        inputsGrupo.forEach(input => {
            input.addEventListener("input", () => actualizarVerificacion(numero));
        });
    });

    function actualizarVerificacion(numero) {
        const inputB = document.getElementById(`proposito_mv_b_${numero}`);
        const inputC = document.getElementById(`proposito_mv_c_${numero}`);
        const destino = document.getElementById(`proposito_mverificacion_${numero}`);

        if (!destino) return;

        const valorB = inputB ? inputB.value.trim() : '';
        const valorC = inputC ? inputC.value.trim() : '';

        const lineasB = valorB.split('\n').map(l => l.trim()).filter(l => l);
        const lineasC = valorC.split('\n').map(l => l.trim()).filter(l => l);

        const todasLineas = [...lineasB, ...lineasC];
        const unicas = [...new Set(todasLineas)];
        const textoFinal = unicas.join('<br>');

        destino.innerHTML = textoFinal;
    }
}

// Escuchar eventos 'change' en el documento y delegar a los selects dinámicos
document.addEventListener('change', function(event) {
  const select = event.target;
  
  // Verificar si el elemento cambiado es un select dinámico
  if (select && select.matches('select[name^="proposito_tipo_indicador_"]')) {
    // Extraer el número del indicador (n) del nombre
    const match = select.name.match(/proposito_tipo_indicador_(\d+)/);
    
    if (match && match[1]) {
      const numeroIndicador = match[1];
      contenedoresVariables(numeroIndicador);
    }
  }
});
