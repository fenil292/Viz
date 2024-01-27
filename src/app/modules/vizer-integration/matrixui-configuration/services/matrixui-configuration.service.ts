import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Data } from '../../../../shared/models/shared.model';
import { endpoints } from '../../../../../endpoints/endpoints';
import { MatrixUIConfiguration } from '../models/matriui-configuration.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatrixuiConfigurationService {
  private baseUrl = endpoints.VIZER_INTEGRATION;
  
  constructor(private http: HttpClient) { }

  getMatrixUIConfigurations(): Observable<Data<MatrixUIConfiguration>> {
    return this.http.get<Data<MatrixUIConfiguration>>(`${this.baseUrl}/GetMatrixUIConfigurations`);  
  }

  saveMatrixUIConfigurations(configurations: MatrixUIConfiguration): Observable<Data<any>> {
    return this.http.post<Data<any>>(`${this.baseUrl}/SaveMatrixUIConfigurations`, configurations);
  }
}
