// `src/app/services/camera.service.ts`
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { Camera } from '../models/camera.model';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/cameras`;

  // Signals pour le state management
  cameras = signal<Camera[]>([]);
  brands = signal<string[]>([]);
  isLoading = signal<boolean>(false);

  getCameras(): Observable<Camera[]> {
    this.isLoading.set(true);
    return this.http.get<Camera[]>(this.apiUrl).pipe(
      tap(cameras => {
        this.cameras.set(cameras);
        this.isLoading.set(false);
      }),
      catchError(error => {
        console.error('Error fetching cameras:', error);
        this.isLoading.set(false);
        return of([]);
      })
    );
  }

  getCameraById(id: number): Observable<Camera | undefined> {
    return this.http.get<Camera>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching camera ${id}:`, error);
        return of(undefined);
      })
    );
  }

  getBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/meta/brands`).pipe(
      tap(brands => this.brands.set(brands)),
      catchError(error => {
        console.error('Error fetching brands:', error);
        return of([]);
      })
    );
  }

  filterCameras(brand: string = '', sortBy: string = 'name'): Observable<Camera[]> {
    this.isLoading.set(true);
    const params: any = {};
    if (brand) params.brand = brand;
    if (sortBy) params.sortBy = sortBy;

    return this.http.get<Camera[]>(`${this.apiUrl}/filter/search`, { params }).pipe(
      tap(cameras => {
        this.cameras.set(cameras);
        this.isLoading.set(false);
      }),
      catchError(error => {
        console.error('Error filtering cameras:', error);
        this.isLoading.set(false);
        return of([]);
      })
    );
  }

  createCamera(camera: Omit<Camera, 'id'>): Observable<Camera> {
    return this.http.post<Camera>(this.apiUrl, camera);
  }

  updateCamera(id: number, camera: Partial<Camera>): Observable<Camera> {
    return this.http.put<Camera>(`${this.apiUrl}/${id}`, camera);
  }

  deleteCamera(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
