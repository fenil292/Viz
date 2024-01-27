import { Injectable } from '@angular/core';
import { Condition, Rule } from '../../modules/aps/process-flow/models/processflow.model';

@Injectable({
  providedIn: 'root'
})
export class QueryBuilderUtilityService {
  isValid: boolean = true;
  message: string = "";
  inValidAttributes: string[] = [];

  constructor() { }

  validateQueryForNotExistAttribue(condition: Condition) {
    this.isValid = true;
    this.inValidAttributes = [];
    this.message = "";
    this.validateRulesForNotExistAttribue(condition);
    return { status: this.isValid, message: this.message };
  }

  private validateRulesForNotExistAttribue(condition: Condition) {
    this.validateExistProperty(condition.rules);
    condition.groupRules.forEach((item: Condition) => {
      this.validateQueryForNotExistAttribue(item);
    });
  }

  private validateExistProperty(rules: Rule[]) {
    rules.forEach((rule: Rule) => {
      if(rule.exist === false) {
        this.isValid = false;
        const attributeName = `${rule.table}.${rule.field}`;
        if(!this.inValidAttributes.includes(attributeName)) {
          this.message += `Attribute '${rule.field}' for table '${rule.table}' does not exist<br/>`;
        }
      }
    });
  }
}
