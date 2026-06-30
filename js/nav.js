/* ================================================================
   VERBENA — OVERLAY DE NAVEGACIÓN
   Gestiona el menú de secciones que aparece al pulsar ≡.
   Cada página indica su sección activa con data-section="xx"
   en el <body> (ej. <body data-section="00">).
   Para páginas de 04-proyecto/, usar data-section="04".
================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.menu-icon');
    if (!menuBtn) return;

    /* ---- Secciones del menú ------------------------------------ */
    const SECCIONES = [
        { id: '00', label: '00. DATOS PERSONALES',  href: '/00-datos.html',      color: 'var(--color-rojo)'    },
        { id: '01', label: '01. DATOS DEL PROYECTO', href: '/01-proyecto.html',   color: 'var(--color-rojo)'    },
        { id: '02', label: '02. PÚBLICO OBJETIVO',   href: '/02-publico.html',    color: 'var(--color-azul)'    },
        { id: '03', label: '03. COMPETENCIA',         href: '/03-competencia.html',color: 'var(--color-verde)'   },
        { id: '04', label: '04. SOBRE EL PROYECTO',  href: null,                  color: 'var(--color-morado)'  },
        { id: '05', label: '05. DATOS VISUALES',     href: '/05-visuales.html',   color: 'var(--color-naranja)' },
        { id: '06', label: '06. CONCLUSIONES',       href: '/06-conclusiones.html',color: 'var(--color-amarillo)'},
    ];

    /* ---- Detectar si estamos en una subcarpeta (04-proyecto/) --- */
    const enSubcarpeta = window.location.pathname.includes('/04-proyecto/');

    function resolveHref(href) {
        if (!href) return null;
        const prefijo = enSubcarpeta ? '../' : '';
        // href viene como '/00-datos.html', quitamos la barra inicial
        return prefijo + href.replace(/^\//, '');
    }

    /* ---- Leer la sección activa del body ----------------------- */
    const seccionActiva = document.body.dataset.section || '';
    const tiposProyecto = typeof VerbenaState !== 'undefined'
        ? VerbenaState.getTiposProyecto()
        : [];

    /* ---- Registrar progreso ------------------------------------ */
    if (seccionActiva && typeof VerbenaState !== 'undefined') {
        VerbenaState.setProgreso(seccionActiva);
    }

    const progresoActual = typeof VerbenaState !== 'undefined'
        ? VerbenaState.getProgreso()
        : seccionActiva;

    /* ---- Construir el overlay ---------------------------------- */
    const overlay = document.createElement('div');
    overlay.id = 'nav-overlay';
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Menú de navegación');
    overlay.hidden = true;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'nav-overlay__close';
    closeBtn.setAttribute('aria-label', 'Cerrar menú');
    closeBtn.textContent = '×';
    overlay.appendChild(closeBtn);

    const lista = document.createElement('nav');
    lista.className = 'nav-overlay__lista';

    /* ---- Tipo activo dentro de 04 (declarado en data-tipo del body) */
    const tipoActivo = document.body.dataset.tipo || '';

    SECCIONES.forEach((seccion) => {
        const esActiva = seccion.id === seccionActiva;
        const desbloqueada = seccion.id <= progresoActual;

        // ---- Línea separadora ANTES del item
        const lineaAntes = document.createElement('hr');
        lineaAntes.className = 'nav-overlay__linea';
        lista.appendChild(lineaAntes);

        const item = document.createElement('div');
        item.dataset.id = seccion.id;
        item.className = 'nav-overlay__item';
        if (!desbloqueada) item.classList.add('nav-overlay__item--bloqueada');

        // Fondo de color para la sección activa (todas igual, incluida 04)
        if (esActiva) {
            item.classList.add('nav-overlay__item--activa');
            item.style.backgroundColor = seccion.color;
        }

        const textoEl = document.createElement('span');
        textoEl.textContent = seccion.label;
        item.appendChild(textoEl);

        if (desbloqueada && seccion.href) {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                window.location.href = resolveHref(seccion.href);
            });
        }

        lista.appendChild(item);

        // ---- Tipos de proyecto debajo de 04 (fuera de las líneas)
        if (seccion.id === '04' && tiposProyecto.length > 0) {

            // Línea inferior del 04 antes de los subtipos
            const lineaInferior04 = document.createElement('hr');
            lineaInferior04.className = 'nav-overlay__linea';
            lista.appendChild(lineaInferior04);
            const LABEL_A_SLUG = {
                'DISCO': 'disco', 'REDES': 'redes', 'PUBLICACIÓN': 'publicacion',
                'MARCA': 'marca', 'CARTEL': 'cartel', 'WEB': 'web',
                'NAMING': 'naming-marca', 'FOTOGRAFÍA': 'fotografia', 'VÍDEO': 'video',
            };

            tiposProyecto.forEach((tipo) => {
                const esTipoActivo = tipo.toUpperCase() === tipoActivo.toUpperCase();
                const slug = LABEL_A_SLUG[tipo.toUpperCase()] || tipo.toLowerCase();

                const subitem = document.createElement('div');
                subitem.className = 'nav-overlay__subtipo-item';
                if (!esTipoActivo) subitem.classList.add('nav-overlay__subtipo-item--inactivo');
                subitem.textContent = tipo;

                if (desbloqueada) {
                    subitem.style.cursor = 'pointer';
                    subitem.addEventListener('click', () => {
                        window.location.href = resolveHref(`/04-proyecto/${slug}.html`);
                    });
                }

                lista.appendChild(subitem);
            });
        }
    });

    // Línea final después del último item
    const lineaFinal = document.createElement('hr');
    lineaFinal.className = 'nav-overlay__linea';
    lista.appendChild(lineaFinal);

    overlay.appendChild(lista);

    /* ---- Footer de marca dentro del overlay ------------------- */
    const footerOverlay = document.createElement('div');
    footerOverlay.className = 'nav-overlay__footer';
    footerOverlay.innerHTML = `
    <span class="brand-name">Verbena</span>
    <span class="brand-suffix">Colectivo Gráfico</span>
  `;
    overlay.appendChild(footerOverlay);

    document.body.appendChild(overlay);

    /* ---- Abrir / cerrar --------------------------------------- */
    function abrirMenu() {
        overlay.hidden = false;
        document.body.style.overflow = 'hidden';
        menuBtn.setAttribute('aria-expanded', 'true');
        closeBtn.focus();
    }

    function cerrarMenu() {
        overlay.hidden = true;
        document.body.style.overflow = '';
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.focus();
    }

    menuBtn.addEventListener('click', abrirMenu);
    closeBtn.addEventListener('click', cerrarMenu);

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !overlay.hidden) cerrarMenu();
    });

    // Cerrar al hacer clic fuera del panel
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) cerrarMenu();
    });
});