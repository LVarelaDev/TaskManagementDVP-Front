import { Component, inject, OnInit } from '@angular/core';
import { userDto } from '../../models/authModels';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { menu } from './menu';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, FontAwesomeModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  session?: userDto;
  dataMenu = menu;
  selectedMenu: string = 'Tareas';
  showTooltipCloed: boolean = false;
  iconLogOut = faRightFromBracket;
  router = inject(Router);

  constructor() {
    const session = localStorage.getItem('user');
    this.session = JSON.parse(session ?? '');
  }

  ngOnInit(): void {
    if (this.session?.rolId != 1) {
      this.dataMenu = this.dataMenu.filter((x) => x.name != 'Usuarios');
    }
  }

  showTooltip() {
    if (!this.showTooltipCloed) {
      this.showTooltipCloed = true;
    } else {
      this.showTooltipCloed = false;
    }
  }

  getFirstLetter(str: string): string {
    return str ? str.charAt(0) : '';
  }

  selectMenu(name: string): void {
    this.selectedMenu = name;
  }

  logOut(): void {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
