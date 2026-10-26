// Catálogo de ejemplo. En el Netflix real esto llega de una API según el perfil
// y el algoritmo de recomendación; aquí es estático y los títulos son ficticios.

const PROFILES = [
  { id: 'p1', name: 'Sara', color: '#e50914' },
  { id: 'p2', name: 'Familia', color: '#2b7bd6' },
  { id: 'p3', name: 'Invitado', color: '#f5b50a' },
  { id: 'p4', name: 'Niños', color: '#22a35a', kids: true },
];

// Vídeos de muestra de dominio público / Creative Commons.
const SAMPLE_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
];

const TITLES = [
  { id: 1, title: 'La Casa del Eco', type: 'serie', year: 2025, rating: '16+', match: 98, seasons: 3, genres: ['Thriller', 'Drama'], kids: false, top10: 1,
    desc: 'Un grupo de ladrones planea el golpe perfecto en una ciudad donde cada sonido queda registrado para siempre.' },
  { id: 2, title: 'Horizonte Rojo', type: 'pelicula', year: 2024, rating: '13+', match: 94, duration: '2 h 4 min', genres: ['Ciencia ficción', 'Acción'], kids: false, top10: 2,
    desc: 'La primera misión tripulada a Marte descubre que no son los primeros en llegar.' },
  { id: 3, title: 'Cocina Salvaje', type: 'serie', year: 2023, rating: '7+', match: 89, seasons: 2, genres: ['Reality', 'Gastronomía'], kids: true, top10: 3,
    desc: 'Chefs aficionados cocinan con lo que encuentran en la naturaleza. El jurado no perdona.' },
  { id: 4, title: 'Sombras de Medianoche', type: 'serie', year: 2025, rating: '18+', match: 92, seasons: 1, genres: ['Terror', 'Misterio'], kids: false, top10: 4,
    desc: 'En un pueblo costero, cada medianoche alguien olvida quién es.' },
  { id: 5, title: 'El Último Verano', type: 'pelicula', year: 2022, rating: '13+', match: 85, duration: '1 h 48 min', genres: ['Romance', 'Drama'], kids: false, top10: 5,
    desc: 'Dos amigos de la infancia se reencuentran el verano antes de que todo cambie.' },
  { id: 6, title: 'Dragones de Papel', type: 'pelicula', year: 2024, rating: 'TP', match: 96, duration: '1 h 32 min', genres: ['Animación', 'Familiar'], kids: true, top10: 6,
    desc: 'Una niña descubre que los dragones que dibuja cobran vida al anochecer.' },
  { id: 7, title: 'Código Fantasma', type: 'serie', year: 2024, rating: '16+', match: 91, seasons: 2, genres: ['Tecnología', 'Thriller'], kids: false, top10: 7,
    desc: 'Una hacker descubre un programa que predice crímenes antes de que ocurran.' },
  { id: 8, title: 'Reyes del Asfalto', type: 'pelicula', year: 2023, rating: '16+', match: 80, duration: '2 h 11 min', genres: ['Acción'], kids: false, top10: 8,
    desc: 'Carreras ilegales, deudas y una última vuelta que lo decide todo.' },
  { id: 9, title: 'Planeta Azul Profundo', type: 'serie', year: 2021, rating: 'TP', match: 97, seasons: 4, genres: ['Documental', 'Naturaleza'], kids: true, top10: 9,
    desc: 'Explora los rincones más remotos del océano y las criaturas que nadie había visto.' },
  { id: 10, title: 'Risas en Cadena', type: 'serie', year: 2025, rating: '12+', match: 88, seasons: 5, genres: ['Comedia'], kids: false, top10: 10,
    desc: 'Un hotel caótico, un gerente desesperado y huéspedes imposibles.' },
  { id: 11, title: 'El Reino Olvidado', type: 'serie', year: 2023, rating: '16+', match: 93, seasons: 3, genres: ['Fantasía', 'Aventura'], kids: false,
    desc: 'Cinco casas luchan por un trono que nadie recuerda quién construyó.' },
  { id: 12, title: 'Detective Lunar', type: 'pelicula', year: 2021, rating: '12+', match: 84, duration: '1 h 56 min', genres: ['Misterio', 'Comedia'], kids: false,
    desc: 'El único detective de la base lunar tiene 48 horas para resolver un robo imposible.' },
  { id: 13, title: 'Pequeños Exploradores', type: 'serie', year: 2024, rating: 'TP', match: 95, seasons: 2, genres: ['Animación', 'Infantil'], kids: true,
    desc: 'Tres amigos y su robot recorren el mundo aprendiendo algo nuevo cada día.' },
  { id: 14, title: 'Frontera Norte', type: 'pelicula', year: 2025, rating: '18+', match: 90, duration: '2 h 20 min', genres: ['Crimen', 'Drama'], kids: false,
    desc: 'Una agente infiltrada descubre que el cártel está más cerca de lo que pensaba.' },
  { id: 15, title: 'Notas de Medianoche', type: 'pelicula', year: 2022, rating: '7+', match: 82, duration: '1 h 40 min', genres: ['Musical', 'Romance'], kids: false,
    desc: 'Un pianista de bar y una cantante sin voz componen la canción de sus vidas.' },
  { id: 16, title: 'Zona Cero', type: 'serie', year: 2024, rating: '18+', match: 87, seasons: 1, genres: ['Terror', 'Ciencia ficción'], kids: false,
    desc: 'Tras un apagón global, los supervivientes descubren que la oscuridad no está vacía.' },
  { id: 17, title: 'Futbolín FC', type: 'serie', year: 2025, rating: '7+', match: 86, seasons: 2, genres: ['Comedia', 'Deportes'], kids: true,
    desc: 'El peor equipo de la liga juvenil tiene un plan: ganar al menos un partido.' },
  { id: 18, title: 'La Herencia', type: 'pelicula', year: 2020, rating: '16+', match: 79, duration: '1 h 52 min', genres: ['Thriller', 'Misterio'], kids: false,
    desc: 'Seis herederos, una mansión aislada y un testamento con trampa.' },
  { id: 19, title: 'Cielos de Acero', type: 'pelicula', year: 2023, rating: '13+', match: 91, duration: '2 h 2 min', genres: ['Acción', 'Bélico'], kids: false,
    desc: 'Una escuadrilla de pilotos se enfrenta a su última misión imposible.' },
  { id: 20, title: 'Mentes Brillantes', type: 'serie', year: 2022, rating: '12+', match: 90, seasons: 3, genres: ['Documental', 'Ciencia'], kids: true,
    desc: 'Los descubrimientos que cambiaron el mundo, contados por quienes los hicieron.' },
  { id: 21, title: 'Tango Final', type: 'pelicula', year: 2021, rating: '16+', match: 83, duration: '1 h 58 min', genres: ['Drama', 'Romance'], kids: false,
    desc: 'En el Buenos Aires de los años 40, un bailarín arriesga todo por un último baile.' },
  { id: 22, title: 'Isla Misterio', type: 'serie', year: 2025, rating: '13+', match: 94, seasons: 1, genres: ['Aventura', 'Misterio'], kids: false,
    desc: 'Un vuelo comercial aterriza en una isla que no aparece en ningún mapa.' },
  { id: 23, title: 'Monstruos S.L.', type: 'pelicula', year: 2024, rating: 'TP', match: 92, duration: '1 h 35 min', genres: ['Animación', 'Comedia'], kids: true,
    desc: 'Los monstruos de debajo de la cama montan una empresa... y no les va bien.' },
  { id: 24, title: 'Noches de Neón', type: 'serie', year: 2023, rating: '18+', match: 88, seasons: 2, genres: ['Crimen', 'Ciencia ficción'], kids: false,
    desc: 'En una megaciudad del futuro, un detective androide busca a su creador.' },
].map((t, i) => ({
  ...t,
  // Degradado de respaldo por si las imágenes no cargan.
  fallback: `linear-gradient(135deg, hsl(${(t.id * 47) % 360} 60% 32%), hsl(${(t.id * 47 + 60) % 360} 50% 12%))`,
  // Imágenes de relleno deterministas por título (picsum.photos).
  backdrop: `https://picsum.photos/seed/netclone-${t.id}/1280/720`,
  thumb: `https://picsum.photos/seed/netclone-${t.id}/480/270`,
  video: SAMPLE_VIDEOS[i % SAMPLE_VIDEOS.length],
}));

