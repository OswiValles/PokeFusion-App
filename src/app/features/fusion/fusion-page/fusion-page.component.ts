import { Component, inject, OnInit } from '@angular/core';
import { PokemonService } from '../../../core/pokemon.service'; 
import { PokemonBase, PokemonFusion } from '../../../core/models/pokemon.model';
import { forkJoin, finalize, map, Observable, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common'; 
import { FusionService } from '../../../features/fusion/fusion.service';
import { FavoritesService } from '../../../features/favorites/favorites.service';
import { PLATFORM_ID } from '@angular/core'; 
import { isPlatformBrowser } from '@angular/common'; 

@Component({
  selector: 'app-fusion-page',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './fusion-page.component.html',
  styleUrls: ['./fusion-page.component.scss']
})
export class FusionPageComponent implements OnInit {
  private pokemonService = inject(PokemonService);
  private fusionService = inject(FusionService);
  private platformId = inject(PLATFORM_ID);

  private favoritesService = inject(FavoritesService); 
  
  fusedPokemon: PokemonFusion | null = null;
  
  favorites$: Observable<PokemonFusion[]> | null = null;

  isLoading: boolean = false;
  error: string | null = null;

  basePokemon: PokemonBase[] = [];

  constructor() { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
        this.favorites$ = this.favoritesService.getFavorites();
        this.loadRandomPokemon(); 
    }
  }

  /**
   * Dispara la lógica de fusión con los 3 Pokémon base actuales.
   */
  private runFusion(): void {
    if (this.basePokemon.length === 3) {
      this.fusionService.performFusion(this.basePokemon)
        .subscribe({
          next: (fusionResult: PokemonFusion) => {
            this.fusedPokemon = fusionResult;
            console.log('Fusión Inicial Lista:', this.fusedPokemon);
          },
          error: (err) => {
            this.error = 'Error al calcular la fusión. Revisa el FusionService.';
            console.error(err);
          }
        });
    }
  }

  reFuse(): void {
    if (this.basePokemon.length === 3) {
      console.log('Iniciando re-fusión...');
      this.runFusion(); 
    }
  }

  
  /**
   * Carga 3 Pokémon aleatorios.
   */
    loadRandomPokemon(): void {
      this.isLoading = true;
      this.error = null;
      this.basePokemon = [];

      // 1. Generar 3 observables para obtener 3 IDs aleatorios
      const randomIds = [
        this.pokemonService.getRandomPokemonId(),
        this.pokemonService.getRandomPokemonId(),
        this.pokemonService.getRandomPokemonId(),
      ];

      // 2. Crear 3 observables de peticiones de Pokémon
      const pokemonRequests: Observable<PokemonBase>[] = randomIds.map(id => 
        this.pokemonService.getPokemon(id)
      );

      // 3. Usar forkJoin para esperar que las 3 peticiones terminen
      forkJoin(pokemonRequests)
          .pipe(
              finalize(() => this.isLoading = false)
          )
          .subscribe({
              next: (pokemons: PokemonBase[]) => {
                  this.basePokemon = pokemons;

                  this.runFusion();
              },
              error: (err) => {
                  this.error = 'Ocurrió un error al cargar los Pokémon. Intenta de nuevo.';
                  console.error(err);
              }
          });
    } 

    saveFavorite(): void {
      if (this.fusedPokemon) {
        const pokemonToSave: PokemonFusion = { ...this.fusedPokemon }; 
        if (!pokemonToSave.id) {
        }
        
        this.favoritesService.addFavorite(pokemonToSave)
          .then(() => {
            console.log(`¡${this.fusedPokemon?.name} guardado en favoritos!`);
          })
          .catch(err => {
            console.error('Error al guardar en Firestore:', err);
          });
      }
    }

    // función para obtener los tipos como un string legible
    public getPokemonTypes(pokemon: PokemonBase): string {
        const types = pokemon.types?.map(t => t.type.name).join(', ');
        return types ? types : 'N/A';
    }

    /**
     * Llama al servicio de favoritos para eliminar un Pokémon por su nombre/ID.
     */
    removeFavorite(name: string): void {
        this.favoritesService.deleteFavorite(name)
            .then(() => {
                console.log(`¡${name} eliminado con éxito! La lista se actualizará automáticamente.`);
            })
            .catch(err => {
                this.error = 'Error al eliminar el favorito.';
                console.error(err);
            });
    }
}