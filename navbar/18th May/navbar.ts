import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Shop3DApp';

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


}