// Filas del inicio. Cada fila es una "categoría" calculada sobre el catálogo,
// igual que Netflix compone su página con filas personalizadas.
const ROWS = [
  { id: 'continue', title: 'Seguir viendo', dynamic: 'continue' },
  { id: 'mylist', title: 'Mi lista', dynamic: 'mylist' },
  { id: 'top10', title: 'Top 10 en España hoy', filter: t => t.top10, sort: (a, b) => a.top10 - b.top10, top10: true },
  { id: 'trending', title: 'Tendencias ahora', filter: t => t.match >= 90 },
  { id: 'new', title: 'Novedades', filter: t => t.year >= 2025 },
  { id: 'series', title: 'Series aclamadas', filter: t => t.type === 'serie' },
  { id: 'action', title: 'Acción y aventura', filter: t => t.genres.some(g => ['Acción', 'Aventura', 'Bélico'].includes(g)) },
  { id: 'scifi', title: 'Ciencia ficción y fantasía', filter: t => t.genres.some(g => ['Ciencia ficción', 'Fantasía'].includes(g)) },
  { id: 'thriller', title: 'Thrillers y misterio', filter: t => t.genres.some(g => ['Thriller', 'Misterio', 'Crimen'].includes(g)) },
  { id: 'comedy', title: 'Comedias', filter: t => t.genres.includes('Comedia') },
  { id: 'docs', title: 'Documentales', filter: t => t.genres.includes('Documental') },
  { id: 'family', title: 'Para toda la familia', filter: t => t.kids },
];
