import { Injectable } from '@angular/core';
import { HttpService } from './core/http.service';
import { Observable } from 'rxjs';

export interface Room {
  id: string;
  name: string;
  building: string;
  floor: string;
  type: string;
  currentStatus: 'free' | 'occupied';
  nextAvailable?: string;
  availableUntil?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  constructor(private httpService: HttpService) {}

  getRoomsByBuilding(building: string, date?: string): Observable<Room[]> {
    return this.httpService.get<Room[]>({
      url: ['rooms'],
      query: {
        building: building,
        date: date || new Date().toISOString().split('T')[0]
      }
    });
  }

  getRoomAvailability(roomId: string, date: string): Observable<any> {
    return this.httpService.get<any>({
      url: ['rooms', roomId, 'availability'],
      query: {
        date: date
      }
    });
  }
} 