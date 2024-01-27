import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { endpoints } from '../../../../../endpoints/endpoints';
import { AttributeModel, CustomAttribute } from '../models/custom-attribute.model';
import { Data } from '../../../../shared/models/shared.model';


@Injectable({
  providedIn: 'root'
})
export class CustomAttributeService {
  private baseUrl = endpoints.CUSTOM_ATTRIBUTE;

  constructor(private http: HttpClient) { }

  getCustomAttributes(): Observable<Data<CustomAttribute>> {
    return this.http.get<Data<CustomAttribute>>(`${this.baseUrl}/CustomerAttributes`);
  }

  saveCustomAttributes(customAttribute: CustomAttribute): Observable<Data<any>> {
    return this.http.post<Data<any>>(`${this.baseUrl}/SaveCustomerAttributes`, customAttribute);
  }

  getAttributeValues(id: number): Observable<Data<boolean>> {
    return this.http.get<Data<boolean>>(`${this.baseUrl}/AttributeValues/${id}`);
  }

  getCustomAttributesForEntity(name: string): Observable<Data<AttributeModel[]>> {
    return this.http.get<Data<AttributeModel[]>>(`${this.baseUrl}/CustomAttributesForEntity?entity=${name}`);
  }

  getCustomAttributeByName(entity: string, attributeName: string): Observable<Data<AttributeModel>> {
    return this.http.get<Data<AttributeModel>>(`${this.baseUrl}/CustomAttributeByName?entity=${entity}&customAttributeName=${attributeName}`);
  }
}
