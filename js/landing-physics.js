/* ================================================================
   VERBENA — FÍSICA DE CAÍDA EN LA LANDING
   Usa Matter.js (cargado vía CDN en index.html) para simular la
   caída de las formas geométricas de marca con gravedad real.
   Cada forma colisiona con las demás y con los bordes del área
   de caída, quedando apiladas de forma natural y aleatoria.

   Pensado para poder ampliarse fácilmente: añadir más formas,
   variar tamaños o colores solo requiere editar la lista
   SHAPES_CONFIG más abajo.
================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('physics-container');
    if (!container || typeof Matter === 'undefined') return;

    const { Engine, Runner, Bodies, Composite, Common } = Matter;

    // -------- Configuración de las formas a soltar --------
    // Cada entrada: nombre de la forma (debe existir el SVG en
    // assets/shapes/forma-<nombre>.svg), color CSS, y tamaño relativo.
    const SHAPES_CONFIG = [
        { tipo: 'verde',    archivo: 'forma-verde.svg',    color: getCssVar('--color-verde'),    width: 220, height: 99,  vertices: null },
        { tipo: 'morado',   archivo: 'forma-morada.svg',   color: getCssVar('--color-morado'),   width: 220, height: 193, vertices: 'triangle' },
        { tipo: 'amarillo', archivo: 'forma-amarilla.svg', color: getCssVar('--color-amarillo'), width: 220, height: 126, vertices: null },
    ];

    function getCssVar(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    const engine = Engine.create();
    const world = engine.world;

    // -------- Suelo y paredes invisibles (límites de caída) --------
    const wallOptions = { isStatic: true, render: { visible: false } };
    const floor = Bodies.rectangle(width / 2, height + 20, width * 2, 40, wallOptions);
    const leftWall = Bodies.rectangle(-20, height / 2, 40, height * 2, wallOptions);
    const rightWall = Bodies.rectangle(width + 20, height / 2, 40, height * 2, wallOptions);

    Composite.add(world, [floor, leftWall, rightWall]);

    // -------- Crear un cuerpo físico por cada forma --------
    const bodies = SHAPES_CONFIG.map((shape, i) => {
        const startX = Common.random(width * 0.2, width * 0.8);
        const startY = -200 - i * 150; // Las suelta escalonadas en el tiempo/altura
        const startAngle = Common.random(-0.5, 0.5);

        let body;
        if (shape.vertices === 'triangle') {
            // Triángulo aproximado para la física (el SVG real se dibuja encima)
            body = Bodies.polygon(startX, startY, 3, shape.width / 2, {
                angle: startAngle,
                restitution: 0.45,
                friction: 0.3,
            });
        } else {
            // El resto se simulan como cápsulas/rectángulos redondeados
            body = Bodies.rectangle(startX, startY, shape.width, shape.height, {
                angle: startAngle,
                chamfer: { radius: shape.height / 2.2 },
                restitution: 0.45,
                friction: 0.3,
            });
        }

        body.shapeTipo = shape.tipo;
        return body;
    });

    Composite.add(world, bodies);

    // -------- Sincronizar cada body físico con un <div> SVG real --------
    const els = bodies.map((body, i) => {
        const shape = SHAPES_CONFIG[i];
        const el = document.createElement('div');
        el.className = `physics-shape physics-shape--${shape.tipo}`;
        el.style.width = `${shape.width}px`;
        el.style.height = `${shape.height}px`;
        el.style.position = 'absolute';
        el.style.left = '0';
        el.style.top = '0';
        el.style.backgroundColor = shape.color;
        el.style.webkitMaskImage = `url('assets/shapes/${shape.archivo}')`;
        el.style.maskImage = `url('assets/shapes/${shape.archivo}')`;
        el.style.webkitMaskSize = 'contain';
        el.style.maskSize = 'contain';
        el.style.webkitMaskRepeat = 'no-repeat';
        el.style.maskRepeat = 'no-repeat';
        container.appendChild(el);
        return el;
    });

    const runner = Runner.create();
    Runner.run(runner, engine);

    (function syncPositions() {
        bodies.forEach((body, i) => {
            const el = els[i];
            const shape = SHAPES_CONFIG[i];
            // El triángulo de Matter.js (Bodies.polygon) nace apuntando hacia
            // arriba; nuestro SVG real es un triángulo invertido (apunta hacia
            // abajo), así que sumamos 180° (π rad) solo para esa forma.
            const visualOffset = shape.vertices === 'triangle' ? Math.PI : 0;
            el.style.transform =
                `translate(${body.position.x - shape.width / 2}px, ${body.position.y - shape.height / 2}px) rotate(${body.angle + visualOffset}rad)`;
        });
        requestAnimationFrame(syncPositions);
    })();
});