import { Component, VERSION } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular ' + VERSION.major;

  showMenu = false;
  showDropdown = false;

  constructor() { }

  ngOnInit(): void {
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


}
