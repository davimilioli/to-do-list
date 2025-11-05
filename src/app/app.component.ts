import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './pages/home/home.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'to-do-list';

  constructor() {
    this.toggleTheme(true);
  }

  toggleTheme(isDark: boolean) {
    const body = document.body;
    if (isDark) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }
}
