import { Component, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { FormsModule } from '@angular/forms';

export interface FilterOptions {
  category: string;
  priceRange: { min: number; max: number };
  brands: string[];
  types: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSliderModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatChipsModule,
    MatDividerModule,
    MatBadgeModule
  ],
  template: `
    <mat-sidenav-container class="h-screen w-full bg-gray-50">
      <!-- Sidebar -->
      <mat-sidenav
        #sidenav
        [mode]="isMobile() ? 'over' : 'side'"
        [opened]="isOpen()"
        (openedChange)="onSidenavToggle($event)"
        class="w-[320px] border-r bg-white shadow-lg flex flex-col">

        <div class="px-6 py-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex justify-between items-center">
          <h2 class="text-lg font-semibold flex items-center gap-2">
            <mat-icon>tune</mat-icon>
            Filtres
          </h2>

          @if (hasActiveFilters()) {
            <button mat-icon-button (click)="resetFilters()" matTooltip="Réinitialiser">
              <mat-icon>refresh</mat-icon>
            </button>
          }
        </div>

        <div class="flex-1 overflow-y-auto pb-28">

          <!-- Categories -->
          <mat-expansion-panel expanded class="shadow-none">
            <mat-expansion-panel-header class="px-6 font-semibold">
              <mat-panel-title class="flex gap-2 items-center">
                <mat-icon class="text-blue-600">category</mat-icon>
                Catégories
              </mat-panel-title>
            </mat-expansion-panel-header>

            <mat-nav-list>
              @for (cat of [
                { key:'cameras', label:'Appareils Photo', icon:'photo_camera', count:camerasCount() },
                { key:'lenses', label:'Objectifs', icon:'camera', count:lensesCount() },
                { key:'accessories', label:'Accessoires', icon:'inventory_2', count:accessoriesCount() },
                { key:'tripods', label:'Trépieds', icon:'videocam', count:tripodsCount() },
                { key:'bags', label:'Sacs', icon:'backpack', count:bagsCount() }
              ]; track cat.key) {

                <mat-list-item
                  (click)="selectCategory(cat.key)"
                  class="cursor-pointer transition hover:bg-gray-100"
                  [class.bg-blue-50]="selectedCategory() === cat.key">

                  <mat-icon matListItemIcon
                            [class.text-blue-600]="selectedCategory() === cat.key">
                    {{ cat.icon }}
                  </mat-icon>

                  <span matListItemTitle>{{ cat.label }}</span>

                  <span matListItemMeta class="text-xs px-2 py-0.5 rounded bg-gray-200">
                {{ cat.count }}
              </span>
                </mat-list-item>
              }
            </mat-nav-list>
          </mat-expansion-panel>

          <mat-divider></mat-divider>

          <!-- Price Range -->
          <mat-expansion-panel [expanded]="true" class="filter-section">
            <mat-expansion-panel-header>
              <mat-panel-title>
                <mat-icon>euro</mat-icon>
                Fourchette de prix
              </mat-panel-title>
            </mat-expansion-panel-header>

            <div class="price-filter">
              <div class="price-display">
                <span class="price-value">{{ minPrice() | currency:'EUR':'symbol':'1.0-0' }}</span>
                <span class="price-separator">-</span>
                <span class="price-value">{{ maxPrice() | currency:'EUR':'symbol':'1.0-0' }}</span>
              </div>

              <mat-slider
                [min]="0"
                [max]="5000"
                [step]="100"
                [discrete]="true"
                class="price-slider">
                <input
                  matSliderStartThumb
                  [(ngModel)]="minPrice"
                  (ngModelChange)="onPriceChange()">
                <input
                  matSliderEndThumb
                  [(ngModel)]="maxPrice"
                  (ngModelChange)="onPriceChange()">
              </mat-slider>

              <div class="price-presets">
                <mat-chip-set>
                  <mat-chip (click)="setPriceRange(0, 1000)" [highlighted]="isPriceRangeSelected(0, 1000)">
                    Moins de 1000€
                  </mat-chip>
                  <mat-chip (click)="setPriceRange(1000, 2000)" [highlighted]="isPriceRangeSelected(1000, 2000)">
                    1000€ - 2000€
                  </mat-chip>
                  <mat-chip (click)="setPriceRange(2000, 3000)" [highlighted]="isPriceRangeSelected(2000, 3000)">
                    2000€ - 3000€
                  </mat-chip>
                  <mat-chip (click)="setPriceRange(3000, 5000)" [highlighted]="isPriceRangeSelected(3000, 5000)">
                    Plus de 3000€
                  </mat-chip>
                </mat-chip-set>
              </div>
            </div>
          </mat-expansion-panel>

          <mat-divider></mat-divider>

          <!-- Brands -->
          <mat-expansion-panel [expanded]="true" class="filter-section">
            <mat-expansion-panel-header>
              <mat-panel-title>
                <mat-icon>business</mat-icon>
                Marques
                @if (selectedBrands().length > 0) {
                  <span class="filter-count">{{ selectedBrands().length }}</span>
                }
              </mat-panel-title>
            </mat-expansion-panel-header>

            <div class="checkbox-list">
              @for (brand of availableBrands(); track brand) {
                <mat-checkbox
                  [checked]="isBrandSelected(brand)"
                  (change)="toggleBrand(brand)">
                  {{ brand }}
                </mat-checkbox>
              }
            </div>
          </mat-expansion-panel>

          <mat-divider></mat-divider>

          <!-- Camera Types -->
          <mat-expansion-panel [expanded]="true" class="filter-section">
            <mat-expansion-panel-header>
              <mat-panel-title>
                <mat-icon>settings</mat-icon>
                Type d'appareil
                @if (selectedTypes().length > 0) {
                  <span class="filter-count">{{ selectedTypes().length }}</span>
                }
              </mat-panel-title>
            </mat-expansion-panel-header>

            <div class="checkbox-list">
              @for (type of cameraTypes(); track type.value) {
                <mat-checkbox
                  [checked]="isTypeSelected(type.value)"
                  (change)="toggleType(type.value)">
                  <div class="checkbox-content">
                    <mat-icon class="type-icon">{{ type.icon }}</mat-icon>
                    <span>{{ type.label }}</span>
                  </div>
                </mat-checkbox>
              }
            </div>
          </mat-expansion-panel>

          <mat-divider></mat-divider>

          <!-- Megapixels -->
          <mat-expansion-panel class="filter-section">
            <mat-expansion-panel-header>
              <mat-panel-title>
                <mat-icon>high_quality</mat-icon>
                Résolution
              </mat-panel-title>
            </mat-expansion-panel-header>

            <div class="checkbox-list">
              @for (range of megapixelRanges(); track range.label) {
                <mat-checkbox
                  [checked]="isMegapixelRangeSelected(range.min, range.max)"
                  (change)="toggleMegapixelRange(range.min, range.max)">
                  {{ range.label }}
                </mat-checkbox>
              }
            </div>
          </mat-expansion-panel>

          <mat-divider></mat-divider>

          <!-- Special Offers -->
          <mat-expansion-panel class="filter-section">
            <mat-expansion-panel-header>
              <mat-panel-title>
                <mat-icon>local_offer</mat-icon>
                Offres spéciales
              </mat-panel-title>
            </mat-expansion-panel-header>

            <div class="checkbox-list">
              <mat-checkbox
                [checked]="onSaleOnly()"
                (change)="toggleOnSale()">
                <div class="checkbox-content">
                  <mat-icon class="sale-icon">sell</mat-icon>
                  <span>En promotion uniquement</span>
                </div>
              </mat-checkbox>

              <mat-checkbox
                [checked]="newArrivals()"
                (change)="toggleNewArrivals()">
                <div class="checkbox-content">
                  <mat-icon class="new-icon">fiber_new</mat-icon>
                  <span>Nouveautés</span>
                </div>
              </mat-checkbox>

              <mat-checkbox
                [checked]="highRating()"
                (change)="toggleHighRating()">
                <div class="checkbox-content">
                  <mat-icon class="rating-icon">star</mat-icon>
                  <span>Note 4.5+ uniquement</span>
                </div>
              </mat-checkbox>
            </div>
          </mat-expansion-panel>

        </div>

        <!-- Sidebar Footer -->
        <div class="p-4 border-t flex gap-2 bg-white sticky bottom-0">
          <button mat-stroked-button class="flex-1" (click)="resetFilters()">
            <mat-icon>refresh</mat-icon>
            Reset
          </button>
        </div>

      </mat-sidenav>

      <!-- Main Content -->
      <mat-sidenav-content class="bg-gray-50 relative">
        <!-- Toggle Button -->
        <button
          mat-fab
          class="toggle-button"
          [class.sidebar-open]="isOpen()"
          (click)="toggleSidebar()"
          [matBadge]="activeFiltersCount()"
          [matBadgeHidden]="activeFiltersCount() === 0"
          matBadgeColor="warn">
          <mat-icon>{{ isOpen() ? 'close' : 'filter_list' }}</mat-icon>
        </button>

        <!-- Active Filters Chips -->
        @if (hasActiveFilters()) {
          <div class="active-filters">
            <mat-chip-set>
              @if (selectedCategory() !== 'all') {
                <mat-chip (removed)="selectCategory('all')">
                  {{ getCategoryLabel(selectedCategory()) }}
                  <button matChipRemove>
                    <mat-icon>cancel</mat-icon>
                  </button>
                </mat-chip>
              }

              @for (brand of selectedBrands(); track brand) {
                <mat-chip (removed)="toggleBrand(brand)">
                  {{ brand }}
                  <button matChipRemove>
                    <mat-icon>cancel</mat-icon>
                  </button>
                </mat-chip>
              }

              @for (type of selectedTypes(); track type) {
                <mat-chip (removed)="toggleType(type)">
                  {{ type }}
                  <button matChipRemove>
                    <mat-icon>cancel</mat-icon>
                  </button>
                </mat-chip>
              }

              @if (onSaleOnly()) {
                <mat-chip (removed)="toggleOnSale()">
                  En promotion
                  <button matChipRemove>
                    <mat-icon>cancel</mat-icon>
                  </button>
                </mat-chip>
              }
            </mat-chip-set>
          </div>
        }

        <!-- Content Slot -->
        <ng-content></ng-content>
      </mat-sidenav-content>

    </mat-sidenav-container>
  `,
  styles: [`
    .sidebar-header h2 {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .sidebar-header mat-icon {
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
    }

    /* Content */

    .filter-section {
      margin: 0;
      box-shadow: none !important;
      border-radius: 0 !important;
    }

    .filter-section mat-expansion-panel-header {
      padding: 1rem 1.5rem;
      font-weight: 600;
    }

    .filter-section mat-panel-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #212121;
    }

    .filter-section mat-panel-title mat-icon {
      color: #1976d2;
    }

    .filter-count {
      background-color: #1976d2;
      color: white;
      border-radius: 12px;
      padding: 0.125rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 700;
      margin-left: 0.5rem;
    }

    /* Categories */
    mat-nav-list {
      padding: 0;
    }

    mat-list-item {
      cursor: pointer;
      transition: background-color 0.2s;
      height: 56px;
    }

    mat-list-item:hover {
      background-color: #f5f5f5;
    }

    mat-list-item.active {
      background-color: #e3f2fd;
      border-left: 4px solid #1976d2;
    }

    mat-list-item.active mat-icon {
      color: #1976d2;
    }

    .count-badge {
      background-color: #e0e0e0;
      color: #616161;
      border-radius: 12px;
      padding: 0.125rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
    }

    mat-list-item.active .count-badge {
      background-color: #1976d2;
      color: white;
    }

    /* Price Filter */
    .price-filter {
      padding: 0.5rem 1.5rem 1rem;
    }

    .price-display {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      font-size: 1.25rem;
      font-weight: 700;
      color: #1976d2;
    }

    .price-value {
      background-color: #e3f2fd;
      padding: 0.5rem 1rem;
      border-radius: 8px;
    }

    .price-separator {
      color: #757575;
    }

    .price-slider {
      width: 100%;
      margin-bottom: 1.5rem;
    }

    .price-presets {
      margin-top: 1rem;
    }

    .price-presets mat-chip-set {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .price-presets mat-chip {
      justify-content: flex-start;
      width: 100%;
      cursor: pointer;
      transition: all 0.2s;
    }

    .price-presets mat-chip:hover {
      background-color: #e3f2fd;
    }

    /* Checkboxes */
    .checkbox-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 0.5rem 1.5rem 1rem;
    }

    .checkbox-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .type-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      color: #757575;
    }

    .sale-icon {
      color: #f44336;
    }

    .new-icon {
      color: #4caf50;
    }

    .rating-icon {
      color: #ffc107;
    }

    mat-checkbox {
      width: 100%;
    }

    /* Footer */
    .sidebar-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      background-color: white;
      border-top: 1px solid #e0e0e0;
      box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
    }

    .reset-button,
    .apply-button {
      flex: 1;
      font-weight: 600;
    }

    .reset-button mat-icon,
    .apply-button mat-icon {
      margin-right: 0.5rem;
    }

    /* Main Content */
    .main-content {
      position: relative;
      background-color: #f5f5f5;
    }

    .toggle-button {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
    }

    .toggle-button:hover {
      transform: scale(1.1);
    }

    .toggle-button.sidebar-open {
      background-color: #f44336;
    }

    /* Active Filters */
    .active-filters {
      padding: 1rem 1.5rem;
      background-color: white;
      border-bottom: 1px solid #e0e0e0;
    }

    .active-filters mat-chip-set {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .sidebar {
        width: 280px;
      }

      .toggle-button {
        bottom: 1rem;
        right: 1rem;
      }
    }

    /* Scrollbar */
    .sidebar-content::-webkit-scrollbar {
      width: 6px;
    }

    .sidebar-content::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    .sidebar-content::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 3px;
    }

    .sidebar-content::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `]
})
export class SidebarComponent {
  // Signals for state management
  isOpen = signal<boolean>(true);
  isMobile = signal<boolean>(false);

