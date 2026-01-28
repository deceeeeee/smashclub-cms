/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'bg-dark': '#0f172a', // Aligning with your CSS variables mostly, but setting up Tailwind tokens
                'primary': '#00d2be',
                'primary-hover': '#00b8a5',
            }
        },
    },
    plugins: [],
}
