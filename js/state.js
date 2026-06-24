/* ================================================================
   VERBENA — ESTADO COMPARTIDO ENTRE PÁGINAS
   Usa localStorage para que datos introducidos en una página
   (ej. nombre de la empresa) estén disponibles en las páginas
   siguientes (ej. breadcrumb del header), y para acumular TODAS
   las respuestas del briefing hasta el envío final en
   06-conclusiones.html (ver ENVÍO ÚNICO AL FINAL más abajo).

   Claves usadas:
   - vb_empresa        → texto, de 00-datos.html (campo "Empresa")
   - vb_nombreProyecto → texto, de 01-proyecto.html
   - vb_tiposProyecto  → array JSON, tipos de proyecto elegidos
                         (se va añadiendo uno por cada vuelta del
                         bucle "¿necesitas otro tipo de proyecto?")
   - vb_field_<id>     → namespace genérico: CUALQUIER campo de
                         CUALQUIER formulario se guarda aquí
                         automáticamente con saveAllFieldsOnPage(),
                         usando su atributo id como parte de la clave.

   CÓMO AÑADIR UNA PÁGINA DE FORMULARIO NUEVA:
   Solo hay que llamar a VerbenaState.autoSaveOnNext('id-del-boton-siguiente')
   una vez, al final de la página. No hace falta listar los campos
   uno a uno: recoge automáticamente todos los <input>, <textarea>
   y <select> que tengan un id, dentro de cualquier <form> o del
   body si no hay <form>.
================================================================ */

const VerbenaState = {
    KEYS: {
        empresa: 'vb_empresa',
        nombreProyecto: 'vb_nombreProyecto',
        tiposProyecto: 'vb_tiposProyecto',
    },
    FIELD_PREFIX: 'vb_field_',
    PROGRESS_KEY: 'vb_progreso', // Máxima sección alcanzada: '00','01'...

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

    LABEL_A_SLUG: {
        'DISCO': 'disco', 'REDES': 'redes', 'PUBLICACIÓN': 'publicacion',
        'MARCA': 'marca', 'CARTEL': 'cartel', 'WEB': 'web',
        'NAMING + MARCA': 'naming-marca', 'FOTOGRAFÍA': 'fotografia', 'VÍDEO': 'video',
    },

    /* Devuelve la URL del 04 del primer tipo elegido, o null si no hay. */
    getUrlPrimerTipo(base = '') {
        const tipos = this.getTiposProyecto();
        if (!tipos.length) return null;
        const slug = this.LABEL_A_SLUG[tipos[0].toUpperCase()];
        if (!slug) return null;
        return `${base}04-proyecto/${slug}.html`;
    },
    setProgreso(seccion) {
        const actual = this.get(this.PROGRESS_KEY);
        if (!actual || seccion > actual) {
            localStorage.setItem(this.PROGRESS_KEY, seccion);
        }
    },

    getProgreso() {
        return this.get(this.PROGRESS_KEY) || '00';
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
            const empresa = this.get(this.KEYS.empresa);
            const esIgualQueEmpresa = proyecto && empresa && proyecto.trim().toLowerCase() === empresa.trim().toLowerCase();
            proyectoEl.textContent = proyecto;
            proyectoEl.hidden = !proyecto || esIgualQueEmpresa;
        }

        if (tipoEl) {
            const tipos = this.getTiposProyecto();
            tipoEl.textContent = tipos.join(' + ');
            tipoEl.hidden = !tipos.length;
        }
    },

    /* ============================================================
       AUTOGUARDADO GENÉRICO DE CAMPOS
       ============================================================ */

    /* Recoge el valor de un campo del DOM según su tipo. */
    _readFieldValue(field) {
        if (field.type === 'checkbox') return field.checked;
        if (field.type === 'radio') return field.checked ? field.value : null;
        return field.value;
    },

    /* Guarda en localStorage todos los campos con id dentro de
       <main> (inputs, textareas, selects). Ignora campos sin id
       (no podríamos luego identificarlos) y campos disabled (ya
       que normalmente significa que están ocultos/no aplican,
       como "origen-nombre" cuando se marca "aún no tiene nombre"). */
    saveAllFieldsOnPage() {
        const root = document.querySelector('main') || document.body;
        const fields = root.querySelectorAll('input[id], textarea[id], select[id]');

        fields.forEach((field) => {
            if (field.disabled) return;
            if (field.dataset.vbExclude === 'true') return;
            const value = this._readFieldValue(field);
            if (value === null) return; // radio no marcado
            localStorage.setItem(this.FIELD_PREFIX + field.id, JSON.stringify(value));
        });
    },

    /* Lee de vuelta un campo guardado (útil si quisiéramos
       restaurar valores al volver atrás en el flujo). */
    getField(id) {
        const raw = localStorage.getItem(this.FIELD_PREFIX + id);
        if (raw === null) return null;
        try { return JSON.parse(raw); } catch { return raw; }
    },

    /* Restaura en el DOM todos los campos guardados para esta página.
       Llamar al cargar la página para que el usuario vea sus respuestas
       si vuelve atrás. */
    restoreAllFieldsOnPage() {
        const root = document.querySelector('main') || document.body;
        const fields = root.querySelectorAll('input[id], textarea[id], select[id]');

        fields.forEach((field) => {
            if (field.dataset.vbExclude === 'true') return;
            const raw = localStorage.getItem(this.FIELD_PREFIX + field.id);
            if (raw === null) return;

            try {
                const value = JSON.parse(raw);
                if (field.type === 'checkbox') {
                    field.checked = !!value;
                    // Disparar change para activar lógicas condicionales
                    field.dispatchEvent(new Event('change'));
                } else if (field.type === 'radio') {
                    field.checked = field.value === value;
                } else {
                    field.value = value || '';
                }
            } catch {
                field.value = raw || '';
            }
        });
    },
    autoSaveOnNext(buttonId) {
        const btn = document.getElementById(buttonId);
        if (!btn) return;
        btn.addEventListener('click', () => this.saveAllFieldsOnPage());
    },

    /* ============================================================
       ENVÍO ÚNICO AL FINAL (06-conclusiones.html)
       Recopila TODO lo guardado (campos individuales + empresa +
       nombreProyecto + tiposProyecto) en un solo objeto plano,
       listo para mandar a Apps Script.
       ============================================================ */
    collectAllData() {
        const data = {
            empresa: this.get(this.KEYS.empresa),
            nombreProyecto: this.get(this.KEYS.nombreProyecto),
            tiposProyecto: this.getTiposProyecto().join(' + '),
        };

        Object.keys(localStorage)
            .filter((key) => key.startsWith(this.FIELD_PREFIX))
            .forEach((key) => {
                const fieldId = key.slice(this.FIELD_PREFIX.length);
                const raw = localStorage.getItem(key);
                try {
                    data[fieldId] = JSON.parse(raw);
                } catch {
                    data[fieldId] = raw;
                }
            });

        return data;
    },

    /* Borra todo el estado guardado (llamar tras un envío exitoso,
       para que un nuevo cliente no arrastre datos del anterior en
       el mismo navegador). */
    clearAll() {
        Object.keys(localStorage)
            .filter((key) => key.startsWith('vb_'))
            .forEach((key) => localStorage.removeItem(key));
    },
};

document.addEventListener('DOMContentLoaded', () => {
    VerbenaState.renderBreadcrumbs();
    VerbenaState.restoreAllFieldsOnPage();
});