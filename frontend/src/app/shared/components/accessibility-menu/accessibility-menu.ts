import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-accessibility-menu',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './accessibility-menu.html',
    styleUrl: './accessibility-menu.css'
})
export class AccessibilityMenuComponent {
    isOpen = false;
    highContrast = false;
    fontSize = 100;

    toggleMenu() {
        this.isOpen = !this.isOpen;
    }

    toggleContrast() {
        this.highContrast = !this.highContrast;
        if (this.highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    }

    changeFontSize(delta: number) {
        this.fontSize += delta;
        if (this.fontSize < 80) this.fontSize = 80;
        if (this.fontSize > 150) this.fontSize = 150;
        document.documentElement.style.fontSize = `${this.fontSize}%`;
    }

    reset() {
        this.fontSize = 100;
        document.documentElement.style.fontSize = '100%';
        this.highContrast = false;
        document.body.classList.remove('high-contrast');
    }
}
