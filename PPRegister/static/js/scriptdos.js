/*ALINEACION AL PLAN ESTATAL DE DESARROLLO*/
let cardCount = 1; // Empieza desde 1 porque ya existe una card con id ped-1
document.addEventListener('DOMContentLoaded', function() {
  fetch('/static/json/APED.json')
  .then(response => response.json())
  .then(data => {
   window.APED = data; // Guarda los datos en la variable global APED

    const directrizSelect = document.getElementById('directriz'); 
    const vertienteSelect = document.getElementById('vertiente');
    const objetivoEstrategicoSelect = document.getElementById('objetivo_estrategico');
    const objetivoEspecificoDiv = document.getElementById('objetivo_especifico');
    const lineaAccionDiv = document.getElementById('linea_accion');

    //seleccion normal
    function updateOptions(selectElement, options) {
        // Limpia las opciones previas
        selectElement.innerHTML = '<option value="">Selecciona una opción</option>';
        
        // Agrega nuevas opciones
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            selectElement.appendChild(opt);
        });
    }

    function updateCheckboxes(divElement, options) {
        // Limpia los checkboxes previos
        divElement.innerHTML = '';

        // Agrega nuevos checkboxes
        options.forEach(option => {
            const checkboxDiv = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = divElement.id; // Agrupa todos los checkboxes bajo el nombre del div
            checkbox.value = option;
            const label = document.createElement('label');
            label.textContent = option;
            checkboxDiv.appendChild(checkbox);
            checkboxDiv.appendChild(label);
            divElement.appendChild(checkboxDiv);
        });
    }

    function updateVertientes() {
        const directriz = directrizSelect.value;
        const vertientes = Object.keys(APED[directriz] || {});
        updateOptions(vertienteSelect, vertientes);
        objetivoEstrategicoSelect.innerHTML = '<option value="">Selecciona un Objetivo Estratégico</option>';
        objetivoEspecificoDiv.innerHTML = '';  // Limpiar objetivo específico
        lineaAccionDiv.innerHTML = '';  // Limpiar línea de acción
    }

    function updateObjetivosEstrategicos() {
        const directriz = directrizSelect.value;
        const vertiente = vertienteSelect.value;
        const objetivosEstrategicos = Object.keys(APED[directriz][vertiente] || {});
        updateOptions(objetivoEstrategicoSelect, objetivosEstrategicos);
        objetivoEspecificoDiv.innerHTML = '';  // Limpiar objetivo específico
        lineaAccionDiv.innerHTML = '';  // Limpiar línea de acción
    }

    function updateObjetivosEspecificos() {
        const directriz = directrizSelect.value;
        const vertiente = vertienteSelect.value;
        const objetivoEstrategico = objetivoEstrategicoSelect.value;
        const objetivosEspecificos = Object.keys(APED[directriz][vertiente][objetivoEstrategico] || []);
        updateCheckboxes(objetivoEspecificoDiv, objetivosEspecificos);
        lineaAccionDiv.innerHTML = '';  // Limpiar línea de acción
    }

    function updateLineasAccion() {
        const directriz = directrizSelect.value;
        const vertiente = vertienteSelect.value;
        const objetivoEstrategico = objetivoEstrategicoSelect.value;

        // Obtener los checkboxes seleccionados para "Objetivo Específico"
        const objetivoEspecifico = Array.from(objetivoEspecificoDiv.querySelectorAll('input[type="checkbox"]:checked'))
                                        .map(checkbox => checkbox.value); // Extraer el valor de cada checkbox

        // Obtener las líneas de acción asociadas a los objetivos específicos seleccionados
        let lineasAccion = [];
        objetivoEspecifico.forEach(objEspecifico => {
            const lineas = APED[directriz][vertiente][objetivoEstrategico][objEspecifico] || [];
            lineasAccion = [...lineasAccion, ...lineas]; // Concatenar todas las líneas de acción correspondientes
        });

        // Mostrar las líneas de acción
        updateCheckboxes(lineaAccionDiv, lineasAccion);
    }

    directrizSelect.addEventListener('change', updateVertientes);
    vertienteSelect.addEventListener('change', updateObjetivosEstrategicos);
    objetivoEstrategicoSelect.addEventListener('change', updateObjetivosEspecificos);
    objetivoEspecificoDiv.addEventListener('change', updateLineasAccion);  //si hay datos ya preguardados
    
     if (typeof estructura_aped !== 'undefined' && estructura_aped !== null) {
        const totalRegistros = Object.keys(estructura_aped).length;
        setTimeout(() => {
        for (let i = 1; i < totalRegistros; i++) {
            document.getElementById('agregar-f7').click();
        }
        }, 100);
        setTimeout(() => {
            const contenedores = document.querySelectorAll('#formato-7');
            contenedores.forEach((contenedor, i) => {
                const registro = Object.values(estructura_aped)[i];
                const suffix = i === 0 ? '' : `-${i+1}`;
                const directriz = document.getElementById(`directriz${suffix}`);
                const vertiente = document.getElementById(`vertiente${suffix}`);
                const objetivoEstrategico = document.getElementById(`objetivo_estrategico${suffix}`);
                const objetivoEspecifico = document.getElementById(`objetivo_especifico${suffix}`);
                const lineaAccion = document.getElementById(`linea_accion${suffix}`);

                 function updateVertientes2() {
                    const d = directriz.value;
                    const vertientes = Object.keys(window.APED[d] || {});
                    updateOptions(vertiente, vertientes);
                    objetivoEstrategico.innerHTML = '<option value="">Selecciona un Objetivo Estratégico</option>';
                    objetivoEspecifico.innerHTML = '';
                    lineaAccion.innerHTML = '';
                    }

                    function updateObjetivosEstrategicos2() {
                    const d = directriz.value;
                    const v = vertiente.value;
                    const objetivos = Object.keys(window.APED[d]?.[v] || {});
                    updateOptions(objetivoEstrategico, objetivos);
                    objetivoEspecifico.innerHTML = '';
                    lineaAccion.innerHTML = '';
                    }

                    function updateObjetivosEspecificos2() {
                    const d = directriz.value;
                    const v = vertiente.value;
                    const oe = objetivoEstrategico.value;
                    const objetivos = Object.keys(window.APED[d]?.[v]?.[oe] || {});
                    updateCheckboxes(objetivoEspecifico, objetivos);
                    lineaAccion.innerHTML = '';
                    }

                    function updateLineasAccion2() {
                    const d = directriz.value;
                    const v = vertiente.value;
                    const oe = objetivoEstrategico.value;
                    const seleccionados = Array.from(objetivoEspecifico.querySelectorAll('input[type="checkbox"]:checked'))
                        .map(cb => cb.value);

                    let lineas = [];
                    seleccionados.forEach(espec => {
                        const l = window.APED[d]?.[v]?.[oe]?.[espec] || [];
                        lineas = [...lineas, ...l];
                    });

                    updateCheckboxes(lineaAccion, lineas);
                    }

                const selDirectriz = contenedor.querySelector(`#directriz${suffix}`);
                const selVertiente = contenedor.querySelector(`#vertiente${suffix}`);
                const selObjetivo = contenedor.querySelector(`#objetivo_estrategico${suffix}`);
                const selObjetivoEspecifico = contenedor.querySelector(`#objetivo_especifico${suffix}`);
                const selLineaAccion = contenedor.querySelector(`#linea_accion${suffix}`);

                if (selDirectriz) selDirectriz.value = registro.directriz;
                updateVertientes2();
                if (selVertiente) selVertiente.value = registro.vertiente;
                updateObjetivosEstrategicos2();
                if (selObjetivo) selObjetivo.value = registro.objetivo_estrategico;
                updateObjetivosEspecificos2();
                
                const objetivos_especificos = registro.objetivo_especifico
                Object.values(objetivos_especificos).forEach(oesp => {
                    const checkbox = Array.from(selObjetivoEspecifico.querySelectorAll('input[type="checkbox"]')).find(cb => cb.value === oesp);
                    if (checkbox) checkbox.checked = true;
                });
                
                // Finalmente, marcar las líneas de acción
                updateLineasAccion2();
                const linea_accion = registro.linea_accion
                Object.values(linea_accion).forEach(oesp => {
                    const checkbox = Array.from(selLineaAccion.querySelectorAll('input[type="checkbox"]')).find(cb => cb.value === oesp);
                    if (checkbox) checkbox.checked = true;
                });


            });
        }, 200);
        
        // Solo tomar la primera entrada si solo vas a prellenar uno
        // const directriz = Object.keys(APED_USER)[0];
        // const vertiente = Object.keys(APED_USER[directriz])[0];
        // const objetivoEstrategico = Object.keys(APED_USER[directriz][vertiente])[0];
        // const objetivosEspecificos = Object.keys(APED_USER[directriz][vertiente][objetivoEstrategico]);
        
        // // Llenamos los selects en orden
        // directrizSelect.value = directriz;
        // updateVertientes();
        
        // vertienteSelect.value = vertiente;
        // updateObjetivosEstrategicos();
        
        // objetivoEstrategicoSelect.value = objetivoEstrategico;
        // updateObjetivosEspecificos();
        
        // Marcar checkboxes de objetivos específicos
        
        }
    
    })
});

