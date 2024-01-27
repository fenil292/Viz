import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AUTH_SVG_NAMES } from '../../constants/auth.constants';

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss']
})
export class AuthorizeComponent implements OnInit {
  isLoading: boolean = false;
  url: string = "/login";
  version: string = '';

  constructor(private route: ActivatedRoute,private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.svgRegistration();
  }

  ngOnInit(): void {
    this.route.url.subscribe({
      next: (res: any) => {
        this.url = res[0]?.path;
      }
    });
    this.version = environment.VERSION;
  }

  private svgRegistration() {
    Object.keys(AUTH_SVG_NAMES).forEach((svgName) => {
      this.matIconRegistry.addSvgIcon(
        svgName,
        this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/' + svgName + '.svg')
      );
    });
  }
}
