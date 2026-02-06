import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Camera } from '../../models/camera.model';
import { FavoritesService } from '../../services/favorites.service';

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
    MatRippleModule,
    MatTooltipModule
  ],
  template: `
    <mat-card
      class="cursor-pointer transition-all duration-300 ease-in-out rounded-2xl overflow-hidden h-full flex flex-col relative hover:shadow-2xl hover:-translate-y-2"
      [class.ring-2]="camera.isOnSale"
      [class.ring-teal-600]="camera.isOnSale"
      matRipple
      (click)="viewDetails()">

      <!-- Image container -->
      <div class="relative h-52 overflow-hidden bg-gray-100">
        <img
          mat-card-image
          [src]="camera.image"
          [alt]="camera.name"
          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105">

        <!-- Sale badge (badge rouge) -->
        @if (camera.isOnSale) {
          <span class="absolute top-3 left-3 inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-bold text-red-700 ring-1 ring-inset ring-red-600/10 uppercase tracking-wide animate-pulse">
            {{ camera.saleLabel }}
          </span>
        }

        <!-- Rating badge -->
        <div class="absolute top-3 right-3 bg-black/80 text-white px-2 py-1 rounded-xl flex items-center gap-1 text-xs font-semibold">
          <mat-icon class="!text-base !w-4 !h-4 text-yellow-400">star</mat-icon>
          <span>{{ camera.rating }}</span>
        </div>

        <!-- Favorite button -->
        <button
          mat-mini-fab
          [color]="isFavorite() ? 'warn' : 'default'"
          (click)="toggleFavorite($event)"
          class="!absolute !bottom-3 !right-3 !z-10 !shadow-lg hover:!scale-110 !transition-transform"
          [class.!bg-white]="!isFavorite()"
          [matTooltip]="isFavorite() ? 'Retirer des favoris' : 'Ajouter aux favoris'">
          <mat-icon [class.text-pink-600]="isFavorite()">
            {{ isFavorite() ? 'favorite' : 'favorite_border' }}
          </mat-icon>
        </button>
      </div>

      <!-- Card content -->
      <mat-card-content class="p-4 flex-1 flex flex-col">
        <!-- Brand -->
        <div class="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-1">
          {{ camera.brand }}
        </div>

        <!-- Camera name -->
        <mat-card-title class="!text-lg !font-bold text-gray-900 mb-3 leading-snug">
          {{ camera.name }}
        </mat-card-title>

        <!-- Specs chips -->
        <div class="mb-4">
          <mat-chip-set>
            <mat-chip class="!text-xs !font-semibold !h-7">
              <mat-icon matChipAvatar class="!text-lg !w-[18px] !h-[18px]">photo_camera</mat-icon>
              {{ camera.megapixels }}MP
            </mat-chip>
            <mat-chip class="!text-xs !font-semibold !h-7">
              <mat-icon matChipAvatar class="!text-lg !w-[18px] !h-[18px]">category</mat-icon>
              {{ camera.type }}
            </mat-chip>
          </mat-chip-set>
        </div>

        <!-- Features -->
        <div class="mb-4 flex-1">
          @for (feature of camera.features.slice(0, 2); track feature) {
            <div class="flex items-start gap-2 mb-1.5 text-gray-700 text-sm leading-relaxed">
              <mat-icon class="!text-lg !w-[18px] !h-[18px] text-green-500 flex-shrink-0 mt-0.5">
                check_circle
              </mat-icon>
              <span>{{ feature }}</span>
            </div>
          }
        </div>

        <!-- Pricing -->
        <div class="flex items-center justify-between gap-2 flex-wrap mb-2">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-2xl font-black text-blue-600">
              {{ camera.price | currency:'EUR':'symbol':'1.0-0' }}
            </span>

            @if (camera.originalPrice) {
              <span class="text-base text-gray-400 line-through">
                {{ camera.originalPrice | currency:'EUR':'symbol':'1.0-0' }}
              </span>
            }
          </div>

          @if (camera.discount) {
            <mat-chip color="warn" class="!font-bold !text-xs">
              -{{ camera.discount }}%
            </mat-chip>
          }
        </div>
      </mat-card-content>

      <!-- Card actions -->
      <mat-card-actions class="!p-4 !pt-0 !m-0">
        <button mat-raised-button color="primary" class="!w-full !font-semibold">
          <mat-icon class="mr-2">visibility</mat-icon>
          Voir les détails
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    /* Animation pulse personnalisée pour le badge */
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.8;
      }
    }

    .animate-pulse {
      animation: pulse 2s ease-in-out infinite;
    }
  `]
})
export class CameraCardComponent {
  @Input() camera!: Camera;

  // Computed signal pour vérifier si l'appareil est en favoris
  isFavorite = computed(() => this.favoritesService.isFavorite(this.camera.id));

  constructor(
    private router: Router,
    private favoritesService: FavoritesService
  ) {}

  viewDetails() {
    this.router.navigate(['/camera', this.camera.id]);
  }

  toggleFavorite(event: Event) {
    event.stopPropagation(); // Empêche la navigation vers les détails

    if (this.isFavorite()) {
      // Retirer des favoris
      this.favoritesService.removeFavorite(this.camera.id);
    } else {
      // Ajouter aux favoris (passer l'objet Camera complet)
      this.favoritesService.addFavorite(this.camera);
    }
  }
}
