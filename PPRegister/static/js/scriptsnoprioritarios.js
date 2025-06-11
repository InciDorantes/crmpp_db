//OTROS 
function mostrarOtroTipo(select) {
  // Obtiene “tipo_formato2_X”
  const idSelect = select.id;
  const numero = idSelect.split("_").pop(); // “1”, “2”, etc.
  const inputOtro = document.getElementById(`otro_tipo_formato2_${numero}`);
  
  if (select.value === "otro") {
    inputOtro.style.display = "block";
  } else {
    inputOtro.style.display = "none";
    inputOtro.value = ""; // limpia si se esconde
  }
}
function mostrarOtroCobertura(select) {
  const idSelect = select.id; // “cobertura_formato2_X”
  const numero = idSelect.split("_").pop();
  const inputOtro = document.getElementById(`otro_cobertura_formato2_${numero}`);
  
  if (select.value === "otro") {
    inputOtro.style.display = "block";
  } else {
    inputOtro.style.display = "none";
    inputOtro.value = "";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  //AGREGAR FILA FORMATO 1
  let contadorF1 = 1;
  function agregarFilaFormatoUno() {
    contadorF1++;

    const tabla = document.getElementById("formatouno").getElementsByTagName('tbody')[0];
    const nuevaFila = tabla.rows[0].cloneNode(true); // clona la primera fila

    // Limpia y actualiza los ID
    const inputs = nuevaFila.querySelectorAll("input, textarea");
    inputs.forEach(input => {
      const oldId = input.id;
      if (oldId) {
        const baseId = oldId.replace(/_\d+$/, '');
        input.id = `${baseId}_${contadorF1}`;
        if (input.hasAttribute("data-select-id")) {
          const baseSelectId = input.getAttribute("data-select-id").replace(/_\d+$/, '');
          input.setAttribute("data-select-id", `${baseSelectId}_${contadorF1}`);
        }
      }
      
      input.value = "";
    });

    // Reasigna el evento al botón de eliminar
    const btnEliminar = nuevaFila.querySelector("button.eliminar-f1");
    if (btnEliminar) {
      btnEliminar.addEventListener("click", eliminarFila);
    }

    tabla.appendChild(nuevaFila);
  }

  function eliminarFila(event) {
    const fila = event.target.closest("tr");
    const tbody = fila.parentElement;

    // No permitir eliminar la primera fila
    if (fila === tbody.rows[0]) {
      alert("No puedes eliminar la primera fila.");
      return;
    }

    fila.remove();

    // Reajustar los IDs después de eliminar
    const filas = tbody.querySelectorAll("tr");
    filas.forEach((tr, index) => {
      const nuevoNumero = index + 1;
      const inputs = tr.querySelectorAll("input, textarea");

      inputs.forEach(input => {
        const oldId = input.id;
        if (oldId) {
          const baseId = oldId.replace(/_\d+$/, '');
          input.id = `${baseId}_${nuevoNumero}`;
        }
      });
    });

    // Actualizar contador total (opcional)
    contadorF1 = filas.length;
  }

    // Botón de agregar fila
  document.getElementById('boton-f1').addEventListener("click", agregarFilaFormatoUno);

    // Asigna eventos a botones de eliminar existentes
  document.querySelectorAll("button.eliminar-f1").forEach(btn => {
    btn.addEventListener("click", eliminarFila);
  });

  //AGREGAR FILA FORMATO DOS
  let contadorF2 = 1;

  function agregarFilaFormatoDos() {
    contadorF2++;

    // 1) Clonar la primera fila de <tbody> de “formatodos”
    const tbody = document
      .getElementById("formatodos")
      .getElementsByTagName("tbody")[0];
    const filaOriginal = tbody.rows[0];
    const nuevaFila = filaOriginal.cloneNode(true);
    nuevaFila.querySelectorAll("select, input, textarea").forEach(elemento => {
      const oldId = elemento.id;
      if (!oldId) return;

      // Base: quita el sufijo “_N” para reconstruirlo con el contador nuevo
      const baseId = oldId.replace(/_\d+$/, "");
      const nuevoId = `${baseId}_${contadorF2}`;
      elemento.id = nuevoId;

      // Si tiene data-select-id, actualízalo al nuevo ID
      if (elemento.hasAttribute("data-select-id")) {
        // Ej: data-select-id="tipo_formato2_1" → baseSelectId="tipo_formato2"
        const baseSelectId = elemento
          .getAttribute("data-select-id")
          .replace(/_\d+$/, "");
        elemento.setAttribute("data-select-id", `${baseSelectId}_${contadorF2}`);
      }

      // Si el elemento es <select>, hay que asegurarse de que el onchange
      // siga llamando a la función, y la función buscará el input “otro” 
      // con el mismo Número.
      if (elemento.tagName.toLowerCase() === "select") {
        // Reconstruir el onchange=”mostrarOtroX(this)” con el mismo nombre:
        if (baseId.startsWith("tipo_formato2")) {
          elemento.setAttribute("onchange", "mostrarOtroTipo(this)");
        } else if (baseId.startsWith("cobertura_formato2")) {
          elemento.setAttribute("onchange", "mostrarOtroCobertura(this)");
        }
      }

      // Limpiar valores en inputs/textarea
      if (elemento.tagName.toLowerCase() !== "select") {
        elemento.value = "";
        // Si es campo “otro” (data-select-id), lo oculta
        if (elemento.hasAttribute("data-select-id")) {
          elemento.style.display = "none";
        }
      } else {
        // Si es <select>, lo dejamos en la primera opción por defecto
        elemento.selectedIndex = 0;
      }

      nuevaFila.querySelectorAll("button.eliminar-f2").forEach(btn => {
        btn.addEventListener("click", eliminarFilaFormatoDos);
      });
    });

    // 3) Insertar la nueva fila al final del <tbody>
    tbody.appendChild(nuevaFila);
  }

  // 4) Función para eliminar fila (Formulario 2)
  function eliminarFilaFormatoDos(event) {
    const boton = event.currentTarget;
    const fila = boton.closest("tr");
    const tbody = fila.parentElement;

    // No eliminar la primera fila
    if (fila === tbody.rows[0]) {
      alert("No puedes eliminar la primera fila.");
      return;
    }

    fila.remove();

    // Reajustar los IDs de las filas que quedan (para tener índices consecutivos):
    const filas = tbody.querySelectorAll("tr");
    filas.forEach((tr, index) => {
      const nuevoNumero = index + 1; // empieza en 1
      tr.querySelectorAll("select, input, textarea").forEach(elemento => {
        const oldId = elemento.id;
        if (!oldId) return;
        const baseId = oldId.replace(/_\d+$/, "");
        const nuevoId = `${baseId}_${nuevoNumero}`;
        elemento.id = nuevoId;

        if (elemento.hasAttribute("data-select-id")) {
          const baseSelectId = elemento
            .getAttribute("data-select-id")
            .replace(/_\d+$/, "");
          elemento.setAttribute("data-select-id", `${baseSelectId}_${nuevoNumero}`);
        }

        // Ajustar onchange si es select
        if (elemento.tagName.toLowerCase() === "select") {
          if (baseId.startsWith("tipo_formato2")) {
            elemento.setAttribute("onchange", "mostrarOtroTipo(this)");
          } else if (baseId.startsWith("cobertura_formato2")) {
            elemento.setAttribute("onchange", "mostrarOtroCobertura(this)");
          }
          elemento.selectedIndex = 0; // opcional: resetear selección
        }
        // Si es “otro”, siempre ocultarlo al recontar
        if (
          elemento.tagName.toLowerCase() === "input" &&
          elemento.hasAttribute("data-select-id")
        ) {
          elemento.style.display = "none";
          elemento.value = "";
        }
      });
    });

    // Actualizar el contador global
    contadorF2 = filas.length;
  }

  // 5) Asociar eventos a botones (al cargar la página)
  document.getElementById("boton-f2").addEventListener("click", agregarFilaFormatoDos);
  document.querySelectorAll("button.eliminar-f2").forEach(btn => {
    btn.addEventListener("click", eliminarFilaFormatoDos);
  });


  //AGREGAR FILA FORMATO DOS
  let contadorF3 = 1;
  function agregarFilaFormatoTres() {
    contadorF3++;

    const tabla = document.getElementById("formatotres").getElementsByTagName('tbody')[0];
    const nuevaFila = tabla.rows[0].cloneNode(true); // clona la primera fila

    // Limpia y actualiza los ID
    const inputs = nuevaFila.querySelectorAll("input, textarea");
    inputs.forEach(input => {
      const oldId = input.id;
      if (oldId) {
        const baseId = oldId.replace(/_\d+$/, '');
        input.id = `${baseId}_${contadorF3}`;
      }
      input.value = "";
    });

    // Reasigna el evento al botón de eliminar
    const btnEliminar = nuevaFila.querySelector("button.eliminar-f3");
    if (btnEliminar) {
      btnEliminar.addEventListener("click", eliminarFila);
    }

    tabla.appendChild(nuevaFila);
  }

  function eliminarFila(event) {
    const fila = event.target.closest("tr");
    const tbody = fila.parentElement;

    // No permitir eliminar la primera fila
    if (fila === tbody.rows[0]) {
      alert("No puedes eliminar la primera fila.");
      return;
    }

    fila.remove();

    // Reajustar los IDs después de eliminar
    const filas = tbody.querySelectorAll("tr");
    filas.forEach((tr, index) => {
      const nuevoNumero = index + 1;
      const inputs = tr.querySelectorAll("input, textarea");

      inputs.forEach(input => {
        const oldId = input.id;
        if (oldId) {
          const baseId = oldId.replace(/_\d+$/, '');
          input.id = `${baseId}_${nuevoNumero}`;
        }
      });
    });

    // Actualizar contador total (opcional)
    contadorF1 = filas.length;
  }

  // Botón de agregar fila
  document.getElementById('boton-f3').addEventListener("click", agregarFilaFormatoTres);

  // Asigna eventos a botones de eliminar existentes
  document.querySelectorAll("button.eliminar-f3").forEach(btn => {
    btn.addEventListener("click", eliminarFila);
  });

});

