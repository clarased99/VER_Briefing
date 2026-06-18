================================================================
VERBENA — BRIEFING INTERACTIVO
README de Estilo y Especificaciones de Diseño
================================================================
Última actualización: Junio 2026
Basado en: VER_Briefing_Wireframes_Junio_2026.pdf (37 mesas de trabajo)


----------------------------------------------------------------
1. TIPOGRAFÍA
----------------------------------------------------------------

Familia: At Hauss Mono VAR
Peso:    Regular
Uso:     Única tipografía del proyecto (titulares, cuerpo de texto,
         labels, botones, navegación). Es monoespaciada, lo cual
         determina el carácter "técnico/editorial" de todo el
         briefing (alineaciones tipo tabla, números con prefijo
         "00.", "01."... guardan el mismo ancho de carácter).


----------------------------------------------------------------
2. PALETA DE COLORES
----------------------------------------------------------------

Color base (texto/UI neutra):
  Negro/Gris oscuro   #606060

Colores de sección/acento (uno por categoría temática):
  Verde      #75c2a6   → 03. Competencia
  Morado     #9e87d9   → 04. Sobre el proyecto / Marca / Web
  Amarillo   #f5fa4d   → 06. Conclusiones / Cartel
  Azul       #7aadf2   → 02. Público objetivo / Naming+Marca
  Naranja    #ff6e14   → Disco
  Rojo       #f0564c   → 01. Datos del proyecto (hover/activo) / Redes / Fotografía

Nota de uso observada en wireframes:
  Cada sección del menú principal (00–06) y cada "tipo de proyecto"
  tiene asignado un color de la paleta como color de estado
  "activo/seleccionado". El resto de los elementos de navegación
  permanecen en gris claro (inactivos) hasta que se hace hover o
  se selecciona la sección.


----------------------------------------------------------------
3. ESTILO DE BOTONES
----------------------------------------------------------------

Botones de texto (navegación, acciones — "EMPEZAR", "SIGUIENTE"):
  - Sin fondo, sin color de relleno
  - Solo texto en Regular, subrayado
  - On hover: opacidad baja a 25%

Checkboxes / Radio buttons:
  - Estilo simple, cuadrado vacío (checkbox) con "X" al marcar
  - Sin estilizado adicional visible en wireframe (a definir en
    fase de diseño visual final)

Campos de texto / inputs:
  - Fondo gris claro (#EAEAEA aprox.), sin bordes visibles
  - Sin placeholder destacado salvo casos específicos (ej. fecha
    "DD/MM/AAAA", "Sube aquí tus archivos")

Botón "+" (añadir fila/tarjeta dinámica):
  - Círculo gris claro con símbolo "+" centrado
  - Mismo estilo "sin relleno fuerte" que el resto de la UI


----------------------------------------------------------------
4. LOGO Y MARCA
----------------------------------------------------------------

Isotipo: Triángulo invertido (sólido, en gris oscuro #606060
         o negro según el fondo)
Lockup:  Isotipo + "Verbena" (bold) + "Colectivo Gráfico" (regular)
         Aparece siempre en el footer de cada pantalla, alineado
         a la izquierda (texto) y el isotipo solo aparece además
         repetido en la esquina inferior derecha de cada pantalla.


----------------------------------------------------------------
5. ESTRUCTURA DE NAVEGACIÓN
----------------------------------------------------------------

5.1 Header (pantallas de formulario)
    - Icono de menú hamburguesa (≡) arriba a la izquierda
    - Breadcrumbs dinámicos en la misma línea, en este orden:
      [Nombre de la empresa]  →  [Tipo de proyecto]  →  [Nombre del proyecto]
    - Si el usuario eligió 2 tipos de proyecto, el breadcrumb central
      se convierte en: [Tipo de proyecto 1] + [Tipo de proyecto 2]
    - En subpáginas específicas por tipo de proyecto aparece además
      una etiqueta adicional arriba a la derecha (ej. "PUBLICACIÓN",
      "CARTEL", "DISCO") — ESTA etiqueta es una anotación de la
      diseñadora para identificar la variante, a confirmar si debe
      o no ser visible en el producto final.

5.2 Overlay de navegación (al pulsar el menú ≡ o la X)
    - Pantalla/panel con el listado completo de secciones:
      00. Datos personales
      01. Datos del proyecto
      02. Público objetivo
      03. Competencia
      04. Sobre el proyecto
          └ [Tipo de proyecto] (submenú dinámico, aparece anidado
            bajo "04." cuando corresponde)
      05. Datos visuales
      06. Conclusiones
    - Estado "inactivo": texto gris claro
    - Estado "activo/sección actual": fila resaltada con el color
      de acento correspondiente a esa sección, texto en gris oscuro
    - Estado "hover": variante visual de prueba vista en wireframe
      (no implica cambio de color, solo ejemplificación de affordance)
    - En móvil, el overlay pasa a ocupar la pantalla completa.

5.3 Navegación secuencial
    - Botón "SIGUIENTE" (texto subrayado, esquina inferior derecha)
      para avanzar de sección.
    - Pantallas de transición entre bloques: número grande + nombre
      de la siguiente sección, con las 4 figuras geométricas de marca
      (triángulo, semicírculo x2, gota) como elemento decorativo.


----------------------------------------------------------------
6. FLUJO LÓGICO / RAMIFICACIONES
----------------------------------------------------------------

a) Selección de tipo de proyecto (pantalla "TIPO DE PROYECTO"):
   - Tarjetas tipo "post-it" con esquina doblada, una por tipo de
     proyecto, cada una con su color de acento:
     Disco (naranja) · Redes (rojo) · Publicación (verde) ·
     Marca (morado) · Cartel (amarillo) · Web (morado/lila) ·
     Naming + Marca (azul) · Fotografía (rojo) · Vídeo (verde)
   - El usuario puede elegir 1 o varios.

