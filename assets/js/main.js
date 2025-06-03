const hero = document.querySelector('.hero');
const toggleButton = document.getElementById('toggleLight');
const dragons = document.querySelectorAll('.drag-overlay');
const toggleIcon = document.getElementById('toggleIcon');

toggleButton.addEventListener('click', () => {
    hero.classList.toggle('dark-mode');

    if (hero.classList.contains('dark-mode')) {
        toggleIcon.classList.remove('bi-moon-fill');
        toggleIcon.classList.add('bi-sun-fill');
        toggleButton.classList.remove('btn-outline-light');
        toggleButton.classList.add('btn-outline-warning');
    } else {
        toggleIcon.classList.remove('bi-sun-fill');
        toggleIcon.classList.add('bi-moon-fill');
        toggleButton.classList.remove('btn-outline-warning');
        toggleButton.classList.add('btn-outline-light');
    }
});

hero.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;

    hero.style.setProperty('--mouse-x', `${x}%`);
    hero.style.setProperty('--mouse-y', `${y}%`);

    if (hero.classList.contains('dark-mode')) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        dragons.forEach((dragon) => {
            const rect = dragon.getBoundingClientRect();
            const dragonCenterX = rect.left + rect.width / 2;
            const dragonCenterY = rect.top + rect.height / 2;

            const distance = Math.hypot(mouseX - dragonCenterX, mouseY - dragonCenterY);

            if (distance < 150) {
                dragon.classList.add('lit');
            } else {
                dragon.classList.remove('lit');
            }
        });
    } else {
        dragons.forEach((dragon) => dragon.classList.remove('lit'));
    }
});

