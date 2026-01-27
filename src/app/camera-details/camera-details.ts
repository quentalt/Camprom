// `src/app/camera-detail/camera-detail.component.ts`
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Camera } from '../models/camera.model';
import { CameraService } from '../services/camera.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-camera-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatBadgeModule
  ],
  template: `
    <div class="detail-container">
      @if (isLoading()) {
        <div class="loading-container">
          <mat-spinner diameter="60"></mat-spinner>
        </div>
      }

      @if (!isLoading() && camera()) {
        <div class="detail-content">
          <!-- Breadcrumb / Back button -->
          <div class="breadcrumb">
            <button mat-button (click)="goBack()" class="back-button">
              <mat-icon>arrow_back</mat-icon>
              Retour à la liste
            </button>
          </div>

          <!-- Main content -->
          <mat-card class="camera-detail-card">
            <div class="detail-grid">
              <!-- Image Section -->
              <div class="image-section">
                <div class="image-container">
                  <img
                    [src]="camera()!.image"
                    [alt]="camera()!.name"
                    class="camera-image">

                  @if (camera()!.isOnSale) {
                    <mat-chip class="sale-badge" color="accent">
                      {{ camera()!.saleLabel }}
                    </mat-chip>
                  }

                  <div class="rating-badge">
                    <mat-icon class="star-icon">star</mat-icon>
                    <span class="rating-value">{{ camera()!.rating }}</span>
                  </div>
                </div>
              </div>

              <!-- Info Section -->
              <div class="info-section">
                <mat-card-content>
                  <!-- Brand -->
                  <div class="brand-label">{{ camera()!.brand }}</div>

                  <!-- Title -->
                  <h1 class="camera-title">{{ camera()!.name }}</h1>

                  <!-- Specs chips -->
                  <div class="specs-container">
                    <mat-chip-set>
                      <mat-chip class="spec-chip">
                        <mat-icon matChipAvatar>photo_camera</mat-icon>
                        {{ camera()!.megapixels }} MP
                      </mat-chip>
                      <mat-chip class="spec-chip">
                        <mat-icon matChipAvatar>category</mat-icon>
                        {{ camera()!.type }}
                      </mat-chip>
                      <mat-chip class="spec-chip">
                        <mat-icon matChipAvatar>star</mat-icon>
                        {{ camera()!.rating }} / 5
                      </mat-chip>
                    </mat-chip-set>
                  </div>

                  <mat-divider></mat-divider>

                  <!-- Features -->
                  <div class="features-section">
                    <h3 class="section-title">
                      <mat-icon>check_circle</mat-icon>
                      Caractéristiques principales
                    </h3>
                    <div class="features-list">
                      @for (feature of camera()!.features; track feature) {
                        <div class="feature-item">
                          <mat-icon class="feature-icon">done</mat-icon>
                          <span>{{ feature }}</span>
                        </div>
                      }
                    </div>
                  </div>

                  <mat-divider></mat-divider>

                  <!-- Pricing -->
                  <div class="pricing-section">
                    <h3 class="section-title">
                      <mat-icon>euro</mat-icon>
                      Prix
                    </h3>
                    <div class="price-container">
                      <div class="price-wrapper">
                        <span class="current-price">
                          {{ camera()!.price | currency:'EUR':'symbol':'1.0-0' }}
                        </span>

                        @if (camera()!.originalPrice) {
                          <span class="original-price">
                            {{ camera()!.originalPrice | currency:'EUR':'symbol':'1.0-0' }}
                          </span>
                        }
                      </div>

                      @if (camera()!.discount) {
                        <mat-chip class="discount-chip" color="warn">
                          -{{ camera()!.discount }}% d'économie
                        </mat-chip>
                      }
                    </div>

                    @if (camera()!.discount && camera()!.originalPrice) {
                      <div class="savings-info">
                        <mat-icon class="savings-icon">savings</mat-icon>
                        <span>
                          Vous économisez {{ camera()!.originalPrice! - camera()!.price | currency:'EUR':'symbol':'1.0-0' }}
                        </span>
                      </div>
                    }
                  </div>

                  <mat-divider></mat-divider>

                  <!-- Actions -->
                  <div class="actions-section">
                    <button mat-raised-button color="accent" class="action-button">
                      <mat-icon>favorite</mat-icon>
                      Ajouter aux favoris
                    </button>
                  <!--  <button mat-stroked-button class="action-button">
                      <mat-icon>share</mat-icon>
                      Partager
                    </button>-->
                  </div>
                </mat-card-content>
              </div>
            </div>
          </mat-card>
        </div>
      }

      @if (!isLoading() && !camera()) {
        <mat-card class="error-card">
          <mat-card-content>
            <mat-icon class="error-icon">error_outline</mat-icon>
            <h2>Appareil photo non trouvé</h2>
            <p>L'appareil photo que vous recherchez n'existe pas ou a été supprimé.</p>
            <button mat-raised-button color="primary" (click)="goBack()">
              Retour à la liste
            </button>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .detail-container {
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 2rem 0;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
    }

    .detail-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.25rem;
    }

    .breadcrumb {
      margin-bottom: 1.5rem;
    }

    .back-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #1976d2;
      font-weight: 500;
    }

    .back-button mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .camera-detail-card {
      margin-bottom: 2rem;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    @media (min-width: 768px) {
      .detail-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    /* Image Section */
    .image-section {
      position: sticky;
      top: 2rem;
      height: fit-content;
    }

    .image-container {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      background-color: #f5f5f5;
      aspect-ratio: 1;
    }

    .camera-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .camera-image:hover {
      transform: scale(1.05);
    }

    .sale-badge {
      position: absolute;
      top: 1rem;
      left: 1rem;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.875rem;
      letter-spacing: 0.5px;
      z-index: 2;
    }

    .rating-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 0.5rem 0.75rem;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      z-index: 2;
    }

    .star-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #ffc107;
    }

    .rating-value {
      font-size: 1rem;
    }

    /* Info Section */
    .info-section {
      display: flex;
      flex-direction: column;
    }

    .brand-label {
      color: #757575;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 0.5rem;
    }

    .camera-title {
      font-size: 2rem;
      font-weight: 700;
      color: #212121;
      margin: 0 0 1.5rem 0;
      line-height: 1.2;
    }

    .specs-container {
      margin-bottom: 1.5rem;
    }

    .spec-chip {
      font-weight: 600;
    }

    .spec-chip mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    mat-divider {
      margin: 1.5rem 0;
    }

    /* Sections */
    .section-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.25rem;
      font-weight: 600;
      color: #212121;
      margin: 0 0 1rem 0;
    }

    .section-title mat-icon {
      color: #1976d2;
    }

    /* Features */
    .features-section {
      margin-bottom: 1.5rem;
    }

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      color: #424242;
      font-size: 1rem;
      line-height: 1.6;
    }

    .feature-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #4caf50;
      flex-shrink: 0;
      margin-top: 2px;
    }

    /* Pricing */
    .pricing-section {
      margin-bottom: 1.5rem;
    }

    .price-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }

    .price-wrapper {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .current-price {
      font-size: 2.5rem;
      font-weight: 900;
      color: #1976d2;
      line-height: 1;
    }

    .original-price {
      font-size: 1.5rem;
      color: #9e9e9e;
      text-decoration: line-through;
    }

    .discount-chip {
      font-weight: 700;
      font-size: 0.875rem;
    }

    .savings-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background-color: #e8f5e9;
      border-radius: 8px;
      color: #2e7d32;
      font-weight: 600;
    }

    .savings-icon {
      color: #4caf50;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    /* Actions */
    .actions-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    @media (min-width: 640px) {
      .actions-section {
        flex-direction: row;
      }
    }

    .action-button {
      flex: 1;
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      font-size: 1rem;
    }

    .action-button mat-icon {
      margin-right: 0.5rem;
    }

    /* Additional Info Card */
    .additional-info-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .additional-info-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: white;
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    @media (min-width: 640px) {
      .info-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .info-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .info-item {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .info-item mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: #ffd700;
      flex-shrink: 0;
    }

    .info-item strong {
      display: block;
      font-size: 1rem;
      margin-bottom: 0.25rem;
    }

    .info-item p {
      margin: 0;
      font-size: 0.875rem;
      opacity: 0.9;
    }

    /* Error Card */
    .error-card {
      margin: 2rem auto;
      max-width: 600px;
      text-align: center;
      padding: 3rem 2rem;
    }

    .error-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #f44336;
      margin: 0 auto 1rem;
    }

    .error-card h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #212121;
      margin-bottom: 0.75rem;
    }

    .error-card p {
      font-size: 1rem;
      color: #757575;
      margin-bottom: 1.5rem;
    }
  `]
})
export class CameraDetailsComponent implements OnInit {
  camera = signal<Camera | null>(null);
  isLoading = signal<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cameraService: CameraService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCamera(parseInt(id));
    }
  }

  private loadCamera(id: number) {
    this.isLoading.set(true);
    this.cameraService.getCameraById(id).subscribe(camera => {
      this.camera.set(camera || null);
      this.isLoading.set(false);
    });
  }

  goBack() {
    this.router.navigate(['/cameras']);
  }
}