/* FORMATO 1 */
function recolectarFormatoUno(){
  const tabla = document.getElementById('formatouno');
  const filas = tabla.getElementsByTagName("tr");

  const datos = [];
  for (let i = 0; i < filas.length; i++) {
    const inputs = filas[i].querySelectorAll("input, textarea");
    if (inputs.length === 0) continue; // Ignorar filas sin inputs

    const filaData = {};

    inputs.forEach(input => {
      // Eliminar sufijos incrementales del id (si es necesario)
      let key = input.getAttribute("id") || input.id.replace(/\d+$/, "");
      filaData[key] = input.value;
    });

    datos.push(filaData);
  }

  return datos;
}

/* FORMATO 2 */
function recolectarFormatoDos() {
  const filas = document.querySelectorAll("#formatodos tbody tr");
  const resultado = [];
  filas.forEach(tr => {
    // 1) Nombre del programa
    const nombreInput = tr.querySelector('textarea[name="nombre"]');
    const nombre = nombreInput ? nombreInput.value.trim() : "";
    // 2) Tipo de programa (y manejo de "otro")
    const selectTipo = tr.querySelector('select[name="tipo"]');
    let tipo;
    if (selectTipo) {
      if (selectTipo.value === "otro") {
        // Buscamos el input asociado cuyo data-select-id coincide con selectTipo.id
        const otroTipoInput = tr.querySelector(`textarea[data-select-id="${selectTipo.id}"]`);
        tipo = otroTipoInput ? otroTipoInput.value.trim() : "";
      } else {
        tipo = selectTipo.value.trim();
      }
    } else {
      tipo = "";
    }
    // 3) Objetivo
    const objetivoInput = tr.querySelector('textarea[name="objetivo"]');
    const objetivo = objetivoInput ? objetivoInput.value.trim() : "";
    // 4) Población objetivo
    const poblacionInput = tr.querySelector('textarea[name="poblacion"]');
    const poblacion = poblacionInput ? poblacionInput.value.trim() : "";
    // 5) Bienes y servicios
    const bysInput = tr.querySelector('textarea[name="bys"]');
    const bys = bysInput ? bysInput.value.trim() : "";
    // 6) Cobertura (y manejo de "otro")
    const selectCobertura = tr.querySelector('select[name="cobertura"]');
    let cobertura;
    if (selectCobertura) {
      if (selectCobertura.value === "otro") {
        const otroCoberturaInput = tr.querySelector(
          `textarea[data-select-id="${selectCobertura.id}"]`
        );
        cobertura = otroCoberturaInput ? otroCoberturaInput.value.trim() : "";
      } else {
        cobertura = selectCobertura.value.trim();
      }
    } else {
      cobertura = "";
    }
    // 7) Institución/Dirección que coordina
    // Como este input no tiene atributo name, lo buscamos por id que empieza con "institucion_coordinadora_formato2_"
    const instCoordInput = tr.querySelector(
      'textarea[name="institucion_coordinadora"]'
    );
    const institucion_coordinadora = instCoordInput
      ? instCoordInput.value.trim()
      : "";
    // 8) Interdependencia
    const selectInterdep = tr.querySelector('select[name="interdep"]');
    const interdependencia = selectInterdep
      ? selectInterdep.value.trim()
      : "";
    // 9) Descripción de la interdependencia
    const descripInterInput = tr.querySelector('textarea[name="descripinter"]');
    const descripinter = descripInterInput
      ? descripInterInput.value.trim()
      : "";
    // Finalmente, armamos un objeto con todos los campos de esta fila:
    resultado.push({
      nombre: nombre,
      tipo: tipo,
      objetivo: objetivo,
      poblacion: poblacion,
      bys: bys,
      cobertura: cobertura,
      institucion_coordinadora: institucion_coordinadora,
      interdependencia: interdependencia,
      descripinter: descripinter
    });
  });
  return resultado;
}
/* FORMATO 3 */
function recolectarFormatoTres(){
  const tabla = document.getElementById('formatotres');
  const filas = tabla.getElementsByTagName("tr");

  const datos = [];
  for (let i = 0; i < filas.length; i++) {
    const inputs = filas[i].querySelectorAll("input, textarea");
    if (inputs.length === 0) continue; // Ignorar filas sin inputs

    const filaData = {};

    inputs.forEach(input => {
      // Eliminar sufijos incrementales del id (si es necesario)
      let key = input.getAttribute("id") || input.id.replace(/\d+$/, "");
      filaData[key] = input.value;
    });

    datos.push(filaData);
  }

  return datos;
}
/* FORMATO 4 */
function recolectarFormatoCuatro() {
  // 1) Seleccionamos todas las filas (<tr>) del <tbody> de la tabla #formatocuatro
  const filas = document.querySelectorAll("#formatocuatro tbody tr");
  const resultado = [];
  filas.forEach(tr => {
    // 2) Dentro de esta fila, buscamos:
    //    a) el input cuyo id empieza con "criterio_"
    //    b) el input cuyo id empieza con "descripcion_"
    //    c) el textarea cuyo id empieza con "justificacion_"
    //
    //    (Por cómo tienes el HTML, cada <td> en orden contiene exactamente
    //    esos elementos, pero usamos selectores más seguros por id^=…)
    const inputCriterio = tr.querySelector('input[id^="criterio_"]');
    const textoCriterio = inputCriterio ? inputCriterio.value.trim() : "";
    const inputDescripcion = tr.querySelector('input[id^="descripcion_"]');
    const textoDescripcion = inputDescripcion ? inputDescripcion.value.trim() : "";
    const textareaJustificacion = tr.querySelector('textarea[id^="justificacion_"]');
    const textoJustificacion = textareaJustificacion
      ? textareaJustificacion.value.trim()
      : "";
    // 3) Armamos un objeto con esos tres campos:
    resultado.push({
      criterio: textoCriterio,
      descripcion: textoDescripcion,
      justificacion: textoJustificacion
    });
  });
  return resultado;
}

