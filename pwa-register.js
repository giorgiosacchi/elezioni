// Integrazione PWA separata dal programma delle elezioni.
if ("serviceWorker" in navigator && location.protocol === "https:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js", { scope: "./" })
      .catch(error => console.warn("Service worker non disponibile:", error));
  }, { once: true });
}
