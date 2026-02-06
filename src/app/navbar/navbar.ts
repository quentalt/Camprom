// src/app/navbar/navbar.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule
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
      <!-- <span class="text-2xl font-bold">MonSite</span> -->

      <!-- Spacer -->
      <span class="flex-1"></span>

      <!-- Desktop Links -->
      <nav class="hidden md:flex items-center gap-2">
        <button mat-button>À propos</button>
      </nav>

      <!-- Icons (si nécessaire) -->
      <!-- <div class="flex items-center gap-1 ml-2">
        <button mat-icon-button>
          <mat-icon>notifications</mat-icon>
        </button>
      </div> -->
    </mat-toolbar>

    <!-- Account Menu (si nécessaire) -->

    <!-- Sidenav for Mobile -->
    <mat-sidenav-container class="absolute top-0 left-0 w-full h-0 z-[999]">
      <mat-sidenav
        #sidenav
        mode="over"
        [opened]="isSidenavOpen()"
        (openedChange)="isSidenavOpen.set($event)">
        <mat-nav-list>
          <button mat-list-item (click)="closeSidenav()">Accueil</button>
          <button mat-list-item (click)="closeSidenav()">À propos</button>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content></mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: []
})
export class NavbarComponent {
  isSidenavOpen = signal(false);

  toggleSidenav() {
    this.isSidenavOpen.update(open => !open);
  }

  closeSidenav() {
    this.isSidenavOpen.set(false);
  }
}