//agregar mas del APED
document.addEventListener('DOMContentLoaded', function () {

  document.getElementById('agregar-f7').addEventListener('click', function () {
    cardCount++;
    // Clonar la primera card
    const originalCard = document.querySelector('.card');
    const newCard = originalCard.cloneNode(true);

    // Cambiar el ID de la nueva card-body
    const newCardBody = newCard.querySelector('.card-body');
    newCardBody.id = `ped-${cardCount}`;

    // Cambiar todos los ids internos
    const idMap = {
      directriz: `directriz-${cardCount}`,
      vertiente: `vertiente-${cardCount}`,
      objetivo_estrategico: `objetivo_estrategico-${cardCount}`,
      objetivo_especifico: `objetivo_especifico-${cardCount}`,
      linea_accion: `linea_accion-${cardCount}`
    };

    for (const [originalId, newId] of Object.entries(idMap)) {
      const el = newCard.querySelector(`#${originalId}`);
      if (el) {
        el.id = newId;
        el.name = newId;
      }
    }

    // Limpiar valores del nuevo form
    const selects = newCard.querySelectorAll('select');
    selects.forEach(select => {
      select.selectedIndex = 0;
    });

    const checkboxContainers = newCard.querySelectorAll('div[id^="objetivo_especifico"], div[id^="linea_accion"]');
    checkboxContainers.forEach(div => {
      div.innerHTML = '';
    });

    // ✅ Agregar botón eliminar (solo a cards nuevas)
    const form = newCard.querySelector('form');
    const existingBtn = newCard.querySelector('.eliminar-card');
    if (!existingBtn) {
      const eliminarBtn = document.createElement('button');
      eliminarBtn.type = 'button';
      eliminarBtn.className = 'btn btn-danger btn-sm eliminar-card mt-2';
      eliminarBtn.textContent = 'Eliminar';
      eliminarBtn.addEventListener('click', () => {
        newCard.remove();
      });
      form.appendChild(eliminarBtn);
    }

    // Insertar la nueva card antes del botón "Agregar más"
    const addButton = document.getElementById('agregar-f7');
    addButton.parentElement.parentNode.insertBefore(newCard, addButton.parentElement);

    // Conectar eventos al nuevo card
    connectCardEvents(cardCount);
  });

  function connectCardEvents(count) {
    const directriz = document.getElementById(`directriz-${count}`);
    const vertiente = document.getElementById(`vertiente-${count}`);
    const objetivoEstrategico = document.getElementById(`objetivo_estrategico-${count}`);
    const objetivoEspecifico = document.getElementById(`objetivo_especifico-${count}`);
    const lineaAccion = document.getElementById(`linea_accion-${count}`);

    function updateOptions(selectElement, options) {
      selectElement.innerHTML = '<option value="">Selecciona una opción</option>';
      options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        selectElement.appendChild(opt);
      });
    }

    function updateCheckboxes(divElement, options) {
      divElement.innerHTML = '';
      options.forEach(option => {
        const checkboxDiv = document.createElement('div');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = divElement.id;
        checkbox.value = option;
        const label = document.createElement('label');
        label.textContent = option;
        checkboxDiv.appendChild(checkbox);
        checkboxDiv.appendChild(label);
        divElement.appendChild(checkboxDiv);
      });
    }

    function updateVertientes() {
      const d = directriz.value;
      const vertientes = Object.keys(window.APED[d] || {});
      updateOptions(vertiente, vertientes);
      objetivoEstrategico.innerHTML = '<option value="">Selecciona un Objetivo Estratégico</option>';
      objetivoEspecifico.innerHTML = '';
      lineaAccion.innerHTML = '';
    }

    function updateObjetivosEstrategicos() {
      const d = directriz.value;
      const v = vertiente.value;
      const objetivos = Object.keys(window.APED[d]?.[v] || {});
      updateOptions(objetivoEstrategico, objetivos);
      objetivoEspecifico.innerHTML = '';
      lineaAccion.innerHTML = '';
    }

    function updateObjetivosEspecificos() {
      const d = directriz.value;
      const v = vertiente.value;
      const oe = objetivoEstrategico.value;
      const objetivos = Object.keys(window.APED[d]?.[v]?.[oe] || {});
      updateCheckboxes(objetivoEspecifico, objetivos);
      lineaAccion.innerHTML = '';
    }

    function updateLineasAccion() {
      const d = directriz.value;
      const v = vertiente.value;
      const oe = objetivoEstrategico.value;
      const seleccionados = Array.from(objetivoEspecifico.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.value);

      let lineas = [];
      seleccionados.forEach(espec => {
        const l = window.APED[d]?.[v]?.[oe]?.[espec] || [];
        lineas = [...lineas, ...l];
      });

      updateCheckboxes(lineaAccion, lineas);
    }

    directriz.addEventListener('change', updateVertientes);
    vertiente.addEventListener('change', updateObjetivosEstrategicos);
    objetivoEstrategico.addEventListener('change', updateObjetivosEspecificos);
    objetivoEspecifico.addEventListener('change', updateLineasAccion);
  }

  // Conectar eventos al primer card
  connectCardEvents(1);
});