/* FORMATO 9 */
document.getElementById("boton-f9").addEventListener("click", () => {
  const tbody = document.querySelector("#formato-9-table tbody");
  const fila = document.createElement("tr");

  // helper para crear una celda con textarea
  function crearCelda(tipo, placeholder = "") {
    const td = document.createElement("td");
    const textarea = document.createElement("textarea");
    textarea.placeholder = placeholder;
    textarea.style.width = "100%";
    textarea.style.border = "none";
    textarea.dataset.tipo = tipo;
    td.appendChild(textarea);
    return td;
  }
  function crearCeldaBoton() {
    const td = document.createElement("td");
    const button = document.createElement("button");
    button.className = "eliminar-f9 buton-eliminar-formatos"
    button.textContent ="x";
    td.appendChild(button);
    return td;
  }
  function crearCeldaUsuario(tipo) {
    const td = document.createElement("td");
    td.dataset.tipo = tipo;  // ← Esto es clave
    const select = document.createElement("select");
    select.className = "form-select";
    select.dataset.tipo = tipo;

    usuarios.forEach(usuario => {
      const option = document.createElement("option");
      option.value = usuario.username;
      option.textContent = usuario.username;
      select.appendChild(option);
  });

  td.appendChild(select);
  return td;
}
  function crearCeldaA(tipo){
    const td=document.createElement("td");
    const a = document.createElement("a");
    a.dataset.tipo = tipo;
    td.appendChild(a);
    return td;
  };
  // Siglas
  fila.appendChild(crearCeldaA("siglas"));
  // Dependencia
  fila.appendChild(crearCeldaA("dependencia"));

  // Username: se usa como base para el resto de los IDs
  const celdaUsername = crearCeldaUsuario("centro de costos");
  const inputUsername = celdaUsername.querySelector("select");

  inputUsername.addEventListener("input", function () {
    const username = this.value.trim().replace(/\s+/g, '_');
    fila.querySelectorAll("textarea").forEach(textarea => {
      const tipo = textarea.dataset.tipo;
      if (tipo !== "username" && tipo !== "siglas" && tipo !== "dependencia") {
        textarea.id = `${tipo}_${username}`;
        textarea.name = `${tipo}`;
      }
    });
    const usuario = usuarios.find(user => user.username === username);
    const dep = usuario.area
    const sig = usuario.dependencia
    fila.querySelectorAll("a").forEach(a => {
      const tipo = a.dataset.tipo;
      if (tipo == "siglas") {
        a.id = `${tipo}_${username}`;
        a.textContent=`${sig}`;
      }else if(tipo == "dependencia"){
        a.id = `${tipo}_${username}`;
        a.textContent=`${dep}`;
      }
    });
  });


  fila.appendChild(celdaUsername);

  // Otras celdas que dependen del username
  fila.appendChild(crearCelda("funcion", "Función en la ejecución"));
  fila.appendChild(crearCelda("interact", "Interactúa con"));
  fila.appendChild(crearCelda("meca", "Mecanismo de coordinación"));
  fila.appendChild(crearCelda("repso", "Responsabilidad"));
  fila.appendChild(crearCelda("atrib", "Atribución RECAPY"));4
  fila.appendChild(crearCeldaBoton("boton", "x"));

  tbody.appendChild(fila);
});
function eliminarFilaF9(event) {
    const fila = event.target.closest("tr");
    const tbody = fila.parentElement;
    fila.remove();
}
// Agrega este listener una sola vez después de cargar la tabla
document.querySelector("#formato-9-table").addEventListener("click", function(event) {
  if (event.target.matches("button.eliminar-f9")) {
    eliminarFilaF9(event);
  }
});
//estructura
function recolectarDatosFormato9() {
  const tabla9 = document.getElementById("formato-9-table");
  const filas = tabla9.querySelectorAll("table tbody tr");
  let datos = [];

  filas.forEach(fila => {
    const centroCostosCelda = fila.querySelector('[data-tipo="centro de costos"]');
    let username = '';

    const select = centroCostosCelda.querySelector('select');
    if (select) {
      // Obtenemos la opción seleccionada correctamente
      const selectedOption = select.options[select.selectedIndex];
      username = selectedOption ? selectedOption.value.trim() : '';
    } else {
      // Si no hay select, usamos el contenido de texto
      username = centroCostosCelda.textContent.trim();
    }

    const funcion = fila.querySelector('[data-tipo="funcion"]').value.trim();
    const interact = fila.querySelector('[data-tipo="interact"]').value.trim();
    const meca = fila.querySelector('[data-tipo="meca"]').value.trim();
    const respo = fila.querySelector('[data-tipo="repso"]').value.trim();
    const atrib = fila.querySelector('[data-tipo="atrib"]').value.trim();

    datos.push({
      username: username,
      funcion: funcion,
      interactua_con: interact,
      mecanismo_coordinacion: meca,
      responsabilidad: respo,
      atribucion_recapy: atrib
    });
  });

  return { data: datos };
}

