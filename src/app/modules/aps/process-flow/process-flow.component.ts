import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification.service';
import { ConfirmDialogService } from '../../../shared/helpers/confirm-dialog.service';
import { ProcessFlow } from './models/processflow.model';
import { ProcessflowService } from './service/processflow.service';
import { Data } from '../../../shared/models/shared.model';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { UtilityService } from '../../../shared/helpers/utility.service';

@Component({
  selector: 'app-process-flow',
  templateUrl: './process-flow.component.html',
  styleUrls: ['./process-flow.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ProcessFlowComponent implements OnInit {
  path: any[] = ["aps", "process flow"];
  index: string = "2.2";
  processFlows: ProcessFlow[] = [];
  isLoading: boolean = false;
  defaultProcessFlowCount: number = 0;
  @ViewChild(TooltipDirective) tooltipDir: TooltipDirective;

  constructor(
    private router: Router,
    private processFlowService: ProcessflowService,
    private confirmDialogService: ConfirmDialogService,
    private notificationService: NotificationService,
    private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.getProcessFlows();
  }

  onAddFlowRule() {
    this.router.navigate(['/aps/create-process-flow']);
  }

  onEditProcessFlow(id: number) {
    this.router.navigate(['/aps/edit-process-flow'], { queryParams: { id: id } });
  }

  onDeleteProcessFlow(id: number) {
    this.confirmDialogService.openConfirmDialog("Confirmation", "Are you sure you want to delete this Flow Rule?")
      .subscribe((response: any) => {
        if (response.status) {
          this.deleteProcessFlow(id);
        }
      });
  }

  onMoveProcessFlow(id: number, index: number) {
    if (id > 0 && index >= 0 && index < this.processFlows.length) {
      index = this.processFlows[index]?.sequence;
      this.processFlowService.moveApsProcessFlow(id, index).subscribe({
        next: (res: Data<any>) => {
          this.getProcessFlows();
        }
      })
    }
  }

  dropProcessFlow(data: CdkDragDrop<ProcessFlow[]>){
    if(data.currentIndex >= 0 && data.item) {
      if(data.currentIndex !== data.previousIndex) {
        this.onMoveProcessFlow(data.item.data, data.currentIndex);
      }
    }
  }

  private getProcessFlows() {
    this.isLoading = true;
    this.processFlowService.getApsProcessFlowList().subscribe({
      next: (res: Data<ProcessFlow[]>) => {
        this.processFlows = res.data;
        this.processFlows.sort((a, b) => Number(a.default) - Number(b.default));
        this.defaultProcessFlowCount = this.processFlows.filter(x => x.default).length;
      },
      error: (err: any) => {
        this.notificationService.error(err);
      },
    }).add(() => this.isLoading = false);
  }

  private deleteProcessFlow(id: number) {
    this.isLoading = true;
    this.processFlowService.deleteApsProcessFlow(id).subscribe({
      next: (res: Data<any>) => {
        this.notificationService.success("Process flow has been deleted successfully.");
        this.getProcessFlows();
      },
      error: (err: any) => {
        this.notificationService.error(err);
      },
    }).add(() => this.isLoading = false);
  }

  showTooltip(e: MouseEvent): void {
    this.utilityService.showTooltip(e,this.tooltipDir);
  }
}
