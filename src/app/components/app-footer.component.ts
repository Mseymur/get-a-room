import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <ion-footer>
      <div class="footer-content">
        <p>© FH JOANNEUM University of Applied Sciences</p>
        <p class="footer-links">
          <a href="https://www.fh-joanneum.at" target="_blank" rel="noopener">FH JOANNEUM Website</a>
          <span class="separator">|</span>
          <a href="https://www.fh-joanneum.at/impressum" target="_blank" rel="noopener">Imprint</a>
        </p>
      </div>
    </ion-footer>
  `,
  styles: [`
    ion-footer {
      background-color: var(--content-bg, #ffffff);
      padding: 1.5em;
      text-align: center;
      box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .footer-content p {
      margin: 0.3em 0;
      font-size: 0.85rem;
      color: var(--subtle-text-color, #666666);
    }
    
    .footer-links a {
      text-decoration: none;
      color: var(--primary-color, var(--fh-red, #e2001a));
    }
    
    .separator {
      margin: 0 0.5em;
      color: var(--subtle-text-color, #666666);
    }
  `]
})
export class AppFooterComponent { } 