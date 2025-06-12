// static/js/ajax.js
/**
 * Función genérica para enviar datos via AJAX
 * @param {string} url - URL del endpoint
 * @param {string} method - Método HTTP (POST, GET, etc.)
 * @param {Object} data - Datos a enviar
 * @param {function} successCallback - Función a ejecutar en éxito
 * @param {function} errorCallback - Función a ejecutar en error
 */

async function sendAjaxRequest(url, method, data, isFormData = false) {
    const config = {
        method: method,
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'X-Requested-With': 'XMLHttpRequest'
        }
    };
    
    if (isFormData) {
        config.body = data;
    } else {
        config.body = JSON.stringify(data);
        config.headers['Content-Type'] = 'application/json';
    }
    
    try {
        const response = await fetch(url, config);
        const responseData = await response.json();
        
        if (!response.ok) {
            throw new Error(responseData.error || `Error HTTP: ${response.status}`);
        }
        
        return responseData;
    } catch (error) {
        console.error('Error en sendAjaxRequest:', error);
        throw error;
    }
}

/*Función para obtener cookies*/
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
function getCSRFToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

/* GUARDAR ARBOL DE OBJETIVOS */
async function guardarArbolObjetivos() {
    const btn = document.getElementById('guardar_detalles_arbol_obj');
    if (!btn) {
        console.error('Botón guardar_detalles_arbol_obj no encontrado');
        return;
    }

    try {
        // Mostrar estado de carga
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        btn.disabled = true;

        // 1. Generar datos del árbol
        const datosArbol = generarEstructuraJerarquicaAO();
        console.log('Datos generados:', datosArbol);

        // 2. Preparar payload similar a tu ejemplo
        const payload = {
            action: 'guardar_arbol_objetivos',
            ...datosArbol,
            id_pp: window.location.pathname.split('/')[2] // Extraer ID de la URL
        };

        // 3. Enviar petición POST
        const response = await fetch('', {  // URL vacía para enviar a la misma vista
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        // 6. Mostrar resultado
        alert(result.message || 'Árbol de objetivos guardado correctamente');
        

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    } finally {
        // Restaurar estado del botón
        btn.innerHTML = 'Guardar';
        btn.disabled = false;
    }
}
// Asignar el evento al botón
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('');
    if (btn) {
        btn.addEventListener('click', guardarArbolObjetivos);
    } else {
        console.error('No se encontró el botón de guardado');
    }
});

/* GUARDAR POBLACION OBJETIVO */
document.addEventListener('DOMContentLoaded', function () {
    const btnGuardar = document.getElementById('guardar_poblacion_objetivo');
    if (btnGuardar) {
        btnGuardar.addEventListener('click', function () {
            console.log("click")
            const tipos = ['referencia', 'potencial', 'objetivo', 'postergada'];
            const data = { action: 'guardar_poblacion_objetivo' };

            tipos.forEach(tipo => {
                data[`descripcion_${tipo}`] = document.querySelector(`[name="descripcion_${tipo}"]`).value;
                data[`hombres_${tipo}`] = limpiarNumero(document.querySelector(`[name="hombres_${tipo}"]`).value);
                data[`mujeres_${tipo}`] = limpiarNumero(document.querySelector(`[name="mujeres_${tipo}"]`).value);
                data[`hablantes_${tipo}`] = limpiarNumero(document.querySelector(`[name="hablantes_${tipo}"]`).value);
                data[`grupos_edad_${tipo}`] = document.querySelector(`[name="grupos_edad_${tipo}"]`).value;
                data[`otros_${tipo}`] = document.querySelector(`[name="otros_${tipo}"]`).value;
                data[`cuanti_${tipo}`] = document.querySelector(`[name="cuanti_${tipo}"]`).value;
                data[`medios_${tipo}`] = document.querySelector(`[name="medios_${tipo}"]`).value;
            });
            console.log(data)
            fetch(window.location.href, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.status === 'ok') {
                    alert('Población objetivo guardada correctamente');
                } else {
                    alert('Error: ' + (result.message || 'Ocurrió un problema.'));
                }
            })
            .catch(error => {
                console.error('Error en AJAX:', error);
            });

        });
    }
});
/* GUARDAR ALINEACION AL PLAN */
document.addEventListener('DOMContentLoaded', function() {
    const guardarBtn = document.getElementById('guardar_aped');

    if (guardarBtn) {
        guardarBtn.addEventListener('click', function (event) {
            event.preventDefault();
            aped =estructuraAPED();

            const payload = {
                action: 'guardar_aped',
                ...aped,
                id_pp: window.location.pathname.split('/')[2]
            };

            sendAjaxRequest(window.location.href, 'POST', payload)
                .then(response => {
                    alert(response.message || 'Datos guardados exitosamente');
                })
                .catch(error => {
                    console.error(error);
                    alert('Ocurrió un error al guardar los datos');
                });
        });
    }
});

