import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-dropdown-panel',
  templateUrl: './dropdown-panel.component.html',
  styleUrls: ['./dropdown-panel.component.scss']
})
export class DropdownPanelComponent implements OnInit, OnChanges {

  @Input() data: Array<unknown> = [];
  @Input() enabled = true;
  @Input() placeholder = '';

  selected: any;

  @Output() confirm = new EventEmitter<any>();

  defaultItem = {value: 'Select a value', id: null};
  selectedId = null;

  constructor() { }

  ngOnInit(): void {
    if(this.placeholder.length !== 0) {
      this.defaultItem.value = this.placeholder;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['enabled']?.currentValue === false) {
      this.selected = null;
    }
  }

  emitId(): void {
    this.confirm.emit(this.selectedId);
  }

  isConfirmationDisabled(): boolean {
    return this.selectedId === null || !this.enabled || !(this.selected >= 0);
  }
}
