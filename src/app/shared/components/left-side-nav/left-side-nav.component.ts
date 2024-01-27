import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { DrawerItemExpandedFn, DrawerSelectEvent } from '@progress/kendo-angular-layout';
import { environment } from '../../../../environments/environment';
import { IntegrationsService } from '../../../modules/admin/integrations/datasets/services/integrations.service';
import { Data } from '../../models/shared.model';
import { sideMenuGroups } from './constants/left-side-nav.constants';
import { filter } from 'rxjs';

@Component({
  selector: 'app-left-side-nav',
  templateUrl: './left-side-nav.component.html',
  styleUrls: ['./left-side-nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LeftSideNavComponent implements OnInit {
  openedSide: boolean = true;
  title: string = '';
  showLogs: boolean = false;
  logs: any[] = [];
  pathLogs: string = '';
  items: any[];
  defaultExpandedIndices = [];
  expandedIndices = [];
  expanded = true;
  webVersion: string = '';
  apiVersion: string = '';
  url: string = '';

  constructor(
    private router: Router,
    private adminService: IntegrationsService) {
      this.router.events.pipe(
        filter((e: any): e is RouterEvent => e instanceof NavigationEnd)
      ).subscribe((e: NavigationEnd) => {
        if(e.url !== '' && e.url !== '/' && this.items) {
          this.url = location.pathname;
          this.items.forEach((x: any) => {
            if(x.path !== '')
            x.selected = false;
          });
          this.getSelectedItem();
          this.items = [...this.items];
        }
      });
  }

  ngOnInit(): void {
    this.items = sideMenuGroups;
    this.getApiVersion();
    this.webVersion = environment?.VERSION ?? '';
    this.url = location.pathname;
    this.getSelectedItem();
  }

  isItemExpanded: DrawerItemExpandedFn = (item): boolean => {
    return this.expandedIndices.indexOf(item.id) >= 0;
  };

  onSelect(ev: DrawerSelectEvent): void {
    const current = ev.item.id;
    if (ev.item.path === '') {
      ev.item.openSub = !ev.item?.openSub;
    }

    if (this.expandedIndices.indexOf(current) >= 0) {
      this.expandedIndices = this.expandedIndices.filter(
        (id) => id !== current
      );
    } else {
      this.expandedIndices.push(current);
    }
    if (ev.item?.path.length > 0) {
      this.router.navigateByUrl('/', {skipLocationChange: true})
        .then(() => this.router.navigate([ev.item.path]));
    }
  }

  private getApiVersion() {
    this.adminService.getVersion().subscribe({
      next: (res: Data<string>) => {
        this.apiVersion = res.data;
      }
    })
  }

  private expandSubMenu() {
    this.expandedIndices.forEach((index: number) => {
      const item = this.items.find((x: any) => x.id === index);
      if(item) {
        item.openSub = true;
      }
    });
  }

  private getSelectedItem() {
    const selectedItem = this.items.find((x: any) => (this.url.includes(x.path) || x?.children?.includes(this.url)) && x.path !== "");
    if(selectedItem) {
      selectedItem.selected = true;
      this.setParentMenuExpand(selectedItem);
    }
    if(this.expandedIndices?.length === 0) {
      this.expandedIndices = this.defaultExpandedIndices;
    }
    this.expandSubMenu();
  }

  private setParentMenuExpand(item: any) {
    if(item?.parentId >= 0) {
      this.expandedIndices.push(item.parentId);
      const parentMenu = this.items.find((x: any) => x.id === item.parentId);
      this.setParentMenuExpand(parentMenu);
    }
  }
}
