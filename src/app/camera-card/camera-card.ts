import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import {Camera} from '../models/camera.model';

@Component({
  selector: 'app-camera-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    MatRippleModule
  ],
  template: `
    <mat-card
      class="camera-card"
      [class.on-sale]="camera.isOnSale"
      matRipple
      (click)="viewDetails()">

      <!-- Image container -->
      <div class="image-container">
        <img
          mat-card-image
          [src]="camera.image"
          [alt]="camera.name"
          class="camera-image">

        <!-- Sale badge -->
        @if (camera.isOnSale) {
          <mat-chip class="sale-badge" color="accent">
            {{ camera.saleLabel }}
          </mat-chip>
        }

        <!-- Rating badge -->
        <div class="rating-badge">
          <mat-icon class="star-icon">star</mat-icon>
          <span>{{ camera.rating }}</span>
        </div>
      </div>

      <!-- Card content -->
      <mat-card-content>
        <!-- Brand -->
        <div class="brand-label">
          {{ camera.brand }}
        </div>

        <!-- Camera name -->
        <mat-card-title class="camera-name">
          {{ camera.name }}
        </mat-card-title>

        <!-- Specs chips -->
        <div class="specs-container">
          <mat-chip-set>
            <mat-chip class="spec-chip">
              <mat-icon matChipAvatar>photo_camera</mat-icon>
              {{ camera.megapixels }}MP
            </mat-chip>
            <mat-chip class="spec-chip">
              <mat-icon matChipAvatar>category</mat-icon>
              {{ camera.type }}
            </mat-chip>
          </mat-chip-set>
        </div>

        <!-- Features -->
        <div class="features-list">
          @for (feature of camera.features.slice(0, 2); track feature) {
            <div class="feature-item">
              <mat-icon class="feature-icon">check_circle</mat-icon>
              <span>{{ feature }}</span>
            </div>
          }
        </div>

        <!-- Pricing -->
        <div class="pricing-container">
          <div class="price-wrapper">
            <span class="current-price">
              {{ camera.price | currency:'EUR':'symbol':'1.0-0' }}
            </span>

            @if (camera.originalPrice) {
              <span class="original-price">
                {{ camera.originalPrice | currency:'EUR':'symbol':'1.0-0' }}
              </span>
            }
          </div>

          @if (camera.discount) {
            <mat-chip class="discount-chip" color="warn">
              -{{ camera.discount }}%
            </mat-chip>
          }
        </div>
      </mat-card-content>

      <!-- Card actions -->
      <mat-card-actions>
        <button mat-raised-button color="primary" class="view-button">
          <mat-icon>visibility</mat-icon>
          Voir les détails
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .camera-card {
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 16px;
      overflow: hidden;
      height: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .camera-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }

    .camera-card.on-sale {
      border: 2px solid #00897b;
    }

    .image-container {
      position: relative;
      height: 200px;
      overflow: hidden;
      background-color: #f5f5f5;
    }

    .camera-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .camera-card:hover .camera-image {
      transform: scale(1.05);
    }

    .sale-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.5px;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.8;
      }
    }

    .rating-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .star-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #ffc107;
    }

    mat-card-content {
      padding: 16px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .brand-label {
      color: #757575;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }

    .camera-name {
      font-size: 1.125rem;
      font-weight: 700;
      color: #212121;
      margin-bottom: 12px;
      line-height: 1.4;
    }

    .specs-container {
      margin-bottom: 16px;
    }

    .spec-chip {
      font-size: 0.75rem;
      font-weight: 600;
      height: 28px;
    }

    .spec-chip mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .features-list {
      margin-bottom: 16px;
      flex: 1;
    }

    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 6px;
      color: #616161;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .feature-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #4caf50;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .pricing-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 8px;
    }

    .price-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .current-price {
      font-size: 1.5rem;
      font-weight: 900;
      color: #1976d2;
    }

    .original-price {
      font-size: 1rem;
      color: #9e9e9e;
      text-decoration: line-through;
    }

    .discount-chip {
      font-weight: 700;
      font-size: 0.75rem;
    }

    mat-card-actions {
      padding: 0 16px 16px;
      margin: 0;
    }

    .view-button {
      width: 100%;
      font-weight: 600;
    }

    .view-button mat-icon {
      margin-right: 8px;
    }
  `]
})
export class CameraCardComponent {
  @Input() camera!: Camera;

  constructor(private router: Router) {}

  viewDetails() {
    this.router.navigate(['/camera', this.camera.id]);
  }
}
