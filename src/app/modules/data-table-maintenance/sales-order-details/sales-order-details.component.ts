import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LinkedWorkOrders, SalesOrder, SalesOrderAttribue } from '../sales-orders/models/sales-order.model';
import { SalesOrderService } from '../sales-orders/services/sales-order.service';
import { Data } from '../../../shared/models/shared.model';
import { NotificationService } from '../../../shared/services/notification.service';
import { DataType } from '../../../shared/components/query-builder/constants/query-builder.constants';
import { UtilityService } from '../../../shared/helpers/utility.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-sales-order-details',
  templateUrl: './sales-order-details.component.html',
  styleUrls: ['./sales-order-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SalesOrderDetailsComponent implements OnInit, OnChanges {
  path = ['Data Table Maintenance', 'Sales Orders', 'Sales Order Details'];
  index = '4.4.1';
  @Input() id: number | null = null;
  @Output() showSalesOrders = new EventEmitter<any>();
  salesOrder: SalesOrder;
  isLoading: boolean = false;
  linkedWorkOrders: LinkedWorkOrders[] = [];
  requiredQty: number = 0;
  notAllocatedQty: number = 0;
  allocatedQty: any = 0;
  quantityDistributionBar: any[] = [];
  isSalesOrderDetailUrl: boolean = false;
  salesOrderAttributes: SalesOrderAttribue[] = [];
  intialSalesOrderAttributes: SalesOrderAttribue[] = [];
  isSalesOrderChange: boolean = false;
  dataTypes = DataType;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private utilityService: UtilityService,
    private salesOrderService: SalesOrderService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if(params['id']) {
        this.id = params['id'];
        this.prepareSalesOrderDetail();
      }
    });
    this.route.url.subscribe({
      next: (res: any) => {
        if(res[0]?.path === 'sales-order-details') {
          this.isSalesOrderDetailUrl = true;
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.id?.currentValue) {
      this.isSalesOrderChange = false;
      this.prepareSalesOrderDetail();
    }
  }

  openWorkOrderDetails(workOrderId: number) {
    this.router.navigate(['/data-table-maintenance/work-order-details'], { queryParams: { id: workOrderId } });
  }

  cancel(): void {
    if(this.isSalesOrderDetailUrl) {
      this.router.navigateByUrl('/data-table-maintenance/sales-orders');
    } else {
      this.showSalesOrders.emit({ status: true, salesOrder: this.isSalesOrderChange ? this.salesOrder : null });
    }
  }

  onRefresh() {
    this.prepareSalesOrderDetail();
  }

  getFloatNumber(number: number) {
    if(number !== null && number !== undefined) {
      return Number.isSafeInteger(number) ? number : number.toFixed(4);
    }
  }

  showTooltip(e: MouseEvent, tooltip: any): void {
    this.utilityService.showTooltip(e, tooltip);
  }

  onSalesOrderAttrributeValueChange(attributes: SalesOrderAttribue[]) {
    attributes = attributes.sort((a: SalesOrderAttribue, b: SalesOrderAttribue) => a.name > b.name ? 1 : -1);
    const isEqual = this.utilityService.compareArrays(this.intialSalesOrderAttributes, attributes);
    if(!isEqual) {
      this.salesOrderAttributes = attributes;
      this.saveCustomAttributes();
    }
  }

  private getSalesOrderDetails() {
    this.isLoading = true;
    this.salesOrderService.getSalesOrder(this.id).subscribe({
      next: (res: Data<SalesOrder>) => {
        this.salesOrder = res.data;
        this.requiredQty = this.salesOrder?.requiredQty;
        this.linkedWorkOrders = this.salesOrder?.linkedWorkOrders;
        this.salesOrderAttributes = this.salesOrder?.attributes;
        this.intialSalesOrderAttributes = cloneDeep(this.salesOrder?.attributes)?.sort((a: SalesOrderAttribue, b: SalesOrderAttribue) => a.name > b.name ? 1 : -1);
      },
      error: (error: any) => {
        this.showEmptySalesOrderDetail();
        this.notificationService.error(error);
      }
    }).add(() => {
      this.isLoading = false;
      this.prepareQuantityDistributionBar();
    });
  }

  private prepareQuantityDistributionBar() {
    this.quantityDistributionBar = [];
    let totalQty = this.requiredQty;
    if(this.salesOrder?.allocatedStockQty > 0) {
      this.quantityDistributionBar.push({ text: `Stock: ${this.getFloatNumber(this.salesOrder.allocatedStockQty) }`, width: this.calculateWidth(this.requiredQty, this.salesOrder.allocatedStockQty), color: '#fdb870', order: 1 });
      totalQty -= this.salesOrder.allocatedStockQty;
    }
    this.linkedWorkOrders?.forEach((workOrder: LinkedWorkOrders) => {
      if(workOrder?.allocatedQty > 0) {
        this.quantityDistributionBar.push({ text: `WO ${workOrder.workOrderNumber}: ${this.getFloatNumber(workOrder.allocatedQty) }`, width: this.calculateWidth(this.requiredQty, workOrder.allocatedQty), color: '#f3f2f2', order: this.quantityDistributionBar.length + 1 });
        totalQty -= workOrder.allocatedQty;
      }
    });
    if(this.salesOrder?.shipQty > 0) {
      this.quantityDistributionBar.push({ text: `Ship Qty: ${this.getFloatNumber(this.salesOrder.shipQty) }`, width: this.calculateWidth(this.requiredQty, this.salesOrder.shipQty), color: '#b0b0b0', order: this.quantityDistributionBar.length + 1 });
      totalQty -= this.salesOrder.shipQty;
    }
    if(totalQty > 0) {
      this.notAllocatedQty = totalQty;
      this.quantityDistributionBar.push({ text: `Not Allocated: ${this.getFloatNumber(totalQty) }`, width: this.calculateWidth(this.requiredQty, totalQty), color: '#fb4242', order: 0 });
    }
    this.quantityDistributionBar = this.quantityDistributionBar.sort((a, b) => a.order - b.order);
    this.allocatedQty = this.requiredQty - this.notAllocatedQty;
    this.allocatedQty =  this.getFloatNumber(this.allocatedQty);
  }

  private calculateWidth(total: number, value: number) {
    return (value * 100) / total;
  }

  private prepareSalesOrderDetail() {
    this.getSalesOrderDetails();
  }

  private saveCustomAttributes() {
    this.isLoading = true;
    this.salesOrderService.saveCustomAttributes(this.salesOrderAttributes).subscribe({
      next: (res: Data<any>) => {
        this.notificationService.success('Custom Attribute has been successfully saved.');
        this.isSalesOrderChange = true;
      },
      error: (err: any) => {
        this.notificationService.error(err);
      }
    }).add(() => {
      this.isLoading = false;
      this.onRefresh();
    });
  }

  private showEmptySalesOrderDetail() {
    this.salesOrder = null;
    this.linkedWorkOrders = [];
    this.quantityDistributionBar = [];
    this.salesOrderAttributes = [];
    this.requiredQty = 0;
    this.notAllocatedQty = 0;
    this.allocatedQty = 0;
    this.intialSalesOrderAttributes = [];
  }
}
