/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brandBlue: '#1d60de', // The blue color from the design
                brandGray: '#4b5563',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Or 'Roboto'
            }
        },
    },
    plugins: [],
}
