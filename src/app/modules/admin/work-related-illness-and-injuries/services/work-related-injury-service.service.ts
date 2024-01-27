import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EntryInitializeDataModel, WorkRelatedInjuryModel } from '../models/work-related-injury.model';
import { Data } from '../../../../shared/models/shared.model';
import { endpoints } from '../../../../../endpoints/endpoints';

@Injectable({
  providedIn: 'root'
})
export class WorkRelatedInjuryServiceService {
  private baseUrl = endpoints.OSHA;

  constructor(private http: HttpClient) {}

  saveWorkRelatedInjury(workRelatedInjuryRecord: WorkRelatedInjuryModel): Observable<Data<number>> {
    return this.http.post<Data<number>>(`${this.baseUrl}/SaveIncident`, workRelatedInjuryRecord);
  }

  getWorkRelatedInjuryData(searchValue: string): Observable<Data<WorkRelatedInjuryModel[]>> {
    return this.http.get<Data<WorkRelatedInjuryModel[]>>(`${this.baseUrl}/Incidents?searchValue=${searchValue}`);
  }

  getWorkrelatedInjuryDataById(id: number): Observable<Data<WorkRelatedInjuryModel>> {
    return this.http.get<Data<WorkRelatedInjuryModel>>(`${this.baseUrl}/Incident/${id}`);
  }

  deleteWorkRelatedInjuryDataById(id: number): Observable<Data<WorkRelatedInjuryModel>> {
    return this.http.delete<Data<WorkRelatedInjuryModel>>(`${this.baseUrl}/DeleteIncident/${id}`);
  }

  getEntryInitializeData(): Observable<Data<EntryInitializeDataModel>> {
    return this.http.get<Data<EntryInitializeDataModel>>(`${this.baseUrl}/EntryInitializeData`);
  }
}
