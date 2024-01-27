import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { endpoints } from '../../../../../endpoints/endpoints';
import { BaseResponseModel } from '../../../../shared/models/base-response.model';
import { WorkOrderModel } from '../models/work-order.model';
import { WorkOrderLog } from '../../work-order-logs/models/work-order-log.model';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderApiService {

  private SOURCES_URL = endpoints.WORK_ORDER;
  private PRIORITY_URL = endpoints.PRIORITY;

  constructor(private http: HttpClient) { }

  getWorkOrdersList(filter: any): Observable<BaseResponseModel<Array<WorkOrderModel>>> {
    return this.http.post<BaseResponseModel<Array<WorkOrderModel>>>(`${this.SOURCES_URL}/GetWorkOrders`, filter);
  }

  getWorkOrder(id: number): Observable<BaseResponseModel<WorkOrderModel>> {
    return this.http.get<BaseResponseModel<WorkOrderModel>>(`${this.SOURCES_URL}/GetWorkOrder/${id}`);
  }

  updateWorkOrderPriorities(data: any): any {
    return this.http.post(`${this.SOURCES_URL}\\UpdateWorkOrderPriorities`, data);
  }

  updateWorkOrderOperationPriorities(data: any): any {
    return this.http.post(`${this.SOURCES_URL}/UpdateWorkOrderOperationPriorities`, data);
  }

  getWorkOrderPriorityInfosShort(): Observable<BaseResponseModel<any>> {
    return this.http.get<BaseResponseModel<any>>(`${this.PRIORITY_URL}/GetPriorityInfosShort`);
  }

  getWorkOrderLogs(id: number): Observable<BaseResponseModel<Array<WorkOrderLog>>> {
    return this.http.get<BaseResponseModel<Array<WorkOrderLog>>>(`${this.SOURCES_URL}/GetWorkOrderLogs/${id}`);
  }

  exportWorkOrderPriorities(workOrderNumbers: string[]): Observable<BaseResponseModel<any>> {
    return this.http.post<BaseResponseModel<Array<any>>>(`${this.SOURCES_URL}/ExportWorkOrderPrioritiesByWorkOrderNumber`, workOrderNumbers);
  }

  exportWorkOrderOperationPriorities(workOrderNumber: string, workOrderOperationIds: number[]): Observable<BaseResponseModel<any>> {
    return this.http.post<BaseResponseModel<Array<any>>>(`${this.SOURCES_URL}/ExportWorkOrderOperationPrioritiesByWorkOrderNumber?workOrderNumber=${workOrderNumber}`, workOrderOperationIds);
  }

  saveWorkOrder(workOrder: WorkOrderModel): Observable<any> {
    return this.http.post<BaseResponseModel<Array<any>>>(`${this.SOURCES_URL}/SaveWorkOrder`, workOrder);
  }

  saveWorkOrderAttributeValue(workOrderAttribute: any): Observable<BaseResponseModel<any>> {
    return this.http.post<BaseResponseModel<any>>(`${this.SOURCES_URL}/SaveCustomAttributeValue`, workOrderAttribute);
  }
}
