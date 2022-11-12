export default () => ({
    port: parseInt(process.env.PORT) || 3000,
    pokemonService: {
        apiKey: process.env.POKEMEON_KEY,
    },
    secretKey: process.env.SECRET_KEY
});