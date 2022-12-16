/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js}'],
    theme: {
        extend: {
            colors: {
                primary: '#a1b9de',
            },
            transitionDuration: {
                DEFAULT: '400ms',
            },
        },
    },
    plugins: [],
}