  // Category
  selectedCategory = signal<string>('all');
  camerasCount = signal<number>(8);
  lensesCount = signal<number>(12);
  accessoriesCount = signal<number>(24);
  tripodsCount = signal<number>(6);
  bagsCount = signal<number>(15);

  // Price
  minPrice = signal<number>(0);
  maxPrice = signal<number>(5000);

  // Brands
  availableBrands = signal<string[]>(['Canon', 'Nikon', 'Sony', 'Fujifilm', 'Panasonic', 'Olympus']);
  selectedBrands = signal<string[]>([]);

  // Types
  cameraTypes = signal([
    { value: 'Hybride', label: 'Hybride', icon: 'photo_camera' },
    { value: 'Reflex', label: 'Reflex', icon: 'camera_alt' },
    { value: 'Compact', label: 'Compact', icon: 'camera' },
    { value: 'Bridge', label: 'Bridge', icon: 'videocam' }
  ]);
  selectedTypes = signal<string[]>([]);

  // Megapixels
  megapixelRanges = signal([
    { label: 'Moins de 20 MP', min: 0, max: 20 },
    { label: '20-30 MP', min: 20, max: 30 },
    { label: '30-45 MP', min: 30, max: 45 },
    { label: 'Plus de 45 MP', min: 45, max: 100 }
  ]);
  selectedMegapixelRanges = signal<{min: number, max: number}[]>([]);

