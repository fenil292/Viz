import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Data, Log } from '../../../shared/models/shared.model';
import { CronExpressionUtilityService } from '../../../shared/helpers/cron-expression-utility.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ScheduleTypes, ScheduleTypeEnum, Units, UnitEnum } from './constants/aps-settings.constants';
import { ApsSchedulings, ApsSettings } from './constants/aps-settings.model';
import { ApsSettingsService } from './services/aps-settings.service';
import { DialogService } from '@progress/kendo-angular-dialog';
import { ApsLogsComponent } from './aps-logs/aps-logs.component';

@Component({
  selector: 'app-aps-settings',
  templateUrl: './aps-settings.component.html',
  styleUrls: ['./aps-settings.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ApsSettingsComponent implements OnInit {
  path: any[] = ["APS", "APS Settings"];
  index: string = "2.3";
  scheduleTypes: any[] = ScheduleTypes;
  scheduleTypesEnum = ScheduleTypeEnum;
  unitType = UnitEnum;
  units: any[] = Units;
  apsSettingForm!: FormGroup;
  isLoading: boolean = false;
  isApsRun: boolean = false;
  isResetJob: boolean = false;
  apsSchedulings: ApsSchedulings[] = [];
  isApiAvailable = false;

  constructor(
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private apsSettingsService: ApsSettingsService,
    private notificationService: NotificationService,
    private cronExpressionUtilityService: CronExpressionUtilityService) { }

  ngOnInit(): void {
    this.getApsSetting();
  }

  onChangeScheduleAPS(value: ScheduleTypeEnum) {
    this.addOrRemoveControls(value);
  }

  onRunAps() {
    this.isApsRun = true;
    const isIntegratorDataset = this.apsSettingForm.get('forceIntegrationDataset')?.value ?? false;
    this.apsSettingsService.startApsJob(isIntegratorDataset).subscribe({
      next: (res: any) => {
        if(res.error) {
          this.notificationService.error(res.error);
        } else {
          this.openApsLogsDialog(res.logs, true);
        }
      },
      error: (err: any) => {
        this.notificationService.error(err.message ?? err);
        if(err?.logs?.length > 0) {
          this.openApsLogsDialog(err.logs, true);
        }
      }
    }).add(() => {
      this.isApsRun = false;
      this.getApsSetting();
    });
  }

  onResetJob() {
    this.isResetJob = true;
    this.apsSettingsService.resetJob().subscribe({
      next: (res: any) => {
        if(res.error) {
          this.notificationService.error(res.error);
        } else {
          this.notificationService.success('Job has been successfully reset.');
        }
      }
    }).add(() => {
      this.isResetJob = false
      this.getApsSetting();
    });
  }

  onSaveAPSSettings() {
    this.apsSettingForm.markAllAsTouched();
    if (this.apsSettingForm.valid) {
      const data = this.apsSettingForm.getRawValue() as ApsSettings;
      const cronExpr = this.generateCronExpression(data);

      const apsSettings: ApsSettings = {
        scheduleAps: cronExpr,
        publishHotsheet: data.publishHotsheet,
        salesOrderQtyFitTolerancePercent: data.salesOrderQtyFitTolerancePercent,
        enable: data.enable,
        archivePath: data.archivePath,
        datasetPath: data.datasetPath,
        forceIntegrationDataset: data.forceIntegrationDataset,
        archiveStorePeriodInDays: data.archiveStorePeriodInDays,
        apsSchedulings: this.apsSchedulings
      };
      this.saveApsSettings(apsSettings);
    }
    else {
      this.notificationService.error("Please fill in all required fields.");
    }
  }

  onCancel() {
    this.getApsSetting();
  }

  openApsLogsDialog(apsLogs: any[] | null = null, isApsRun: boolean = false) {
    const dialogRef = this.dialogService.open({
      content: ApsLogsComponent,
      actions: [],
      height: '60%',
      width: '50%',
      actionsLayout: 'normal',
      cssClass: 'aps-log-dialog'
    });

    const data = dialogRef.content.instance as ApsLogsComponent;
    if(isApsRun) {
      data.apsLogs = apsLogs;
    } else {
      data.logs = apsLogs?.join('\n');
    }
  }

  private getApsSetting() {
    this.isLoading = true;
    this.apsSettingsService.getApsSettings().subscribe({
      next: (res: Data<ApsSettings>) => {
        if (res?.data) {
          this.isApiAvailable = false;
          this.prepareApsSettingsForm(res.data);
        }
        else {
          this.isApiAvailable = true;
          this.prepareApsSettingsForm(undefined);
        }
        this.apsSchedulings = res?.data?.apsSchedulings?.sort((a: any, b: any) => new Date(a.startTime) > new Date(b.startTime) ? -1 : 1);
      },
      error: (err: any) => {
        this.notificationService.error(err);
        this.isApiAvailable = true;
        this.prepareApsSettingsForm(undefined);
      }
    }).add(() => this.isLoading = false);
  }

  private saveApsSettings(data: ApsSettings) {
    this.isLoading = true;
    this.apsSettingsService.saveApsSettings(data).subscribe({
      next: (res: Data<any>) => {
        this.notificationService.success('APS settings has been saved successfully.');
      },
      error: (err: any) => {
        this.notificationService.error(err);
      }
    }).add(() => this.isLoading = false);
  }

  private prepareApsSettingsForm(apsSettings: ApsSettings | undefined) {
    this.apsSettingForm = this.formBuilder.group({
      scheduleType: [{value :(apsSettings) ? ScheduleTypeEnum.EVERY_DAY_AT : null , disabled:this.isApiAvailable }],
      everyDayAt: new FormGroup({
        time: new FormControl(new Date(0, 0, 0, 24, 0), Validators.required)
      }),
      publishHotsheet: [{ value: (apsSettings)? apsSettings.publishHotsheet : false , disabled: this.isApiAvailable}],
      salesOrderQtyFitTolerancePercent: [{ value :(apsSettings) ? apsSettings.salesOrderQtyFitTolerancePercent : null, disabled: this.isApiAvailable} , Validators.required],
      enable: [{ value: (apsSettings) ? apsSettings.enable : false , disabled:this.isApiAvailable}],
      archivePath: [{value : (apsSettings) ? apsSettings.archivePath : '', disabled:this.isApiAvailable} , [Validators.required, Validators.maxLength(100)]],
      datasetPath: [{value : (apsSettings) ? apsSettings.datasetPath : '', disabled:this.isApiAvailable} , [Validators.required, Validators.maxLength(100)]],
      forceIntegrationDataset: [{value : (apsSettings) ? apsSettings.forceIntegrationDataset : false , disabled:this.isApiAvailable}],
      archiveStorePeriodInDays: [{ value :(apsSettings) ? apsSettings.archiveStorePeriodInDays : null , disabled:this.isApiAvailable} ]
    })

    this.setScheduleAps(apsSettings);
  }

  private generateCronExpression(data: any) {
    if (data.scheduleType === ScheduleTypeEnum.EVERY) {
      return this.cronExpressionUtilityService.generateCronExpression(data.scheduleType, data.every.unit, data.every.unitType);
    }
    else if (data.scheduleType === ScheduleTypeEnum.EVERY_DAY_AT) {
      return this.cronExpressionUtilityService.generateCronExpression(data.scheduleType, data.everyDayAt);
    }
    else {
      return null;
    }
  }

  private setScheduleAps(apsSettings: ApsSettings) {
    const selectedScheduleAPS: any = this.cronExpressionUtilityService.parseCronExpression(apsSettings?.scheduleAps);
    if (selectedScheduleAPS) {
      this.apsSettingForm.get('scheduleType')?.patchValue(selectedScheduleAPS.ScheduleType);
      this.addOrRemoveControls(selectedScheduleAPS.ScheduleType);

      if (selectedScheduleAPS.ScheduleType === ScheduleTypeEnum.EVERY_DAY_AT) {
        this.apsSettingForm.get('everyDayAt.time')?.patchValue(selectedScheduleAPS.value);
      }
      else {
        this.apsSettingForm.get('every.unit')?.patchValue(selectedScheduleAPS.value);
        this.apsSettingForm.get('every.unitType')?.patchValue(selectedScheduleAPS.SchedulePeriod);
      }
    }
  }

  private addOrRemoveControls(scheduleType: ScheduleTypeEnum) {
    if (scheduleType === ScheduleTypeEnum.EVERY) {
      this.removeControl('everyDayAt');
      this.apsSettingForm.addControl('every', new FormGroup({
        unit: new FormControl(5, Validators.required),
        unitType: new FormControl(UnitEnum.MIN, Validators.required)
      }));
    }
    else if (scheduleType === ScheduleTypeEnum.EVERY_DAY_AT) {
      this.removeControl('every');
      this.apsSettingForm.addControl('everyDayAt', new FormGroup({
        time: new FormControl(new Date(0, 0, 0, 24, 0), Validators.required)
      }));
    }
  }

  private removeControl(name: string) {
    this.apsSettingForm.removeControl(name);
  }
}
