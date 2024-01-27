import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Data } from '../../../../shared/models/shared.model';
import { endpoints } from '../../../../../endpoints/endpoints';
import { Export, ExportChangeSet } from '../models/export.model';

@Injectable({
  providedIn: 'root'
})
export class ExportsService {
  private baseUrl = endpoints.ADMIN;
  
  constructor(private http: HttpClient) { }

  getExports(): Observable<Data<Export[]>> {
    return this.http.get<Data<Export[]>>(`${this.baseUrl}/GetExports`);
  }

  getExportLogs(id: number): Observable<Data<string>> {
    return this.http.get<Data<string>>(`${this.baseUrl}/GetExportLogs/${id}`);
  }

  getExportChangeSet(id: number): Observable<Data<ExportChangeSet>> {
    return this.http.get<Data<ExportChangeSet>>(`${this.baseUrl}/GetExportChangeset/${id}`);
  }
}