//estructura PED
function estructuraAPED() {
    const cards = document.querySelectorAll('.card[name="formato-7"]');
    const datos = {};
    
    cards.forEach((card, index) => {
        const cardId = `registro${index + 1}`;
        datos[cardId] = {
            directriz: card.querySelector('select[id^="directriz"]').value,
            vertiente: card.querySelector('select[id^="vertiente"]').value,
            objetivo_estrategico: card.querySelector('select[id^="objetivo_estrategico"]').value,
            objetivos_especificos: [],
            lineas_accion: []
        };
        
        // Obtener objetivos específicos seleccionados
        const objetivosEspecificos = card.querySelectorAll('div[id^="objetivo_especifico"] input[type="checkbox"]:checked');
        objetivosEspecificos.forEach(obj => {
            datos[cardId].objetivos_especificos.push(obj.value);
        });

        const lineasAccion = card.querySelectorAll('div[id^="linea_accion"] input[type="checkbox"]:checked');
        lineasAccion.forEach(la => {
            datos[cardId].lineas_accion.push(la.value);
        });
    });
    
    return {data: datos};
}

//rellenar datos



/* MATRIZ DE INDICADORES */
function formatearFecha(fechaStr) {
    if (!fechaStr || !fechaStr.includes('/')) return fechaStr;
    const [day, month, year] = fechaStr.split('/');
    if (!day || !month || !year) return fechaStr;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}
