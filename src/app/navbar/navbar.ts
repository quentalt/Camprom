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
    <mat-toolbar color="primary" class="navbar">
      <!-- Mobile Hamburger -->
      <button mat-icon-button class="mobile-menu-button" (click)="toggleSidenav()">
        <mat-icon>menu</mat-icon>
      </button>

      <!-- Logo / Title -->
<!--      <span class="logo">MonSite</span>-->

      <!-- Spacer -->
      <span class="spacer"></span>

      <!-- Desktop Links -->
      <nav class="desktop-links">
        <button mat-button>À propos</button>
      </nav>

      <!-- Icons -->
    </mat-toolbar>

    <!-- Account Menu -->

    <!-- Sidenav for Mobile -->
    <mat-sidenav-container class="mobile-sidenav-container">
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
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 700;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .desktop-links button {
      margin-right: 0.5rem;
    }

    .icons button {
      margin-left: 0.25rem;
    }

    /* Mobile */
    .mobile-menu-button {
      display: none;
    }

    @media (max-width: 768px) {
      .desktop-links {
        display: none;
      }
      .mobile-menu-button {
        display: inline-flex;
      }
    }

    .mobile-sidenav-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 0;
      z-index: 999;
    }
  `]
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
