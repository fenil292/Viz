import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { endpoints } from '../../../../../endpoints/endpoints';
import { HttpClient } from '@angular/common/http';
import { Data, LookUpItem } from '../../../../shared/models/shared.model';
import { VizerDisplayGroups } from '../models/vizer-display-group.model';

@Injectable({
  providedIn: 'root'
})
export class VizerDisplayGroupsApiService {
  private SOURCES_URL = endpoints.VIZER_INTEGRATION;

  constructor(private http: HttpClient) { }

  getVizerDisplayGroups(): Observable<Data<Array<VizerDisplayGroups>>> {
    return this.http.get<Data<Array<VizerDisplayGroups>>>(`${this.SOURCES_URL}/GetVizerDisplayGroups`);
  }

  getVizerDisplayGroupDetails(id: number): Observable<Data<VizerDisplayGroups>> {
    return this.http.get<Data<VizerDisplayGroups>>(`${this.SOURCES_URL}/GetVizerDisplayGroup/${id}`);
  }

  getSortOrders(): Observable<Data<LookUpItem[]>> {
    return this.http.get<Data<LookUpItem[]>>(`${this.SOURCES_URL}/SortOrders`);
  }

  saveVizerDisplayGroup(data: VizerDisplayGroups): Observable<any> {
    return this.http.post(`${this.SOURCES_URL}/SaveVizerDisplayGroup`, data);
  }

  deleteVizerDisplayGroup(id: number): Observable<any> {
    return this.http.delete(`${this.SOURCES_URL}/DeleteVizerDisplayGroup/${id}`);
  }
}