/* FORMATO 6 */
//formulas
document.addEventListener("DOMContentLoaded", function () {
  const tabla = document.getElementById("table-formato-6");

  if (!tabla) return;

  const inputs = tabla.querySelectorAll("input[type='number']");

  const formatearConComas = (numero) => {
    return numero.toLocaleString("es-MX"); // Puedes ajustar según tu país
  };

  const getValor = (id) => {
    const el = document.getElementById(id);
    if (!el) return 0;
    const valor = el.value.replace(/,/g, "");  // Eliminar comas
    return parseFloat(valor) || 0;
  };

  const actualizarFila = (municipio) => {
    const tipo1 = getValor(`tipo1_${municipio}`);
    const tipo2 = getValor(`tipo2_${municipio}`);
    const tipo3 = getValor(`tipo3_${municipio}`);
    const tipo4 = getValor(`tipo4_${municipio}`);
    const tipo5 = getValor(`tipo5_${municipio}`);
    const tipo6 = getValor(`tipo6_${municipio}`);

    const cuantificacion = tipo1 + tipo2 + tipo3 + tipo4 + tipo5 + tipo6;
    const porcentaje1 = cuantificacion ? ((tipo1 + tipo2) / cuantificacion) * 100 : 0;
    const porcentaje2 = cuantificacion ? ((tipo3 + tipo4 + tipo5 + tipo6) / cuantificacion) * 100 : 0;

    const cuantificacionEl = document.getElementById(`cuantificacion_general_${municipio}`);
    const porcentaje1El = document.getElementById(`porcentaje1_${municipio}`);
    const porcentaje2El = document.getElementById(`porcentaje2_${municipio}`);

    if (cuantificacionEl) cuantificacionEl.textContent = formatearConComas(cuantificacion);
    if (porcentaje1El) porcentaje1El.textContent = porcentaje1.toFixed(2) + " %";
    if (porcentaje2El) porcentaje2El.textContent = porcentaje2.toFixed(2) + " %";
  };

  inputs.forEach(input => {
    input.addEventListener("input", () => {
      const idPartes = input.id.split("_");
      const municipio = idPartes[1];  // Asume ids como tipo1_municipioNombre
      if (municipio) {
        actualizarFila(municipio);
      }
    });
  });
});
//recoleción de datos
function parseNumero(valor) {
  return parseFloat((valor || "0").toString().replace(/,/g, "")) || 0;
}

function recolectarDatosFormato6() {
  const tabla = document.getElementById("table-formato-6");
  const filas = tabla.querySelectorAll("tbody tr");
  const datos = [];

  filas.forEach(fila => {
    const municipio = fila.children[0].textContent.trim();

    const localidades = parseNumero(fila.querySelector(`[id^="localidades_"]`)?.value);
    const tipo1 = parseNumero(fila.querySelector(`[id^="tipo1_"]`)?.value);
    const tipo2 = parseNumero(fila.querySelector(`[id^="tipo2_"]`)?.value);
    const tipo3 = parseNumero(fila.querySelector(`[id^="tipo3_"]`)?.value);
    const tipo4 = parseNumero(fila.querySelector(`[id^="tipo4_"]`)?.value);
    const tipo5 = parseNumero(fila.querySelector(`[id^="tipo5_"]`)?.value);
    const tipo6 = parseNumero(fila.querySelector(`[id^="tipo6_"]`)?.value);

    const cuantificacion_general = tipo1 + tipo2 + tipo3 + tipo4 + tipo5 + tipo6;

    const porcentaje1 = cuantificacion_general ? ((tipo1 + tipo2) / cuantificacion_general) * 100 : 0;
    const porcentaje2 = cuantificacion_general ? ((tipo3 + tipo4 + tipo5 + tipo6) / cuantificacion_general) * 100 : 0;

    datos.push({
      municipio: municipio,
      localidades: localidades,
      cuantificacion_general: cuantificacion_general,
      tipo1: tipo1,
      tipo2: tipo2,
      tipo3: tipo3,
      tipo4: tipo4,
      tipo5: tipo5,
      tipo6: tipo6,
      porcentaje1: porcentaje1.toFixed(2),
      porcentaje2: porcentaje2.toFixed(2)
    });
  });

  return {data:datos};
};

