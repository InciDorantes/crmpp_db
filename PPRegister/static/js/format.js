document.addEventListener('DOMContentLoaded', function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  });

  /*decimales */
document.addEventListener("DOMContentLoaded", function () {
  // Espera 100ms a que los datos del backend se hayan insertado en los inputs
  setTimeout(() => {
    const numberInputs = document.querySelectorAll("table input[type='number'], table input.formato-miles");

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
  }, 100); // Espera 100ms
});

function limpiarNumero(valor) {
    const limpio = valor.replace(/,/g, '').trim();
    return limpio === "" ? null : parseInt(limpio, 10);
}