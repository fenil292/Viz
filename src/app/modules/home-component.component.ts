import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    public router: Router
  ) { }

  ngOnInit(): void {
    if (this.router.url === '/') {
      this.router.navigate(['/dashboard']);
    }
  }
}
