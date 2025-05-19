//import { Component } from '@angular/core';

//@Component({
//  selector: 'app-login',
//  templateUrl: './login.component.html',
//  styleUrls: ['./login.component.css']
//})
//export class LoginComponent {

//}

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
//import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user-service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  status: string = "";
  errorMsg: string = "";
  msg: string = "";
  showDiv: boolean = false;

  constructor(private _userService: UserService, private router: Router) { }

  submitLoginForm(form: NgForm) {
    if (!form.valid) {
      this.errorMsg = "Form validation failed.";
      return;
    }

    this._userService.validateCredentials(form.value.email, form.value.password).subscribe(
      (response: any) => {
        if (response.success )
        {
          this.status = "success";
          sessionStorage.setItem("userId", response.user.userId);
          sessionStorage.setItem("userRoleId", response.user.roleId);
          this.msg = "Login successful";
          this.router.navigate(['/products']);
          
        } else {
          this.status = "Invalid credentials";
          this.showDiv = true;
          this.msg = "Invalid credentials. Try again.";
        }
      },
      (error) => {
        this.errorMsg = "Server error. Try again later.";
      },
      () => console.log("Login request completed.")
    );
  }

  ngOnInit(): void {
    this._userService.logout();
  }
}
