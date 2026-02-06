// src/app/services/favorites.service.ts
import { inject, Injectable, signal } from '@angular/core';
import { Camera } from '../models/camera.model';
import { HttpClient } from '@angular/common/http';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/favorites`;

  // Signal pour stocker les favoris
  favorites = signal<Camera[]>([]);

  // Ajouter une caméra aux favoris
  addFavorite(camera: Camera) {
    if (!this.isFavorite(camera.id)) {
      this.favorites.set([...this.favorites(), camera]);
      this.http.post(this.apiUrl, { cameraId: camera.id }).subscribe();
    }
  }

  // Supprimer une caméra des favoris
  removeFavorite(cameraId?: number) {
    // Si aucun ID n'est fourni, vider tous les favoris
    if (cameraId === undefined) {
      this.favorites.set([]);
      this.http.delete(this.apiUrl).subscribe();
    } else {
      this.favorites.set(this.favorites().filter(fav => fav.id !== cameraId));
      this.http.delete(`${this.apiUrl}/${cameraId}`).subscribe();
    }
  }

  // Vérifier si une caméra est dans les favoris
  isFavorite(cameraId: number): boolean {
    return this.favorites().some(fav => fav.id === cameraId);
  }

  // Récupérer les favoris depuis le backend
  loadFavorites() {
    this.http.get<Camera[]>(this.apiUrl).subscribe(favorites => {
      this.favorites.set(favorites);
    });
  }

  // Obtenir le nombre de favoris
  getFavoritesCount(): number {
    return this.favorites().length;
  }
}
