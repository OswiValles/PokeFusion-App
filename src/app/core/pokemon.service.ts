import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PokemonBase } from './models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2/pokemon/';
  // Usaremos este número para simular la aleatoriedad, ya que la API no tiene un endpoint para esto.
  private readonly totalPokemon = 1025; // Número aproximado de Pokémon en la PokeAPI V2 (a la fecha de este reto)

  constructor(private http: HttpClient) { }

  /**
   * Genera un ID de Pokémon aleatorio entre 1 y el número total de Pokémon.
   * @returns El ID del Pokémon (number).
   */
  public getRandomPokemonId(): number {
    return Math.floor(Math.random() * this.totalPokemon) + 1;
  }

  /**
   * Obtiene los datos de un Pokémon de la PokeAPI.
   * @param id El ID o nombre del Pokémon.
   * @returns Un Observable con los datos del Pokémon.
   */
  public getPokemon(id: number | string): Observable<any> {
    // Aseguramos que la entrada sea en minúsculas si es un string (para nombres)
    const query = typeof id === 'string' ? id.toLowerCase() : id;
    const url = `${this.baseUrl}${query}`;

    // La IA puede ayudarte a definir la interfaz precisa para 'any' (¡paso 4!)
    return this.http.get<PokemonBase>(url);
  }
}
