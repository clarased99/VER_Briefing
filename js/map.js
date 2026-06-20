/* ================================================================
   VERBENA — MAPA DIBUJABLE (Leaflet + OpenStreetMap)
   Componente reutilizable para "¿Cuál es tu área de influencia?".
   Permite dibujar uno o varios polígonos libres sobre un mapa
   real, con zoom y buscador de direcciones.

   Requiere que el HTML cargue, ANTES de este script:
   - Leaflet CSS + JS (CDN, ver <head> de la página)
   - Leaflet.draw CSS + JS (plugin de dibujo, CDN)

   Uso: VerbenaMap.init('id-del-contenedor')
   Devuelve un objeto con:
   - getGeoJSON()  → las formas dibujadas, como texto JSON
   - getCount()    → cuántas zonas se han dibujado
   - captureImage(callback) → genera una imagen PNG del mapa
                              actual (usado para subir a Drive)
================================================================ */

const VerbenaMap = {
    init(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container || typeof L === 'undefined') {
            console.warn('VerbenaMap: contenedor no encontrado o Leaflet no cargado');
            return null;
        }

        // Vista inicial: España centrada, zoom moderado. Se puede
        // ajustar a la ubicación del cliente más adelante si hace falta.
        const map = L.map(containerId, {
            center: options.center || [40.4168, -3.7038],
            zoom: options.zoom || 6,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
            maxZoom: 19,
        }).addTo(map);

        // Buscador de direcciones (usa Nominatim, el geocoder
        // gratuito de OpenStreetMap, sin necesidad de API key)
        const searchControl = L.control({ position: 'topleft' });
        searchControl.onAdd = function () {
            const div = L.DomUtil.create('div', 'map-search-box');
            div.innerHTML = `
        <input type="text" class="map-search-input" placeholder="Buscar dirección o lugar...">
      `;
            L.DomEvent.disableClickPropagation(div);
            return div;
        };
        searchControl.addTo(map);

        const searchInput = container.querySelector('.map-search-input');
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            const query = searchInput.value.trim();
            if (query.length < 3) return;

            searchTimeout = setTimeout(async () => {
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=es&accept-language=es`
                    );
                    const results = await res.json();
                    if (results.length > 0) {
                        const { lat, lon } = results[0];
                        map.setView([lat, lon], 13);
                    }
                } catch (err) {
                    console.warn('Búsqueda de dirección falló:', err);
                }
            }, 600);
        });

        // Capa donde se guardan las formas dibujadas
        const drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);

        const drawControl = new L.Control.Draw({
            draw: {
                polygon: { allowIntersection: false, showArea: true },
                polyline: false,
                circle: false,
                circlemarker: false,
                marker: false,
                rectangle: true,
            },
            edit: {
                featureGroup: drawnItems,
            },
        });
        map.addControl(drawControl);

        map.on(L.Draw.Event.CREATED, (e) => {
            drawnItems.addLayer(e.layer);
        });

        return {
            map,
            drawnItems,

            getGeoJSON() {
                return JSON.stringify(drawnItems.toGeoJSON());
            },

            getCount() {
                return drawnItems.getLayers().length;
            },

            /* Genera una imagen del estado actual del mapa (incluyendo
               las zonas dibujadas) usando leaflet-image. Devuelve un
               dataURL (base64) vía callback, listo para enviar a
               Apps Script y guardarlo como archivo en Drive. */
            captureImage(callback) {
                if (typeof leafletImage === 'undefined') {
                    console.warn('VerbenaMap: leaflet-image no está cargado, no se puede capturar.');
                    callback(null);
                    return;
                }
                leafletImage(map, (err, canvas) => {
                    if (err) {
                        console.warn('Error al capturar el mapa:', err);
                        callback(null);
                        return;
                    }
                    callback(canvas.toDataURL('image/png'));
                });
            },
        };
    },
};