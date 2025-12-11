import { Routes } from '@angular/router';
import { FusionPageComponent } from './features/fusion/fusion-page/fusion-page.component'; // Importar la clase

export const routes: Routes = [
  { path: '', component: FusionPageComponent }, 
  
  { path: '**', redirectTo: '', pathMatch: 'full' } 
];
