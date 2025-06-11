const idExtraido = document.getElementById('id_numero_pp').textContent;
/* ARBOL DE PROBLEMAS POR HACER */
const containerdad = document.getElementById('container');
const container = document.getElementById("diagramContainer");
const resetBtn = document.getElementById('reset-btn');
const zoomInBtn = document.getElementById("zoom-in");
const zoomOutBtn = document.getElementById("zoom-out");
const zoomStep = 0.9;
let isPanning = false;
let startX, startY, scrollLeft, scrollTop;
let offsetX = -2890, offsetY = 0;
let scale = 1;
const canvasWidth = 20000;
const canvasHeight = 20000;
container.style.transform = `translate(${offsetX}px, ${offsetY}px )`;
function applyTransform() {
  container.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
}
function clampOffsets() {
  const viewWidth = container.clientWidth;
  const viewHeight = container.clientHeight;
  const maxOffsetX = 0;
  const minOffsetX = viewWidth - canvasWidth * scale;
  const maxOffsetY = 0;
  const minOffsetY = viewHeight - canvasHeight * scale;
  offsetX = Math.min(maxOffsetX, Math.max(minOffsetX, offsetX));
  offsetY = Math.min(maxOffsetY, Math.max(minOffsetY, offsetY));
}
containerdad.addEventListener("mousedown", (e) => {
  if (e.target.tagName === "TEXTAREA") return;
  
  isPanning = true;
  startX = e.clientX;
  startY = e.clientY;
  containerdad.style.cursor = "grabbing";
});
window.addEventListener("mousemove", (e) => {
  if (!isPanning) return;
  offsetX += (e.clientX - startX);
  offsetY += (e.clientY - startY);
  startX = e.clientX;
  startY = e.clientY;
  clampOffsets();
  applyTransform();
});
window.addEventListener("mouseup", () => {
  isPanning = false;
  containerdad.style.cursor = "grab";
});
//Botón de zoom
function zoom(centerX, centerY, factor) {
const prevScale = scale;
scale *= factor;
offsetX -= (centerX / prevScale - centerX / scale);
offsetY -= (centerY / prevScale - centerY / scale);
applyTransform();
}
zoomInBtn.addEventListener("click", () => {
  const rect = containerdad.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  zoom(centerX, centerY, zoomStep);
});
zoomOutBtn.addEventListener("click", () => {
  const rect = containerdad.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  zoom(centerX, centerY, 1 / zoomStep);
});
// Botón de reset
resetBtn.addEventListener('click', () => {
  console.log("si hubo click")
  offsetX = -2890;
  offsetY = 0;
  scale = 1;
  applyTransform();
});

