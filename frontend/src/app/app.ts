import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccessibilityMenuComponent } from './shared/components/accessibility-menu/accessibility-menu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AccessibilityMenuComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App { }