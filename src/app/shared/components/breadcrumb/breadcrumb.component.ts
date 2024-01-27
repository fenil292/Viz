import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { DropDownListComponent, PopupSettings } from '@progress/kendo-angular-dropdowns';
import { WidgetConfigModel } from 'src/app/modules/dashboard/models/dashboard-model';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BreadcrumbComponent implements OnInit, OnChanges {
  @Input() path: string[] = [];
  @Input() index: string = '';
  @Input() widgets: WidgetConfigModel[] = [];
  @Output() widgetHideShow = new EventEmitter<any>();
  activePath: string = '';
  popupSetting: PopupSettings = {
    popupClass: 'widget-dropdown-popup'
  };
  @ViewChild('dropdownlist') public dropdownlist: DropDownListComponent;

  constructor() { }

  ngOnInit(): void {
    this.setActivePath();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.path) {
      if(!changes.path.firstChange) {
        this.path = changes.path.currentValue;
        this.setActivePath();
      }
    }
  }

  onClose(event: any) {
    event.preventDefault();
    setTimeout(() => {
      if (!this.dropdownlist.wrapper.nativeElement.contains(document.activeElement)) {
        this.dropdownlist.toggle(false);
      }
    });
  }

  onWidgetHideShow(name: any) {
    const widget = this.widgets.find((x) => x.title === name);
    if (widget) {
      widget.visible = !widget.visible;
      this.widgetHideShow.emit(this.widgets);
      this.widgets = [...this.widgets];
    }
  }

  private setActivePath() {
    if (this.path?.length > 0) this.activePath = this.path.splice(this.path.length - 1, 1)[0];
  }
}
