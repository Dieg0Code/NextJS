import { SimplePokemon } from '@/pokemons';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface PokemonState {
    favorites: { [key: string]: SimplePokemon }
}

// const getInitialStateFromLocalStorage = (): PokemonState => {
//     // if (typeof localStorage === "undefined") return {};

//     const favorites = JSON.parse(localStorage.getItem("favorite-pokemons") ?? "{}");

//     return favorites
// }

const initialState: PokemonState = {
    favorites: {},
    // Aquí podrías agregar algunos Pokémon de ejemplo si lo deseas.
    // "1": {
    //     id: "1",
    //     name: "Bulbasaur",
    // }
}

const pokemonsSlice = createSlice({
    name: "pokemons",
    initialState,
    reducers: {
        setFavoritePokemons(state, action: PayloadAction<{ [key: string]: SimplePokemon }>) {
            state.favorites = action.payload;
        },

        toggleFavorite(state, action: PayloadAction<SimplePokemon>) {
            const pokemon = action.payload;
            const { id } = pokemon;

            if (!!state.favorites[id]) {
                delete state.favorites[id];
                // return;
            } else {
                state.favorites[id] = pokemon;

            }

            // Esto no se debería hacer en Redux.
            localStorage.setItem("favorite-pokemons", JSON.stringify(state.favorites));

        }
    }
});

export const { toggleFavorite, setFavoritePokemons } = pokemonsSlice.actions

export default pokemonsSlice.reducer