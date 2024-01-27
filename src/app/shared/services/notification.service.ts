import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  toastrConfig = {
    timeOut: 5000,
    closeButton: true,
    easing: 'ease-in',
    easeTime: 300,
    enableHtml: true,
    positionClass: 'toast-top-right'
  };

  constructor(private toastr: ToastrService) { }

  error(message: string, title?: string) {
    this.toastr.error(message, title ? title : '', this.toastrConfig);
  }

  success(message: string, title?: string) {
    this.toastr.success(message, title ? title : '', this.toastrConfig);
  }

  warning(message: string, title?: string) {
    this.toastr.warning(message, title ? title : '', this.toastrConfig);
  }

  info(message: string, title?: string) {
    this.toastr.info(message, title ? title : '', this.toastrConfig);
  }
}