let instance
jsPlumb.ready(function () {
 instance = jsPlumb.getInstance({
  container: container,
  elementsDraggable: true,
  dragOptions: { cursor: 'pointer', zIndex: 2000 }
});
 // Modificar las opciones por defecto de jsPlumb
 instance.importDefaults({
   connector: ["Flowchart"],
   paintStyle: { stroke: "black", strokeWidth: 4 },
   connectionOverlays: [
     ["Arrow", {
       width: 10,
       length: 10,
       location: 1,
       direction: 1,
       foldback: 0.8
     }]
   ],
  ConnectionsDetachable: false,
  ReattachConnections: true
 });
 // Este evento también está modificando el grosor de la línea cuando se crea una conexión
 instance.bind("connection", function (info) {
   info.connection.setConnector(["Flowchart"]);
   info.connection.setPaintStyle({ stroke: "black", strokeWidth: 4 }); // Ajusta el grosor aquí
   info.connection.addOverlay([
     "Arrow", {
       width: 10,
       length: 10,
       location: 1,
       direction: 1,
       foldback: 0.8
     }
   ]);
 });
  let contadorCI =1;
  let contadorCD =1;
  let contadorPC =1;
  let contadorED =1;
  let contadorEI =1;
  let contadorES =1;
 function createNode(type, topOffset = 0, leftOffset ="42%", idNodo=null, id_html) {
    if (id_html === null) {
    switch (type) {
      case "causa_indirecta":
        id_html = `${type}_${contadorCD}_nodo_pp_${idExtraido}`;
        contadorCD++;
        break;
      case "causa_directa":
        id_html = `${type}_${contadorCI}_nodo_pp_${idExtraido}`;
        contadorCI++;
        break;
      case "problema_central":
        id_html = `${type}_${contadorPC}_nodo_pp_${idExtraido}`;
        contadorPC++;
        break;
      case "efecto_directo":
        id_html = `${type}_${contadorED}_nodo_pp_${idExtraido}`;
        contadorED++;
        break;
      case "efecto_indirecto":
        id_html = `${type}_${contadorEI}_nodo_pp_${idExtraido}`;
        contadorEI++;
        break;
      case "efecto_superior":
        id_html = `${type}_${contadorES}_nodo_pp_${idExtraido}`;
        contadorES++;
        break;
      default:
        console.warn("Tipo de nodo desconocido:", type);
        id_html = `nodo_${type}_0`;
    };
  };
   const id = id_html;
   const node = document.createElement("div");
   node.classList.add("node");
   node.id = id;
   node.style.position = "absolute";
   node.style.top = topOffset + "px";
   node.style.left = leftOffset;
   node.setAttribute("data-type", type);
   node.setAttribute("data-id-nodo", idNodo);
   node.innerHTML = `
     <h6 style="text-align:center; background-color:gray; border-radius: .25rem;"><strong>${type.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}</strong></h6>
     <textarea placeholder="Escribe el contenido..."></textarea>
     <button type="button" class="btn-close btn-close-red" onclick="deleteNode('${id}')"></button>
   `;
   container.appendChild(node, {
    containment: "parent"  // evita que el nodo se salga del container
  });
   setTimeout(() => {
   instance.draggable(node);
   // Estilo de los endpoints (invisibles por defecto)
   const commonEndpointConfig = {
     endpoint: "Dot",
     cssClass: "endpoint-cursor",
     paintStyle: { fill: "black", radius: 4 },
     isSource: true,
     isTarget: true,
     maxConnections: -1,
     connector: ["Flowchart"],
     connectorStyle: { stroke: "black", strokeWidth: 4 },
     connectorOverlays: [
       ["Arrow", { width: 10, length: 10, location: 1 }]
     ],
     hoverPaintStyle: { fill: "red", stroke: "red" }, // Cambia el color cuando el mouse está sobre el endpoint
     // Este estilo hace que los puntos sean invisibles pero aún interactivos
     paintStyle: { fill: "transparent", radius: 4 }
   };
   // Agregar los endpoints al nodo
   const topEndpoint = instance.addEndpoint(node, { anchor: "Top" }, commonEndpointConfig);
   const bottomEndpoint = instance.addEndpoint(node, { anchor: "Bottom" }, commonEndpointConfig);
   const leftEndpoint = instance.addEndpoint(node, { anchor: "Left" }, commonEndpointConfig);
   const rightEndpoint = instance.addEndpoint(node, { anchor: "Right" }, commonEndpointConfig);
   // Cuando el nodo recibe hover, hacemos los endpoints visibles
   node.addEventListener('mouseenter', function () {
     topEndpoint.setPaintStyle({ fill: "black", radius: 4 });
     bottomEndpoint.setPaintStyle({ fill: "black", radius: 4 });
     leftEndpoint.setPaintStyle({ fill: "black", radius: 4});
     rightEndpoint.setPaintStyle({ fill: "black", radius: 4 });
   });
   // Cuando el mouse sale del nodo, los endpoints se vuelven invisibles nuevamente
   node.addEventListener('mouseleave', function () {
     topEndpoint.setPaintStyle({ fill: "transparent", radius: 4 });
     bottomEndpoint.setPaintStyle({ fill: "transparent", radius: 4 });
     leftEndpoint.setPaintStyle({ fill: "transparent", radius: 4 });
     rightEndpoint.setPaintStyle({ fill: "transparent", radius: 4 });
   });
   // Revalidar después del render inicial
    instance.revalidate(node);

    // Observar cambios de tamaño
    const resizeObserver = new ResizeObserver(() => {
      instance.revalidate(node);
    });
    resizeObserver.observe(node); },0);
   return {
     id,
     el: node
    
   };
 }


 // Función para eliminar una conexión
 instance.bind("click", function (conn, originalEvent) {
   if (confirm("¿Quieres eliminar esta conexión?")) {
     instance.deleteConnection(conn);
   }
 });
 // Función para eliminar un nodo específico
 window.deleteNode = function(id) {
   const node = document.getElementById(id);
   
   if (!node) return; // Si el nodo no existe, salir
   
   const nodeType = node.getAttribute("data-type");
   
   // Verificar si el nodo es de un tipo protegido
   if (nodeType === "problema_central" || nodeType === "efecto_superior") {
     alert("⚠️ Este nodo no puede eliminarse: " + nodeType);
     return; // No continuar con la eliminación
   }
   
   // Si no es un nodo protegido, eliminarlo
   instance.remove(node); // Eliminar conexiones
   node.remove(); // Eliminar nodo del DOM
 };
 //creación del template
  var form = document.getElementById('form-AP-done');
  if (!form){createNode("efecto_superior", 100, "42%", null, null);
  createNode("problema_central", 500, "42%", null, null);
  }
  
 // Funciones para agregar nodos de cada tipo
 document.getElementById("add-causa-directa").onclick = () => createNode("causa_directa",700, "42%",null,null);
 document.getElementById("add-causes-indirectas").onclick = () => createNode("causa_indirecta",800, "42%",null,null);
 document.getElementById("add-efecto-directo").onclick = () => createNode("efecto_directo",300, "42%",null,null);
 document.getElementById("add-efecto-indirecto").onclick = () => createNode("efecto_indirecto",200, "42%",null,null);


 /* ARBOL DE PROBLEMAS YA HECHO */

document.getElementById('visulizar-diag').addEventListener('click', function() {
  const contenedor = document.getElementById('hidder-uno');
  contenedor.classList.add('no-hidder')
  contenedor.classList.remove('hidder')

  requestAnimationFrame(() => {
    // Obtener datos
    var data = JSON.parse(document.getElementById('problemas-data').textContent);
    console.log(data)
    const container = document.getElementById("diagramContainer");

    var nodos = data.nodos || [];
    var conexiones = data.conexiones || [];

    //crear los nodos
    nodos.forEach(function(nodo) {
      // Crear el nodo según su tipo
      let tipo;
      switch (nodo.tipo) {  
        case 1:
          tipo = "causa_indirecta";
          break;
        case 2:
          tipo = "causa_directa";
          break;
        case 3:
          tipo = "problema_central";
          break;
        case 4:
          tipo = "efecto_directo";
          break;
        case 5:
          tipo = "efecto_indirecto";
          break;
        default:
          tipo = "efecto_superior";
      };

      leftOffset = nodo.posicion_x + "px";

      var nuevoNodo = createNode(tipo, nodo.posicion_y, leftOffset, nodo.id_nodo, nodo.id_html);
      
      // Establecer texto y ID del nodo
      const textarea = nuevoNodo.el.querySelector('textarea');
      
      if (textarea) {
        textarea.value = nodo.texto || '';
      }
      const match = nodo.id_html.match(/^([a-zA-Z_]+)_(\d+)/);
      const numero = parseInt(match[2]);
      //actualizar contador para el nuevo agregar mas
       switch (tipo) {
        case "causa_indirecta":
          if (numero >= contadorCD) contadorCD = numero + 1;
          break;
        case "causa_directa":
          if (numero >= contadorCI) contadorCI = numero + 1;
          break;
        case "problema_central":
          if (numero >= contadorPC) contadorPC = numero + 1;
          break;
        case "efecto_directo":
          if (numero >= contadorED) contadorED = numero + 1;
          break;
        case "efecto_indirecto":
          if (numero >= contadorEI) contadorEI = numero + 1;
          break;
        case "efecto_superior":
          if (numero >= contadorES) contadorES = numero + 1;
          break;
      }

    });

    function connectNodes(origenHtml, destinoHtml) {
      const endpointsOrigen = instance.getEndpoints(origenHtml);
      const endpointsDestino = instance.getEndpoints(destinoHtml);

      // Encontrar los endpoints específicos que queremos conectar
      const sourceEndpoint = endpointsOrigen.find(ep => ep.anchor.type === "Top");
      const targetEndpoint = endpointsDestino.find(ep => ep.anchor.type === "Bottom");
      instance.connect({
        source: sourceEndpoint,
        target: targetEndpoint,
        detachable: true,
        reattach: true,
        connector: ["Flowchart"],
        connectorStyle: { stroke: "black", strokeWidth: 2 },
        connectorOverlays: [
            ["Arrow", { width: 10, length: 10, location: 1 }]
        ]
      });
    }

    // Conectar nodos según las conexiones definidas
    conexiones.forEach((con) => {
      const origenHtml = document.querySelector(`[data-id-nodo="${con.origen_id}"]`);
      const destinoHtml = document.querySelector(`[data-id-nodo="${con.destino_id}"]`);

      setTimeout(() => connectNodes(origenHtml, destinoHtml), 50);

    });
    instance.repaintEverything()
    
  });
  });
});