/* GUARDAR BIENES Y SERVICIOS */
document.addEventListener('DOMContentLoaded', function (){
    const btnGuardarBys = document.getElementById('guardar_bys');
    if (btnGuardarBys){
        btnGuardarBys.addEventListener('click', function(){
            const contenedores = document.querySelectorAll("#contenedores-bys > .card");
            const bienesServicios = [];

            contenedores.forEach((contenedor) => {
            const bienInput = contenedor.querySelector(`[name^="bien_"]`);
            const descripcionInput = contenedor.querySelector(`[name^="descr_"]`);
            const criticidadInput = contenedor.querySelector(`[name^="critcalidad_"]`);
            const criterioInput = contenedor.querySelector(`[name^="criteo_"]`);

            if (bienInput && descripcionInput && criticidadInput && criterioInput) {
                bienesServicios.push({
                    bien: bienInput.value,
                    descripcion: descripcionInput.value,
                    criticidad: criticidadInput.value,
                    criterio: criterioInput.value
                });
            }
        });
        console.log("este debe ser el json: ",bienesServicios)
             const data = {
                action: 'guardar_bienes_servicios',  // Asegúrate de que esto coincida con tu lógica en views.py
                bienes_servicios: bienesServicios
            };
        console.log("este debe ser el json ya como data: ", data)
        
            // Si no hay datos para guardar, muestra un mensaje al usuario
            if (bienesServicios.length === 0) {
                alert('No hay datos para guardar.');
                return; // Detenemos la ejecución si no hay datos.
            }

            fetch(window.location.href, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': getCSRFToken()
                    
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.status === 'success') {
                    alert('Bienes y Servicios guardados correctamente');
                } else {
                    alert('Error: ' + (result.message || 'Ocurrió un problema.'));
                }
            })
            .catch(error => {
                console.error('Error en AJAX:', error);
            });
            
        });
    }
});

/* GUARDAR MIR */
let mirGuardada = datosMIR && Object.keys(datosMIR).length > 0;

