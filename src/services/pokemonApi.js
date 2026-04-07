/**
 * pokemonApi.js
 * Handle komunikasi API untuk aplikasi PokeDeck.
 */

const BASE_URL = 'https://pokeapi.co/api/v2';

// 1. Ambil list Pokemon beserta detail lengkap (stats & sprites) secara paralel
export const getPokemonList = async (limit = 151, offset = 0) => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    
    // Fetch detail tiap Pokemon secara bersamaan untuk efisiensi
    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        return await res.json();
      })
    );
    
    return pokemonDetails;
  } catch (error) {
    console.error("Gagal ambil data Pokemon List:", error);
    return [];
  }
};

// 2. Ambil semua tipe elemen Pokemon (kecuali shadow & unknown) untuk filter
export const getPokemonTypes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/type`);
    const data = await response.json();
    return data.results.filter(t => t.name !== 'unknown' && t.name !== 'shadow');
  } catch (error) {
    console.error("Gagal ambil data Types:", error);
    return [];
  }
};

// 3. Ambil daftar item (inventory) beserta detail gambarnya
export const getItemsList = async (limit = 50, offset = 0) => {
  try {
    const response = await fetch(`${BASE_URL}/item?limit=${limit}&offset=${offset}`);
    const data = await response.json();

    const itemDetails = await Promise.all(
      data.results.map(async (item) => {
        const res = await fetch(item.url);
        return await res.json();
      })
    );

    return itemDetails;
  } catch (error) {
    console.error("Gagal ambil data Items:", error);
    return [];
  }
};

// 4. Ambil data rantai evolusi berdasarkan URL species Pokemon
export const getEvolutionChain = async (speciesUrl) => {
  try {
    const speciesRes = await fetch(speciesUrl);
    const speciesData = await speciesRes.json();
    
    const evoRes = await fetch(speciesData.evolution_chain.url);
    const evoData = await evoRes.json();
    
    return evoData;
  } catch (error) {
    console.error("Gagal ambil data Evolution Chain:", error);
    return null;
  }
};

// 5. Ambil detail species (deskripsi/flavor text) untuk tampilan Modal
export const getPokemonSpecies = async (idOrName) => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon-species/${idOrName}`);
    return await response.json();
  } catch (error) {
    console.error("Gagal ambil data Species:", error);
    return null;
  }
};