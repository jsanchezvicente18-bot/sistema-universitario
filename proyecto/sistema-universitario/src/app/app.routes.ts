import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadComponent: () =>
      import('./pages/inicio/inicio').then(m => m.Inicio)
  },
  {
    path: 'aperturas',
    loadComponent: () =>
      import('./pages/aperturas/aperturas').then(m => m.Aperturas)
  },
  {
    path: 'asignaturas',
    loadComponent: () =>
      import('./pages/asignaturas/asignaturas').then(m => m.Asignaturas)
  },
  {
    path: 'grupos',
    loadComponent: () =>
      import('./pages/grupos/grupos').then(m => m.Grupos)
  },
  {
    path: 'profesores',
    loadComponent: () =>
      import('./pages/profesores/profesores').then(m => m.Profesores)
  },
  {
    path: '**',
    redirectTo: 'inicio'
  }
];