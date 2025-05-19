import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Shop3DApp';
  userRoleId: number = 0;
  userId: number = 0;
  guestNavbarShow: boolean = false;
  customerNavbarShow: boolean = false;
  adminNavbarShow: boolean = false;

  showMenu = false;
  showDropdown = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    
    const uri: string = <string>sessionStorage.getItem('userRoleId');
    const ui: string = <string>sessionStorage.getItem('userId');
    this.userRoleId = parseInt(uri);
    console.log("Rolem :" + this.userRoleId);
    if (this.userRoleId === 2) {
      this.customerNavbarShow = true;
    }
    else if (this.userRoleId === 3) {
      this.adminNavbarShow = true;
    }
    else {
      this.guestNavbarShow = true;
    }
    this.userId = parseInt(ui);
  }

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }


  onHover():void{
    this.showDropdown=true;
  }

  onMouseLeave():void{
    this.showDropdown=false;
  }


  onClickLogout(): void {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userRoleId")
    this.router.navigate(['login']);
    this.adminNavbarShow = false;
    this.guestNavbarShow = false;
    this.customerNavbarShow = false;
    this.ngOnInit();
  }

}