b) Sección "04. Sobre el proyecto":
   - El contenido de esta sección cambia dinámicamente según el/los
     tipo(s) de proyecto elegido(s) (batería de preguntas específica
     por tipo: Fotografía, Vídeo, Web, Cartelería, Disco, Naming,
     Marca, Publicación, Redes).
   - Si se eligieron 2+ tipos, al estar en el formulario del tipo 1,
     el tipo 2 se muestra en el menú con opacidad 100% (ambos
     visibles/activos en el submenú).

c) Tras completar "04. Sobre el proyecto", pantalla de bifurcación:
   "¿Necesitas añadir otro tipo de proyecto?"
     - "SÍ" → vuelve a pantalla de Tipo de proyecto (selección 2)
       → nueva batería de preguntas específicas → 05. Datos
       visuales → 06. Conclusiones
     - "NO, ESTÁ BIEN ASÍ" → va directo a 05. Datos visuales →
       06. Conclusiones

d) Sección "03. Competencia":
   - Estructura base común a todos los proyectos (mapa de área de
     influencia + competencia real/aspiracional)
   - Variantes con preguntas adicionales específicas para:
     Publicación, Cartel, Disco

e) Sección "05. Datos visuales":
   - Pregunta inicial "¿Existe ya una identidad visual definida?"
     - SÍ → deslizador de fidelidad (Totalmente independiente ↔
       Completamente fiel)
     - NO → pregunta de escala con 4 opciones fijas (No es
       importante / No es muy importante / Es importante / Es
       muy importante) en vez del deslizador
   - Ambas ramas continúan con la misma batería de preguntas
     (adjetivos, texturas, colores, formas, deslizadores de
     personalidad, juego de imágenes, etc.)


----------------------------------------------------------------
7. COMPONENTES DE FORMULARIO IDENTIFICADOS
----------------------------------------------------------------

- Input de texto corto (una línea)
- Textarea (varias líneas)
- Checkbox individual y checkbox grid (multi-columna, ej. lista de
  adjetivos — máx. 5 seleccionables)
- Checkbox "otro" con campo de texto condicional al lado
- Radio button Sí/No con contenido condicional según respuesta
- Dropdown / select (ej. Género, Nivel académico, Nivel adquisitivo)
- Checkbox de selección múltiple para Edad (NO es dropdown ni
  deslizador doble), con los siguientes rangos fijos:
    Infantil/adolescente · Menor de 25 · 25-35 · 35-50 · 50-65 ·
    Más de 65
- Selector de mapa interactivo tipo Google Maps con buscador
  (para "área de influencia")
