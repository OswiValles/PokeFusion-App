import { inject, Injectable } from '@angular/core'; 
import { Observable } from 'rxjs'; 

import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  setDoc,
  CollectionReference,
  deleteDoc
} from '@angular/fire/firestore';

import { PokemonFusion } from '../../core/models/pokemon.model'; 

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private firestore: Firestore = inject(Firestore); 
  
  private favoritesCollection = collection(this.firestore, 'favorites') as CollectionReference<PokemonFusion>;

  constructor() {
  }

  /**
   * Obtiene la lista de todos los Pokémon fusionados guardados en Firestore.
   */
  getFavorites(): Observable<PokemonFusion[]> {
    return collectionData(this.favoritesCollection, { idField: 'id' }) as Observable<PokemonFusion[]>;
  }

  /**
   * Guarda un Pokémon fusionado como favorito en Firestore.
   */
  async addFavorite(pokemon: PokemonFusion): Promise<void> {
    const docRef = doc(this.favoritesCollection, pokemon.name); 
    await setDoc(docRef, pokemon);
  }

  /**
   * Elimina un Pokémon de la colección de favoritos en Firestore.
   * @param name El nombre del Pokémon (usado como ID del documento).
   */
  async deleteFavorite(name: string): Promise<void> {
      const docRef = doc(this.favoritesCollection, name); 
  
      await deleteDoc(docRef);
      console.log(`Documento ${name} eliminado de favoritos.`);
  }
}