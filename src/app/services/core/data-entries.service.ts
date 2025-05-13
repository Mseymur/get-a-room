import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataEntriesService {

  constructor(private httpService: HttpService) {}

  public add<T extends { key: string }>(entry: T): Observable<T> {
    entry.key = environment.keySuffix + entry.key;
    return this.httpService.post<any>({
      url: ['data', 'entries']
    }, entry);
  }

  public update<T extends { key: string }>(entry: T): Observable<T> {
    entry.key = environment.keySuffix + entry.key;
    return this.httpService.put<any>({
      url: ['data', 'entries']
    }, entry);
  }

  public get<T>(entryId: number): Observable<T> {
    return this.httpService.get<any>({
      url: ['data', 'entries', entryId.toString()]
    });
  }

  public getAll<T>(key: string): Observable<T[]> {
    return this.httpService.get<any[]>({
      url: ['data', 'entries'],
      query: {
        type: key
      }
    });
  }

}
