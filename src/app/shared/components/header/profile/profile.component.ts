import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
  username: string = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const user = this.authService.loggedInUserValue;
    this.username = user.email;
  }

  handleLogout() {
    this.authService.signOut();
  }
}
