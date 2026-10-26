# NETCLONE — clon de Netflix

Clon de la interfaz de Netflix hecho con HTML, CSS y JavaScript puro (sin dependencias ni compilación).

## Cómo funciona Netflix (y qué replica este clon)

| Netflix | NETCLONE |
|---|---|
| **Perfiles**: cada cuenta tiene varios perfiles con su propio historial, lista y recomendaciones; los perfiles infantiles solo ven contenido apto. | Pantalla "¿Quién está viendo ahora?" con 4 perfiles. Cada uno guarda sus datos por separado y el perfil *Niños* filtra el catálogo. |
| **Portada (billboard)**: un título destacado a pantalla completa con *Reproducir* y *Más información*. | Portada aleatoria con badge Top 10, clasificación por edad y botones. |
| **Filas personalizadas**: la página de inicio es una lista de filas ("Seguir viendo", "Top 10", "Tendencias", géneros…) generadas para cada perfil. | Filas calculadas a partir del catálogo (`js/data.js` → `ROWS`), con scroll horizontal y flechas. |
| **Vista previa al pasar el ratón**: la tarjeta crece y muestra acciones, % de coincidencia, edad y géneros. | Igual, con reproducir, añadir a Mi lista y abrir detalles. |
| **Top 10** con números gigantes junto al póster. | Fila Top 10 con números contorneados. |
| **Ficha de detalles**: sinopsis, episodios por temporada y "Más títulos similares". | Modal con episodios (series) y similares por coincidencia de géneros. |
| **Mi lista**. | Botón `+`/`✓`; se guarda por perfil. |
| **Seguir viendo**: guarda el punto donde lo dejaste y muestra una barra de progreso. | Se guarda el progreso del vídeo; al volver a reproducir reanuda desde ahí. |
| **Búsqueda** por título, género o descripción. | Buscador instantáneo (ignora tildes). |
| **Navegación**: Inicio, Series, Películas, Mi lista; la barra se vuelve opaca al hacer scroll. | Igual. |

En Netflix todo esto vive en servidores (catálogo, recomendaciones, progreso) y el vídeo se sirve por streaming adaptativo desde su CDN. Aquí el catálogo es estático, los datos de cada perfil se guardan en `localStorage` y los vídeos son películas abiertas de la Blender Foundation.

## Ejecutar

Abre `index.html` en el navegador, o sirve la carpeta:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Estructura

```
index.html      Estructura de pantallas (perfiles, catálogo, modal, reproductor)
css/styles.css  Estilos y diseño responsive
js/data.js      Perfiles, catálogo de títulos ficticios y definición de filas
js/app.js       Lógica: render, Mi lista, progreso, búsqueda, modal y reproductor
```

Para añadir títulos, edita `TITLES` en `js/data.js`; para nuevas filas, añade una entrada a `ROWS` con su `filter`.

Proyecto educativo. Los títulos son ficticios y las imágenes de relleno vienen de picsum.photos.