async function guardarMIR() {
    const btn = document.getElementById('guardar_mir');

    try {
        // Mostrar estado de carga
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        btn.disabled = true;

        const fin= obtenerEstructuraFin();
        const proposito = obtenerEstructuraProposito();
        const componente = generarEstructuraCompleta();

        const datamir= {fin, proposito, componente};
        console.log('Datos generados:', datamir);

        // 2. Preparar payload similar a tu ejemplo
        const payload = {
            action: 'guardar_mir',
            ...datamir,
            id_pp: window.location.pathname.split('/')[2] // Extraer ID de la URL
        };

        // 3. Enviar petición POST
        const response = await fetch('', {  // URL vacía para enviar a la misma vista
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        // 6. Mostrar resultado
        mirGuardada = true; 

        await guardarFichasSilencioso();

        alert(result.message || 'MIR guardada correctamente');
        

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    } finally {
        // Restaurar estado del botón
        btn.innerHTML = 'Guardar';
        btn.disabled = false;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('guardar_mir');
    if (btn) {
        btn.addEventListener('click', guardarMIR);
    } else {
        console.error('No se encontró boton de guardar mir');
    }
});

/* GUARDAR FICHA FIN */
async function guardarFichaFin() {
    //Primero verificar si la MIR ya esta guardada
    if (!mirGuardada) {                      // ← comprobación en tiempo real
        alert('Primero debe guardar la MIR');
        return;
    } 

    //guardar la MIR al mismo tiempo que se guardan las fichas
    const confirmacion = confirm("Al guardar tus fichas, guardaras el estado actual de la MIR, por el cambio de medios de verificación")
    if (!confirmacion) return;
    try {
        await guardarMIR(); 
    } catch (err) {
        alert("No se pudo guardar la MIR. No se guardará la Ficha Fin.");
        return;
    }

    //Empieza función de guardado de datos
    const btn = document.getElementById('guardar_ff');

    try {
        // Mostrar estado de carga
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        btn.disabled = true;

        // 1. Generar datos del árbol
        const FichaFin= ffin();
        console.log('Datos generados:', FichaFin);

        // 2. Preparar payload similar a tu ejemplo
        const payload = {
            action: 'guardar_ficha_fin',
            ...FichaFin,
            id_pp: window.location.pathname.split('/')[2] // Extraer ID de la URL
        };

        // 3. Enviar petición POST
        const response = await fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // Si status es 500 o algo distinto de 2xx
            const text = await response.text();  // Por si no es JSON
            console.error('Error del servidor:', text);
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message || 'Ficha de Fin guardada correctamente');
        

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    } finally {
        // Restaurar estado del botón
        btn.innerHTML = 'Guardar';
        btn.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('guardar_ff');
    if (btn) {
        btn.addEventListener('click', guardarFichaFin); 
    }else {
        console.error('No se encontró boton de guardar mir');
    }
});

/* GUARDAR FICHA PROPOSITO */
async function guardarFichaProposito() {
     if (!mirGuardada) {                      // ← comprobación en tiempo real
        alert('Primero debe guardar la MIR');
        return;
    } 
    const confirmacion = confirm("Al guardar tus fichas, guardaras el estado actual de la MIR, por el cambio de medios de verificación")
    if (!confirmacion) return;

    try {
        await guardarMIR();  // <-- aquí se vuelve a guardar la MIR incluso si ya se había guardado
    } catch (err) {
        alert("No se pudo guardar la MIR. No se guardará la Ficha Fin.");
        return;
    }
     
    const btn = document.getElementById('guardar_fp');

    try {
        // Mostrar estado de carga
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        btn.disabled = true;

        // 1. Generar datos del árbol
        const FichaProposito= fichaProposito();
        console.log('Datos generados:', FichaProposito);

        // 2. Preparar payload similar a tu ejemplo
        const payload = {
            action: 'guardar_ficha_proposito',
            ...FichaProposito,
            id_pp: window.location.pathname.split('/')[2] // Extraer ID de la URL
        };

        // 3. Enviar petición POST
        const response = await fetch('', {  // URL vacía para enviar a la misma vista
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        // 6. Mostrar resultado
        alert(result.message || 'Fichas Própositos guardadas correctamente');
        

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    } finally {
        // Restaurar estado del botón
        btn.innerHTML = 'Guardar';
        btn.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('guardar_fp');
    if (btn) {
        btn.addEventListener('click', guardarFichaProposito); 
    }else {
        console.error('No se encontró boton de guardar FP');
    }
});

/* GUARDAR FICHAS COMPONENTE */
async function guardarFichaComp() {
    //Primero verificar si la MIR ya esta guardada
    if (!mirGuardada) {                      // ← comprobación en tiempo real
        alert('Primero debe guardar la MIR');
        return;
    } 

    //guardar la MIR al mismo tiempo que se guardan las fichas
    const confirmacion = confirm("Al guardar tus fichas, guardaras el estado actual de la MIR, por el cambio de medios de verificación")
    if (!confirmacion) return;
    try {
        await guardarMIR(); 
    } catch (err) {
        alert("No se pudo guardar la MIR. No se guardarán las fichas componente.");
        return;
    }

    //Empieza función de guardado de datos
    const btn = document.getElementById('guardar_fc');

    try {
        // Mostrar estado de carga
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        btn.disabled = true;

        // 1. Generar datos del árbol
        const FichaComp= fichaComponente() ;
        console.log('Datos generados:', FichaComp);

        // 2. Preparar payload similar a tu ejemplo
        const payload = {
            action: 'guardar_ficha_componente',
            ...FichaComp,
            id_pp: window.location.pathname.split('/')[2] // Extraer ID de la URL
        };

        // 3. Enviar petición POST
        const response = await fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // Si status es 500 o algo distinto de 2xx
            const text = await response.text();  // Por si no es JSON
            console.error('Error del servidor:', text);
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message || 'Fichas de componente guardadas correctamente');
        

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    } finally {
        // Restaurar estado del botón
        btn.innerHTML = 'Guardar';
        btn.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('guardar_fc');
    if (btn) {
        btn.addEventListener('click', guardarFichaComp); 
    }else {
        console.error('No se encontró boton de guardar FICHA C');
    }
});

/* GUARDAR FICHAS ACTIVIDAD */
async function guardarFichaAct() {
    //Primero verificar si la MIR ya esta guardada
    if (!mirGuardada) {                      // ← comprobación en tiempo real
        alert('Primero debe guardar la MIR');
        return;
    } 

    //guardar la MIR al mismo tiempo que se guardan las fichas
    const confirmacion = confirm("Al guardar tus fichas, guardaras el estado actual de la MIR, por el cambio de medios de verificación")
    if (!confirmacion) return;
    try {
        await guardarMIR(); 
    } catch (err) {
        alert("No se pudo guardar la MIR. No se guardarán las fichas actividad.");
        return;
    }

    //Empieza función de guardado de datos
    const btn = document.getElementById('guardar_fa');

    try {
        // Mostrar estado de carga
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        btn.disabled = true;

        // 1. Generar datos del árbol
        const FichaAct= fichasActividad()  ;
        console.log('Datos generados:', FichaAct);

        // 2. Preparar payload similar a tu ejemplo
        const payload = {
            action: 'guardar_ficha_actividad',
            ...FichaAct,
            id_pp: window.location.pathname.split('/')[2] // Extraer ID de la URL
        };

        // 3. Enviar petición POST
        const response = await fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // Si status es 500 o algo distinto de 2xx
            const text = await response.text();  // Por si no es JSON
            console.error('Error del servidor:', text);
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message || 'Fichas de actividad guardadas correctamente');
        

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    } finally {
        // Restaurar estado del botón
        btn.innerHTML = 'Guardar';
        btn.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('guardar_fa');
    if (btn) {
        btn.addEventListener('click', guardarFichaAct); 
    }else {
        console.error('No se encontró boton de guardar FICHA A');
    }
});

/* GUARDADOS SILENCIOSOS */
/* Versión silenciosa para guardar ficha Fin */
async function guardarFichaFinSilenciosa() {
    const FichaFin = ffin();

    const payload = {
        action: 'guardar_ficha_fin',
        ...FichaFin,
        id_pp: window.location.pathname.split('/')[2]
    };

    const response = await fetch('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error servidor ficha fin: ${response.status} - ${text}`);
    }

    return await response.json();
}

/* Versión silenciosa para guardar ficha Propósito */
async function guardarFichaPropositoSilenciosa() {
    const FichaProposito = fichaProposito();

    const payload = {
        action: 'guardar_ficha_proposito',
        ...FichaProposito,
        id_pp: window.location.pathname.split('/')[2]
    };

    const response = await fetch('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error servidor ficha propósito: ${response.status} - ${text}`);
    }

    return await response.json();
}

/* Versión silenciosa para guardar ficha Componente */
async function guardarFichaComponenteSilenciosa() {
    const FichaComp = fichaComponente();

    const payload = {
        action: 'guardar_ficha_componente',
        ...FichaComp,
        id_pp: window.location.pathname.split('/')[2]
    };

    const response = await fetch('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error servidor ficha componente: ${response.status} - ${text}`);
    }

    return await response.json();
}

/* Versión silenciosa para guardar ficha Actividad */
async function guardarFichaActividadSilenciosa() {
    const FichaAct = fichasActividad();

    const payload = {
        action: 'guardar_ficha_actividad',
        ...FichaAct,
        id_pp: window.location.pathname.split('/')[2]
    };

    const response = await fetch('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error servidor ficha actividad: ${response.status} - ${text}`);
    }

    return await response.json();
}
async function guardarFichasSilencioso() {
    // Guarda todas las fichas sin alertas ni confirmaciones
    try {
        // Las funciones guardarFichaXX actuales usan alert y confirm.
        // Crea versiones "silenciosas" que no muestren alert ni modifiquen botones,
        // por ejemplo: guardarFichaFinSilencioso, guardarFichaPropositoSilencioso, etc.

        await Promise.all([
            guardarFichaFinSilenciosa(),
            guardarFichaPropositoSilenciosa(),
            guardarFichaComponenteSilenciosa(),
            guardarFichaActividadSilenciosa()
        ]);
        console.log('Fichas guardadas silenciosamente');

    } catch (error) {
        console.error('Error guardando fichas silenciosamente:', error);
        // Aquí podrías decidir si quieres informar algo al usuario o no
    }
}
/* GUARDAR FORMATO 1 */
async function guardarFormatoUno() {
    //Empieza función de guardado de datos
    const btn = document.getElementById('guardar_formato_uno');

    try {
        // Mostrar estado de carga
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        btn.disabled = true;

        // 1. Generar datos del árbol
        const formatoUno= recolectarFormatoUno()  ;
        console.log('Datos generados:', formatoUno);

        // 2. Preparar payload similar a tu ejemplo
        const payload = {
            action: 'guardar_formato_uno',
            ...formatoUno,
            id_pp: window.location.pathname.split('/')[2] // Extraer ID de la URL
        };

        // 3. Enviar petición POST
        const response = await fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // Si status es 500 o algo distinto de 2xx
            const text = await response.text();  // Por si no es JSON
            console.error('Error del servidor:', text);
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message || 'Formato 1 guardado correctamente');
        

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    } finally {
        // Restaurar estado del botón
        btn.innerHTML = 'Guardar';
        btn.disabled = false;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('guardar_formato_uno');
    if (btn) {
        btn.addEventListener('click', guardarFormatoUno); 
    }else {
        console.error('No se encontró boton de guardar F1');
    }
});

