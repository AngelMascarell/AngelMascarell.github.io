let isScrolling = false; // Controla si una transición está en curso

// Función para realizar el scroll suave
function smoothScrollTo(target) {
    if (isScrolling) return;

    isScrolling = true;
    const start = window.scrollY;
    const distance = target - start;
    const duration = 400;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        window.scrollTo(0, start + distance * progress);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        } else {
            isScrolling = false; // Transición completada
        }
    }

    requestAnimationFrame(animation);
}

// Resalta el botón o punto correspondiente según la sección visible
function highlightActiveNavigation() {
    const sections = document.querySelectorAll('section');
    const buttons = document.querySelectorAll('.nav-link'); // Asegúrate de que los botones tengan esta clase
    const dots = document.querySelectorAll('.dot'); // Puntos de navegación

    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionBottom = rect.bottom;

        if (sectionTop <= window.innerHeight * 0.6 && sectionBottom >= window.innerHeight * 0.4) {
            // Resalta el botón correspondiente
            buttons.forEach(button => {
                button.classList.remove('active'); // Elimina la clase 'active' de todos los botones
            });
            buttons[index].classList.add('active'); // Agrega la clase 'active' al botón correspondiente

            // Resalta el punto de navegación correspondiente
            dots.forEach(dot => {
                dot.classList.remove('active'); // Elimina la clase 'active' de todos los puntos
            });
            dots[index].classList.add('active'); // Agrega la clase 'active' al punto correspondiente
        }
    });
}

// Función de scroll con la rueda del mouse
function scrollToSection(event) {
    event.preventDefault(); // Evita el scroll predeterminado

    const sections = document.querySelectorAll('section');
    let currentSection = null;
    const scrollDirection = event.deltaY;

    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.6 && rect.bottom >= window.innerHeight * 0.4) {
            currentSection = section;
        }
    });

    if (currentSection) {
        const firstSection = sections[0];
        const lastSection = sections[sections.length - 1];

        let targetSection = null;
        if (scrollDirection > 0 && currentSection !== lastSection) {
            targetSection = currentSection.nextElementSibling;
        } else if (scrollDirection < 0 && currentSection !== firstSection) {
            targetSection = currentSection.previousElementSibling;
        }

        if (targetSection) {
            smoothScrollTo(targetSection.offsetTop);
            highlightActiveNavigation(); // Actualiza los botones y puntos resaltados
        }
    }
}

// Bloquea el desplazamiento con el touchpad/rueda del mouse
window.addEventListener('wheel', scrollToSection, { passive: false });

// Bloquea el desplazamiento táctil en móviles
window.addEventListener('touchmove', (event) => event.preventDefault(), { passive: false });

// Llama a la función para resaltar el botón y los puntos al hacer scroll
window.addEventListener('scroll', highlightActiveNavigation);

// Llama a la función para resaltar el botón y los puntos cuando la página carga
document.addEventListener('DOMContentLoaded', highlightActiveNavigation);
