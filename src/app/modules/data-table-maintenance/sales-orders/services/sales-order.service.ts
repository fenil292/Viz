import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endpoints } from '../../../../../endpoints/endpoints';
import { SalesOrder, SalesOrderAttribue } from '../models/sales-order.model';
import { Observable } from 'rxjs';
import { Data } from '../../../../shared/models/shared.model';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {
  private baseUrl = endpoints.SALES_ORDER;

  constructor(private http: HttpClient) { }

  getSalesOrders(filter: any): Observable<Data<SalesOrder[]>> {
    return this.http.post<Data<SalesOrder[]>>(`${this.baseUrl}/SalesOrders`, filter);
  }

  getSalesOrder(id: number): Observable<Data<SalesOrder>> {
    return this.http.get<Data<SalesOrder>>(`${this.baseUrl}/SalesOrder/${id}`);
  }

  saveCustomAttributes(attributes: SalesOrderAttribue[]): Observable<Data<any>> {
    return this.http.post<Data<any>>(`${this.baseUrl}/SaveCustomAttributes`, attributes);
  }
}
