import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'character',
    pathMatch: 'full'
  },
  {
    path: 'character',
    loadChildren: () => import('./pages/character/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'character/:id',
    loadChildren: () => import('./pages/character/details/details.module').then( m => m.DetailsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
