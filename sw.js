// Importar la CDN de Workbox

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js')

// Verificamos si la variable workbox está definida y disponible
if(workbox){
    console.log('Workbox está cargado')
    workbox.precaching.precacheAndRoute([])

    // Cache de imagenes en la carpeta public/img
    workbox.routing.registerRoute(
        /(.*others(.*)\.(?:png|gif|jpg|jpeg|svg))/,
        new workbox.strategies.CacheFirst({
            cacheName: 'images',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                })
            ]
        })
    )

    // Hacemos que el contenido en JS y CSS sean rapidos devolviendo los assets de la cache
    workbox.routing.registerRoute(
        // Cache de js, css y archivos de CDN
        /.*\.(?:css|js|scss|sass)/,

        // Usamos el cache para actualizar en 2do plano
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'assets',
        })
    )

    // Cache de Fuentes de Google
    workbox.routing.registerRoute(
        new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
        new workbox.strategies.CacheFirst({
            cacheName: 'google-fonts',
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                }),
            ],
        })
    )

    // Agregar analisis offline
    workbox.googleAnalytics.initialize()

    // Instalar un nuevo service worker
    workbox.core.skipWaiting()
    workbox.core.clientsClaim()
} else {
    console.log('Workbox fallo')
}