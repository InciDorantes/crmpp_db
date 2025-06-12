
let temp = $("#btn1").clone();
$("#btn1").click(function(){
    $("#btn1").after(temp);
});

/* TABLA DEL HOME */
$(document).ready(function() {
  var table = $('#example').DataTable({
      orderCellsTop: true,
      fixedHeader: true,
      language: {
          url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json"
      }
    });

    // Creamos una fila en el head de la tabla y lo clonamos para cada columna
    $('#example thead tr').clone(true).appendTo('#example thead');

    $('#example thead tr:eq(1) th').each(function(i) {
        var title = $(this).text(); // es el nombre de la columna

        // Aquí verificamos si la columna es una de las últimas dos
        if (i < $('#example thead tr:eq(0) th').length - 2) {
            // Si no es una de las últimas dos columnas, agregamos el input
            $(this).html('<input type="text" placeholder="Buscar... " style="width: 100% !important; border-radius: 5px !important; border-style: none !important;" />');

            // Agregamos el evento para la búsqueda
            $('input', this).on('keyup change', function() {
                if (table.column(i).search() !== this.value) {
                    table.column(i).search(this.value).draw();
                }
            });
        } else {
            // Si es una de las últimas dos columnas, mantenemos el encabezado sin input
            $(this).html('');
        }
    });
});

/*SELECT USURIOS*/ 
$(document).ready(function() {
    $('#usuarios').select2({
      placeholder: "Seleccionar participantes",
      allowClear: true,  // Permite quitar selecciones
      tags: true,  // Activa los tags
      tokenSeparators: [',', ' ']  // Permite escribir y separar con comas o espacios
    });
    // Asegúrate de que los valores seleccionados se estén enviando correctamente
    $('#form_pp').submit(function(event) {
        var selectedUsers = $('#usuarios').val();  // Recoger los usuarios seleccionados
        if (selectedUsers.length == 0) {
          alert('Debe seleccionar al menos un usuario.');
          event.preventDefault();  // Detener el formulario si no hay usuarios seleccionados
        } else {
          console.log("Usuarios seleccionados:", selectedUsers);  // Muestra los usuarios seleccionados
        }
      });

  });
  