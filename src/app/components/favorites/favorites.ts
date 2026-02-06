import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Camera } from '../../models/camera.model';
import { CameraService } from '../../services/camera.service';
import { CameraCardComponent } from '../camera-card/camera-card';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    CameraCardComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-100 py-8">
      <div class="max-w-7xl mx-auto px-5">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <h1 class="flex items-center gap-3 text-4xl font-bold text-gray-900">
              <mat-icon class="!text-4xl !w-10 !h-10 text-pink-600">favorite</mat-icon>
              Mes Favoris
            </h1>

            @if (favoriteCameras().length > 0) {
              <button
                mat-stroked-button
                color="warn"
                (click)="clearAllFavorites()"
                class="!font-semibold">
                <mat-icon class="!mr-2">delete_sweep</mat-icon>
                Tout supprimer
              </button>
            }
          </div>

          <p class="text-base text-gray-600">
            @if (favoriteCameras().length === 0) {
              Vous n'avez pas encore ajouté d'appareils à vos favoris
            } @else if (favoriteCameras().length === 1) {
              Vous avez {{ favoriteCameras().length }} appareil dans vos favoris
            } @else {
              Vous avez {{ favoriteCameras().length }} appareils dans vos favoris
            }
          </p>
        </div>

        <!-- Loading -->
        @if (isLoading()) {
          <div class="flex justify-center items-center min-h-96">
            <mat-spinner diameter="60"></mat-spinner>
          </div>
        }

        <!-- Empty State -->
        @if (!isLoading() && favoriteCameras().length === 0) {
          <mat-card class="text-center py-20 px-8">
            <mat-card-content>
              <mat-icon class="!text-8xl !w-32 !h-32 text-gray-300 mx-auto mb-6">
                favorite_border
              </mat-icon>
              <h2 class="text-3xl font-bold text-gray-900 mb-4">
                Aucun favori pour le moment
              </h2>
              <p class="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Parcourez notre catalogue et ajoutez vos appareils photo préférés en cliquant sur l'icône cœur
              </p>
              <button
                mat-raised-button
                color="primary"
                (click)="goToCatalog()"
                class="!px-8 !py-3 !text-base !font-semibold">
                <mat-icon class="!mr-2">photo_camera</mat-icon>
                Découvrir les appareils
              </button>
            </mat-card-content>
          </mat-card>
        }

        <!-- Favorites Grid -->
        @if (!isLoading() && favoriteCameras().length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (camera of favoriteCameras(); track camera.id) {
              <div class="relative">
                <app-camera-card [camera]="camera"></app-camera-card>

                <!-- Remove button -->
                <button
                  mat-mini-fab
                  color="warn"
                  (click)="removeFromFavorites($event, camera)"
                  class="!absolute !top-4 !right-4 !z-20 hover:!scale-110 !transition-transform"
                  matTooltip="Retirer des favoris">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
            }
          </div>

          <!-- Stats Footer -->
          <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <mat-card class="text-center py-6">
              <mat-card-content>
                <mat-icon class="!text-5xl !w-12 !h-12 text-blue-600 mx-auto mb-3">
                  photo_camera
                </mat-icon>
                <div class="text-3xl font-bold text-gray-900 mb-1">
                  {{ favoriteCameras().length }}
                </div>
                <div class="text-sm text-gray-600">
                  Appareils favoris
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="text-center py-6">
              <mat-card-content>
                <mat-icon class="!text-5xl !w-12 !h-12 text-green-600 mx-auto mb-3">
                  euro
                </mat-icon>
                <div class="text-3xl font-bold text-gray-900 mb-1">
                  {{ totalValue() | currency:'EUR':'symbol':'1.0-0' }}
                </div>
                <div class="text-sm text-gray-600">
                  Valeur totale
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="text-center py-6">
              <mat-card-content>
                <mat-icon class="!text-5xl !w-12 !h-12 text-purple-600 mx-auto mb-3">
                  savings
                </mat-icon>
                <div class="text-3xl font-bold text-gray-900 mb-1">
                  {{ totalSavings() | currency:'EUR':'symbol':'1.0-0' }}
                </div>
                <div class="text-sm text-gray-600">
                  Économies potentielles
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        }
      </div>
    </div>
  `,
  styles: []
})
export class FavoritesComponent implements OnInit {
  isLoading = signal<boolean>(true);

  // Computed signal pour les appareils favoris (directement depuis le service)
  favoriteCameras = computed(() => this.favoritesService.favorites());

  // Computed signal pour la valeur totale
  totalValue = computed(() => {
    return this.favoriteCameras().reduce((sum, camera) => sum + camera.price, 0);
  });

  // Computed signal pour les économies totales
  totalSavings = computed(() => {
    return this.favoriteCameras().reduce((sum, camera) => {
      if (camera.originalPrice) {
        return sum + (camera.originalPrice - camera.price);
      }
      return sum;
    }, 0);
  });

  constructor(
    private cameraService: CameraService,
    private favoritesService: FavoritesService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  private loadFavorites() {
    this.isLoading.set(true);
    this.favoritesService.loadFavorites();
    // Attendre un peu pour que les données se chargent
    setTimeout(() => {
      this.isLoading.set(false);
    }, 500);
  }

  removeFromFavorites(event: Event, camera: Camera) {
    event.stopPropagation();
    this.favoritesService.removeFavorite(camera.id);
    this.snackBar.open(`${camera.name} retiré des favoris`, 'Annuler', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    }).onAction().subscribe(() => {
      this.favoritesService.addFavorite(camera);
    });
  }

  clearAllFavorites() {
    if (confirm('Êtes-vous sûr de vouloir supprimer tous vos favoris ?')) {
      const count = this.favoriteCameras().length;
      this.favoritesService.removeFavorite();
      this.snackBar.open(`${count} favori(s) supprimé(s)`, 'OK', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
    }
  }

  goToCatalog() {
    this.router.navigate(['/cameras']);
  }
}
