import { Injectable } from '@angular/core';
import { PokemonBase, PokemonFusion } from '../../core/models/pokemon.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FusionService {
  
  performFusion(bases: PokemonBase[]): Observable<PokemonFusion> {
    
    // --- Lógica de Stats (Implementada) ---
    const fusionStats = this.calculateFusionStats(bases);
    
    // --- Lógica de Tipos (Ya implementada y funcional) ---
    const fusionTypes = this.calculateFusionTypes(bases);

    // --- Lógica de Naming (Ya implementada y funcional) ---
    const newName = this.generateFusionName(bases.map(p => p.name));
    
    // --- Lógica de Movimientos (Implementada) ---
    const fusionMoves = this.selectFusionMoves(bases);

    const fusionResult: PokemonFusion = {
      name: newName,
      types: fusionTypes,
      stats: fusionStats,
      moves: fusionMoves,
      basePokemonIds: bases.map(p => p.id),
    };

    return of(fusionResult); 
  }


   /**
   * REGLA DE IA/HEURÍSTICA: Promedia el valor de cada estadística entre los 3 Pokémon base.
   */
    private calculateFusionStats(bases: PokemonBase[]): { name: string; value: number }[] {
      const combinedStats: { [key: string]: number } = {};
      const averagedStats: { name: string; value: number }[] = [];

      // ... (Código para sumar los stats - ELIMINADO para brevedad) ...

      // 1. Sumar los stats de los 3 Pokémon
      bases.forEach(pokemon => {
          pokemon.stats.forEach(statWrapper => {
              const name = statWrapper.stat.name;
              const value = statWrapper.base_stat;
              combinedStats[name] = (combinedStats[name] || 0) + value;
          });
      });

      // 2. Calcular el promedio y añadir variación
      Object.entries(combinedStats).forEach(([name, sum]) => {
          let baseValue = Math.floor(sum / 3);

          // 🟥 CORRECCIÓN: Agregar un factor de variación de +/- 5%
          const variationFactor = 1 + (Math.random() * 0.10 - 0.05); // Genera valor entre 0.95 y 1.05
          let finalValue = Math.floor(baseValue * variationFactor);

          // Asegurarse de que el stat sea al menos 1
          if (finalValue < 1) finalValue = 1;

          averagedStats.push({ name: name, value: finalValue });
      });

      return averagedStats;
  }

  /**
   * REGLA DE IA/HEURÍSTICA: Seleccionar 1-2 movimientos de manera heurística.
   * Implementación: Tomar un movimiento aleatorio de cada Pokémon base, sin duplicados.
   */
  private selectFusionMoves(bases: PokemonBase[]): string[] {
    const selectedMoves = new Set<string>();

    bases.forEach(pokemon => {
      if (pokemon.moves && pokemon.moves.length > 0) {
        // Obtener un índice aleatorio
        const randomIndex = Math.floor(Math.random() * pokemon.moves.length);
        // Obtener el nombre del movimiento
        const moveName = pokemon.moves[randomIndex].move.name;
        selectedMoves.add(moveName);
      }
    });

    // Devolvemos el Set como un array
    return Array.from(selectedMoves).slice(0, 3); // Limitar a un máximo de 3 movimientos para ser generosos
  }

    private calculateFusionTypes(bases: PokemonBase[]): string[] {
      const typeCount: { [key: string]: number } = {};
      
      
      // 1. Contar la frecuencia de todos los tipos
      bases.forEach(pokemon => {
          pokemon.types.forEach(typeWrapper => {
              const typeName = typeWrapper.type.name;
              typeCount[typeName] = (typeCount[typeName] || 0) + 1;
          });
      });

      // 2. Ordenar por frecuencia. Si el conteo es igual, ordenar aleatoriamente.
      const sortedTypes = Object.entries(typeCount)
          .sort(([, countA], [, countB]) => {
              if (countB !== countA) {
                  return countB - countA; // Ordenar por frecuencia si son diferentes
              }
              // 🟥 CORRECCIÓN: Si hay empate, ordenar aleatoriamente para que Re-Fusionar cambie el resultado
              return 0.5 - Math.random(); 
          })
          .map(([name]) => name);

      // 3. Tomar los 2 tipos más comunes/prioritarios
      return sortedTypes.slice(0, 2);
  }
  
  private generateFusionName(baseNames: string[]): string {
      const [name1, name2, name3] = baseNames;
      let newName = '';

      // Heurística de IA: Usar partes aleatorias de los tres nombres.
      const parts = [
          name1.substring(0, Math.min(3, name1.length)), 
          name2.substring(Math.floor(name2.length / 2), Math.floor(name2.length / 2) + 2), 
          name3.substring(name3.length - Math.min(3, name3.length)), 
      ];
      
      const shuffledParts = parts.sort(() => 0.5 - Math.random());
      
      const finalParts = shuffledParts.slice(0, Math.floor(Math.random() * 2) + 2); 
      
      newName = finalParts.join('');

      newName = newName.replace(/[^a-z]/gi, '').toLowerCase();
      
      if (newName.length < 4) {
          newName = name1.substring(0, 2) + name3.substring(name3.length - 2);
      }

      return newName.charAt(0).toUpperCase() + newName.slice(1);
  }
}