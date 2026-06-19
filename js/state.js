/* ================================================================
   VERBENA — ESTADO COMPARTIDO ENTRE PÁGINAS
   Usa localStorage para que datos introducidos en una página
   (ej. nombre de la empresa) estén disponibles en las páginas
   siguientes (ej. breadcrumb del header).

   Claves usadas:
   - vb_empresa        → texto, de 00-datos.html (campo "Empresa")
   - vb_nombreProyecto → texto, de 01-proyecto.html
   - vb_tiposProyecto  → array JSON, tipos de proyecto elegidos
                         (se va añadiendo uno por cada vuelta del
                         bucle "¿necesitas otro tipo de proyecto?")
================================================================ */

const VerbenaState = {
    KEYS: {
        empresa: 'vb_empresa',
        nombreProyecto: 'vb_nombreProyecto',
        tiposProyecto: 'vb_tiposProyecto',
    },

    get(key) {
        return localStorage.getItem(key) || '';
    },

    set(key, value) {
        localStorage.setItem(key, value);
    },

    getTiposProyecto() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.tiposProyecto)) || [];
        } catch {
            return [];
        }
    },

    addTipoProyecto(tipo) {
        const actuales = this.getTiposProyecto();
        if (!actuales.includes(tipo)) {
            actuales.push(tipo);
            localStorage.setItem(this.KEYS.tiposProyecto, JSON.stringify(actuales));
        }
    },

    resetTiposProyecto() {
        localStorage.removeItem(this.KEYS.tiposProyecto);
    },

    /* Rellena automáticamente los breadcrumbs del header en cualquier
       página que tenga los elementos con estos IDs. Se llama sola al
       cargar cada página (ver abajo). */
    renderBreadcrumbs() {
        const empresaEl = document.getElementById('breadcrumb-empresa');
        const proyectoEl = document.getElementById('breadcrumb-proyecto');
        const tipoEl = document.getElementById('breadcrumb-tipo');

        if (empresaEl) {
            const empresa = this.get(this.KEYS.empresa);
            empresaEl.textContent = empresa;
            empresaEl.hidden = !empresa;
        }

        if (proyectoEl) {
            const proyecto = this.get(this.KEYS.nombreProyecto);
            proyectoEl.textContent = proyecto;
            proyectoEl.hidden = !proyecto;
        }

        if (tipoEl) {
            const tipos = this.getTiposProyecto();
            tipoEl.textContent = tipos.join(' + ');
            tipoEl.hidden = !tipos.length;
        }
    },
};

document.addEventListener('DOMContentLoaded', () => {
    VerbenaState.renderBreadcrumbs();
});