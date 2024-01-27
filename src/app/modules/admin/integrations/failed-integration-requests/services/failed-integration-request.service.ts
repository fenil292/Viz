import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Data } from '../../../../../shared/models/shared.model';
import { endpoints } from '../../../../../../endpoints/endpoints';
import { FailedIntegrationRequest } from '../models/failed-integration-requests.model';

@Injectable({
  providedIn: 'root'
})
export class FailedIntegrationRequestService {
  private baseUrl = endpoints.ADMIN;

  constructor(private http: HttpClient) { }

  getFailedIntegrationRequests(): Observable<Data<FailedIntegrationRequest[]>> {
    return this.http.get<Data<FailedIntegrationRequest[]>>(`${this.baseUrl}/GetFailedIntegrationRequests`);
  }

  getFailedIntegrationRequestLogs(id: number): Observable<Data<string>> {
    return this.http.get<Data<string>>(`${this.baseUrl}/GetFailedIntegrationRequestLogs/${id}`);
  }
}
