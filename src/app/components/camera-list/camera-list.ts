import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Camera } from '../../models/camera.model';
import { CameraService } from '../../services/camera.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FilterOptions, SidebarComponent } from '../sidebar/sidebar';
import { CameraCardComponent } from '../camera-card/camera-card';

@Component({
  selector: 'app-camera-list',
  standalone: true,
  imports: [
    CommonModule,
    CameraCardComponent,
    SidebarComponent,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <app-sidebar (filtersChanged)="onFiltersChanged($event)">
      <div class="p-8 min-h-screen md:p-4">
        <div class="max-w-screen-2xl mx-auto">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="flex items-center gap-3 text-4xl font-bold text-gray-900 mb-2">
              <mat-icon class="!text-4xl !w-8 !h-8 text-blue-600">photo_camera</mat-icon>
              Appareils Photo
            </h1>
            <p class="text-base text-gray-600">
              Découvrez notre sélection d'appareils photo professionnels
            </p>
          </div>

          <!-- Loading Spinner -->
          @if (isLoading()) {
            <div class="flex justify-center items-center min-h-96">
              <mat-spinner diameter="60"></mat-spinner>
            </div>
          }

          <!-- Camera Grid -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-300"
            [class.opacity-0]="isLoading()">
            @for (camera of filteredCameras(); track camera.id) {
              <app-camera-card
                [camera]="camera"
                class="animate-fade-in-up">
              </app-camera-card>
            }
          </div>

          <!-- Empty State -->
          @if (filteredCameras().length === 0 && !isLoading()) {
            <mat-card class="mt-8 py-20 px-8 text-center bg-white">
              <mat-card-content>
                <mat-icon class="!text-6xl !w-16 !h-16 text-gray-400 mx-auto mb-6">
                  search_off
                </mat-icon>
                <h3 class="text-2xl font-bold text-gray-900 mb-3">
                  Aucun appareil trouvé
                </h3>
                <p class="text-base text-gray-600 m-0">
                  Essayez de modifier vos filtres pour voir plus de résultats.
                </p>
              </mat-card-content>
            </mat-card>
          }
        </div>
      </div>
    </app-sidebar>
  `,
  styles: [`
    /* Animation personnalisée pour fadeInUp */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in-up {
      animation: fadeInUp 0.6s ease-out both;
    }
  `]
})
export class CameraListComponent implements OnInit {
  filteredCameras = signal<Camera[]>([]);
  isLoading = signal<boolean>(false);
  currentFilters = signal<FilterOptions | null>(null);

  constructor(private cameraService: CameraService) {
    effect(() => {
      console.log('Cameras loaded:', this.filteredCameras().length);
    });
  }

  ngOnInit() {
    this.loadCameras();
  }

  private loadCameras() {
    this.isLoading.set(true);
    this.cameraService.getCameras().subscribe(cameras => {
      this.filteredCameras.set(cameras);
      this.isLoading.set(false);
    });
  }

  onFiltersChanged(filters: FilterOptions) {
    console.log('Filters changed:', filters);
    this.currentFilters.set(filters);
    this.applyFilters(filters);
  }

  private applyFilters(filters: FilterOptions) {
    this.isLoading.set(true);

    this.cameraService.getCameras().subscribe(cameras => {
      let filtered = cameras;

      // Filtre par marque
      if (filters.brands.length > 0) {
        filtered = filtered.filter(c => filters.brands.includes(c.brand));
      }

      // Filtre par type
      if (filters.types.length > 0) {
        filtered = filtered.filter(c => filters.types.includes(c.type));
      }

      // Filtre par prix
      filtered = filtered.filter(c =>
        c.price >= filters.priceRange.min &&
        c.price <= filters.priceRange.max
      );

      this.filteredCameras.set(filtered);
      this.isLoading.set(false);
    });
  }
}
