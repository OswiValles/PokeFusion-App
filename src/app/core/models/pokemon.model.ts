/**
 * Interfaz para los datos esenciales de un Pokémon base, necesarios para la fusión.
 */
export interface PokemonBase {
  id: number;
  name: string;
  // Solo necesitamos el nombre del tipo y la URL para referencia si es necesario
  types: { type: { name: string } }[];
  
  // Array de stats base
  stats: { 
    base_stat: number; 
    stat: { name: string }; 
  }[];

  // Movimientos, solo necesitamos unos pocos para seleccionar
  moves: { 
    move: { 
      name: string; 
      url: string; 
    } 
  }[];

  // Usaremos el sprite frontal como imagen de referencia
  sprites: {
    front_default: string;
  };
}

/**
 * Interfaz para el Pokémon fusionado, incluyendo los nuevos atributos calculados.
 */
export interface PokemonFusion {
  id?: string;
  name: string; // Nuevo nombre (generado por IA/regla)
  types: string[]; // Tipos fusionados
  stats: { name: string; value: number; }[]; // Stats promedio/calculados
  moves: string[]; // 1-2 movimientos seleccionados
  // Aquí podrías agregar un campo para el historial de la fusión (los 3 IDs)
  basePokemonIds: number[];
}