  // Special offers
  onSaleOnly = signal<boolean>(false);
  newArrivals = signal<boolean>(false);
  highRating = signal<boolean>(false);

  // Outputs
  filtersChanged = output<FilterOptions>();
  sidebarToggled = output<boolean>();

  constructor() {
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
  }

  private checkMobile() {
    this.isMobile.set(window.innerWidth < 768);
    if (this.isMobile()) {
      this.isOpen.set(false);
    }
  }

  toggleSidebar() {
    this.isOpen.update(val => !val);
    this.sidebarToggled.emit(this.isOpen());
  }

  onSidenavToggle(opened: boolean) {
    this.isOpen.set(opened);
    this.sidebarToggled.emit(opened);
  }

  // Category methods
  selectCategory(category: string) {
    this.selectedCategory.set(category);
    this.emitFilters();
  }

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      cameras: 'Appareils Photo',
      lenses: 'Objectifs',
      accessories: 'Accessoires',
      tripods: 'Trépieds',
      bags: 'Sacs'
    };
    return labels[category] || category;
  }

  // Price methods
  onPriceChange() {
    this.emitFilters();
  }

  setPriceRange(min: number, max: number) {
    this.minPrice.set(min);
    this.maxPrice.set(max);
    this.emitFilters();
  }

  isPriceRangeSelected(min: number, max: number): boolean {
    return this.minPrice() === min && this.maxPrice() === max;
  }

  // Brand methods
  toggleBrand(brand: string) {
    const brands = this.selectedBrands();
    const index = brands.indexOf(brand);

    if (index > -1) {
      this.selectedBrands.set(brands.filter(b => b !== brand));
    } else {
      this.selectedBrands.set([...brands, brand]);
    }

    this.emitFilters();
  }

  isBrandSelected(brand: string): boolean {
    return this.selectedBrands().includes(brand);
  }

  // Type methods
  toggleType(type: string) {
    const types = this.selectedTypes();
    const index = types.indexOf(type);

    if (index > -1) {
      this.selectedTypes.set(types.filter(t => t !== type));
    } else {
      this.selectedTypes.set([...types, type]);
    }

    this.emitFilters();
  }

  isTypeSelected(type: string): boolean {
    return this.selectedTypes().includes(type);
  }

  // Megapixel methods
  toggleMegapixelRange(min: number, max: number) {
    const ranges = this.selectedMegapixelRanges();
    const index = ranges.findIndex(r => r.min === min && r.max === max);

    if (index > -1) {
      this.selectedMegapixelRanges.set(ranges.filter((_, i) => i !== index));
    } else {
      this.selectedMegapixelRanges.set([...ranges, { min, max }]);
    }

    this.emitFilters();
  }

  isMegapixelRangeSelected(min: number, max: number): boolean {
    return this.selectedMegapixelRanges().some(r => r.min === min && r.max === max);
  }

  // Special offers methods
  toggleOnSale() {
    this.onSaleOnly.update(val => !val);
    this.emitFilters();
  }

  toggleNewArrivals() {
    this.newArrivals.update(val => !val);
    this.emitFilters();
  }

  toggleHighRating() {
    this.highRating.update(val => !val);
    this.emitFilters();
  }

  // Filter management
  hasActiveFilters(): boolean {
    return this.activeFiltersCount() > 0;
  }

  activeFiltersCount(): number {
    let count = 0;

    if (this.selectedCategory() !== 'all') count++;
    count += this.selectedBrands().length;
    count += this.selectedTypes().length;
    count += this.selectedMegapixelRanges().length;
    if (this.onSaleOnly()) count++;
    if (this.newArrivals()) count++;
    if (this.highRating()) count++;
    if (this.minPrice() > 0 || this.maxPrice() < 5000) count++;

    return count;
  }

  resetFilters() {
    this.selectedCategory.set('all');
    this.minPrice.set(0);
    this.maxPrice.set(5000);
    this.selectedBrands.set([]);
    this.selectedTypes.set([]);
    this.selectedMegapixelRanges.set([]);
    this.onSaleOnly.set(false);
    this.newArrivals.set(false);
    this.highRating.set(false);

    this.emitFilters();
  }

  applyFilters() {
    this.emitFilters();
    if (this.isMobile()) {
      this.toggleSidebar();
    }
  }

  private emitFilters() {
    const filters: FilterOptions = {
      category: this.selectedCategory(),
      priceRange: {
        min: this.minPrice(),
        max: this.maxPrice()
      },
      brands: this.selectedBrands(),
      types: this.selectedTypes()
    };

    this.filtersChanged.emit(filters);
  }
}
