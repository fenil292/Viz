import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Data, Pagging } from '../../../../../shared/models/shared.model';
import { endpoints } from '../../../../../../endpoints/endpoints';
import { DatasetsData } from '../models/integrations.model';

@Injectable({
  providedIn: 'root'
})
export class IntegrationsService {
  private baseUrl = endpoints.ADMIN;
  private apsBaseUrl = endpoints.APS;
  
  constructor(private http: HttpClient) { }

  getDatasets(paging: Pagging): Observable<Data<DatasetsData>> {
    return this.http.post<Data<DatasetsData>>(`${this.baseUrl}/GetDatasets`, paging);
  }

  getDatasetLogs(id: number): Observable<Data<string>> {
    return this.http.get<Data<string>>(`${this.baseUrl}/GetDatasetLogs/${id}`);
  }

  getVersion(): Observable<Data<string>> {
    return this.http.get<Data<string>>(`${this.baseUrl}/GetVersion`);
  }

  getReprocessDataSet(id: number): Observable<Data<any>> {
    return this.http.get<Data<any>>(`${this.apsBaseUrl}/ReprocessDataset/${id}`);
  }
}