window.addEventListener('resize', () => {
  document.querySelectorAll('.node').forEach(n => instance.revalidate(n));
});


/* ARBOL DE OBJETIVOS */
const containerdad_ao = document.getElementById('container-ao');
const container_ao = document.getElementById("diagramContainer-ao");
const resetBtn_ao = document.getElementById('reset-btn-ao');
const zoomInBtn_ao = document.getElementById("zoom-in-ao");
const zoomOutBtn_ao = document.getElementById("zoom-out-ao");
const zoomStep_ao = 0.9;
let isPanning_ao = false;
let startX_ao, startY_ao, scrollLeft_ao, scrollTop_ao;
let offsetX_ao = -2890, offsetY_ao = 0;
let scale_ao = 1;
const canvasWidth_ao = 20000;
const canvasHeight_ao = 20000;

container_ao.style.transform = `translate(${offsetX_ao}px, ${offsetY_ao}px )`;
function applyTransformAO() {
  container_ao.style.transform = `translate(${offsetX_ao}px, ${offsetY_ao}px) scale(${scale_ao})`;
}
function clampOffsetsAO() {
  const viewWidth = container_ao.clientWidth;
  const viewHeight = container_ao.clientHeight;
  const maxOffsetX = 0;
  const minOffsetX = viewWidth - canvasWidth_ao * scale;
  const maxOffsetY = 0;
  const minOffsetY = viewHeight - canvasHeight * scale;
  offsetX_ao = Math.min(maxOffsetX, Math.max(minOffsetX, offsetX_ao));
  offsetY_ao = Math.min(maxOffsetY, Math.max(minOffsetY, offsetY_ao));
}
containerdad_ao.addEventListener("mousedown", (e) => {
  if (e.target.tagName === "TEXTAREA") return;
  
  isPanning_ao = true;
  startX_ao = e.clientX;
  startY_ao = e.clientY;
  containerdad_ao.style.cursor = "grabbing";
});
window.addEventListener("mousemove", (e) => {
  if (!isPanning_ao) return;
  offsetX_ao += (e.clientX - startX_ao);
  offsetY_ao += (e.clientY - startY_ao);
  startX_ao = e.clientX;
  startY_ao = e.clientY;
  clampOffsetsAO();
  applyTransformAO();
});
window.addEventListener("mouseup", () => {
  isPanning_ao = false;
  containerdad_ao.style.cursor = "grab";
});
//Botón de zoom
function zoomAO(centerX, centerY, factor) {
const prevScale = scale_ao;
scale_ao *= factor;
offsetX_ao -= (centerX / prevScale - centerX / scale_ao);
offsetY_ao -= (centerY / prevScale - centerY / scale_ao);
applyTransformAO();
}
zoomInBtn_ao.addEventListener("click", () => { 
  const rect = containerdad_ao.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  zoomAO(centerX, centerY, zoomStep);
});
zoomOutBtn_ao.addEventListener("click", () => {
  const rect = containerdad_ao.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  zoomAO(centerX, centerY, 1 / zoomStep);
});
// Botón de reset
resetBtn_ao.addEventListener('click', () => {
  console.log("si hubo click")
  offsetX_ao = -2890;
  offsetY_ao = 0;
  scale_ao = 1;
  applyTransformAO();
});