/* FORMATO 12 */
function recolectarDatosFormato12() {
  const tabla = document.getElementById("tabla-formato-12");
  const filas = tabla.querySelectorAll("tbody tr");
  const datos = [];

  filas.forEach(fila => {
    const variable = fila.children[1].textContent.trim();

    const registro = fila.querySelector(`[id^="registro_"]`)?.value;
    const desagregacion = fila.querySelector(`[id^="desagregacion_"]`)?.value;
    const instrumentos = fila.querySelector(`[id^="instrumentos_"]`)?.value;
    const programa = fila.querySelector(`[id^="programa_"]`)?.value;
    const responsable = fila.querySelector(`[id^="responsable_"]`)?.value;
    const periodicidad = fila.querySelector(`[id^="periodicidad_"]`)?.value;

    datos.push({
      variable : variable,
      registro: registro,
      desagregacion: desagregacion,
      instrumentos: instrumentos,
      programa: programa,
      responsable: responsable,
      periodicidad: periodicidad,
    });
  });

  return {data:datos};
};

/* FORMATO 13 */
document.addEventListener("DOMContentLoaded", function () {
  const botonAgregar = document.getElementById("boton-f13");

  const tabla = botonAgregar.previousElementSibling; // Referencia a la <table>
  let contadorF13 = 1;
  botonAgregar.addEventListener("click", function () {
    contadorF13++;
    const nuevaFila = document.createElement("tr");
    nuevaFila.innerHTML = `
      <td>

        <input placeholder="otro" style="border: none; width: 90%;">
      </td>
      <td><textarea placeholder="Descripción" name="descripcion" id="otro_descripcion_${contadorF13}" style="width: 100%;"></textarea></td>
      <td><textarea placeholder="Periodicidad" name="periodicidad" id="otro_periodicidad_${contadorF13}" style="width: 100%; border: none;"></textarea></td>
      <td><textarea placeholder="Responsable" name="responsable" id="otro_responsable_${contadorF13}" style="width: 100%;"></textarea></td>
      <td>
        <button type="button" class="eliminar-f13 buton-eliminar-formatos style="background-color: red; color: white; border: none; border-radius: 0.25rem;">x</button>
      </td>
    `;
    tabla.querySelector("tbody").appendChild(nuevaFila);
  });
  tabla.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("eliminar-f13")) {
      const fila = e.target.closest("tr");
      fila.remove();
    }
  });
  //si formato13 (que esta definido en el html no esta vacio entonces:)
  //rellenar datos
  //simula el click y rellena los datos
  if (typeof formato13 !== "undefined" && Object.keys(formato13).length > 0) {
    const items = Object.values(formato13);
    const statics = items.filter(item => item.es_predeterminado);
    const dynamics = items.filter(item => !item.es_predeterminado);

    // 3.1) Rellenar las 2 filas estáticas con los predeterminados
    const filasEstaticas = tabla.querySelectorAll("tbody tr:nth-child(-n+2)");
    statics.forEach((item, idx) => {
      const fila = filasEstaticas[idx];
      fila.cells[0].querySelector("a").textContent = item.nombre_reporte || "";
      fila.cells[1].querySelector("textarea").value = item.descripcion    || "";
      fila.cells[2].querySelector("textarea").value = item.periodicidad   || "";
      fila.cells[3].querySelector("textarea").value = item.responsable    || "";
    });

    // 3.2) Rellenar la fila “otro” que ya existe en el HTML con el primer dinámico
    //      (solo si hay al menos 1 dinámico)
    const tablaBody = tabla.querySelector("tbody");
    const filaExistenteOtro = tablaBody.querySelector("tr:nth-child(3)");
    if (dynamics.length > 0 && filaExistenteOtro) {
      const item0 = dynamics[0];
      filaExistenteOtro.cells[0].querySelector("input").value = item0.nombre_reporte || "";
      filaExistenteOtro.cells[1].querySelector("textarea").value = item0.descripcion    || "";
      filaExistenteOtro.cells[2].querySelector("textarea").value = item0.periodicidad   || "";
      filaExistenteOtro.cells[3].querySelector("textarea").value = item0.responsable    || "";
    }

    // 3.3) Simular clic en “Agregar otro” para cada dinámico EXCEPTO el primero
    //      (dynamics[0] ya fue cargado en la fila existente)
    const restantes = dynamics.slice(1);
    restantes.forEach(() => botonAgregar.click());

    // 3.4) Rellenar las filas recién creadas con dynamics[1..]
    const todasFilas = Array.from(tablaBody.querySelectorAll("tr"));
    // Índice de la primera dinámica en 'todasFilas' es 2 (dos estáticas)
    // La fila existente ocupa el índice 2, y las nuevas empiezan en índice 3
    restantes.forEach((item, idx) => {
      const filaDin = todasFilas[3 + idx];
      filaDin.cells[0].querySelector("input").value = item.nombre_reporte || "";
      filaDin.cells[1].querySelector("textarea").value = item.descripcion    || "";
      filaDin.cells[2].querySelector("textarea").value = item.periodicidad   || "";
      filaDin.cells[3].querySelector("textarea").value = item.responsable    || "";
    });
  }

});