/* GUARDAR FORMATO 2 */
async function guardarFormatoDos() {
    //Empieza función de guardado de datos
    const btn = document.getElementById('guardar_formato_dos');

    try {
        // Mostrar estado de carga
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        btn.disabled = true;

        // 1. Generar datos del árbol
        const formatoDos= recolectarFormatoDos()  ;
        console.log('Datos generados:', formatoDos);

        // 2. Preparar payload similar a tu ejemplo
        const payload = {
            action: 'guardar_formato_dos',
            ...formatoDos,
            id_pp: window.location.pathname.split('/')[2] // Extraer ID de la URL
        };

        // 3. Enviar petición POST
        const response = await fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // Si status es 500 o algo distinto de 2xx
            const text = await response.text();  // Por si no es JSON
            console.error('Error del servidor:', text);
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message || 'Formato 2 guardado correctamente wu');
        

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    } finally {
        // Restaurar estado del botón
        btn.innerHTML = 'Guardar';
        btn.disabled = false;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('guardar_formato_dos');
    if (btn) {
        btn.addEventListener('click', guardarFormatoDos); 
    }else {
        console.error('No se encontró boton de guardar F2');
    }
});

/* GUARDAR FORMATO 3 */
async function guardarFormatoTres() {
    //Empieza función de guardado de datos
    const btn = document.getElementById('guardar_formato_tres');

    try {
        // Mostrar estado de carga
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        btn.disabled = true;

        // 1. Generar datos del árbol
        const formatoTres= recolectarFormatoTres()  ;
        console.log('Datos generados:', formatoTres);

        // 2. Preparar payload similar a tu ejemplo
        const payload = {
            action: 'guardar_formato_tres',
            ...formatoTres,
            id_pp: window.location.pathname.split('/')[2] // Extraer ID de la URL
        };

        // 3. Enviar petición POST
        const response = await fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // Si status es 500 o algo distinto de 2xx
            const text = await response.text();  // Por si no es JSON
            console.error('Error del servidor:', text);
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message || 'Formato 3 guardado correctamente');
        

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    } finally {
        // Restaurar estado del botón
        btn.innerHTML = 'Guardar';
        btn.disabled = false;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('guardar_formato_tres');
    if (btn) {
        btn.addEventListener('click', guardarFormatoTres); 
    }else {
        console.error('No se encontró boton de guardar F3');
    }
});

