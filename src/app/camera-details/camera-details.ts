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
    <div class="min-h-screen bg-gray-100 py-8">
      @if (isLoading()) {
        <div class="flex justify-center items-center min-h-[60vh]">
          <mat-spinner diameter="60"></mat-spinner>
        </div>
      }

      @if (!isLoading() && camera()) {
        <div class="max-w-7xl mx-auto px-5">
          <!-- Breadcrumb / Back button -->
          <div class="mb-6">
            <button mat-button (click)="goBack()" class="!flex !items-center !gap-2 !text-blue-600 !font-medium">
              <mat-icon class="!text-xl !w-5 !h-5">arrow_back</mat-icon>
              Retour à la liste
            </button>
          </div>

          <!-- Main content -->
          <mat-card class="mb-8 overflow-visible">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Image Section -->
              <div class="md:sticky md:top-8 h-fit z-0">
                <div class="relative rounded-xl overflow-hidden bg-gray-100 aspect-square">
                  <img
                    [src]="camera()!.image"
                    [alt]="camera()!.name"
                    class="w-full h-full object-cover transition-transform duration-300 hover:scale-105">

                  @if (camera()!.isOnSale) {
                    <span class="absolute top-4 left-4 inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-sm font-bold text-red-700 ring-1 ring-inset ring-red-600/10 uppercase tracking-wide z-10">
                      {{ camera()!.saleLabel }}
                    </span>
                  }

                  <div class="absolute top-4 right-4 bg-black/80 text-white px-3 py-2 rounded-xl flex items-center gap-2 font-semibold z-10">
                    <mat-icon class="!text-xl !w-5 !h-5 text-yellow-400">star</mat-icon>
                    <span class="text-base">{{ camera()!.rating }}</span>
                  </div>
                </div>
              </div>

              <!-- Info Section -->
              <div class="flex flex-col relative z-10">
                <mat-card-content>
                  <!-- Brand -->
                  <div class="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">
                    {{ camera()!.brand }}
                  </div>

                  <!-- Title -->
                  <h1 class="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {{ camera()!.name }}
                  </h1>

                  <!-- Specs chips -->
                  <div class="mb-6">
                    <mat-chip-set>
                      <mat-chip class="!font-semibold">
                        <mat-icon matChipAvatar class="!text-xl !w-5 !h5-">photo_camera</mat-icon>
                        {{ camera()!.megapixels }} MP
                      </mat-chip>
                      <mat-chip class="!font-semibold">
                        <mat-icon matChipAvatar class="!text-xl !w-5 !h-5">category</mat-icon>
                        {{ camera()!.type }}
                      </mat-chip>
                      <mat-chip class="!font-semibold">
                        <mat-icon matChipAvatar class="!text-xl !w-5 !h-5">star</mat-icon>
                        {{ camera()!.rating }} / 5
                      </mat-chip>
                    </mat-chip-set>
                  </div>

                  <mat-divider class="!my-6"></mat-divider>

                  <!-- Features -->
                  <div class="mb-6">
                    <h3 class="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-4">
                      <mat-icon class="text-blue-600 !flex-shrink-0">check_circle</mat-icon>
                      Caractéristiques principales
                    </h3>
                    <div class="flex flex-col gap-3">
                      @for (feature of camera()!.features; track feature) {
                        <div class="flex items-start gap-3 text-gray-800 text-base leading-relaxed">
                          <mat-icon class="!text-xl !w-5 !h-5 text-green-500 flex-shrink-0 mt-0.5">
                            done
                          </mat-icon>
                          <span>{{ feature }}</span>
                        </div>
                      }
                    </div>
                  </div>

                  <mat-divider class="!my-6"></mat-divider>

                  <!-- Pricing -->
                  <div class="mb-6">
                    <h3 class="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-4">
                      <mat-icon class="text-blue-600 !flex-shrink-0">euro</mat-icon>
                      Prix
                    </h3>
                    <div class="flex items-center justify-between gap-4 flex-wrap mb-4">
                      <div class="flex items-center gap-4 flex-wrap">
                        <span class="text-5xl font-black text-blue-600 leading-none">
                          {{ camera()!.price | currency:'EUR':'symbol':'1.0-0' }}
                        </span>

                        @if (camera()!.originalPrice) {
                          <span class="text-2xl text-gray-400 line-through">
                            {{ camera()!.originalPrice | currency:'EUR':'symbol':'1.0-0' }}
                          </span>
                        }
                      </div>

                      @if (camera()!.discount) {
                        <mat-chip color="warn" class="!font-bold !text-sm">
                          -{{ camera()!.discount }}% d'économie
                        </mat-chip>
                      }
                    </div>

                    @if (camera()!.discount && camera()!.originalPrice) {
                      <div class="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-green-800 font-semibold">
                        <mat-icon class="!text-xl !w-5 !h-5 text-green-500 !flex-shrink-0">savings</mat-icon>
                        <span>
                          Vous économisez {{ camera()!.originalPrice! - camera()!.price | currency:'EUR':'symbol':'1.0-0' }}
                        </span>
                      </div>
                    }
                  </div>

                  <mat-divider class="!my-6"></mat-divider>

                  <!-- Actions -->
                  <div class="flex flex-col sm:flex-row gap-4 mt-6">
                    <button mat-raised-button color="accent" class="!flex-1 !py-3 !px-6 !font-semibold !text-base">
                      <mat-icon class="!mr-2">favorite</mat-icon>
                      Ajouter aux favoris
                    </button>
                  </div>
                </mat-card-content>
              </div>
            </div>
          </mat-card>
        </div>
      }

      @if (!isLoading() && !camera()) {
        <mat-card class="mx-auto my-8 max-w-2xl text-center p-12">
          <mat-card-content>
            <mat-icon class="!text-6xl !w-16 !h-16 text-red-500 mx-auto mb-4">error_outline</mat-icon>
            <h2 class="text-3xl font-bold text-gray-900 mb-3">Appareil photo non trouvé</h2>
            <p class="text-base text-gray-600 mb-6">
              L'appareil photo que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <button mat-raised-button color="primary" (click)="goBack()">
              Retour à la liste
            </button>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: []
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
