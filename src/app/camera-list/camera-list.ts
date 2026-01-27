// `src/app/camera-list/camera-list.component.ts`
import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Camera } from '../models/camera.model';
import { CameraService } from '../services/camera.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {FilterOptions, SidebarComponent} from '../sidebar/sidebar';
import {CameraCardComponent} from '../camera-card/camera-card';

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
      <div class="camera-list-container">
        <div class="content-wrapper">
          <div class="header">
            <h1>
              <mat-icon>photo_camera</mat-icon>
              Appareils Photo
            </h1>
            <p class="subtitle">Découvrez notre sélection d'appareils photo professionnels</p>
          </div>

          @if (isLoading()) {
            <div class="loading-container">
              <mat-spinner diameter="60"></mat-spinner>
            </div>
          }

          <div class="camera-grid" [class.hidden]="isLoading()">
            @for (camera of filteredCameras(); track camera.id) {
              <app-camera-card
                [camera]="camera"
                class="camera-card-item">
              </app-camera-card>
            }
          </div>

          @if (filteredCameras().length === 0 && !isLoading()) {
            <mat-card class="empty-state">
              <mat-card-content>
                <mat-icon class="empty-icon">search_off</mat-icon>
                <h3 class="empty-title">Aucun appareil trouvé</h3>
                <p class="empty-description">
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
    .camera-list-container {
      padding: 2rem;
      min-height: 100vh;
    }

    .content-wrapper {
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 2rem;
    }

    .header h1 {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 2rem;
      font-weight: 700;
      color: #212121;
      margin: 0 0 0.5rem 0;
    }

    .header mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: #1976d2;
    }

    .subtitle {
      font-size: 1rem;
      color: #757575;
      margin: 0;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    .camera-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      transition: opacity 0.3s ease-in-out;
    }

    .camera-grid.hidden {
      opacity: 0;
    }

    .camera-card-item {
      animation: fadeInUp 0.6s ease-out both;
    }

    .empty-state {
      margin-top: 2rem;
      padding: 5rem 2rem;
      text-align: center;
      background: white;
    }

    .empty-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #9e9e9e;
      margin: 0 auto 1.5rem;
    }

    .empty-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #212121;
      margin-bottom: 0.75rem;
    }

    .empty-description {
      font-size: 1rem;
      color: #757575;
      margin: 0;
    }

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

    @media (max-width: 768px) {
      .camera-list-container {
        padding: 1rem;
      }

      .camera-grid {
        grid-template-columns: 1fr;
      }
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

    // Appliquer les filtres côté client pour l'instant
    // Plus tard, vous pourrez envoyer ces filtres à l'API
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