/* GUARDAR FORMATO 4 */
async function guardarFormatoCuatro() {
    //Empieza función de guardado de datos
    const btn = document.getElementById('guardar_formato_cuatro');

    try {
        // Mostrar estado de carga
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        btn.disabled = true;

        // 1. Generar datos del árbol
        const formatoCuatro= recolectarFormatoCuatro()  ;
        console.log('Datos generados:', formatoCuatro);

        // 2. Preparar payload similar a tu ejemplo
        const payload = {
            action: 'guardar_formato_cuatro',
            ...formatoCuatro,
            id_pp: window.location.pathname.split('/')[2] // Extraer ID de la URL
        };

        // 3. Enviar petición POST
        const response = await fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // Si status es 500 o algo distinto de 2xx
            const text = await response.text();  // Por si no es JSON
            console.error('Error del servidor:', text);
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message || 'Formato 4 guardado correctamente');
        

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    } finally {
        // Restaurar estado del botón
        btn.innerHTML = 'Guardar';
        btn.disabled = false;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('guardar_formato_cuatro');
    if (btn) {
        btn.addEventListener('click', guardarFormatoCuatro); 
    }else {
        console.error('No se encontró boton de guardar F4');
    }
});

/* GUARDAR ARBOL PROBLEMAS */
async function guardarAPNuevo() {
    //Empieza función de guardado de datos
    const btn = document.getElementById('guardar_detalles_arbol');

    try {
        // Mostrar estado de carga
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        btn.disabled = true;

        // 1. Generar datos del árbol
        const AP= generarEstructuraDiagramArbol("diagramContainer",instance )  ;
        console.log('Datos generados:', AP);

        const idExtraidoE = document.getElementById('id_numero_pp').textContent;
        console.log("numero id guardado: ", idExtraido)

        // 2. Preparar payload similar a tu ejemplo
        const payload = {
            action: 'guardar_arbol_problemas_nuevo',
            datos_arbol: AP,
            id_pp: idExtraidoE // Extraer ID de la URL
        };

        // 3. Enviar petición POST
        const response = await fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // Si status es 500 o algo distinto de 2xx
            const text = await response.text();  // Por si no es JSON
            console.error('Error del servidor:', text);
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message || 'Árbol de Problemas guardado correctamente');
        

    } catch (error) {
        console.error('Error al guardar: front', error);
        alert('Error al guardar front: ' + error.message);
    } finally {
        // Restaurar estado del botón
        btn.innerHTML = 'Guardar';
        btn.disabled = false;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('guardar_detalles_arbol');
    if (btn) {
        btn.addEventListener('click', guardarAPNuevo); 
    }else {
        console.error('No se encontró boton de guardar F4');
    }
});

