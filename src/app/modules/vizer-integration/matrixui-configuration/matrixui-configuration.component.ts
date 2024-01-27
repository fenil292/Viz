import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../shared/services/notification.service';
import { Data } from '../../../shared/models/shared.model';
import { ColorSchemaItems, MatrixUIConfiguration } from './models/matriui-configuration.model';
import { MatrixuiConfigurationService } from './services/matrixui-configuration.service';

@Component({
  selector: 'app-matrixui-configuration',
  templateUrl: './matrixui-configuration.component.html',
  styleUrls: ['./matrixui-configuration.component.scss']
})
export class MatrixuiConfigurationComponent implements OnInit {
  path: string[] = ["Vizer Integration", "MatrixUI Configuration"];
  index: string = "3.1";
  matrixuiConfigurationsForm!: FormGroup;
  configurations: MatrixUIConfiguration;
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private matrixuiConfigurationService: MatrixuiConfigurationService) { }

  ngOnInit(): void {
    this.getMatrixUIConfigurations();
  }

  onSaveConfigurations() {
    this.matrixuiConfigurationsForm.markAllAsTouched();
    if(this.matrixuiConfigurationsForm.valid) {
      const data = this.matrixuiConfigurationsForm.getRawValue() as any;
      data.colorSchemaItems = Object.values(data.colorSchemaItems);
      if(data) {
        this.saveMatrixUIConfigurations(data);
      }
    }
  }

  private saveMatrixUIConfigurations(configurations: MatrixUIConfiguration) {
    this.isLoading = true;
    this.matrixuiConfigurationService.saveMatrixUIConfigurations(configurations).subscribe({
      next: (res: Data<any>) => {
        this.notificationService.success("MatrixUI configurations has been successfully saved.");
      },
      error: (error: any) => {
        this.notificationService.error(error);
      }
    }).add(() => this.isLoading = false);
  }

  private getMatrixUIConfigurations() {
    this.isLoading = true;
    this.matrixuiConfigurationService.getMatrixUIConfigurations().subscribe({
      next: (res: Data<MatrixUIConfiguration>) => {
        this.configurations = res.data;
        this.prepareMatrixUIConfigurationsForm();
      }
    }).add(() => this.isLoading = false);
  }

  private prepareMatrixUIConfigurationsForm() {
    if(this.configurations) {
      let configurationsGroup: any[] = [];
      this.configurations.colorSchemaItems.forEach((x: ColorSchemaItems) => {
        configurationsGroup[x.name] = new FormGroup(this.getFormControlsFields(x));
      })
      this.matrixuiConfigurationsForm = this.formBuilder.group({
        backgroundBlinking: [this.configurations.backgroundBlinking ? this.configurations.backgroundBlinking : 0, Validators.required],
        colorSchemaItems: this.formBuilder.group(configurationsGroup)});
    }
  }

  private getFormControlsFields(configuration: ColorSchemaItems) {
    return {
      id: new FormControl({ value: configuration.id, disabled: true}),
      name: new FormControl({ value: configuration.name, disabled: true }),
      background: new FormControl(configuration.background, Validators.required),
      foreground: new FormControl(configuration.foreground, Validators.required),
      threshold: new FormControl(configuration.threshold, Validators.required)
    }
  }
}
