import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'characters',
    pathMatch: 'full'
  },
  {
    path: 'characters/:id',
    loadChildren: () => import('./pages/character/character-details/character-details.module').then( m => m.CharacterDetailsPageModule)
  },
  {
    path: 'characters',
    loadChildren: () => import('./pages/character/characters/characters.module').then( m => m.CharactersPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
