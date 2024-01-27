import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { endpoints } from '../../../../../endpoints/endpoints';
import { Data } from '../../process-flow/models/processflow.model';
import { ApsSettings } from '../constants/aps-settings.model';

@Injectable({
  providedIn: 'root'
})
export class ApsSettingsService {
  private baseUrl = endpoints.APS;
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  saveApsSettings(apsSettings: ApsSettings): Observable<Data<any>> {
    return this.http.post<Data<any>>(`${this.baseUrl}/SaveApsSettings`, apsSettings, { headers: this.headers });
  }

  getApsSettings(): Observable<Data<ApsSettings>> {
    return this.http.get<Data<ApsSettings>>(`${this.baseUrl}/GetApsSettings`);
  }

  startApsJob(forceIntegrationDataset: boolean): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/StartApsJob/${forceIntegrationDataset}`);
  }

  resetJob(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/ResetJob`);
  }
}
