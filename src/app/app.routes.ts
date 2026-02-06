import { Routes } from '@angular/router';
import { CameraDetailsComponent } from './components/camera-details/camera-details';
import {CameraListComponent} from './components/camera-list/camera-list';
import {FavoritesComponent} from './components/favorites/favorites';

export const routes: Routes = [
  { path: '', component: CameraListComponent },
  { path: 'camera/:id', component: CameraDetailsComponent },
  { path: 'favorites', component: FavoritesComponent},
  { path: '**', redirectTo: '' }
];
