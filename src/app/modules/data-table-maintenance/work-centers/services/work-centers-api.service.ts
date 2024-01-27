import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { endpoints } from '../../../../../endpoints/endpoints';
import { HttpClient } from '@angular/common/http';
import { WorkCenterModel } from '../models/work-center.model';
import { BaseResponseModel } from '../../../../shared/models/base-response.model';

@Injectable({
  providedIn: 'root'
})
export class WorkCentersApiService {
  private SOURCES_URL = endpoints.WORK_CENTER;

  constructor(private http: HttpClient) { }

  getWorkCenters(): Observable<BaseResponseModel<Array<WorkCenterModel>>> {
    return this.http.get<BaseResponseModel<Array<WorkCenterModel>>>(`${this.SOURCES_URL}/GetWorkCenters`);
  }

  getWorkCenterDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.SOURCES_URL}/GetWorkCenter/${id}`);
  }

  saveWorkCenter(data: WorkCenterModel): Observable<any> {
    return this.http.post(`${this.SOURCES_URL}/SaveWorkCenter`, data);
  }

  deleteWorkCenter(id: number): Observable<any> {
    return this.http.delete(`${this.SOURCES_URL}/DeleteWorkCenters/${id}`);
  }

  loadExternalWorkCenters(): Observable<any> {
    return this.http.post(`${this.SOURCES_URL}/LoadExternalWorkCenters`,{});
  }
}
