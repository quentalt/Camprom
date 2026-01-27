import { Routes } from '@angular/router';
import { CameraDetailsComponent } from './camera-details/camera-details';
import {CameraListComponent} from './camera-list/camera-list';

export const routes: Routes = [
  { path: '', component: CameraListComponent },
  { path: 'camera/:id', component: CameraDetailsComponent },
  { path: '**', redirectTo: '' }
];
