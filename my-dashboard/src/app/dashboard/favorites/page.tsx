import { PokemonsGrid } from "@/pokemons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favoritos",
  description: "lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};

export default async function PokemonsPage() {
  return (
    <div className="flex flex-col">
      <span className="text-5xl my-2">
        Pokémons Favoritos <small className="text-blue-500">Global State</small>
      </span>

      <PokemonsGrid pokemons={[]} />
    </div>
  );
}