//mandar
function recolectarFormato13() {
  const tabla = document.getElementById("tabla-f13");
  const filas = tabla.querySelectorAll("tbody tr");
  const datos = [];

  filas.forEach(fila => {
    const celdas = fila.querySelectorAll("td");

    // Obtener el nombre del reporte
    let nombreReporte;
    const link = celdas[0].querySelector("a");
    const input = celdas[0].querySelector("input");

    if (input) {
      // Si es "otros", concatenamos el texto del <a> con el valor del input
      nombreReporte = (link ? link.textContent : '') + input.value.trim();
    } else {
      // Si es un reporte predeterminado
      nombreReporte = link ? link.textContent.trim() : '';
    }

    // Obtener los otros campos desde los textarea
    const descripcion = celdas[1].querySelector("textarea")?.value.trim() || '';
    const periodicidad = celdas[2].querySelector("textarea")?.value.trim() || '';
    const responsable = celdas[3].querySelector("textarea")?.value.trim() || '';

    datos.push({
      nombre_reporte: nombreReporte,
      descripcion: descripcion,
      periodicidad: periodicidad,
      responsable_integracion: responsable
    });
  });

  return {data:datos};
}

/* FORMATO 14 */
function recolectarDatosF14() {
  const tabla = document.getElementById('tabla-formato-14');
  const filas = tabla.querySelectorAll('tbody tr');

  const datosRecolectados = [];

  filas.forEach(fila => {
    const fichaId = fila.id;  // obtiene el id del tr
    
    const celdas = fila.querySelectorAll('td');

    if (celdas.length >= 10) {
      // Ya no usamos 'tipo', en vez de eso ponemos 'fichaId'
      const indicador = celdas[1].textContent.trim();
      const lineaBase = limpiarNumero(celdas[2].textContent);

      const metas = {
        '2025': limpiarNumero(celdas[3].querySelector('input')?.value || ''),
        '2026': limpiarNumero(celdas[4].querySelector('input')?.value || ''),
        '2027': limpiarNumero(celdas[5].querySelector('input')?.value || ''),
        '2028': limpiarNumero(celdas[6].querySelector('input')?.value || ''),
        '2029': limpiarNumero(celdas[7].querySelector('input')?.value || ''),
        '2030': limpiarNumero(celdas[8].querySelector('input')?.value || ''),
      };

      const medios = celdas[9].textContent.trim();

      datosRecolectados.push({
        fichaId,
        indicador,
        lineaBase,
        metas,
        medios
      });
    }
  });

  return{data: datosRecolectados}
}

/* FORMATO 16 */
function recolectarDatosF16() {
  const componentes = [];
  const cards = document.querySelectorAll('.f16');

  cards.forEach(card => {
    // Objetivo (texto dentro del <h5> antes del strong)
    const objetivoElem = card.querySelector('h5 strong');
    const objetivo = objetivoElem ? objetivoElem.textContent.trim() : '';

    // Obtener id_componente desde algún input o textarea para construir los nombres (o usar regex)
    // Aquí buscamos en los name de textareas para extraer id_componente, por ejemplo:
    // name="meta_mediano_plazo_123" => id_componente = 123
    const textareaMeta = card.querySelector('textarea[name^="meta_mediano_plazo_"]');
    let idComponente = null;
    if (textareaMeta) {
      const match = textareaMeta.name.match(/meta_mediano_plazo_(\d+)/);
      if (match) idComponente = match[1];
    }

    // Años fijos que aparecen en el HTML (de 2025 a 2030)
    const años = [2025, 2026, 2027, 2028, 2029, 2030];

    // Extraer metas (textareas por año)
    const metas = {};
    años.forEach(anio => {
      // nombre textarea: meta_{idComponente}_{anio}
      const nameMeta = `meta_${idComponente}_${anio}`;
      const textarea = card.querySelector(`textarea[name="${nameMeta}"]`);
      metas[anio] = textarea ? textarea.value.trim() : '';
    });

    // Presupuestos: recorrer inputs de nombre: presupuesto_{idComponente}_{cog}_{anio}
    // Los COG van de 1000 a 9000, cada 1000
    const cogs = ['1000','2000','3000','4000','5000','6000','7000','8000','9000'];

    const presupuestos = [];

    cogs.forEach(cog => {
      años.forEach(anio => {
        const nameInput = `presupuesto_${idComponente}_${cog}_${anio}`;
        const input = card.querySelector(`input[name="${nameInput}"]`);
        const valor = input ? limpiarNumero(input.value)  || 0 : 0;
        presupuestos.push({ cog, anio, valor });
      });
    });

    componentes.push({
      objetivo,
      idComponente,
      metas,
      presupuestos
    });
  });

  return { data: componentes };
}

/* FORMATO 15 */
let contadorf15 = 0;
const botonF15 = document.getElementById('boton-f15');
function agregarf15(){
  const tabla = document.getElementById('tabla-formato-15')
  const nuevaFila = document.createElement("tr");
  nuevaFila.innerHTML = `
    <td><a style="width: 100%;">Otro: </a> <input type="text" placeholder="Escribe otro" style:"width:100%" id="otro_${contadorf15}_concepto" name="concepto"><button type="button" class="eliminar-f15 buton-eliminar-formatos style="background-color: red; color: white; border: none; border-radius: 0.25rem;">x</button></td>
          <td><input type="text" placeholder="0" id="otro_${contadorf15}_total" name="total" style="width: 100%; border: none;"></td>
          <td><input type="text" placeholder="0" id="otro_${contadorf15}_2025" style="width: 100%; border: none;"></td>
          <td><input type="text" placeholder="0" id="otro_${contadorf15}_2026" style="width: 100%; border: none;"></td>
          <td><input type="text" placeholder="0" id="otro_${contadorf15}_2027" style="width: 100%; border: none;"></td>
          <td><input type="text" placeholder="0" id="otro_${contadorf15}_2028" style="width: 100%; border: none;"></td>
          <td><input type="text" placeholder="0" id="otro_${contadorf15}_2029" style="width: 100%; border: none;"></td>
          <td><input type="text" placeholder="0" id="otro_${contadorf15}_2030" style="width: 100%; border: none;"></td>
  `;
  tabla.querySelector("tbody").appendChild(nuevaFila);

  const prefix = `otro_${contadorf15}`;

  // Formateo de número y evento input para recalcular total
  const inputs = nuevaFila.querySelectorAll('input');
  inputs.forEach(input => {
    input.value = '';

    if (!input.name || !input.name.startsWith('concepto')) {
      input.addEventListener("input", function () {
        let raw = input.value.replace(/,/g, '').replace(/\D/g, '');
        input.value = raw ? Number(raw).toLocaleString('en-US') : '';
        // Recalcular el total al cambiar cualquier input de año
        recalcularTotalPorFila(prefix);
      });
    }
  });

  // Botón de eliminar
  const btnEliminarF15 = nuevaFila.querySelector("button.eliminar-f15");
  if (btnEliminarF15) {
    btnEliminarF15.addEventListener("click", eliminarFilaF15);
  }

  contadorf15++;
}

