# PokeFusion

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) version 18.2.12.

---

## Reto Elegido y Alcance

El objetivo es fusionar tres Pokémon base de PokeAPI para crear una nueva criatura.

* **Core Implementado:** Aleatorización de 3 Pokémon (`forkJoin`), cálculo de atributos fusionados (nombre, tipos, stats, movimientos) y visualización en una tarjeta principal.
* **Tu Toque:** **Botón "Re-Fusionar"**. Permite generar un nuevo nombre, movimientos y una ligera variación en las estadísticas y tipos (para demostrar aleatoriedad) usando los mismos Pokémon base.
* **Persistencia:** **Firestore**. Permite al usuario guardar y eliminar sus fusiones favoritas (operaciones CRUD: Create, Read, Delete).

---

## Arquitectura y Dependencias

La arquitectura se basa en el patrón de **Separación de Capas** (Data, Business/Logic, UI) usando Angular *standalone components*.

### Estructura del Proyecto

* `core/models/`: Definición de interfaces (`PokemonBase`, `PokemonFusion`).
* `core/pokemon.service.ts`: Capa de datos para interactuar con la PokeAPI.
* `features/fusion/fusion.service.ts`: **Capa de Lógica de Negocio/IA**. Contiene las heurísticas para calcular `stats`, `types`, `moves`, y `name`.
* `features/favorites/favorites.service.ts`: **Capa de Persistencia**. Lógica de interacción con Firestore (Guardar, Leer, Eliminar).
* `features/fusion/fusion-page.component.ts`: **Capa de Presentación**. Orquestación de la carga, fusión, estado de la aplicación (`isLoading`, `error`) y manejo de eventos.

---

## Modelo de Datos (Firestore)

El sistema de persistencia utiliza Firestore para almacenar la colección `favorites`.

* **Colección:** `favorites`
* **Document ID:** El nombre del Pokémon fusionado (`fusedPokemon.name`).
* **Esquema de Datos (`PokemonFusion`):**
    * `name`: `string`
    * `types`: `string[]`
    * `stats`: `{ name: string; value: number; }[]`
    * `moves`: `string[]`
    * `basePokemonIds`: `number[]`

### Reglas de Seguridad (Resumidas)