/* GUARDAR ARBOL OBJETIVOS */
async function guardarAONuevo() {
    //Empieza función de guardado de datos
    const btn = document.getElementById('guardar_detalles_arbol_obj');

    try {
        // Mostrar estado de carga
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        btn.disabled = true;

        // 1. Generar datos del árbol
        const AO= generarEstructuraDiagramArbol("diagramContainer-ao",instanceAO )  ;
        console.log('Datos generados:', AO);

        // 2. Preparar payload similar a tu ejemplo
        const payload = {
            action: 'guardar_arbol_objetivos_nuevo',
            datos_arbol: AO,
            id_pp: window.location.pathname.split('/')[2] // Extraer ID de la URL
        };

        // 3. Enviar petición POST
        const response = await fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // Si status es 500 o algo distinto de 2xx
            const text = await response.text();  // Por si no es JSON
            console.error('Error del servidor:', text);
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message || 'Árbol de Objetivos guardado correctamente');
        

    } catch (error) {
        console.error('Error al guardar: front', error);
        alert('Error al guardar front: ' + error.message);
    } finally {
        // Restaurar estado del botón
        btn.innerHTML = 'Guardar';
        btn.disabled = false;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('guardar_detalles_arbol_obj');
    if (btn) {
        btn.addEventListener('click', guardarAONuevo); 
    }else {
        console.error('No se encontró boton de guardar AO');
    }
});

/* GUARDAR FORMATO 6 */
async function guardarFormatoSeis() {
    //Empieza función de guardado de datos
    const btn = document.getElementById('guardar_formato_seis');

    try {
        // Mostrar estado de carga
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        btn.disabled = true;

        // 1. Generar datos del árbol
        const formatoSeis= recolectarDatosFormato6() ;
        

        // 2. Preparar payload similar a tu ejemplo
        const payload = {
            action: 'guardar_formato_seis',
            ...formatoSeis,
            id_pp: window.location.pathname.split('/')[2] // Extraer ID de la URL
        };
        console.log('Datos generados:', payload);
        // 3. Enviar petición POST
        const response = await fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // Si status es 500 o algo distinto de 2xx
            const text = await response.text();  // Por si no es JSON
            console.error('Error del servidor:', text);
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message || 'Formato 6 guardado correctamente');
        

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    } finally {
        // Restaurar estado del botón
        btn.innerHTML = 'Guardar';
        btn.disabled = false;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('guardar_formato_seis');
    if (btn) {
        btn.addEventListener('click', guardarFormatoSeis); 
    }else {
        console.error('No se encontró boton de guardar F6');
    }
});