function recalcularTotalPorFila(prefix) {
  const anios = [2025, 2026, 2027, 2028, 2029, 2030];
  let suma = 0;

  anios.forEach(anio => {
    const input = document.getElementById(`${prefix}_${anio}`);
    const valor = limpiarNumero(input?.value) || 0;
    suma += valor;
  });

  const totalInput = document.getElementById(`${prefix}_total`);
  if (totalInput) {
    totalInput.value = suma.toLocaleString('en-US');
  }
}
function eliminarFilaF15(event){
  const fila = event.target.closest("tr");
  const tbody = fila.parentElement

  fila.remove();
};
botonF15.addEventListener("click", agregarf15);

document.querySelectorAll("#tabla-formato-15 input").forEach(input => {
  input.addEventListener("input", () => {
    actualizarTotalesF15();
    configurarLimitePorGrupo("mujeres");
    configurarLimitePorGrupo("hombres");
     configurarLimitePorGrupo("hli");
  });
});

function actualizarTotalesF15() {
  const tabla = document.getElementById("tabla-formato-15");
  const anios = [2025, 2026, 2027, 2028, 2029, 2030];

  anios.forEach(anio => {
    const mujeresInput = tabla.querySelector(`#mujeres_${anio}`);
    const hombresInput = tabla.querySelector(`#hombres_${anio}`);
    const totalInput = tabla.querySelector(`#total_${anio}`);

    const mujeres = limpiarNumero(mujeresInput?.value) || 0;
    const hombres = limpiarNumero(hombresInput?.value) || 0;

    totalInput.value = mujeres + hombres;
  });

  //Suma edad
  let sumaEdad = 0;
  anios.forEach(anio => {
    const input = document.querySelector(`#edad_${anio}`);
    const valor = limpiarNumero(input?.value) || 0;
    sumaEdad += valor;
  });

  // Coloca el total en el input con ID 'edad_total'
  const totalInput = document.querySelector('#edad_total');
  if (totalInput) {
    totalInput.value = sumaEdad;
  }


  // Sumar mujeres_total + hombres_total para total_total
  const mujeresTotal = limpiarNumero(tabla.querySelector("#mujeres_total")?.value) || 0;
  const hombresTotal = limpiarNumero(tabla.querySelector("#hombres_total")?.value) || 0;
  const edadTotal = limpiarNumero(tabla.querySelector("#edad_total")?.value) || 0;
  const totalGeneralInput = tabla.querySelector("#total_total");

  totalGeneralInput.value = mujeresTotal + hombresTotal;

  const numberInputs = tabla.querySelectorAll("table input[type='text'], table input.formato-miles");
  numberInputs.forEach(input => {
      // Cambiar a tipo "text" para permitir comas
      input.setAttribute("type", "text");

      // Aplicar formateo si ya hay datos cargados
      let raw = input.value.replace(/,/g, '').replace(/\D/g, '');
      if (raw) {
        input.value = Number(raw).toLocaleString('en-US');
      }

      // Formatear cuando el usuario escriba
      input.addEventListener("input", function () {
        let raw = input.value.replace(/,/g, '').replace(/\D/g, '');
        input.value = raw ? Number(raw).toLocaleString('en-US') : '';
      });
    });
}
function mostrarAlerta(mensaje) {
  const alerta = document.getElementById("alerta-limite");
  alerta.textContent = mensaje;
  alerta.style.display = "flex";
  alerta.style.alignItems= "center";
  alerta.style.justifyContent= "center";
  clearTimeout(alerta.timeout);
  alerta.timeout = setTimeout(() => {
    alerta.style.display = "none";
  }, 5000);
}
function formatearConComas(numero) {
  return Number(numero).toLocaleString('en-US');
}
function configurarLimitePorGrupo(grupo) {
  const tabla = document.getElementById("tabla-formato-15");
  const totalInput = tabla.querySelector(`#${grupo}_total`);
  const anios = [2025, 2026, 2027, 2028, 2029, 2030];
  const inputs = anios.map(anio => tabla.querySelector(`#${grupo}_${anio}`));

  inputs.forEach(input => {
    input.type = "text";
    input.addEventListener("input", () => {
      const totalPermitido = limpiarNumero(totalInput.value);
      let sumaParcial = 0;

      inputs.forEach(i => {
        if (i !== input) {
          sumaParcial += limpiarNumero(i.value);
        }
      });

      let valorActual = limpiarNumero(input.value);
      let sumaTotal = sumaParcial + valorActual;

      if (sumaTotal > totalPermitido) {
        const maxDisponible = totalPermitido - sumaParcial;
        valorActual = maxDisponible >= 0 ? maxDisponible : 0;

        input.value = valorActual ? formatearConComas(valorActual) : '';
        mostrarAlerta(`La suma total de ${grupo} no puede superar ${formatearConComas(totalPermitido)}.`);

      } else {
        input.value = valorActual ? formatearConComas(valorActual) : '';
      }

      actualizarTotalesF15();
    });
  });
}

