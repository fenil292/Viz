import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Data } from '../../../../shared/models/shared.model';
import { endpoints } from '../../../../../endpoints/endpoints';
import { Priority } from '../models/priority.model';

@Injectable({
  providedIn: 'root'
})
export class PriorityService {
  private baseUrl = endpoints.PRIORITY;
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  
  constructor(private http: HttpClient) { }

  getPriorityInfos(): Observable<Data<Priority[]>> {
    return this.http.get<Data<Priority[]>>(`${this.baseUrl}/GetPriorityInfos`);
  }

  savePriorityInfo(priority: Priority): Observable<Data<any>> {
    return this.http.post<Data<any>>(`${this.baseUrl}/SavePriorityInfo`, priority, { headers: this.headers });
  }

  getPriorityInfoById(id: number): Observable<Data<Priority>> {
    return this.http.get<Data<Priority>>(`${this.baseUrl}/GetPriorityInfo/${id}`);
  }

  deletePriorityInfo(id: number): Observable<Data<any>> {
    return this.http.delete<Data<any>>(`${this.baseUrl}/DeletePriorityInfo/${id}`);
  }
}