/* GUARDAR FORMATO 9 */
async function guardarFormatoNueve() {
    //Empieza función de guardado de datos
    const btn = document.getElementById('guardar_formato_nueve');

    try {
        // Mostrar estado de carga
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        btn.disabled = true;

        // 1. Generar datos del árbol
        const formatoNueve= recolectarDatosFormato9()  ;
        

        // 2. Preparar payload similar a tu ejemplo
        const payload = {
            action: 'guardar_formato_nueve',
            ...formatoNueve,
            id_pp: window.location.pathname.split('/')[2] // Extraer ID de la URL
        };
        console.log('Datos generados:', payload);
        // 3. Enviar petición POST
        const response = await fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // Si status es 500 o algo distinto de 2xx
            const text = await response.text();  // Por si no es JSON
            console.error('Error del servidor:', text);
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message || 'Formato 9 guardado correctamente');
        

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    } finally {
        // Restaurar estado del botón
        btn.innerHTML = 'Guardar';
        btn.disabled = false;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('guardar_formato_nueve');
    if (btn) {
        btn.addEventListener('click', guardarFormatoNueve); 
    }else {
        console.error('No se encontró boton de guardar F9');
    }
});

/* FORMATO 12*/
async function guardarFormatoDoce() {
    //Empieza función de guardado de datos
    const btn = document.getElementById('guardar_formato_doce');

    try {
        // Mostrar estado de carga
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        btn.disabled = true;

        // 1. Generar datos del árbol
        const formatoDoce= recolectarDatosFormato12()  ;
        

        // 2. Preparar payload similar a tu ejemplo
        const payload = {
            action: 'guardar_formato_doce',
            ...formatoDoce,
            id_pp: window.location.pathname.split('/')[2] // Extraer ID de la URL
        };
        console.log('Datos generados:', payload);
        // 3. Enviar petición POST
        const response = await fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // Si status es 500 o algo distinto de 2xx
            const text = await response.text();  // Por si no es JSON
            console.error('Error del servidor:', text);
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message || 'Formato 12 guardado correctamente');
        

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    } finally {
        // Restaurar estado del botón
        btn.innerHTML = 'Guardar';
        btn.disabled = false;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('guardar_formato_doce');
    if (btn) {
        btn.addEventListener('click', guardarFormatoDoce); 
    }else {
        console.error('No se encontró boton de guardar F12');
    }
});

/* FORMATO 13*/
async function guardarFormatoTrece() {
    //Empieza función de guardado de datos
    const btn = document.getElementById('guardar_formato_trece');

    try {
        // Mostrar estado de carga
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        btn.disabled = true;

        // 1. Generar datos del árbol
        const formatoTrece= recolectarFormato13()  ;
        

        // 2. Preparar payload similar a tu ejemplo
        const payload = {
            action: 'guardar_formato_trece',
            ...formatoTrece,
            id_pp: window.location.pathname.split('/')[2] // Extraer ID de la URL
        };
        console.log('Datos generados:', payload);
        // 3. Enviar petición POST
        const response = await fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // Si status es 500 o algo distinto de 2xx
            const text = await response.text();  // Por si no es JSON
            console.error('Error del servidor:', text);
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message || 'Formato 13 guardado correctamente');
        

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    } finally {
        // Restaurar estado del botón
        btn.innerHTML = 'Guardar formato 13';
        btn.disabled = false;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('guardar_formato_trece');
    if (btn) {
        btn.addEventListener('click', guardarFormatoTrece); 
    }else {
        console.error('No se encontró boton de guardar F13');
    }
});