let instanceAO;
jsPlumb.ready(function(){
  instanceAO = jsPlumb.getInstance({
  container: container_ao,
  elementsDraggable: true,
  dragOptions: { cursor: 'pointer', zIndex: 2000 }
});

  // Modificar las opciones por defecto de jsPlumb
 instanceAO.importDefaults({
   connector: ["Flowchart"],
   paintStyle: { stroke: "black", strokeWidth: 4 },
   connectionOverlays: [
     ["Arrow", {
       width: 10,
       length: 10,
       location: 1,
       direction: 1,
       foldback: 0.8
     }]
   ],
  ConnectionsDetachable: false,
  ReattachConnections: true
 });
 // Este evento también está modificando el grosor de la línea cuando se crea una conexión
 instanceAO.bind("connection", function (info) {
   info.connection.setConnector(["Flowchart"]);
   info.connection.setPaintStyle({ stroke: "black", strokeWidth: 4 }); // Ajusta el grosor aquí
   info.connection.addOverlay([
     "Arrow", {
       width: 10,
       length: 10,
       location: 1,
       direction: 1,
       foldback: 0.8
     }
   ]);
 });

//crear nodo
function createNodeAO(type, topOffset = 0, leftOffset, idNodo=null, id_html) {
   const id = id_html;
   const node = document.createElement("div");
   node.classList.add("node");
   node.id = id;
   node.style.position = "absolute";
   node.style.top = topOffset + "px";
   node.style.left = leftOffset;
   node.setAttribute("data-type", type);
   node.setAttribute("data-id-nodo", idNodo);
   node.innerHTML = `
     <h6 style="text-align:center; background-color:gray; border-radius: .25rem;"><strong>${type.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}</strong></h6>
     <textarea placeholder="Escribe el contenido..."></textarea>
     <button type="button" class="btn-close btn-close-red" onclick="deleteNode('${id}')"></button>
   `;
   container_ao.appendChild(node);

  // Esperar un tick del event loop para asegurar renderizado
  setTimeout(() => {
    instanceAO.draggable(node);

    const commonEndpointConfigAO = {
      endpoint: "Dot",
      cssClass: "endpoint-cursor",
      isSource: true,
      isTarget: true,
      maxConnections: -1,
      connector: ["Flowchart"],
      connectorStyle: { stroke: "black", strokeWidth: 4 },
      connectorOverlays: [["Arrow", { width: 10, length: 10, location: 1 }]],
      paintStyle: { fill: "gray", radius: 4, stroke: "gray" }, // Cambiado a visible
      hoverPaintStyle: { fill: "red", stroke: "red", radius: 8 }
    };

    // Agregar endpoints
    const topEndpoint = instanceAO.addEndpoint(node, { anchor: "Top" }, commonEndpointConfigAO);
    const bottomEndpoint = instanceAO.addEndpoint(node, { anchor: "Bottom" }, commonEndpointConfigAO);
    const leftEndpoint = instanceAO.addEndpoint(node, { anchor: "Left" }, commonEndpointConfigAO);
    const rightEndpoint = instanceAO.addEndpoint(node, { anchor: "Right" }, commonEndpointConfigAO);

    // Eventos hover
    node.addEventListener('mouseenter', () => {
      [topEndpoint, bottomEndpoint, leftEndpoint, rightEndpoint].forEach(ep => {
        ep.setPaintStyle({ fill: "black", radius: 4, stroke: "black" });
        ep.setHoverPaintStyle({ fill: "red", radius: 4, stroke: "red" });
      });
    });

    node.addEventListener('mouseleave', () => {
      [topEndpoint, bottomEndpoint, leftEndpoint, rightEndpoint].forEach(ep => {
        ep.setPaintStyle({ fill: "transparent", radius: 4, stroke: "transparent" });
      });
    });

    // Forzar repintado
    instanceAO.revalidate(node);
    instanceAO.repaint(node.id);

    // ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      instanceAO.revalidate(node);
    });
    resizeObserver.observe(node);
  }, 0);

  return { id, el: node };
};

