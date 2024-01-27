import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { endpoints } from '../../../../endpoints/endpoints';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UpdateHotSheetsModel } from '../models/update-hotsheets.model';
import { HotsheetPriorityShortModel } from '../models/hotsheet-priority.interface';
import { HotSheetListModel } from '../models/hotsheets.model';
import { Data } from '../../../shared/models/shared.model';

@Injectable({
  providedIn: 'root'
})

export class HotsheetsApiService {
  private SOURCES_URL = endpoints.HOTSHEET;
  private PRIORITY_URL = endpoints.PRIORITY;
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  constructor(private http: HttpClient) { }

  getHotSheetList(): Observable<Data<HotSheetListModel>>{
    return this.http.get<Data<HotSheetListModel>>(`${this.SOURCES_URL}\\GetHotSheet`);
  }

  getPriorityListShort(): Observable<Data<Array<HotsheetPriorityShortModel>>> {
    return this.http.get<Data<Array<HotsheetPriorityShortModel>>>(`${this.PRIORITY_URL}/GetHotSheetPriorityInfosShort`);
  }

  updateHotSheetList(data: UpdateHotSheetsModel): Observable<any> {
    return this.http.post(`${this.SOURCES_URL}\\UpdateHotSheetPriority`, data);
  }

  getHotSheetExcel(data: any) {
    return this.http.post(`${this.SOURCES_URL}/GetHotSheetExcel`, data, { headers: this.headers, responseType: 'blob' as 'json'});
  }

  saveCustomAttributeValue(hotSheetAttribute: any): Observable<Data<any>> {
    return this.http.post<Data<any>>(`${this.SOURCES_URL}/SaveCustomAttribute`, hotSheetAttribute);
  }
}