function recolectarDatosF15() {
  const tabla = document.getElementById("tabla-formato-15");
  const filas = tabla.querySelectorAll("tbody tr");
  const datos = [];

  filas.forEach(fila => {
    const celdas = fila.querySelectorAll("td");
    const grupoEdadLink = fila.querySelector("a[id='grupo_edad']");
    
    // Determinar el concepto
    let concepto;
    if (grupoEdadLink) {
      // Para fila de grupo de edad, tomar solo el texto del enlace con id="grupo_edad"
      concepto = grupoEdadLink.textContent.trim();
    } else {
      // Para otras filas, mantener lógica original
      const inputOtro = celdas[0].querySelector("input[id^='otro']");
      concepto = inputOtro ? inputOtro.value.trim() : celdas[0].innerText.trim();
    }

    const anios = ["2025", "2026", "2027", "2028", "2029", "2030"];
    const filaDatos = {
      concepto: concepto,
      total: 0,
    };

    // Recolectar valores de inputs para cada año
    anios.forEach((anio, i) => {
      const inputValor = celdas[i + 2].querySelector("input").value;
      filaDatos[anio] = limpiarNumero(inputValor);
    });

    // Calcular el total
    if (grupoEdadLink) {
      // Para grupo de edad, tomar el valor específico del input total
      const totalInput = celdas[1].querySelector("input").value;
      filaDatos.total = limpiarNumero(totalInput);
    } else {
      // Para otras filas, sumar los valores de los años
      filaDatos.total = anios.reduce((sum, anio) => sum + (filaDatos[anio] || 0), 0);
    }

    datos.push(filaDatos);
  });

  return { data: datos };
}
const clavesEstandar = [
  "total",
  "hombres",
  "mujeres",
  "hablantes_de_lengua_índigena",
  "grupo_de_edad"
];

const dataf15 = document.getElementById('data_f15').textContent;
const limpio = dataf15.replace(/'/g, '"');
const f15json = JSON.parse(limpio);
const clavesRecibidas = Object.keys(f15json.objetivo);

// Filtrar las claves extra (no estándar)
const clavesExtra = clavesRecibidas.filter(clave => !clavesEstandar.includes(clave));

// Ejecutar agregarf15() por cada clave extra
clavesExtra.forEach((clave, index) => {
  agregarf15(); // crea la fila y aumenta contadorf15
  llenarFilaExtra(clave, f15json.objetivo[clave], index);
});

function llenarFilaExtra(clave, datos, index) {
  const anios = [2025, 2026, 2027, 2028, 2029, 2030];
  const prefix = `otro_${index}`;

  // Poner el concepto
  const inputConcepto = document.getElementById(`${prefix}_concepto`);
  if (inputConcepto) inputConcepto.value = clave;

  let suma = 0;
  // Poner valores por año y acumular la suma
  anios.forEach(anio => {
    const inputAnio = document.getElementById(`${prefix}_${anio}`);
    if (inputAnio && datos[`anio_${anio}`] !== undefined) {
      const valor = Number(datos[`anio_${anio}`]) || 0;
      inputAnio.value = valor.toLocaleString('en-US');
      suma += valor;
    }
  });

  // Poner la suma total en el input total
  const inputTotal = document.getElementById(`${prefix}_total`);
  if (inputTotal) inputTotal.value = suma.toLocaleString('en-US');
}



/* FORMATO 17 */
document.getElementById("boton-f17").addEventListener("click", agregarFilaFormato17);

function agregarFilaFormato17() {
    const tabla = document.getElementById("tabla-formato-17").getElementsByTagName('tbody')[0];
    const nuevaFila = tabla.rows[0].cloneNode(true); // clona la primera fila

    // Reasigna el evento al botón de eliminar
    const btnEliminar = nuevaFila.querySelector("button.eliminar-f17");
    if (btnEliminar) {
      btnEliminar.addEventListener("click", eliminarFilaF17);
    }
    const inputs = nuevaFila.querySelectorAll('input');
    inputs.forEach(input => {
      input.value = '';
        input.addEventListener("input", function () {
          let raw = input.value.replace(/,/g, '').replace(/\D/g, '');
          input.value = raw ? Number(raw).toLocaleString('en-US') : '';
      })
    })

    tabla.appendChild(nuevaFila);
;
};

function eliminarFilaF17(event){
  const fila = event.target.closest("tr");
  const tbody = fila.parentElement;

  // No permitir eliminar la primera fila
  if (fila === tbody.rows[0]) {
    alert("No puedes eliminar la primera fila.");
    return;
  }

  fila.remove();
};

function recolectarDatosF17() {
  const filas = document.querySelectorAll("#tabla-formato-17 tbody tr");
  const datos = [];

  filas.forEach(fila => {
    const fuenteSelect = fila.querySelector("select[name='ff-select']");
    const id_ff = fuenteSelect ? parseInt(fuenteSelect.value) : null;

    const anios = [2025, 2026, 2027, 2028, 2029, 2030];
    const valores = {};

    anios.forEach(anio => {
      const input = fila.querySelector(`input[id='${anio}']`);
      valores[anio] = input ? parseFloat(limpiarNumero(input.value)) || 0 : 0;
    });

    datos.push({
      id_ff: id_ff,
      valores: valores
    });
  });

  return { data: datos };
}

document.addEventListener("DOMContentLoaded", function () {
  if (typeof formato17 !== "undefined" && Object.keys(formato17).length > 0) {
    const tabla = document.getElementById("tabla-formato-17").getElementsByTagName('tbody')[0];
    const filaBase = tabla.rows[0];

    let index = 0;
    for (const key in formato17) {
        if (!formato17.hasOwnProperty(key)) continue;

        const registro = formato17[key];
        let fila;

        // Primera fila es la estática
        if (index === 0) {
            fila = filaBase;
        } else {
            fila = filaBase.cloneNode(true);
            tabla.appendChild(fila);

            const btnEliminar = fila.querySelector("button.eliminar-f17");
            if (btnEliminar) btnEliminar.addEventListener("click", eliminarFilaF17);
        }

        // Asignar valor al select (nombre_ff contiene el id_ff)
        const select = fila.querySelector('select[name="ff-select"]');
        if (select) {
            select.value = registro.nombre_ff.toString();
        }

        // Rellenar inputs con los presupuestos por año
        const anios = ['2025', '2026', '2027', '2028', '2029', '2030'];
        anios.forEach(anio => {
            const input = fila.querySelector(`input[id="${anio}"]`);
            if (input) {
                input.value = Number(registro[anio] || 0);
            }
        });

        index++;
    }
  }
});
