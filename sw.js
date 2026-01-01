self.addEventListener("install", event => {
  console.log("Service Worker instalado.");
});

self.addEventListener("fetch", event => {
  // Puedes agregar lógica de caché si lo deseas
});
