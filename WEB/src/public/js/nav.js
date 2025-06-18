document.addEventListener("DOMContentLoaded", () => {
    const navMenu = document.getElementById("nav-menu");
    const navToggle = document.getElementById("nav-toggle");
    const navClose = document.getElementById("nav-close");

    const handleMissingElement = (element, message) => {
        if (!element) {
            return true;
        }
        return false;
    };

    if (
        handleMissingElement(navMenu, "No se encontró el menú de navegación.") ||
        handleMissingElement(
            navToggle,
            "No se encontró el botón para mostrar el menú."
        )
    ) {
        return;
    }

    if (navToggle) {
        navToggle.addEventListener("click", () => {
            navMenu.classList.add("show-menu");
        });
    }

    if (navClose) {
        navClose.addEventListener("click", () => {
            navMenu.classList.remove("show-menu");
        });
    }
});
