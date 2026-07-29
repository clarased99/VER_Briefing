/* ================================================================
   VERBENA — FÍSICA DE CAÍDA EN LA LANDING
   - Secciones de 120° + triángulos, colores aleatorios
   - MouseConstraint para arrastrar figuras
================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('physics-container');
    if (!container || typeof Matter === 'undefined') return;

    const {
        Engine, Render, Runner, Bodies, Composite,
        Common, Events, Mouse, MouseConstraint
    } = Matter;

    function getCssVar(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    const COLORES = [
        getCssVar('--color-verde'),
        getCssVar('--color-morado'),
        getCssVar('--color-amarillo'),
        getCssVar('--color-azul'),
        getCssVar('--color-naranja'),
        getCssVar('--color-rojo'),
    ];

    function colorAleatorio() {
        return COLORES[Math.floor(Math.random() * COLORES.length)];
    }

    const W = window.innerWidth;
    const H = window.innerHeight;

    const engine = Engine.create();
    engine.world.gravity.y = 1;

    const render = Render.create({
        element: container,
        engine: engine,
        options: {
            width: W,
            height: H,
            background: 'transparent',
            wireframes: false,
            pixelRatio: 1,
        },
    });

    render.canvas.style.position = 'absolute';
    render.canvas.style.top    = '0';
    render.canvas.style.left   = '0';
    render.canvas.style.width  = W + 'px';
    render.canvas.style.height = H + 'px';

    // ---- Paredes ----
    const SUELO_Y = H - 20;
    const wallOpts = { isStatic: true, render: { visible: false } };
    Composite.add(engine.world, [
        Bodies.rectangle(W / 2,  SUELO_Y + 25, W * 2, 50, wallOpts),
        Bodies.rectangle(-25,    H / 2,         50, H * 2, wallOpts),
        Bodies.rectangle(W + 25, H / 2,         50, H * 2, wallOpts),
    ]);

   // ---- Tamaños (+30% sobre la versión anterior) ----
const R    = 260;   // radio visual sección
const RT   = 306;   // radio triángulo
const R_HIT = R * 0.38; // hitbox físico sección

    // ---- Crear formas ----
    const FORMAS = [];

    for (let i = 0; i < 38; i++) {
        const color    = colorAleatorio();
        const startX   = Common.random(W * 0.05, W * 0.95);
        const startY   = -120 - i * 110;
        const initAng  = Common.random(-Math.PI, Math.PI);
        const esTriang = (i + 1) % 3 === 0;
        const arcStart = Common.random(0, 2 * Math.PI);

        const physOpts = {
            restitution: 0.3,
            friction: 0.5,
            frictionAir: 0.01,
            angle: initAng,
            render: { fillStyle: 'transparent', strokeStyle: 'transparent', lineWidth: 0 },
        };

        let body;
        if (esTriang) {
            body = Bodies.polygon(startX, startY, 3, RT, physOpts);
        } else {
            body = Bodies.circle(startX, startY, R_HIT, physOpts);
            body._arcStart = arcStart;
        }

        body._tipo  = esTriang ? 'triangulo' : 'segmento';
        body._color = color;
        FORMAS.push(body);
    }

    Composite.add(engine.world, FORMAS);

    // ---- MouseConstraint: permite arrastrar figuras ----
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
            stiffness: 0.2,
            angularStiffness: 0.1,
            render: { visible: false },
        },
    });
    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // ---- Dibujo custom ----
    Events.on(render, 'afterRender', () => {
        const ctx = render.context;

        FORMAS.forEach((body) => {
            const { x, y } = body.position;
            const ang = body.angle;

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(ang);
            ctx.fillStyle = body._color;
            ctx.beginPath();

            if (body._tipo === 'triangulo') {
                for (let k = 0; k < 3; k++) {
                    const a = (k / 3) * 2 * Math.PI - Math.PI / 2;
                    k === 0
                        ? ctx.moveTo(RT * Math.cos(a), RT * Math.sin(a))
                        : ctx.lineTo(RT * Math.cos(a), RT * Math.sin(a));
                }
            } else {
                const a0  = body._arcStart;
                const a1  = a0 + (2 * Math.PI / 3);
                const theta = 2 * Math.PI / 3;
                const aMid  = a0 + theta / 2;
                const d     = (4 * R / 3) * Math.sin(theta / 2) / (theta - Math.sin(theta));
                const cx    = -d * Math.cos(aMid);
                const cy    = -d * Math.sin(aMid);

                ctx.moveTo(cx + R * Math.cos(a0), cy + R * Math.sin(a0));
                ctx.arc(cx, cy, R, a0, a1, false);
                ctx.lineTo(cx + R * Math.cos(a0), cy + R * Math.sin(a0));
            }

            ctx.closePath();
            ctx.fill();
            ctx.restore();
        });
    });

    Render.run(render);
    Runner.run(Runner.create(), engine);

    window.addEventListener('resize', () => {
        const nW = window.innerWidth;
        const nH = window.innerHeight;
        render.options.width  = nW;
        render.options.height = nH;
        render.canvas.width   = nW;
        render.canvas.height  = nH;
        render.canvas.style.width  = nW + 'px';
        render.canvas.style.height = nH + 'px';
        Render.lookAt(render, { min: { x: 0, y: 0 }, max: { x: nW, y: nH } });
    });
});
