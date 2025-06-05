const darkButton = document.getElementById('dark');
const lightButton = document.getElementById('light');
const labelDark = document.querySelector('label[for="dark"]');
const labelLight = document.querySelector('label[for="light"]');

const setDarkMode = () => {
    document.querySelector('body').classList = 'dark';
    labelDark.classList.remove('visually-hidden');
    labelLight.classList.toggle('visually-hidden');
    localStorage.setItem('theme', 'dark');
};

const setLightMode = () => {
    document.querySelector('body').classList = 'light';
    labelLight.classList.remove('visually-hidden');
    labelDark.classList.toggle('visually-hidden');
    localStorage.setItem('theme', 'light');
};

const colorModeFromLocalStorage = () => {
    return localStorage.getItem('theme');
}

const colorModeFromPreferences = () => {
    return window.matchMedia('(prefers-color-scheme: dark').matches ? 'dark' : 'light';
};

const loadAndUpdateColor = () => {
    const color = colorModeFromLocalStorage() || colorModeFromPreferences();
    color === 'dark' ? darkButton.click() : lightButton.click();
}

const radioButtons = document.querySelectorAll('.toggle__wrapper input');
radioButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        darkButton.checked ? setDarkMode() : setLightMode();
    });
});


window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => {
        event.matches ? darkButton.click() : lightButton.click();
    });

loadAndUpdateColor();