import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private static prefix: string = 'app_design_';

  constructor() {}

  /**
   *
   * @param key
   * @param value
   * @param session
   */
  public static setItem(key: string, value: any, session: boolean = false): void {
    const storage = session ? sessionStorage : localStorage;
    storage.setItem(StorageService.prefix + key, JSON.stringify(value));
  }

  /**
   *
   * @param key
   * @param session
   */
  public static getItem(key: string, session: boolean = false): any {
    const storage = session ? sessionStorage : localStorage;
    return JSON.parse(storage.getItem(StorageService.prefix + key));
  }

  /**
   *
   * @param key
   * @param session
   */
  public static isset(key: string, session: boolean = false): boolean {
    const storage = session ? sessionStorage : localStorage;
    return !!storage.getItem(StorageService.prefix + key);
  }

  /**
   *
   */
  public static clear(): void {
    sessionStorage.clear();
    localStorage.clear();
  }

  /**
   *
   * @param key
   * @param session
   */
  public static removeItem(key: string, session: boolean = false): void {
    const storage = session ? sessionStorage : localStorage;
    return storage.removeItem(StorageService.prefix + key);
  }

}
