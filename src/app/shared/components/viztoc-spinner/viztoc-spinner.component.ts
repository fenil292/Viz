import { Component, Input } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'viztoc-spinner',
  templateUrl: './viztoc-spinner.component.html',
  styleUrls: ['./viztoc-spinner.component.scss']
})
export class ViztocSpinnerComponent {

  @Input() isLoading: boolean | undefined = false;
  constructor() { }

}
