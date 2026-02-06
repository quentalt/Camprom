import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white p-6 rounded-2xl shadow-lg mb-6 flex gap-8 items-center flex-wrap md:flex-nowrap">
      <div class="w-full md:w-auto">
        <h3 class="m-0 mb-3 text-sm font-bold text-gray-700 uppercase tracking-wide">
          Marques
        </h3>
        <div class="flex gap-2 flex-wrap justify-center md:justify-start">
          <button
            class="px-4 py-2 border-2 bg-white rounded-full font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
            [class]="selectedBrand === ''
              ? 'bg-gradient-to-br from-blue-600 to-blue-800 border-blue-600 text-white'
              : 'border-gray-300 text-gray-500 hover:border-blue-600 hover:text-blue-600'"
            (click)="onBrandSelect('')">
            Toutes
          </button>
          @for (brand of brands; track brand) {
            <button
              class="px-4 py-2 border-2 bg-white rounded-full font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
              [class]="selectedBrand === brand
                ? 'bg-gradient-to-br from-blue-600 to-blue-800 border-blue-600 text-white'
                : 'border-gray-300 text-gray-500 hover:border-blue-600 hover:text-blue-600'"
              (click)="onBrandSelect(brand)">
              {{ brand }}
            </button>
          }
        </div>
      </div>

      <div class="w-full md:w-auto">
        <h3 class="m-0 mb-3 text-sm font-bold text-gray-700 uppercase tracking-wide">
          Trier par
        </h3>
        <select
          class="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold text-sm text-gray-700 bg-white cursor-pointer transition-colors duration-200 focus:outline-none focus:border-blue-600"
          [value]="selectedSort"
          (change)="onSortChange($event)">
          <option value="name">Nom A-Z</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="rating">Meilleures notes</option>
          <option value="brand">Marque</option>
        </select>
      </div>

      <div class="w-full md:w-auto md:ml-auto text-center md:text-left">
        <span class="text-gray-500 font-semibold text-sm">
          {{ totalResults }} appareils trouvés
        </span>
      </div>
    </div>
  `,
  styles: []
})
export class FilterBarComponent {
  @Input() brands: string[] = [];
  @Input() selectedBrand: string = '';
  @Input() selectedSort: string = 'name';
  @Input() totalResults: number = 0;

  @Output() brandChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<string>();

  onBrandSelect(brand: string) {
    this.brandChange.emit(brand);
  }

  onSortChange(event: any) {
    this.sortChange.emit(event.target.value);
  }
}
