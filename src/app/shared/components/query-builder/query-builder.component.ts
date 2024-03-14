import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { PopupRef, PopupService } from '@progress/kendo-angular-popup';
import { QueryBuilderConfig } from 'angular2-query-builder';
import {
  Condition,
  ConditionBuild,
  Data,
  Field,
  Rule,
  Table,
  TypeOperator
} from '../../../modules/aps/process-flow/models/processflow.model';
import { ProcessflowService } from '../../../modules/aps/process-flow/service/processflow.service';
import { ComparisonOperator, DataType, operatorSymbols } from './constants/query-builder.constants';

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QueryBuilderComponent implements OnInit, OnChanges, OnDestroy {
  @Input() queryConditions: Condition | undefined = undefined;
  @Output() changeConditions = new EventEmitter<any>();
  conditionBuild: ConditionBuild;
  isLoading: boolean = true;
  queryControl!: FormControl;
  @ViewChild("anchor") public anchor: ElementRef;
  @ViewChild('addRuleRef', { read: ViewContainerRef, static: true }) public addRuleRef: any;
  conditions: any[] = [];
  query = {
    condition: '0',
    rules: []
  };
  public popupRef: PopupRef;
  config: QueryBuilderConfig = {} as any;
  dataTypes = DataType;
  ruleIndex: number = 1;

  constructor(
    private popupService: PopupService,
    private formBuilder: FormBuilder,
    private processFlowService: ProcessflowService) { }

  ngOnDestroy(): void {
    this.closeAddRule();
  }

  ngOnInit(): void {
    this.getConditionBuild();
    this.queryControl = this.formBuilder.control(this.query);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.queryConditions) {
      if(changes.queryConditions.currentValue) {
        this.queryConditions = changes.queryConditions.currentValue;
        this.prepareQuery();
      }
    }
  }

  onQueryBuilderChange(event: any) {
    this.conditions = [];
    let conditions = event;
    this.conditions = this.getGroupRules([conditions]);
    if(this.conditions.length > 0) {
      const conditions = {
        operator: this.conditions[0].operator,
        rules: this.conditions[0].rules,
        groupRules: this.conditions[0].groupRules
      };
      const errors = this.queryControl.errors === null ? true : false;
      this.changeConditions.emit({ data: conditions, errors: errors });
    }
  }

  openAddRule(anchor: any, template: TemplateRef<any>): void {
    if (this.popupRef) {
         this.popupRef.close();
         this.popupRef = null;
         return;
    }

    this.popupRef = this.popupService.open({
      anchor: anchor,
      content: template,
      popupClass: 'add-rule-popup',
      appendTo: this.addRuleRef
    });
  }

  closeAddRule() {
    if (this.popupRef) {
      this.popupRef.close();
      this.popupRef = null;
    }
  }

  onReArrangeRuleOrder() {
    this.ruleIndex = 1;
    this.query?.rules?.forEach(rule => {
      if (rule?.rules) {
        if (rule.rules.length > 0) {
          this.onTraverseQueryBuilderRules(rule);
        }
      }
      else {
        rule.ruleIndex = this.ruleIndex;
        this.ruleIndex++;
      }
    });
  }

  @HostListener("document:keydown", ["$event"])
  public keydown(event: KeyboardEvent): void {
    if (event?.keyCode === 27) {
      this.closeAddRule();
    }
  }

  @HostListener("document:click", ["$event"])
  public documentClick(event: KeyboardEvent): void {
    if (!this.contains(event.target)) {
      this.closeAddRule();
    }
  }

  private contains(target: any): boolean {
    return (
      this.anchor?.nativeElement.contains(target) ||
      target?.classList?.contains('plus') ||
      (this.addRuleRef ? this.addRuleRef.nativeElement.contains(target) : false)
    );
  }

  private getConditionBuild() {
    this.isLoading = true;
    this.processFlowService.getApsConditionBuild().subscribe({
      next: (res: Data<ConditionBuild>) => {
        this.conditionBuild = res.data;
        this.preapreQueryBuilderConfig();
        this.prepareQuery();
      }
    }).add(() => this.isLoading = false);
  }

  private preapreQueryBuilderConfig() {
    if(this.conditionBuild.tables.length > 0 && this.conditionBuild.typeOperators.length > 0) {
      let entities = {};
      this.conditionBuild.tables.forEach(item => {
        entities[item.name] = { name: item.name }
      });

      let fields = {};
      this.conditionBuild.tables.forEach((item: Table) => {

        item.fields.forEach((field: Field) => {
          const operators = this.conditionBuild.typeOperators.find((x: TypeOperator) => (x.type.toLowerCase() === field.type.toLowerCase() || (x.type.toLowerCase() === DataType.STRING && field.type.toLowerCase() === DataType.URL)) &&
                            x.isNull === field.isNull)?.operators;
          if(operators) {
            let res = { 
              name: `${item.name}-${field.name}`,
              text: field.name,
              type: field.type,
              operators: this.getOperatorSymbols(operators),
              entity: item.name,
              defaultValue: '',
              nullable: field.isNull,
              validator: this.validator
            };
            fields[`${item.name}-${field.name}`] = res;
          }
        })
      })
      this.config = { entities: entities, fields: fields };
    }
  }

  private getGroupRules(conditions: any[]) {
    if(conditions.length > 0){
      let rules = [];
      conditions.forEach(condition => {
        if(condition?.condition && condition?.rules) {
          let c = condition.condition === "and" ? 0 : condition.condition;
          rules.push({
            operator: parseInt(c),
            rules: this.getRules(condition.rules.filter(x => x.field !== undefined)),
            groupRules: this.getGroupRules(condition.rules.filter(x => x.condition !== undefined)) ?? []
          });
        }
      });
      return rules;
    }
  }

  private getRules(rules: any[]) {
    let res = [];
    rules.forEach(item => {
      if(item.field) {
          const field = item.field.split('-')[1];
          const column = this.conditionBuild.tables.find(x => x.name === item.entity)?.fields.find(x => x.name === field);
          if(column) {
            const type = column?.type ?? '';
            const persist = column?.persist;
            let rule = {
              field: field,
              table: item.entity,
              comparison: item.operator.id,
              value: this.getValueByType(item.value, type),
              type: type,
              persist: persist,
              exist: (item?.exist !== undefined && item?.exist !== null) ? item.exist : true
            }
            res.push(rule);
          }
          else if(item?.exist === false) {
            const rule = this.getNotExistAttributeRule(item);
            res.push(rule);
          }
      }
    });
    return res;
  }

  private getNotExistAttributeRule(item: any) {
    const type = this.config.fields[item.field]?.type ?? DataType.STRING;
    const field = item.field.split('-')[1];
    return {
      field: field,
      table: item.entity,
      comparison: item.operator.id,
      value: this.getValueByType(item.value, type),
      type: type,
      persist: item.persist,
      exist: item.exist
    };
  }

  private getValueByType(value: any, type: string) {
    let res = "";
    if(value != undefined && value !== null) {
      switch(type.toLowerCase()) {
        case DataType.NVARCHAR:
        case DataType.BOOLEAN:
        case DataType.INT:
        case DataType.DECIMAL:
        case DataType.DATETIME:
        case DataType.URL:
          res = value.toString();
          break;
        case DataType.BIT:
        case DataType.BOOLEAN:
          res = value.toString();
          break;
        default:
          res = value.toString();
          break;
      }
      return res.trim();
    }
    return value;
  }

  private prepareQuery() {
    if(this.queryConditions && this.conditionBuild) {
      this.ruleIndex = 1;
      this.query = this.setCondition(this.queryConditions) as any;
    }
  }

	private onTraverseQueryBuilderRules(rule: any) {
    if (rule?.rules && rule?.rules.length > 0) {
      rule.rules.forEach(childRule => {
        this.onTraverseQueryBuilderRules(childRule);
      });
    }
    else {
      rule.ruleIndex = this.ruleIndex;
      this.ruleIndex++;
    }
  }

  private setCondition(condition: any) {
    let rules = {};
    rules['condition'] = condition.operator.toString();
    rules['rules'] = this.setRules(condition.rules);
    condition.groupRules.forEach(item => {
      rules['rules'].push(this.setCondition(item));
    })
    return rules;
  }

  private setRules(rules: any) {
    let res = [];
    rules.forEach(item => {
      const table = this.conditionBuild.tables.find(x => x.name === item.table);
      const field = table?.fields?.find(x => x.name === item.field);
      
      if(table && field) {
        let rule = {
          field: `${item.table}-${item.field}`,
          operator: this.conditionBuild.typeOperators.find(x => (x.type.toLowerCase() === field.type.toLowerCase() || (x.type.toLowerCase() === DataType.STRING && field.type.toLowerCase() === DataType.URL)) && x.isNull === field.isNull)?.operators?.find(x => x.id === item.comparison),
          value: this.setValueByType(item.value, field.type),
          entity: item.table,
          persist: item.persist,
          exist: item.exist,
          ruleIndex: this.ruleIndex++
        }
        res.push(rule);
      }
      else if(item.exist === false) {
        const rule = this.setNotExistAttributeRule(item);
        res.push(rule);
      }
    });
    return res;
  }

  private setNotExistAttributeRule(item: Rule) {
    const fieldName = `${item.table}-${item.field}-NotExistAttribute`;
        const operators = this.conditionBuild.typeOperators.find((x: TypeOperator) => (x.type.toLowerCase() === item.type.toLowerCase() || (x.type.toLowerCase() === DataType.STRING && item.type.toLowerCase() === DataType.URL)) &&
          x.isNull === true)?.operators;
        let rule = {
          field: fieldName,
          operator: operators?.find(x => x.id === item.comparison),
          value: this.setValueByType(item.value, item.type),
          entity: item.table,
          persist: item.persist,
          exist: item.exist,
      	  ruleIndex: this.ruleIndex++
        }
        
        const field = {
          name: fieldName,
          text: item.field,
          type: item.type,
          operators: this.getOperatorSymbols(operators),
          entity: item.table,
          defaultValue: '',
          nullable: true,
          validator: this.validator
        }

        if(this.config.entities[item.table] === undefined) {
          this.config.entities[item.table] = { name: item.table };
        }

        this.config.fields[field.name] = field;
        this.config = {...this.config};
        return rule;
  }
  
  private setValueByType(value: any, type: string) {
    let res: any = "";
    if(value !== undefined && value !== null) {
      switch(type.toLowerCase()) {
        case DataType.NVARCHAR:
        case DataType.STRING:
        case DataType.DATETIME:
        case DataType.URL:
          res = value.toString();
          break;
        case DataType.INT:
          if(value !== undefined && value !== null && value !== '') {
            res = parseInt(value);
          }
          break;
        case DataType.DECIMAL:
          if(value !== undefined && value !== null && value !== '') {
            res = parseFloat(value);
          }
          break;
        case DataType.BIT:
        case DataType.BOOLEAN:
          res = value.toString();
          break;
        default:
          res = value.toString();
          break;
      }
    }
    return res;
  }

  private getOperatorSymbols(operators: any) {
    operators?.forEach(item => {
      item ['symbol'] = operatorSymbols[item.id] ?? item.name;
    });
    return operators;
  }

  validator(rule: any, parent: any, type: string = this['type'] ?? '') {
    rule.error = false;
    if(!rule?.field?.includes('NotExistAttribute')) {
      rule.exist = true;
    }
    
    const nonValueOperators = [ComparisonOperator.IsTrue, ComparisonOperator.IsFalse, ComparisonOperator.IsNull, ComparisonOperator.IsNotNull];
    if(!nonValueOperators.includes(rule?.operator?.id)) {
      if(rule.value === "" || rule.value === null) {
        rule.error = true;
      }
      else if(type === DataType.DATETIME) {
        rule.value = rule.value.trim();
        if(rule.value.search(/^[0-9]{4}[\-][0-9]{2}[\-][0-9]{2}$/) > -1) {
          const timestamp = Date.parse(rule.value);
          if(isNaN(timestamp)) {
            rule.error = true;
          }
        }
      }
    }
    else {
      rule.value = null;
    }
    if(rule.error) return rule.error;
  }
}
