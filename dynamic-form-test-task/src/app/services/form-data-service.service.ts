import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormStructureModel } from '../models/form-structure-model';

@Injectable({
  providedIn: 'root'
})
export class FormDataServiceService {
  employeeDetailsFormData: any;

  constructor(private httpClient: HttpClient) { }

  getFormDataStructure() {
    return this.httpClient.get<FormStructureModel>("/assets/data/form-structure.json");
  }

}
