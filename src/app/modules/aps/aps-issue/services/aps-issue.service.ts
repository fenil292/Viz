import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Data } from '../../../../shared/models/shared.model';
import { endpoints } from '../../../../../endpoints/endpoints';
import { ApsIssue } from '../models/aps-issue.model';

@Injectable({
  providedIn: 'root'
})
export class ApsIssueService {
  private baseUrl = endpoints.APS;

  constructor(private http: HttpClient) { }

  getApsIssues(): Observable<Data<ApsIssue[]>> {
    return this.http.get<Data<ApsIssue[]>>(`${this.baseUrl}/GetApsIssues`);
  }
}