//Generar contenedores
function generarContenedoresDesdeDatos() {
  // FIN
  if (datosMIR.fin) {
    document.getElementById("fin_objetivo").value = datosMIR.fin.fin.objetivo || "";
    objetivo.dispatchEvent(new Event('input'));
    document.getElementById("fin_indicador").value = datosMIR.fin.fin.indicador || "";
    indicador.dispatchEvent(new Event('input'));
    document.getElementById("fin_supuestos").value = datosMIR.fin.fin.supuestos || "";
    document.getElementById("fin_verificacion").textContent = datosMIR.fin.fin.medioVerificacion || "";
  }

  
  // PROPÓSITO
  if (datosMIR.proposito) {
    const objetivo = datosMIR.proposito.proposito.objetivo || "";
    const objetivoInput = document.querySelector("[name='proposito_objetivo']");
    if (objetivoInput) {
        objetivoInput.value = objetivo;
        objetivoInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    const indicadores = datosMIR.proposito.proposito.indicadores || {};
    const clavesIndicadores = Object.keys(indicadores);

    for (let i = 0; i < clavesIndicadores.length; i++) {
        const indicador = indicadores[clavesIndicadores[i]];
        const index = i + 1;

        if (i > 0) agregarIndicadorProposito(); // añade nuevos campos si no es el primero

        // Asignar valores y disparar eventos
        setInputYDisparar(`proposito_indicador_${index}`, indicador.name);
        document.querySelector(`[name='proposito_supuesto_${index}']`).value = indicador.supuesto || "";
        document.getElementById(`proposito_mverificacion_${index}`).textContent = indicador.medioVerificacion || "";
    }
    }

  // COMPONENTES
    const componentes = datosMIR.componente || {};
    const clavesComponentes = Object.keys(componentes);

    for (let i = 0; i < clavesComponentes.length; i++) {
    const compKey = clavesComponentes[i];
    if (i > 0) agregarComponente();

    const compIndex = i + 1;
    const componente = componentes[compKey];

    // Objetivo del componente
    const objetivoInput = document.querySelector(`[name='componente_${compIndex}_objetivo']`);
    if (objetivoInput) {
        objetivoInput.value = componente.objetivo || "";
        objetivoInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // Indicadores del componente
    const indicadoresObj = componente.indicadores || {};
    const clavesIndicadores = Object.keys(indicadoresObj);

    for (let j = 0; j < clavesIndicadores.length; j++) {
        if (j > 0) agregarIndicador(compIndex);
        const indIndex = j + 1;
        const indicador = indicadoresObj[clavesIndicadores[j]];

        const nombreInput = document.querySelector(`[name='componente_${compIndex}_indicador_${indIndex}_nombre']`);
        if (nombreInput) {
        nombreInput.value = indicador.nombre || "";
        nombreInput.dispatchEvent(new Event('input', { bubbles: true }));
        }

        document.querySelector(`[name='componente_${compIndex}_indicador_${indIndex}_supuesto']`).value = indicador.supuesto || "";
        document.querySelector(`[name='componente_${compIndex}_indicador_${indIndex}_medio']`).textContent = indicador.medioVerificacion || "";
    }

    // Actividades del componente
    const actividadesObj = componente.actividades || {};
    const clavesActividades = Object.keys(actividadesObj);

    for (let k = 0; k < clavesActividades.length; k++) {
        if (k > 0) agregarActividad(compIndex);
        const actIndex = k + 1;
        const actividad = actividadesObj[clavesActividades[k]];

        // Objetivo de la actividad
        const objetivoActInput = document.querySelector(`[name='componente_${compIndex}_actividad_${actIndex}_objetivo']`);
        if (objetivoActInput) {
        objetivoActInput.value = actividad.objetivo || "";
        objetivoActInput.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // Indicadores de la actividad
        const indActObj = actividad.indicadores || {};
        const clavesIndAct = Object.keys(indActObj);

        for (let m = 0; m < clavesIndAct.length; m++) {
        if (m > 0) agregarIndicadorActividad(compIndex, actIndex);
        const indActIndex = m + 1;
        const indicador = indActObj[clavesIndAct[m]];

        const nombreInput = document.querySelector(`[name='componente_${compIndex}_actividad_${actIndex}_indicador_${indActIndex}_nombre']`);
        if (nombreInput) {
            nombreInput.value = indicador.nombre || "";
            nombreInput.dispatchEvent(new Event('input', { bubbles: true }));
        }

        document.querySelector(`[name='componente_${compIndex}_actividad_${actIndex}_indicador_${indActIndex}_supuesto']`).value = indicador.supuesto || "";
        document.querySelector(`[name='componente_${compIndex}_actividad_${actIndex}_indicador_${indActIndex}_medio']`).textContent = indicador.medioVerificacion || "";
        }
    }
    }


}
//Listener
function setInputYDisparar(name, valor) {
  const input = document.querySelector(`[name='${name}']`);
  if (input) {
    input.value = valor || "";
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

/*ESTRUCTURA DE LAS FICHAS*/
//FICHA FIN 
function ffin (){
    const cont = document.getElementById("ficha_fin_uno");
    const span = cont.querySelectorAll('span');
    const indi = {};
    span.forEach(i => {
        indi[i.name || i.id] = i.textContent;
    });

    const contenedor = document.getElementById("ficha_fin_dos");
    const inputs = contenedor.querySelectorAll('input');
    const selects = contenedor.querySelectorAll('select');
    const ps = contenedor.querySelectorAll('p');
    const metadatos = {};

    inputs.forEach(i => {
        metadatos[i.name || i.id] = i.value;
    });
    selects.forEach(i => {
        metadatos[i.name || i.id] = i.value;
    });
    ps.forEach(i => {
        metadatos[i.name || i.id] = i.textContent;
    });

    const contenedordos = document.getElementById("ficha_fin_tres");
    const inputsdos = contenedordos.querySelectorAll('input');
    const textareas = contenedordos.querySelectorAll('textarea');
    const vars = {};
    inputsdos.forEach(i => {
        vars[i.name || i.id] = i.value;
    });
    textareas.forEach(i => {
        vars[i.name || i.id] = i.value;
    });

    const contenedortres = document.getElementById("ficha_fin_cuatro");
    const inputstres = contenedortres.querySelectorAll('input');
    const pstres = contenedortres.querySelectorAll('p');
    const lbvr = {};
    inputstres.forEach(i => {
        lbvr[i.name || i.id] = i.value;
    });
    pstres .forEach(i => {
        lbvr[i.name || i.id] = i.textContent;
    });

    const contenedorcuatro = document.getElementById("ficha_fin_cinco");
    const inputscuatro = contenedorcuatro.querySelectorAll('input');
    const pscuatro = contenedorcuatro.querySelectorAll('p');
    const meta = {};
    inputscuatro.forEach(i => {
        meta[i.name || i.id] = i.value;
    });
    pscuatro.forEach(i => {
        meta[i.name || i.id] = i.textContent;
    });

    const data_ffin = {
        indi,
        metadatos, 
        vars,
        lbvr,
        meta
        };

    return data_ffin
}
//Poner datos en la ficha
function cargarFichaFin (){
  const datos = datos_ficha_fin;
  try {
        if (!datos || !datos.ficha_fin) {
         console.error('Estructura de datos incorrecta');
        return;
        }
    
    const ficha = datos.ficha_fin;

    // Función auxiliar para asignar valores de forma segura
    function setValue(id, value, isTextContent = false) {
        const element = document.getElementById(id);
        if (!element) return;

        if (isTextContent) {
            element.textContent = value || '';
        } else {
            element.value = value || '';

            // 🔥 Solo disparar evento si es un input o textarea
            const tagName = element.tagName.toLowerCase();
            if (tagName === 'input' || tagName === 'textarea') {
                element.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    }


    // Función auxiliar para selects
    function setSelectValue(id, value) {
            const element = document.getElementById(id);
            if (element && value) {
                try {
                    element.value = value;
                } catch (e) {
                    console.warn(`No se pudo asignar valor ${value} al select ${id}`);
                }
            }
    }

    // Parte 1: Información básica
    setValue('objetivo_fin', ficha.parte1.objetivo, true);
    setValue('indicador_fin', ficha.parte1.indicador, true);

    // Metadatos
    setValue('fin_definicion', ficha.metadatos.fin_definicion);

     // Después de cargar el valor del select
    setSelectValue('fin_tipo_indicador', ficha.metadatos.fin_tipo_indicador);
    const event = new Event('change');
    document.getElementById('fin_tipo_indicador').dispatchEvent(event);

    setSelectValue('fin_periocidadcalc', ficha.metadatos.fin_periocidadcalc);
    setSelectValue('fin_tendencia', ficha.metadatos.fin_tendencia); 
    setSelectValue('fin_amed', ficha.metadatos.fin_amed);
    setSelectValue('fin_dimdesp', ficha.metadatos.fin_dimdesp); 

    // Variables - Solo asignar si existen
        if (ficha.vars) {
            ['b', 'c', 'd'].forEach(letra => {
                const nameKey = `fin_name_${letra}`;
                const mvKey = `fin_mv_${letra}`;
                
                // Verificar explícitamente si la propiedad existe
                if (nameKey in ficha.vars) {
                    setValue(nameKey, ficha.vars[nameKey]);
                }
                
                if (mvKey in ficha.vars) {
                    setValue(mvKey, ficha.vars[mvKey]);
                }
            });
        }
        
        // Línea Base (LBVR)
        if (ficha.lbvr) {
            ['b', 'c', 'd'].forEach(letra => {
                const keys = [
                    `fin_valor_${letra}_lbvr`,
                    `fin_um_${letra}_lbvr`,
                    `fin_date_${letra}_lbvr`
                ];
                
                keys.forEach(key => {
                    if (key in ficha.lbvr) {
                        setValue(key, ficha.lbvr[key]);
                    }
                });
            });

            // Totales LBVR (sin valores sugeridos)
            setValue('resultado_formula_lvbr', ficha.lbvr.resultado_formula_lvbr, true);
            setValue('fin_result_um_lbvr', ficha.lbvr.fin_result_um_lbvr);
            setValue('fin_result_date_lbvr', ficha.lbvr.fin_result_date_lbvr);
        }

        // Meta
        if (ficha.meta) {
            ['b', 'c', 'd'].forEach(letra => {
                const keys = [
                    `fin_valor_${letra}_meta`,
                    `fin_um_${letra}_meta`,
                    `fin_date_${letra}_meta`
                ];
                
                keys.forEach(key => {
                    if (key in ficha.meta) {
                        setValue(key, ficha.meta[key]);
                    }
                });
            });

            // Totales Meta (sin valores sugeridos)
            setValue('resultado_formula_meta', ficha.meta.resultado_formula_meta, true);
            setValue('fin_result_um_meta', ficha.meta.fin_result_um_meta);
            setValue('fin_result_date_meta', ficha.meta.fin_result_date_meta);
        }

    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
}

//FICHA PROPOSITO
 function fichaProposito() {
    const fichas = [];
    const contenedores = document.querySelectorAll('[id^="proposito_indicador_"]');

    contenedores.forEach(contenedor => {
        const id = contenedor.id;
        const index = id.split('_').pop();
        
        if (index && !isNaN(index)) {
            const ficha = {
                parte1: {
                    objetivo: document.getElementById(`objetivo_proposito_${index}`)?.textContent || '',
                    indicador: document.getElementById(`indicador_proposito_${index}`)?.textContent || ''
                },
                metadatos: {
                    definicion: document.getElementById(`proposito_definicion_${index}`)?.value || '',
                    tipo_indicador: document.getElementById(`proposito_tipo_indicador_${index}`)?.value || '',
                    algoritmo: document.getElementById(`proposito_tipo_algoritmo_${index}`)?.textContent || '',
                    periocidadcalc: document.getElementById(`proposito_periocidadcalc_${index}`)?.value || '',
                    tendencia: document.getElementById(`proposito_tendencia_${index}`)?.value || '',
                    amed: document.getElementById(`proposito_amed_${index}`)?.value || '',
                    dimdesp: document.getElementById(`proposito_dimdesp_${index}`)?.value || ''
                },
                vars: { },
                lbvr: {
                    resultado_formula_lvbr_prop: document.getElementById(`resultado_formula_lvbr_prop_${index}`)?.textContent || '0',
                    proposito_result_um_lbvr: document.getElementById(`proposito_result_um_lbvr_${index}`)?.value || '',
                    proposito_result_date_lbvr: document.getElementById(`proposito_result_date_lbvr_${index}`)?.value || ''
                },
                meta: {
                    resultado_formula_meta_prop: document.getElementById(`resultado_formula_meta_prop_${index}`)?.textContent || '0',
                    proposito_result_um_meta: document.getElementById(`proposito_result_um_meta_${index}`)?.value || '',
                    proposito_result_date_meta: document.getElementById(`proposito_result_date_meta_${index}`)?.value || ''
                }
            };

            // Variables B, C, D
            ['b', 'c', 'd'].forEach(letra => {
                ficha.vars[`proposito_name_${letra}_${index}`] = 
                    document.getElementById(`proposito_name_${letra}_${index}`)?.value || '';
                ficha.vars[`proposito_mv_${letra}_${index}`] = 
                    document.getElementById(`proposito_mv_${letra}_${index}`)?.value || '';

                ficha.lbvr[`proposito_valor_${letra}_lbvr_${index}`] = 
                    document.getElementById(`proposito_valor_${letra}_lbvr_${index}`)?.value || '';
                ficha.lbvr[`proposito_um_${letra}_lbvr_${index}`] = 
                    document.getElementById(`proposito_um_${letra}_lbvr_${index}`)?.value || '';
                ficha.lbvr[`proposito_date_${letra}_lbvr_${index}`] = 
                    document.getElementById(`proposito_date_${letra}_lbvr_${index}`)?.value || '';

                ficha.meta[`proposito_valor_${letra}_meta_${index}`] = 
                    document.getElementById(`proposito_valor_${letra}_meta_${index}`)?.value || '';
                ficha.meta[`proposito_um_${letra}_meta_${index}`] = 
                    document.getElementById(`proposito_um_${letra}_meta_${index}`)?.value || '';
                ficha.meta[`proposito_date_${letra}_meta_${index}`] = 
                    document.getElementById(`proposito_date_${letra}_meta_${index}`)?.value || '';
            });

            fichas.push(ficha);
        }
    });

    return fichas;
}
function cargarFichaProposito() {
    const datos = datos_fichas_proposito;
    // Primer pase: asignar valores y disparar change si aplica
    for (const [clave, valor] of Object.entries(datos)) {
        const elemento = document.getElementById(clave);
        if (elemento) {
            if (elemento.tagName === 'INPUT' || elemento.tagName === 'TEXTAREA') {
                elemento.value = valor;
                if (elemento.tagName === 'TEXTAREA') {
                    elemento.dispatchEvent(new Event('input', { bubbles: true }));
                }
            } else if (elemento.tagName === 'SELECT') {
                const option = Array.from(elemento.options).find(opt => opt.value === valor);
                if (option) {
                    elemento.value = valor;

                    // Dispara el change si es tipo_indicador
                    if (clave.startsWith('proposito_tipo_indicador_')) {
                        setTimeout(() => {
                            const event = new Event('change', { bubbles: true });
                            elemento.dispatchEvent(event);
                        }, 0);
                    }
                }
            } else if(elemento.localName === 'p'){
                elemento.textContent = valor;
            }
        }
    }

    // Segundo pase: espera 150ms y vuelve a intentar llenar los campos por si aparecieron después del change
    setTimeout(() => {
        for (const [clave, valor] of Object.entries(datos)) {
            const elemento = document.getElementById(clave);
            if (elemento) {
                if (elemento.tagName === 'INPUT' || elemento.tagName === 'TEXTAREA' || elemento.tagName === 'SELECT') {
                    elemento.value = valor;
                } else if(elemento.localName === 'p'){
                elemento.textContent = valor;
            }
            }
        }
    }, 150);
}

//FICHA COMPONENTE
function fichaComponente() {
    const fichasComponentes = [];
    
    // 1. Encontrar todos los mega contenedores de componentes
    const contenedoresComponentes = document.querySelectorAll('[id^="contenedor_componente_"]');
    
    contenedoresComponentes.forEach(contenedorComp => {
        const idComp = contenedorComp.id;
        const n = idComp.split('_').pop(); // Obtiene el número de componente (n)
        
        if (n && !isNaN(n)) {
            const componente = {
                numero_componente: n,
                indicadores: []
            };
            
            // 2. Buscar todos los contenedores de indicadores dentro de este componente
            const contenedoresIndicadores = contenedorComp.querySelectorAll(`[id^="contenedor_componente_${n}_indicador_"]`);
            
            contenedoresIndicadores.forEach(contenedorInd => {
                const idInd = contenedorInd.id;
                const m = idInd.split('_').pop(); // Obtiene el número de indicador (m)
                
                if (m && !isNaN(m)) {
                    const prefix = `componente_${n}_indicador_${m}`;
                    
                    const ficha = {
                        parte1: {
                            objetivo: document.getElementById(`objetivo_${prefix}`)?.textContent || '',
                            indicador: document.getElementById(`indicador_${prefix}`)?.textContent || ''
                        },
                        metadatos: {
                            definicion: document.getElementById(`definicion_${prefix}`)?.value || '',
                            tipo_indicador: document.getElementById(`tipo_indicador_${prefix}`)?.value || '',
                            algoritmo: document.getElementById(`tipo_algoritmo_${prefix}`)?.textContent || '',
                            periocidadcalc: document.getElementById(`periocidadcalc_${prefix}`)?.value || '',
                            tendencia: document.getElementById(`tendencia_${prefix}`)?.value || '',
                            amed: document.getElementById(`amed_${prefix}`)?.value || '',
                            dimdesp: document.getElementById(`dimdesp_${prefix}`)?.value || ''
                        },
                        vars: {},
                        lbvr: {
                            resultado_formula: document.getElementById(`resultado_formula_lbvr_${prefix}`)?.textContent || '0',
                            [`result_lbvr_${prefix}`]: document.getElementById(`result_lbvr_${prefix}`)?.value || '',
                            [`result_date_lbvr_${prefix}`]: formatearFecha(document.getElementById(`result_date_lbvr_${prefix}`)?.value || '')
                        },
                        meta: {
                            resultado_formula: document.getElementById(`resultado_formula_meta_${prefix}`)?.textContent || '0',
                            [`result_meta_${prefix}`]: document.getElementById(`result_meta_${prefix}`)?.value || '',
                            [`result_date_meta_${prefix}`]: formatearFecha(document.getElementById(`result_date_meta_${prefix}`)?.value || '')
                        }
                    };

                    // Variables B, C, D
                    ['b', 'c', 'd'].forEach(letra => {
                        // Variables
                        ficha.vars[`name_${letra}_${prefix}`] = 
                            document.getElementById(`name_${letra}_${prefix}`)?.value || '';
                        ficha.vars[`mv_${letra}_${prefix}`] = 
                            document.getElementById(`mv_${letra}_${prefix}`)?.value || '';

                        // LBVR
                        ficha.lbvr[`valor_${letra}_lbvr_${prefix}`] = 
                            document.getElementById(`valor_${letra}_lbvr_${prefix}`)?.value || '';
                        ficha.lbvr[`um_${letra}_lbvr_${prefix}`] = 
                            document.getElementById(`um_${letra}_lbvr_${prefix}`)?.value || '';
                        ficha.lbvr[`date_${letra}_lbvr_${prefix}`] = 
                            formatearFecha(document.getElementById(`date_${letra}_lbvr_${prefix}`)?.value || '');

                        // Meta
                        ficha.meta[`valor_${letra}_meta_${prefix}`] = 
                            document.getElementById(`valor_${letra}_meta_${prefix}`)?.value || '';
                        ficha.meta[`um_${letra}_meta_${prefix}`] = 
                            document.getElementById(`um_${letra}_meta_${prefix}`)?.value || '';
                        ficha.meta[`date_${letra}_meta_${prefix}`] = 
                            formatearFecha(document.getElementById(`date_${letra}_meta_${prefix}`)?.value || '');
                    });

                    componente.indicadores.push(ficha);
                }
            });
            
            fichasComponentes.push(componente);
        }
    });
    
    return { data: fichasComponentes };
}
//Poner los datos en la ficha
function cargarFichasComponente() {
    const datos = datos_fichas_componente;
    // Primero procesar los selects de tipo de algoritmo para disparar los eventos
    const algoritmoKeys = Object.keys(datos).filter(key => key.includes('algoritmo_componente'));
    
    // Procesar primero los campos de algoritmo
    algoritmoKeys.forEach(key => {
        const value = datos[key];
        const element = document.getElementById(key);
        
        if (element && element.tagName === 'SELECT') {
            // Seleccionar la opción correcta
            const option = element.querySelector(`option[value="${value}"]`);
            if (option) {
                option.selected = true;
                // Disparar evento change con bubbles para que llegue a los listeners
                const event = new Event('change', { bubbles: true });
                element.dispatchEvent(event);
            }
        }
    });
    
    // Esperar un breve momento para permitir que los eventos se procesen
    setTimeout(() => {
        // Luego procesar el resto de los campos
        Object.keys(datos).forEach(key => {
            // Saltar los campos de algoritmo que ya procesamos
            if (key.includes('algoritmo_componente')) return;
            
            const value = datos[key];
            let element = document.getElementById(key);
            
            if (element) {
                poblarElementoConEventos(element, value);
            } else {
                // Búsqueda flexible si no encuentra por ID exacto
                const elements = document.querySelectorAll(`[id*="${key}"]`);
                if (elements.length > 0) {
                    elements.forEach(el => poblarElementoConEventos(el, value));
                }
            }
        });
        
    }, 50); // Pequeño retraso para asegurar que los eventos de algoritmo se procesen primero
}
// Función auxiliar mejorada para poblar elementos con manejo de eventos
function poblarElementoConEventos(element, value) {
    if (!element) return;
    
    // Convertir value a string para consistencia
    const strValue = value !== undefined && value !== null ? String(value) : '';
    
    if (element.tagName === 'SELECT') {
        const option = element.querySelector(`option[value="${strValue}"]`);
        if (option) {
            option.selected = true;
            // Disparar evento change para selects
            const changeEvent = new Event('change', { bubbles: true });
            element.dispatchEvent(changeEvent);
        }
    } 
    else if (element.tagName === 'INPUT') {
        if (element.type === 'checkbox') {
            element.checked = Boolean(value);
        } else if (element.type === 'radio') {
            element.checked = (element.value === strValue);
        } else {
            element.value = strValue;
        }
    } 
    else if (element.tagName === 'TEXTAREA') {
        element.value = strValue;
    } 
    else if (element.tagName === 'P' || element.tagName === 'DIV' || element.tagName === 'SPAN') {
        element.textContent = strValue;
    }
    
    // Disparar evento input para actualizaciones
    const inputEvent = new Event('input', { bubbles: true });
    element.dispatchEvent(inputEvent);
}
//FICHA ACTIVIDAD
function fichasActividad() {
    const actividadesData = [];
    
    // 1. Encontrar todos los contenedores de actividad
    const contenedoresActividades = document.querySelectorAll('[id^="contenedoract_componente_"]');
    
    contenedoresActividades.forEach(contenedorAct => {
        const idParts = contenedorAct.id.split('_');
        const n = idParts[2]; // Número de componente
        const m = idParts[4]; // Número de actividad
        const o = idParts[6]; // Número de indicador
        
        if (n && !isNaN(m)) {
            const prefix = `componente_${n}_actividad_${m}_indicador_${o}`;
            
            const actividad = {
                componente_numero: parseInt(n),
                actividad_numero: parseInt(m),
                indicador_numero: parseInt(o),
                datos: {
                    parte1: {
                        objetivo: document.getElementById(`objetivo_${prefix}`)?.textContent || '',
                        indicador: document.getElementById(`indicador_${prefix}`)?.textContent || ''
                    },
                    metadatos: {
                        definicion: document.getElementById(`definicion_${prefix}`)?.value || '',
                        tipo_indicador: document.getElementById(`tipo_indicador_${prefix}`)?.value || '',
                        algoritmo: document.getElementById(`tipo_algoritmo_${prefix}`)?.textContent || '',
                        periocidadcalc: document.getElementById(`periocidadcalc_${prefix}`)?.value || '',
                        tendencia: document.getElementById(`tendencia_${prefix}`)?.value || '',
                        amed: document.getElementById(`amed_${prefix}`)?.value || '',
                        dimdesp: document.getElementById(`dimdesp_${prefix}`)?.value || ''
                    },
                    vars: {},
                    lbvr: {
                        [`resultado_formula_lbvr_${prefix}`]: document.getElementById(`resultado_formula_lbvr_${prefix}`)?.textContent || '0',
                        [`result_lbvr_${prefix}`]: document.getElementById(`result_lbvr_${prefix}`)?.value || '',
                        [`result_date_lbvr_${prefix}`]: document.getElementById(`result_date_lbvr_${prefix}`)?.value || ''
                    },
                    meta: {
                        [`resultado_formula_meta_${prefix}`]: document.getElementById(`resultado_formula_meta_${prefix}`)?.textContent || '0',
                        [`result_meta_${prefix}`]: document.getElementById(`result_meta_${prefix}`)?.value || '',
                        [`result_date_meta_${prefix}`]: document.getElementById(`result_date_meta_${prefix}`)?.value || ''
                    }
                }
            };

            // Variables B, C, D
            ['b', 'c', 'd'].forEach(letra => {
                // Variables
                actividad.datos.vars[`name_${letra}_${prefix}`] = 
                    document.getElementById(`name_${letra}_${prefix}`)?.value || '';
                    console.log(document.getElementById(`name_${letra}_${prefix}`))
                actividad.datos.vars[`mv_${letra}_${prefix}`] = 
                    document.getElementById(`mv_${letra}_${prefix}`)?.value || '';

                // LBVR
                actividad.datos.lbvr[`valor_${letra}_lbvr_${prefix}`] = 
                    document.getElementById(`valor_${letra}_lbvr_${prefix}`)?.value || '';
                actividad.datos.lbvr[`um_${letra}_lbvr_${prefix}`] = 
                    document.getElementById(`um_${letra}_lbvr_${prefix}`)?.value || '';
                actividad.datos.lbvr[`date_${letra}_lbvr_${prefix}`] = 
                    document.getElementById(`date_${letra}_lbvr_${prefix}`)?.value || '';

                // Meta
                actividad.datos.meta[`valor_${letra}_meta_${prefix}`] = 
                    document.getElementById(`valor_${letra}_meta_${prefix}`)?.value || '';
                actividad.datos.meta[`um_${letra}_meta_${prefix}`] = 
                    document.getElementById(`um_${letra}_meta_${prefix}`)?.value || '';
                actividad.datos.meta[`date_${letra}_meta_${prefix}`] = 
                    document.getElementById(`date_${letra}_meta_${prefix}`)?.value || '';
            });

            actividadesData.push(actividad);
        }
    });
    
    // 2. Organizar los datos por componente y actividad
    const resultado = {};
    
    actividadesData.forEach(actividad => {
        const { componente_numero, actividad_numero, indicador_numero, datos } = actividad;
        
        if (!resultado[componente_numero]) {
            resultado[componente_numero] = {};
        }
        
        if (!resultado[componente_numero][actividad_numero]) {
            resultado[componente_numero][actividad_numero] = {
                actividad_numero: actividad_numero,
                indicadores: []
            };
        }
        
        resultado[componente_numero][actividad_numero].indicadores.push({
            indicador_numero: indicador_numero,
            ...datos
        });
    });
    
    // 3. Convertir a formato de array ordenado
    actividadesData.sort((a, b,c) => {
        if (a.componente_numero !== b.componente_numero) {
            return a.componente_numero - b.componente_numero;
        } else if (a.actividad_numero !== b.actividad_numero) {
            return a.actividad_numero - b.actividad_numero;
        } else {
            return a.indicador_numero - b.indicador_numero;
        }
    });

    return { data: actividadesData }
}
function cargarFichasActividades(datos) {
    // Crear un mapa de todos los contenedores de actividades
    const contenedores = document.querySelectorAll('[id^="contenedoract_componente_"]');

    // Convertir NodeList a array para poder usar find
    const contenedoresArray = Array.from(contenedores);

    // Poblar cada campo en su contenedor correspondiente
    Object.keys(datos).forEach(key => {
        // Extraer números de componente, actividad e indicador
        const match = key.match(/componente_(\d+)_actividad_(\d+)_indicador_(\d+)/);
        if (match) {
            const [_, numComponente, numActividad, numIndicador] = match;
            
            // Buscar el contenedor específico
            const contenedorId = `contenedoract_componente_${numComponente}_actividad_${numActividad}_indicador_${numIndicador}`;
            const contenedor = document.getElementById(contenedorId);
            
            if (contenedor) {
                // Extraer el nombre del campo (lo que viene después del último indicador_X)
                const fieldName = key.split(`_indicador_${numIndicador}_`).pop() || 
                                 key.split(`_indicador_${numIndicador}`).pop();
                
                // Buscar el elemento dentro del contenedor
                // Primero intentar con selector que termine con el fieldName
                let element = contenedor.querySelector(`[id$="_${fieldName}"]`);
                
                // Si no se encuentra, intentar con selector que contenga el fieldName
                if (!element) {
                    element = contenedor.querySelector(`[id*="${fieldName}"]`);
                }
                
                if (element) {
                    poblarElemento(element, datos[key]);
                }
            }
        }
    });
}
// Función auxiliar mejorada para poblar elementos
function poblarElemento(element, value) {
    if (!element || value === undefined || value === null) return;
    
    // Convertir value a string para comparaciones
    const strValue = String(value);
    
    if (element.tagName === 'SELECT') {
        // Para select, buscar opción que coincida con el valor
        const options = element.options;
        let optionFound = false;
        
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === strValue) {
                options[i].selected = true;
                optionFound = true;
                break;
            }
        }
        
        if (!optionFound && options.length > 0) {
            options[0].selected = true; // Seleccionar primera opción por defecto
        }
        
        // Disparar evento change
        const changeEvent = new Event('change', { bubbles: true });
        element.dispatchEvent(changeEvent);
    } 
    else if (element.tagName === 'INPUT') {
        if (element.type === 'checkbox') {
            element.checked = Boolean(value);
        } else if (element.type === 'radio') {
            element.checked = (element.value === strValue);
        } else {
            element.value = strValue;
        }
    } 
    else if (element.tagName === 'TEXTAREA') {
        element.value = strValue;
    } 
    else {
        element.textContent = strValue;
    }
    
    // Disparar evento input
    const inputEvent = new Event('input', { bubbles: true });
    element.dispatchEvent(inputEvent);
}
// Ejecutar al cargar la página
window.onload = function() {
    generarContenedoresDesdeDatos();

    if(Object.keys(datos_ficha_fin).length >0){
        cargarFichaFin();
    }
    if (Object.keys(datos_fichas_proposito).length > 0) {
        cargarFichaProposito();
        setTimeout(() =>{
            cargarFichaProposito();
        }, 50)
        
    }
    if (Object.keys(datos_fichas_componente).length > 0) {
        cargarFichasComponente();
    }
    if (Object.keys(datos_fichas_actividad).length > 0) {
        cargarFichasActividades(datos_fichas_actividad);
    }
};