Las reglas están configuradas para permitir la lectura pública, pero restringir la escritura a usuarios autenticados.

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /favorites/{favoriteId} {
      allow read: if true; 
      allow write: if request.auth != null; 
    }
  }
}
```

---

## Checklist de Auditoría

### Estado y Navegación
* **Estrategia:** Single Page Application (SPA) con *routing* básico (`/` -> `FusionPageComponent`).
* **Estado:** Manejo de estado de la aplicación (`isLoading`, `error`, `basePokemon`) dentro de `FusionPageComponent`.

### Decisiones Técnicas
* **Rendimiento (Llamadas Agrupadas):** Uso de `forkJoin` para solicitar datos de 3 Pokémon simultáneamente, reduciendo el tiempo de espera.
* **Diseño de Servicios:** Lógica de negocio (fusión) y persistencia (Firestore) están en servicios separados para máxima mantenibilidad.
* **Aleatoriedad en Fusión:** El botón "Re-Fusionar" aplica un factor de aleatoriedad a la generación de **Nombre**, **Movimientos**, **Tipos** y **Stats** (variación $\pm 5\%$) para un resultado visiblemente diferente en cada click.

### Escalabilidad y Mantenimiento
* **Mantenimiento:** La separación de capas hace que cualquier cambio en la lógica de fusión se aísle a `FusionService`.
* **Escalabilidad:** Las llamadas a PokeAPI son independientes. Para soportar más usuarios, la única capa que necesitaría escalar es Firestore (BaaS).

---

## Sección "Uso de IA"

Utilicé herramientas de IA generativa (principalmente Gemini) como copiloto y generador de heurísticas para cumplir los requisitos del reto de forma rápida y robusta.

* **¿En qué partes te apoyaste y por qué?**
    * **Regla de *Naming* (Heurística):** Generación de la regla de mezcla de sílabas de los tres nombres base (`generateFusionName`).
    * **Scaffolding de Servicios:** Creación del esqueleto inicial de `PokemonService` y las interfaces de datos.
    * **Lógica de Promedios:** Implementación de `calculateFusionStats` para promediar los valores entre los tres Pokémon base.
* **¿Qué sugerencias aceptaste vs. reescribiste?**
    * **Aceptadas:** La estructura de la inyección de dependencias (`inject()`) y el uso de `forkJoin` para llamadas concurrentes.
    * **Reescritas:** La implementación final del método `subscribe` y la protección de objetos al guardar (`{...this.fusedPokemon}`) fueron reescritas manualmente para resolver errores de tipado, *scope* y la correcta serialización de objetos en Angular/RxJS.
* **Riesgos detectados y cómo los mitigaste.**
    * **Riesgo de Seguridad:** Exposición de las claves de Firebase. **Mitigación:** Se aseguró que el `firebaseConfig` no contenga secretos y que las reglas de Firestore restrinjan el acceso de escritura.
    * **Riesgo de Performance/UX:** El compilador falló debido a lógica compleja (`.map()`, funciones de flecha) en el HTML. **Mitigación:** Se movió la lógica compleja a funciones dentro del componente (ej. `getPokemonTypes()`) para una compilación limpia.

### Resumen de Interacciones Clave con la IA

Las interacciones se centraron en obtener las reglas de negocio y resolver *bugs*:

| Área | Prompt (Mejorado) | Objetivo |
| :--- | :--- | :--- |
| **1. Regla de Naming (El Toque)** | "Dado los nombres de tres Pokémon base, diseña una heurística compleja de mezcla de sílabas en TypeScript que pueda generar un nombre único y legible. Asegura que la función pueda producir resultados *variables* cuando se ejecuta varias veces con la misma entrada." | Obtener la lógica variable para `generateFusionName`. |
| **2. Heurística de Stats/Movs** | "Genera una función TypeScript para calcular las estadísticas de fusión promediando las estadísticas base de tres Pokémon, añadiendo un elemento controlado de variación aleatoria (ej. $\pm 5\%$) al valor final, y formatea la salida como un arreglo de objetos {name: string, value: number}." | Implementar la regla de promedio variable para `calculateFusionStats` y asegurar el formato de datos. |
| **3. Configuración de Hosting/Deployment** | "Estoy configurando componentes *standalone* de Angular con Firebase Hosting y Firestore. Proporciona la configuración recomendada para `firebase.json` y los comandos de Angular CLI para asegurar que el directorio público sea correcto y las rutas SPA funcionen." | Obtener la configuración final de `firebase.json` y los pasos de despliegue. |
| **4. Solución de Bugs Críticos** | "Estoy obteniendo un error de compilación de TypeScript 'NG5: Argument of type 'undefined' is not assignable...' al usar `.map()` dentro de una plantilla de Angular. ¿Cómo puedo acceder de forma segura a `pokemon.types` usando un método *custom* o un *observable*, evitando depender solo del encadenamiento opcional (`?`) en la expresión HTML?" | Forzar la solución de *bug* hacia la buena práctica (mover lógica al componente: `getPokemonTypes()`). |

### Enfoque General:

El uso de la IA se centró en generar el **"qué"** (las reglas y heurísticas) y la estructura del **"cómo"** (el *scaffolding*), reservando el **ajuste manual** para la integración de observables, la corrección de errores de compilación (`NG5002`) y la serialización de objetos de Firestore.

---

## Instalación y Despliegue

### Requisitos

* Node.js (LTS)
* Angular CLI
* Firebase CLI

### Pasos de Instalación y Ejecución

1.  Clonar el repositorio:
    ```bash
    git clone
    cd pokefusion-app
    ```
2.  Instalar dependencias:
    ```bash
    npm install
    ```
3.  Ejecutar el servidor local:
    ```bash
    ng serve
    ```
    *Navega a `http://localhost:4200/`.*

### Build y Despliegue Final

1.  Generar el Build de Producción (optimizado):
    ```bash
    ng build --configuration=production
    ```
    *Los artefactos se encuentran en `dist/pokefusion-app/browser`.*
2.  Desplegar a Firebase Hosting:
    ```bash
    firebase deploy --only hosting
    ```
    *La **URL pública** será el enlace proporcionado por la CLI.*
