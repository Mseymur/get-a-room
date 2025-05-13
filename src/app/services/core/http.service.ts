import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {Url} from '../../interfaces/core/url';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

interface HttpOptions {
  headers?: { name: string; value: string }[];
  errors?: { [key: number]: (error: HttpErrorResponse) => void };
  allErrors?: (error: HttpErrorResponse) => void;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private numberOfRetries: number = 0;

  /**
   *
   * @param httpClient
   */
  constructor(private httpClient: HttpClient) {
  }

  /**
   *
   * @param url
   */
  public generateLink(url: string | Url): string {
    const baseUrl: string = environment.baseUrl;
    if(typeof (url) === 'string') {
      if(url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
        return url;
      }
      return baseUrl + url;
    }
    else {
      url = {
        ...{
          url: [],
          params: [],
          query: {}
        }, ...url
      };

      let _url = '';
      if(baseUrl) {
        _url = baseUrl;
      }
      let delimiter = '';
      // ---------------------------------------------------------------------------------------------------------------
      for (const urlPart of url.url) {
        _url += delimiter + urlPart;
        delimiter = '/';
      }
      // ---------------------------------------------------------------------------------------------------------------
      delimiter = '';
      // @ts-ignore
      for (const param of url.params) {
        if(param) {
          _url += delimiter + param;
          delimiter = '/';
        }
      }
      // ---------------------------------------------------------------------------------------------------------------
      delimiter = '?';
      for (const key in url.query) {
        if(url.query.hasOwnProperty(key)) {
          _url = _url + delimiter + key + '=' + url.query[key];
          delimiter = '&';
        }
      }
      // ---------------------------------------------------------------------------------------------------------------
      return _url;
    }

  }

  /**
   *
   * @param error
   * @param httpOptions
   */
  public handleError(error: HttpErrorResponse, httpOptions: HttpOptions): Observable<never> {
    // Client error
    if(error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      if(httpOptions.errors?.hasOwnProperty(error.status)) {
        httpOptions.errors[error.status](error);
      }
      if(error.status === 401) {
        // TODO: Handle 401
      } else {
        if(httpOptions.allErrors) {
          httpOptions.allErrors(error);
        }
      }
    }

    return throwError(error);
  }

  /**
   *
   * @param httpOptions
   */
  public getHttpOptions(httpOptions: HttpOptions = {}) {
    const options: any = {};

    if(httpOptions.headers) {
      options.headers = {};
      for (const header of httpOptions.headers) {
        options.headers[header.name] = header.value;
      }
    }

    return options;
  }

  /**
   *
   * @param url
   * @param httpOptions
   */
  public get<T>(url: string | Url, httpOptions: HttpOptions = {}): Observable<T> {
    url = this.generateLink(url);

    // @ts-ignore
    return this.httpClient.get<T>(
      url,
      this.getHttpOptions(httpOptions)).pipe(retry(this.numberOfRetries),
      catchError((error) => this.handleError(error, httpOptions)));
  }

  /**
   *
   * @param url
   * @param data
   * @param httpOptions
   */
  public post<T>(url: string | Url,
                 data: any,
                 httpOptions: HttpOptions = {}): Observable<T> {
    url = this.generateLink(url);

    // @ts-ignore
    return this.httpClient.post<T>(url,
      data,
      this.getHttpOptions(httpOptions)).pipe(retry(this.numberOfRetries),
      catchError((error) => this.handleError(error, httpOptions)));
  }

  /**
   *
   * @param url
   * @param data
   * @param httpOptions
   */
  public put<T>(url: string | Url,
                data: any,
                httpOptions: HttpOptions = {}): Observable<T> {
    url = this.generateLink(url);

    // @ts-ignore
    return this.httpClient.put<T>(
      url,
      data,
      this.getHttpOptions(httpOptions)).pipe(retry(this.numberOfRetries),
      catchError((error) => this.handleError(error, httpOptions)));
  }

  /**
   *
   * @param url
   * @param httpOptions
   */
  public delete<T>(url: string | Url,
                   httpOptions: HttpOptions = {}): Observable<T> {
    url = this.generateLink(url);

    // @ts-ignore
    return this.httpClient.delete<T>(
      url,
      this.getHttpOptions(httpOptions)).pipe(retry(this.numberOfRetries),
      catchError((error) => this.handleError(error, httpOptions)));
  }

  /**
   *
   * @param url
   * @param data
   * @param httpOptions
   */
  public patch<T>(url: string | Url,
                  data: any,
                  httpOptions: HttpOptions = {}): Observable<T> {
    url = this.generateLink(url);

    // @ts-ignore
    return this.httpClient.patch<T>(
      url,
      data,
      this.getHttpOptions(httpOptions)).pipe(retry(this.numberOfRetries),
      catchError((error) => this.handleError(error, httpOptions)));
  }

  /**
   *
   * @param url
   * @param httpOptions
   * @param type
   */
  public download(url: string | Url, httpOptions: HttpOptions = {}, type: string = 'application/octet-stream'): Observable<Blob> {
    url = this.generateLink(url);
    const options = this.getHttpOptions(httpOptions);

    return this.httpClient.get(url, {
      ...options,
      responseType: 'blob'
    }).pipe(map((_file) => {
      return new Blob([_file], { type: type });
    }));
  }

}
