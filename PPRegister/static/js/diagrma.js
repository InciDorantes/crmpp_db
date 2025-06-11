
let instanceAOSafe;
document.getElementById('visualizar-dobj').addEventListener('click', function() {
  requestAnimationFrame(() => {
      // Obtener datos
      const objetivosDataSafe = JSON.parse(document.getElementById('objetivos-data-safe').textContent);
      const container = document.getElementById("diagramObjContainerDone");
      container.innerHTML = '';
      
      // Configuración optimizada de jsPlumb
      instanceAOSafe = jsPlumb.getInstance({ 
          container: container
      });
       instanceAOSafe.importDefaults({
        connector: ["Straight"],
        paintStyle: { stroke: "black", strokeWidth: 5 },
        connectionOverlays: [
          ["Arrow", {
            width: 15,
            length: 15,
            location: 1,
            direction: 1,
            foldback: 0.8
          }]
        ]
      });
      // Este evento también está modificando el grosor de la línea cuando se crea una conexión
    instanceAOSafe.bind("connection", function (info) {
      info.connection.setConnector(["Straight"]);
      info.connection.setPaintStyle({ stroke: "black", strokeWidth: 2 }); // Ajusta el grosor aquí
      info.connection.addOverlay([
        "Arrow", {
          width: 15,
          length: 15,
          location: 1,
          direction: 1,
          foldback: 0.8
        }
      ]);
    });
          // Mapa de nodos y niveles para posicionamiento
      const nodeMap = {};
      const levels = {
          'medio_indirecto': 1000,
          'medio_directo': 800,
          'problema_central': 600,
          'fin_directo': 300,
          'fin_indirecto': 150,
          'fin_superior': 0
      };
      // Función optimizada para crear nodos
      function createNode(type, data, level, horizontalPos) {
          const id = `${type}_${data.id}`;
          const node = document.createElement("div");
          
          // Configuración inicial del nodo
          node.className = "node";
          node.id = id;
          node.dataset.type = type;
          node.dataset.id = data.id;
          node.style.cssText = `
              position: absolute;
              top: ${levels[type]}px;
              left: ${horizontalPos}%;
              min-width: 200px;
              z-index: 10;
          `;
          
          node.innerHTML = `
              <div class="node-header bg-secondary text-white rounded-top text-center p-1">
                  <strong>${type.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}</strong>
              </div>
              <textarea class="w-100 p-1">${data.texto}</textarea>
          `;
          
          container.appendChild(node);
          instanceAOSafe.draggable(id);
          // Estilo de los endpoints (invisibles por defecto)
        const commonEndpointConfig = {
          endpoint: "Dot",
          paintStyle: { fill: "black", radius: 4 },
          isSource: true,
          isTarget: true,
          maxConnections: -1,
          connector: ["Straight"],
          connectorStyle: { stroke: "black", strokeWidth: 2 },
          connectorOverlays: [
            ["Arrow", { width: 15, length: 15, location: 1 }]
          ],
          hoverPaintStyle: { fill: "red", stroke: "red" }
        };
          // Configuración de endpoints después de inserción
          
          const topEndpoint = instanceAOSafe.addEndpoint(node, { anchor: "Top"}, commonEndpointConfig);
          const bottomEndpoint = instanceAOSafe.addEndpoint(node, { anchor: "Bottom"}, commonEndpointConfig);
          const leftEndpoint = instanceAOSafe.addEndpoint(node, { anchor: "Left"}, commonEndpointConfig);
          const rightEndpoint = instanceAOSafe.addEndpoint(node, { anchor: "Right"}, commonEndpointConfig);
          
          
          
          nodeMap[id] = { node, type };
        // Cuando el nodo recibe hover, hacemos los endpoints visibles
        node.addEventListener('mouseenter', function () {
          topEndpoint.setPaintStyle({ fill: "black", radius: 4 });
          bottomEndpoint.setPaintStyle({ fill: "black", radius: 4 });
          leftEndpoint.setPaintStyle({ fill: "black", radius: 4 });
          rightEndpoint.setPaintStyle({ fill: "black", radius: 4 });
        });
        // Cuando el mouse sale del nodo, los endpoints se vuelven invisibles nuevamente
        node.addEventListener('mouseleave', function () {
          topEndpoint.setPaintStyle({ fill: "transparent", radius: 4 });
          bottomEndpoint.setPaintStyle({ fill: "transparent", radius: 4 });
          leftEndpoint.setPaintStyle({ fill: "transparent", radius: 4 });
          rightEndpoint.setPaintStyle({ fill: "transparent", radius: 4 });
        });
          return id;
      }

      // Posicionamiento horizontal inteligente
      function calculateHorizontalPosition(type, index, total) {
        // 1. Configuración de zonas por tipo (en %)
        const typeZones = {
          'medio_indirecto': { center: 75, maxSpread: 35 }, // Ej: 20% del contenedor
          'medio_directo':   { center: 45, maxSpread: 55 },
          'fin_directo':  { center: 45, maxSpread: 35 },
          'fin_indirecto':{ center: 50, maxSpread: 35 }
        };
        // 2. Espaciado mínimo (30% del ancho del nodo para evitar choques)
        const nodeWidthPercent = 15; // 200px en un contenedor de ~1300px ≈ 15%
        const minSpacing = nodeWidthPercent * 1.0; // 22.5% (espacio mínimo entre nodos)
        // 3. Spread dinámico (ajustado a la cantidad de nodos)
        const spread = Math.max(
          minSpacing,
          typeZones[type].maxSpread / Math.max(total, 1) // Evita división por cero
        );
        // 4. Posición final en %
        return typeZones[type].center + (index * spread) - ((total - 1) * spread / 2);
      }
      
      // Generar todos los nodos primero
      // Problema Central
      const spId = createNode('solucion_problema', objetivosData.solucion_problema, levels['solucion_problema'], 50);
      
      // Efecto Superior
      const fsId = createNode('fin_superior', objetivosData.fin_superior, levels['fin_superior'], 50);
      
      // Medios directos
      objetivosDataSafe.medios_directos.forEach((cd, i) => {
          const mdId = createNode(
              'medio_directo', 
              cd,
              levels['medio_directo'],
              calculateHorizontalPosition('medio_directo', i, objetivosDataSafe.medios_directos.length)
          );
      });
      
      //Medios indirectos
      objetivosDataSafe.medios_indirectos.forEach((ci, i) => {
          const miId = createNode(
              'medio_indirecto',
              ci,
              levels['medio_indirecto'],
              calculateHorizontalPosition('medio_indirecto', i, objetivosDataSafe.medios_indirectos.length)
          );
      });
      
      // Fines Directos
      objetivosDataSafe.fines_directos.forEach((ed, i) => {
          const fdId = createNode(
              'fin_directo',
              ed,
              levels['fin_directo'],
              calculateHorizontalPosition('fin_directo', i, objetivosDataSafe.fines_directos.length)
          );
      });
      
      // Efectos Indirectos
      objetivosDataSafe.fines_indirectos.forEach((ei, i) => {
          const fiId = createNode(
              'fin_indirecto',
              ei,
              levels['fin_indirecto'],
              calculateHorizontalPosition('fin_indirecto', i, objetivosDataSafe.fines_indirectos.length)
          );
      });
      // Conectar nodos después de crearlos todos
      function connectNodes(sourceId, targetId) {
          instanceAOSafe.connect({
              source: sourceId,
              target: targetId,
              anchors: ["Top", "Bottom"],
              detachable: false
          });
      }
      
      // Conexiones Medios Directos-> Solucion problema
      objetivosDataSafe.medios_directos.forEach(cd => {
          const mdId = `medio_directo_${cd.id}`;
          if (nodeMap[mdId]) connectNodes(mdId, spId);
      });
      
      // Conexiones Medios indirectos -> Medios directos
      objetivosDataSafe.medios_indirectos.forEach(mi => {
          const miId = `medio_indirecto_${mi.id}`;
          const mdId = `medio_directo_${mi.id_MD}`;
          if (nodeMap[miId] && nodeMap[mdId]) connectNodes(miId, mdId);
      });
      
      // Conexiones fines Directos -> solucion problema
      objetivosDataSafe.fines_directos.forEach(fd => {
          const fdId = `fin_directo_${fd.id}`;
          if (nodeMap[fdId]) {
              // Conectar con solcion problema
              connectNodes(spId, fdId);
              
              // Conectar con su fin Indirecto correspondiente (si existe)
              if (fd.id_FI) {
                  const fiId = `fin_indirecto_${fd.id_FI}`;
                  if (nodeMap[fiId]) {
                      connectNodes(fdId, fiId);
                  }
              }
          }
      });
      
      // Conexiones fin Indirectos ->fin Superior
      objetivosDataSafe.fines_indirectos.forEach(fi => {
          const fiId = `fin_indirecto_${fi.id}`;
          if (nodeMap[fiId]) connectNodes(fiId, fsId);
      });

      // Redibujar una sola vez al final
      instanceAOSafe.setSuspendDrawing(false, true);
      // Agrega esto a la configuración de jsPlumb
  });
});
function transformDiagramToHierarchy(diagramData) {
  const hierarchy = {
    problema_central: { nombre: "problema_central", contenido: "" },
    causas_directas: [],
    efectos_indirectos: [],
    efecto_superior: { nombre: "efecto_superior", contenido: "" }
  };
  // Primero encontramos todos los nodos principales
  diagramData.nodes.forEach(node => {
    if (node.type === "problema_central") {
      hierarchy.problema_central.contenido = node.content;
    } else if (node.type === "efecto_superior") {
      hierarchy.efecto_superior.contenido = node.content;
    }
  });
  // Mapeamos todos los nodos por ID para fácil acceso
  const nodesById = {};
  diagramData.nodes.forEach(node => {
    nodesById[node.id] = node;
  });
  // Procesamos causas directas
  const causasDirectas = diagramData.nodes.filter(node => node.type === "causa_directa");
  causasDirectas.forEach((causaDirecta, n) => {
    const causaEntry = {
      nombre: `causa_directa_${n+1}`,
      contenido: causaDirecta.content,
      causas_indirectas: []
    };
    // Buscamos causas indirectas que apuntan a esta causa directa
    diagramData.connections.forEach(conn => {
      if (conn.targetId === causaDirecta.id) {
        const sourceNode = nodesById[conn.sourceId];
        if (sourceNode && sourceNode.type === "causa_indirecta") {
          // Encontramos el índice de esta indirecta para esta directa
          const m = causaEntry.causas_indirectas.length + 1;
          causaEntry.causas_indirectas.push({
            nombre: `causa_indirecta_${n+1}_${m}`,
            contenido: sourceNode.content
          });
        }
      }
    });
    hierarchy.causas_directas.push(causaEntry);
  });
  // Procesamos efectos Indirectos
  const efectosIndirectos = diagramData.nodes.filter(node => node.type === "efecto_indirecto");
  efectosIndirectos.forEach((efectoIndirecto, n) => {
    const efectoEntry = {
      nombre: `efecto_indirecto_${n+1}`,
      contenido: efectoIndirecto.content,
      efectos_directos: []
    };
    // Buscamos efectos dierctos que apunten a efectos indirectos
    diagramData.connections.forEach(conn => {
      if (conn.targetId === efectoIndirecto.id) {
        const sourceNode  = nodesById[conn.sourceId];
        if (sourceNode  && sourceNode.type === "efecto_directo") {
          const m = efectoEntry.efectos_directos.length + 1;
          efectoEntry.efectos_directos.push({
            nombre: `efecto_directo_${n+1}_${m}`,
            contenido: sourceNode.content
          });
        }
      }
    });
    hierarchy.efectos_indirectos.push(efectoEntry);
  });
  return hierarchy;
}
window.getDiagramJSON = function(jsPlumbInstance) {
  const diagramData = {
    nodes: [],
    connections: []
  };
  document.querySelectorAll('.node').forEach(node => {
    diagramData.nodes.push({
      id: node.id,
      type: node.getAttribute('data-type'),
      position: {
        top: node.style.top,
        left: node.style.left
      },
      content: node.querySelector('textarea').value
    });
  });
  jsPlumbInstance.getAllConnections().forEach(conn => {
    diagramData.connections.push({
      sourceId: conn.sourceId,
      targetId: conn.targetId,
      anchors: conn.endpoints.map(ep => ep.anchor.type)
    });
  });
  console.log(diagramData);
  const estructuraJerarquica = transformDiagramToHierarchy(diagramData);
  console.log("ya: ", estructuraJerarquica);
  return estructuraJerarquica;
};
        