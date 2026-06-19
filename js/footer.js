/* ================================================================
   VERBENA — FOOTER FIJO DE MARCA
   Se inyecta en cualquier página que tenga <div id="brand-footer">.
   Queda fijo (position: fixed) sobre el resto del contenido en
   TODAS las páginas, excepto las pantallas de carga/transición
   (esas páginas simplemente no incluyen este script).
================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const textPlaceholder = document.getElementById('brand-footer-text');
    const logoPlaceholder = document.getElementById('brand-footer-logo');

    if (textPlaceholder) {
        textPlaceholder.innerHTML = `
      <span class="brand-name">Verbena</span>
      <span class="brand-suffix">Colectivo Gráfico</span>
    `;
    }

    if (logoPlaceholder) {
        logoPlaceholder.innerHTML = `<div class="brand-mark brand-mark--logo" aria-hidden="true"></div>`;
    }
});