/* FORMATO 14 */
async function guardarFormato14() {
    //Empieza función de guardado de datos
    const btn = document.getElementById('guardar_formato_catorce');

    try {
        // Mostrar estado de carga
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        btn.disabled = true;

        // 1. Generar datos del árbol
        const formato14= recolectarDatosF14()  ;
        

        // 2. Preparar payload similar a tu ejemplo
        const payload = {
            action: 'guardar_formato_catorce',
            ...formato14,
            id_pp: window.location.pathname.split('/')[2] // Extraer ID de la URL
        };
        console.log('Datos generados:', payload);
        // 3. Enviar petición POST
        const response = await fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // Si status es 500 o algo distinto de 2xx
            const text = await response.text();  // Por si no es JSON
            console.error('Error del servidor:', text);
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message || 'Formato 14 guardado correctamente');
        

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    } finally {
        // Restaurar estado del botón
        btn.innerHTML = 'Guardar formato 14';
        btn.disabled = false;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('guardar_formato_catorce');
    if (btn) {
        btn.addEventListener('click', guardarFormato14); 
    }else {
        console.error('No se encontró boton de guardar F14');
    }
});

/* FORMATO 15 */
async function guardarFormato15() {
    //Empieza función de guardado de datos
    const btn = document.getElementById('guardar_formato_quince');

    try {
        // Mostrar estado de carga
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        btn.disabled = true;

        // 1. Generar datos del árbol
        const formato15= recolectarDatosF15()  ;
        

        // 2. Preparar payload similar a tu ejemplo
        const payload = {
            action: 'guardar_formato_quince',
            ...formato15,
            id_pp: window.location.pathname.split('/')[2] // Extraer ID de la URL
        };
        console.log('Datos generados:', payload);
        // 3. Enviar petición POST
        const response = await fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // Si status es 500 o algo distinto de 2xx
            const text = await response.text();  // Por si no es JSON
            console.error('Error del servidor:', text);
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message || 'Formato 15 guardado correctamente');
        

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    } finally {
        // Restaurar estado del botón
        btn.innerHTML = 'Guardar formato 15';
        btn.disabled = false;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('guardar_formato_quince');
    if (btn) {
        btn.addEventListener('click', guardarFormato15); 
    }else {
        console.error('No se encontró boton de guardar F15');
    }
});

/* FORMATO 16 */
async function guardarFormato16() {
    //Empieza función de guardado de datos
    const btn = document.getElementById('guardar_formato_dieciseis');

    try {
        // Mostrar estado de carga
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        btn.disabled = true;

        // 1. Generar datos del árbol
        const formato16= recolectarDatosF16()  ;
        

        // 2. Preparar payload similar a tu ejemplo
        const payload = {
            action: 'guardar_formato_dieciseis',
            ...formato16,
            id_pp: window.location.pathname.split('/')[2] // Extraer ID de la URL
        };
        console.log('Datos generados:', payload);
        // 3. Enviar petición POST
        const response = await fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // Si status es 500 o algo distinto de 2xx
            const text = await response.text();  // Por si no es JSON
            console.error('Error del servidor:', text);
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message || 'Formato 16 guardado correctamente');
        

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    } finally {
        // Restaurar estado del botón
        btn.innerHTML = 'Guardar formato 16';
        btn.disabled = false;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('guardar_formato_dieciseis');
    if (btn) {
        btn.addEventListener('click', guardarFormato16); 
    }else {
        console.error('No se encontró boton de guardar F16');
    }
});
/* FORMATO 17*/
async function guardarFormato17() {
    //Empieza función de guardado de datos
    const btn = document.getElementById('guardar_formato_17');

    try {
        // Mostrar estado de carga
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        btn.disabled = true;

        // 1. Generar datos del árbol
        const formato17= recolectarDatosF17()  ;
        

        // 2. Preparar payload similar a tu ejemplo
        const payload = {
            action: 'guardar_formato_dieciciete',
            ...formato17,
            id_pp: window.location.pathname.split('/')[2] // Extraer ID de la URL
        };
        console.log('Datos generados:', payload);
        // 3. Enviar petición POST
        const response = await fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // Si status es 500 o algo distinto de 2xx
            const text = await response.text();  // Por si no es JSON
            console.error('Error del servidor:', text);
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message || 'Formato 17 guardado correctamente');
        

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar: ' + error.message);
    } finally {
        // Restaurar estado del botón
        btn.innerHTML = 'Guardar formato 17';
        btn.disabled = false;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('guardar_formato_17');
    if (btn) {
        btn.addEventListener('click', guardarFormato17); 
    }else {
        console.error('No se encontró boton de guardar F17');
    }
});

