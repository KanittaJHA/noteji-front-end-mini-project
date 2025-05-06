/** @type {import('tailwindcss').Config} */

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#ED9889",
                secondary1: "#F0BDA6",
                secondary2: "#EE9687",
                secondary3: "#F7E4D0",
                secondary4: "#9AC7E3"
            },
        },
    },
    plugins: [],
};
