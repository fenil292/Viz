import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WidgetModel, TableWidgetModel, KeyValueWidgetModel, TableWidgetDetails } from '../../../modules/dashboard/models/dashboard-model';
import { endpoints } from '../../../../endpoints/endpoints';
import { Data } from '../../../shared/models/shared.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = endpoints.DASHBOARD;
  private viztocAutomationUrl = environment.VIZTOK_AUTOMATION_URL;

  constructor(private http: HttpClient ) {}

  getAllWidgets(): Observable<Data<WidgetModel[]>> {
    return this.http.get<Data<WidgetModel[]>>(`${this.baseUrl}/Widgets`);
  }

  getWidgetDataUsingRequestUrl(requestUrl: string, id: number): Observable<Data<KeyValueWidgetModel> | Data<TableWidgetModel>> {
    return this.http.get<Data<TableWidgetModel>>(`${this.viztocAutomationUrl}/${requestUrl}/${id}`);
  }

  getWidgetDetails(detailsUrl: string, queryParams: string): Observable<Data<TableWidgetDetails>> {
    return this.http.get<Data<TableWidgetDetails>>(`${this.viztocAutomationUrl}/${detailsUrl}/${queryParams}`);
  }
}
