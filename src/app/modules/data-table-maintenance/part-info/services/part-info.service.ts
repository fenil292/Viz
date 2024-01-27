import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Data } from '../../../../shared/models/shared.model';
import { endpoints } from '../../../../../endpoints/endpoints';
import { Part, PartAttribute } from '../models/part-info.model';

@Injectable({
  providedIn: 'root'
})
export class PartInfoService {
  private baseUrl = endpoints.PART;
  
  constructor(private http: HttpClient) { }

  getParts(): Observable<Data<Part[]>> {
    return this.http.get<Data<Part[]>>(`${this.baseUrl}/GetParts`);
  }

  loadExternalParts(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/LoadExternalParts`);
  }

  getPartCustomAttributes(id: number): Observable<Data<PartAttribute[]>> {
    return this.http.get<Data<PartAttribute[]>>(`${this.baseUrl}/CustomAttributes/${id}`);
  }

  saveCustomAttributes(attributes: PartAttribute[]): Observable<any> {
    return this.http.post<Data<any>>(`${this.baseUrl}/SaveCustomAttributes`, attributes);
  }
}
