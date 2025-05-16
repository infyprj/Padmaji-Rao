import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
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