- Tarjetas de imagen seleccionables en grid (single o multi-select),
  con opción "otro" + campo de texto
- Tabla dinámica de 2 columnas con botón "+" para añadir filas
  (ej. listados de competidores: Competidor / Descripción)
- Tarjetas dinámicas con múltiples campos + botón "+" (ej.
  "Fotografías de (sujeto)" con campo de texto y stepper de cantidad)
- Campo de fecha con selector tipo calendario (DD/MM/AAAA)
- Deslizador de rango con un único punto central ARRASTRABLE
  (funcional, no decorativo) — usado en:
    · Fidelidad a identidad visual (escala 0–10, dos extremos
      textuales)
    · Los 11 ejes de personalidad de marca/proyecto (Local↔
      Internacional, Conceptual↔Literal, Accesible↔Exclusiva,
      Sencilla↔Compleja, Amigable↔Corporativa, Natural↔Urbana,
      Infantil↔Adulta, Ecológica↔Indiferente al medioambiente,
      Clásica↔Moderna, Seria↔Divertida, Estable↔Dinámica)
- Campo de subida de archivos (botón "EXAMINAR...") con alternativa
  textual: enlace a WeTransfer → hola@colectivoverbena.info
- Checkbox "Aún no tiene nombre" (para Nombre del proyecto)


----------------------------------------------------------------
8. DATOS VISUALES — LISTADOS DE OPCIONES (05.)
----------------------------------------------------------------

8.1 Texturas (7 + otro):
    Rugosa/Áspera · Suave/Lisa · Orgánica/Natural ·
    Metálica/Industrial · Granulada/Porosa · Líquida/Fluida ·
    Brillante/Deslizante · Otra

8.2 Formas (4):
    Cuadrado · Círculo · Forma orgánica/blob · Forma explosiva/estrella

8.3 Paletas de color: 8 paletas predefinidas (4 tonos cada una)

8.4 "Una imagen vale más..." — categorías de juego visual:
    Arte pictórico · Arte escultórico · Arquitectura ·
    Entorno/calles · Diseño de interiores · Mochila/objeto
    (cada categoría presenta 4 imágenes de referencia entre las
    que el cliente elige 1 o 2)


----------------------------------------------------------------
9. RESPONSIVE / MOBILE
----------------------------------------------------------------

- El layout de 2 columnas en desktop pasa a 1 columna (stack
  vertical) en móvil.
- El overlay de navegación pasa a ocupar pantalla completa.
- Los deslizadores de personalidad mantienen el mismo formato
  visual (línea + punto), con el texto del extremo derecho
  bajando a una segunda línea si no cabe (ej. "INDIFERENTE AL
  MEDIO AMBIENTE").
- Los grids de selección de imagen/textura reducen el número de
  columnas (ej. texturas pasa de 7 en fila a grid 2x4).
- La pantalla de aterrizaje (landing) mantiene los mismos
  elementos gráficos, simplemente apilados verticalmente.


----------------------------------------------------------------
10. PENDIENTES / A CONFIRMAR EN PRÓXIMA REVISIÓN
----------------------------------------------------------------

- Confirmar si la etiqueta de variante (ej. "PUBLICACIÓN", "CARTEL",
  "DISCO") en la esquina superior derecha de algunas pantallas debe
  ser visible en el producto final o es solo anotación de trabajo.
- Aclaraciones en los márgenes del PDF original no visibles para
  Claude — pendientes de que la diseñadora las traslade al pasar
  a fase de código.
- Diagrama de flujo completo del briefing — pendiente de envío.
- Estilo final de checkboxes y radio buttons (más allá del
  wireframe funcional).
- Comportamiento exacto de la subida de archivos (tipos permitidos,
  tamaño máximo, destino de guardado — Google Drive vía Apps Script
  según planteamiento ya discutido).


----------------------------------------------------------------
11. ERRATAS DETECTADAS EN EL ARCHIVO FUENTE (a corregir por la diseñadora)
----------------------------------------------------------------

- Mesa "03. COMPETENCIA (DISCO)": aparece una etiqueta suelta
  "MOBILE EX1" debajo del mapa. Confirmado por la diseñadora que es
  un resto de anotación de trabajo, no parte del diseño — corregir
  en el archivo .ai original.

================================================================
Fin del documento
================================================================
