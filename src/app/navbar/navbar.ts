import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { FavoritesService } from '../services/favorites.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatBadgeModule
  ],
  template: `
    <mat-toolbar color="primary" class="sticky top-0 z-[1000] flex items-center">
      <!-- Mobile Hamburger -->
      <button
        mat-icon-button
        class="md:!hidden"
        (click)="toggleSidenav()">
        <mat-icon>menu</mat-icon>
      </button>

      <!-- Logo / Title -->
      <a routerLink="/cameras" class="text-2xl font-bold no-underline text-black flex items-center gap-2">
        <mat-icon class="!text-3xl !w-8 !h-8">photo_camera</mat-icon>
        <span class="hidden sm:inline">CameraShop</span>
      </a>

      <!-- Spacer -->
      <span class="flex-1"></span>

      <!-- Desktop Links -->
      <nav class="hidden md:flex items-center gap-2">
        <a mat-button routerLink="/cameras" routerLinkActive="!bg-white/20">
          <mat-icon class="!mr-2">photo_camera</mat-icon>
          Catalogue
        </a>
        <a mat-button routerLink="/favorites" routerLinkActive="!bg-white/20">
          <mat-icon
            class="!mr-2"
            [matBadge]="favoritesCount()"
            [matBadgeHidden]="favoritesCount() === 0"
            matBadgeColor="warn"
            matBadgeSize="small">
            favorite
          </mat-icon>
          Favoris
        </a>
      </nav>

      <!-- Mobile Favorites Icon -->
      <a
        mat-icon-button
        routerLink="/favorites"
        class="md:!hidden !ml-2">
        <mat-icon
          [matBadge]="favoritesCount()"
          [matBadgeHidden]="favoritesCount() === 0"
          matBadgeColor="warn"
          matBadgeSize="small">
          favorite
        </mat-icon>
      </a>
    </mat-toolbar>

    <!-- Sidenav for Mobile -->
    <mat-sidenav-container class="absolute top-0 left-0 w-full h-0 z-[999]">
      <mat-sidenav
        #sidenav
        mode="over"
        [opened]="isSidenavOpen()"
        (openedChange)="isSidenavOpen.set($event)">
        <div class="p-4 bg-blue-600 text-white flex items-center gap-2">
          <mat-icon class="!text-3xl !w-8 !h-8">photo_camera</mat-icon>
          <span class="text-xl font-bold">CameraShop</span>
        </div>
        <mat-nav-list>
          <a mat-list-item routerLink="/cameras" (click)="closeSidenav()">
            <mat-icon matListItemIcon>photo_camera</mat-icon>
            <span matListItemTitle>Catalogue</span>
          </a>
          <a mat-list-item routerLink="/favorites" (click)="closeSidenav()">
            <mat-icon
              matListItemIcon
              [matBadge]="favoritesCount()"
              [matBadgeHidden]="favoritesCount() === 0"
              matBadgeColor="warn"
              matBadgeSize="small">
              favorite
            </mat-icon>
            <span matListItemTitle>Mes Favoris ({{ favoritesCount() }})</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content></mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: []
})
export class NavbarComponent {
  isSidenavOpen = signal(false);

  // Computed signal pour le nombre de favoris
  favoritesCount = computed(() => this.favoritesService.getFavoritesCount());

  constructor(private favoritesService: FavoritesService) {}

  toggleSidenav() {
    this.isSidenavOpen.update(open => !open);
  }

  closeSidenav() {
    this.isSidenavOpen.set(false);
  }
}
