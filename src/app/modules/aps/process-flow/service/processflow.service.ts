import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { endpoints } from '../../../../../endpoints/endpoints';
import { ConditionBuild, Data, EmulateFlowRule, ProcessFlow } from '../models/processflow.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessflowService {
  private baseUrl = endpoints.APS;
  private priorityBaseUrl = endpoints.PRIORITY;
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  getApsProcessFlowList(): Observable<Data<ProcessFlow[]>> {
    return this.http.get<Data<ProcessFlow[]>>(`${this.baseUrl}/GetApsProcessFlowList`);
  }

  getApsConditionBuild(): Observable<Data<ConditionBuild>> {
    return this.http.get<Data<ConditionBuild>>(`${this.baseUrl}/GetConditionBuild`);
  }

  saveApsProcessFlow(processFlow: ProcessFlow): Observable<Data<any>> {
    return this.http.post<Data<any>>(`${this.baseUrl}/SaveApsProcessFlow`, processFlow, { headers: this.headers });
  }

  getApsProcessFlowById(id: number): Observable<Data<ProcessFlow>> {
    return this.http.get<Data<ProcessFlow>>(`${this.baseUrl}/GetApsProcessFlow/${id}`);
  }

  moveApsProcessFlow(id: number, index: number): Observable<Data<any>> {
    return this.http.post<Data<any>>(`${this.baseUrl}/MoveToIndexApsProcessFlow?apsProcessFlowId=${id}&index=${index}`, null);
  }

  deleteApsProcessFlow(id: number): Observable<Data<any>> {
    return this.http.delete<Data<any>>(`${this.baseUrl}/DeleteApsProcessFlow/${id}`);
  }

  getTroubleshootRuleLogs(id: number): Observable<Data<EmulateFlowRule>> {
    return this.http.post<Data<EmulateFlowRule>>(`${this.baseUrl}/EmulateFlowRule/${id}`, id);
  }
}