document.getElementById('AO-sug').addEventListener('click', function() {
  generarSugerenciaAO ()
});

function generarSugerenciaAO() {
  // Limpia y resetea completamente
  container_ao.innerHTML = '';
  instanceAO.reset();

  var data = JSON.parse(document.getElementById('objetivos-data').textContent);
  var nodos = data.nodos || [];
  var conexiones = data.conexiones || [];

  // Primero crea todos los nodos con un pequeño retraso entre ellos
  nodos.forEach((nodo, index) => {
    setTimeout(() => {
      let tipo;
      switch(nodo.tipo) {
        case 1: tipo = "medio_indirecto"; break;
        case 2: tipo = "medio_directo"; break;
        case 3: tipo = "solucion_problema"; break;
        case 4: tipo = "fin_directo"; break;
        case 5: tipo = "fin_indirecto"; break;
        default: tipo = "fin_superior";
      }

      const leftOffset = nodo.posicion_x + "px";
      const nuevoNodo = createNodeAO(tipo, nodo.posicion_y, leftOffset, nodo.id_nodo, nodo.id_html);
      
      if (nuevoNodo.el) {
        const textarea = nuevoNodo.el.querySelector('textarea');
        if (textarea) textarea.value = nodo.texto || '';
      }
    }, index * 30); // Pequeño retraso progresivo
  });

  // Luego conecta con mayor retraso
  setTimeout(() => {
    conexiones.forEach((con, idx) => {
      setTimeout(() => {
        // Usa el contenedor específico para AO
        const origenHtml = container_ao.querySelector(`[data-id-nodo="${con.origen_id}"]`);
        const destinoHtml = container_ao.querySelector(`[data-id-nodo="${con.destino_id}"]`);
        
        if (origenHtml && destinoHtml) {
          const endpointsOrigen = instanceAO.getEndpoints(origenHtml);
          const endpointsDestino = instanceAO.getEndpoints(destinoHtml);
          
          if (endpointsOrigen && endpointsDestino) {
            const sourceEndpoint = endpointsOrigen.find(ep => ep.anchor.type === "Top");
            const targetEndpoint = endpointsDestino.find(ep => ep.anchor.type === "Bottom");
            
            if (sourceEndpoint && targetEndpoint) {
              instanceAO.connect({
                source: sourceEndpoint,
                target: targetEndpoint,
                detachable: false,
                connector: ["Flowchart"],
                paintStyle: { stroke: "#4CAF50", strokeWidth: 3 },
                overlays: [["Arrow", { width: 10, length: 10, location: 1 }]]
              });
            }
          }
        }
      }, idx * 50); // Retraso adicional para cada conexión
    });

    // Repintado final
    setTimeout(() => {
      instanceAO.repaintEverything();
    }, conexiones.length * 50 + 200);
  }, nodos.length * 30 + 200);
}

});



/* ESTRUCTURA */
//los parametros me permitiran decidir de que arbol sacar la estructura gracias al id del contenedor y la instancia del jsplumb
function generarEstructuraDiagramArbol(containerId, jsPlumbInstance) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error("Contenedor no encontrado:", containerId);
        return null;
    }

    // Obtener nodos
    const nodos = Array.from(container.getElementsByClassName("node")).map(nodo => {
        const textarea = nodo.querySelector("textarea");
        const tipo = nodo.getAttribute("data-type") || null;
        const texto = textarea ? textarea.value : "";
        const style = window.getComputedStyle(nodo);
        const left = parseInt(style.left) || 0;
        const top = parseInt(style.top) || 0;

        return {
            id_html: nodo.id,
            texto: texto,
            tipo: tipo,
            posicion_x: left,
            posicion_y: top
        };
    });

    // Obtener conexiones activas
    const conexiones = jsPlumbInstance.getAllConnections().map(conn => ({
        origen: conn.sourceId,
        destino: conn.targetId
    }));

    return {
        nodos: nodos,
        conexiones: conexiones
    };
}

