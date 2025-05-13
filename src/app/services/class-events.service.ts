import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ClassEvent } from '../interfaces/class-event';
import { ClassEventFactory } from '../factories/class-event.factory';
import mockEventsData from '../../assets/mock-events.json';

interface RawClassEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allday: boolean;
  className: string[];
  color: string;
  description: string;
}

interface LoadEventsParams {
  q: string;
  start?: string;
  end?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClassEventsService {
  private readonly API_URL = 'https://api.fh-joanneum.at/events/v1';

  constructor(private http: HttpClient) {}

  loadClassEvents(params: LoadEventsParams): Observable<ClassEvent[]> {
    const url = `${this.API_URL}/events`;
    return this.http.get<RawClassEvent[]>(url, { params: params as any }).pipe(
      map(events => ClassEventFactory.fromArray(events)),
      catchError(() => {
        console.log('Using mock data due to API error');
        const mockEvents = mockEventsData as unknown as RawClassEvent[];
        
        // If start date is provided, filter by date
        if (params.start) {
          const targetDate = new Date(params.start);
          targetDate.setHours(0, 0, 0, 0);
          
          const filteredEvents = mockEvents.filter(event => {
            const eventDate = new Date(event.start);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate.getTime() === targetDate.getTime();
          });

          return of(ClassEventFactory.fromArray(filteredEvents));
        }
        
        // If no date provided, return all events
        return of(ClassEventFactory.fromArray(mockEvents));
      })
    );
  }
}
