import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnChanges {
  @Input() title;

  constructor() { }

  ngOnChanges(): void {
    const val = this.title.replace(/-/g, ' ');
    const newVal = val.replace(/\//, '');

    switch (newVal) {
      case 'demand':
        this.title = 'Demand';
        break;
      default:
        this.title = newVal;
        break;
    }
  }
}
