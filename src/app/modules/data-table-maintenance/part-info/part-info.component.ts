import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColumnReorderEvent, ColumnResizeArgs, ColumnVisibilityChangeEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { DefaultPageSize, DefaultPageSizes } from '../../../shared/models/pagination-configuration.model';
import { CustomAttrbuteEntities, Data, pages } from '../../../shared/models/shared.model';
import { NotificationService } from '../../../shared/services/notification.service';
import { Part, PartAttribute } from './models/part-info.model';
import { PartInfoService } from './services/part-info.service';
import { UtilityService } from '../../../shared/helpers/utility.service';
import { ColumnSettings, ColumnType, GridState } from '../../../shared/models/column-settings.model';
import { StatePersistingService } from '../../../shared/helpers/state-persisting.service';
import { DialogService } from '@progress/kendo-angular-dialog';
import { PartInfoAttributeEntryComponent } from './part-info-attribute-entry/part-info-attribute-entry.component';
import { cloneDeep } from 'lodash';
import { CustomAttributeService } from '../../admin/custom-attributes/services/custom-attribute.service';
import { AttributeModel } from '../../admin/custom-attributes/models/custom-attribute.model';

@Component({
  selector: 'app-part-info',
  templateUrl: './part-info.component.html',
  styleUrls: ['./part-info.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PartInfoComponent implements OnInit, AfterContentChecked {
  path: any[] = ["Data Table Maintenance", "Part Info"];
  index: string = "4.3";
  partInfo: Part[] = [];
  isLoading: boolean = false;
  state: State = {
    filter: {
      logic: 'and',
      filters: []
    }
  };
  pageSizes = DefaultPageSizes;
  pageSize = DefaultPageSize;
  isExternalPartsLoading: boolean = false;
  gridSettings: GridState;
  columnType = ColumnType;
  partAttributes: AttributeModel[] = [];
  customAttributeAsColumns: string[] = [];
  
  constructor(
    private cdref: ChangeDetectorRef,
    private dialogService: DialogService,
    private partInfoService: PartInfoService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private customAttributeService: CustomAttributeService,
    private statePersistingService: StatePersistingService) { }

  ngOnInit(): void {
    this.getParts();
    const defaultGridSettings = this.preparePartInfoGridState();
    this.gridSettings = this.statePersistingService.getGridSettings(pages.PART_INFO, defaultGridSettings);
    this.customAttributeAsColumns = this.gridSettings.columnConfig.filter((column: ColumnSettings) => column.isCustomAttribute).map(x => x.field);
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  onLoadExternalParts() {
    this.isExternalPartsLoading = true;
    this.partInfoService.loadExternalParts().subscribe({
      next: (res: any) => {
        if(!res.error) {
          this.getParts();
        }
      },
      error: (err: any) => {  
        this.notificationService.error(err);
      }
    }).add(() => this.isExternalPartsLoading = false);
  }

  dataStateChange(state: State) {
    this.statePersistingService.saveDataStateChange(pages.PART_INFO, state, this.gridSettings);
  }

  columnReorder(columnReOrder: ColumnReorderEvent) {
    this.statePersistingService.saveColumnOrder(pages.PART_INFO, columnReOrder, this.gridSettings);
  }

  columnResize(columnResize: ColumnResizeArgs[]) {
    this.statePersistingService.saveColumnWidth(pages.PART_INFO, columnResize, this.gridSettings);
  }

  columnVisibilityChange(columns: ColumnVisibilityChangeEvent) {
    this.statePersistingService.saveColumnsVisibility(pages.PART_INFO, columns, this.gridSettings);
  }

  onCustomAttributesChange(values: any[]) {
    this.statePersistingService.saveCustomAttributesColumns(pages.PART_INFO, values, this.partAttributes, this.gridSettings);
    this.gridSettings = cloneDeep(this.gridSettings);
  }

  onEditPartInfoAttributes(partInfo: Part) {
    const dialogRef = this.dialogService.open({
      content: PartInfoAttributeEntryComponent,
      actionsLayout: 'normal',
      cssClass: 'part-attribute-entry-dialog',
      width: '600px'
    });

    const data = dialogRef.content.instance as PartInfoAttributeEntryComponent;
    data.partInfo = partInfo;

    dialogRef.result.subscribe((result: any) => {
      if(result?.status) {
        this.getParts();
      }
    });
  }

  showTooltip(e: MouseEvent, tooltip: any): void {
    this.utilityService.showTooltip(e, tooltip);
  }

  private getParts() {
    this.isLoading = true;
    this.partInfoService.getParts().subscribe({
      next: (res: Data<Part[]>) => {
        this.partInfo = res.data;
        this.getPartCustomAttributes();
      },
      error: (err: any) => {
        this.partInfo = [];
        this.notificationService.error(err);
      }
    }).add(() => this.isLoading = false);
  }

  private preparePartInfoGridState(): GridState {
    return {
      columnConfig: [
        { field: 'partNumber', title: 'Part Number', order: 0, type: ColumnType.TEXT, width: 200 },
        { field: 'partDescription', title: 'Part Description', order: 1, type: ColumnType.TEXT },
        { field: 'stockQuantity', title: 'Stock Quantity', order: 2, type: ColumnType.TEXT, width: 200 },
        { field: 'Actions', title: 'Actions', order: 3, type: ColumnType.ACTION, width: 100 }
      ],
      state: this.state
    }
  }

  private getPartCustomAttributes() {
    this.isLoading = true;
    this.partAttributes = [];
    this.customAttributeService.getCustomAttributesForEntity(CustomAttrbuteEntities.Part).subscribe({
      next: (res: Data<AttributeModel[]>) => {
        this.partAttributes = res.data;
        this.customAttributeAsColumns = this.statePersistingService.updateAttributeColumnName(pages.PART_INFO, this.gridSettings, this.partAttributes);
      }
    }).add(() => this.isLoading = false);
  }
}
