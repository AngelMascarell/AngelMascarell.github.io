let isScrolling = false;

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
            isScrolling = false;
        }
    }

    requestAnimationFrame(animation);
}

function highlightActiveNavigation() {
    const sections = document.querySelectorAll('section');
    const buttons = document.querySelectorAll('.nav-link');
    const dots = document.querySelectorAll('.dot');

    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionBottom = rect.bottom;

        if (sectionTop <= window.innerHeight * 0.6 && sectionBottom >= window.innerHeight * 0.4) {
            buttons.forEach(button => {
                button.classList.remove('active');
            });
            buttons[index].classList.add('active');

            dots.forEach(dot => {
                dot.classList.remove('active');
            });
            dots[index].classList.add('active');
        }
    });
}

function scrollToSection(event) {
    event.preventDefault();

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
            highlightActiveNavigation();
        }
    }
}

window.addEventListener('wheel', scrollToSection, { passive: false });

window.addEventListener('touchmove', (event) => event.preventDefault(), { passive: false });

window.addEventListener('scroll', highlightActiveNavigation);

document.addEventListener('DOMContentLoaded', highlightActiveNavigation);
