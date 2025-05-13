import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../services/core/storage.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {
  selectedBuilding: string = 'AP152';
  statusMessage: string = '';

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    // Check if there's a previously saved building
    const savedBuilding = StorageService.getItem('selectedBuilding');
    if (savedBuilding) {
      this.selectedBuilding = savedBuilding;
    }
  }

  navigateToHome() {
    if (this.selectedBuilding) {
      // Save selected building in storage
      StorageService.setItem('selectedBuilding', this.selectedBuilding);
      
      // Navigate to home page
      this.router.navigateByUrl('/home');
    } else {
      this.statusMessage = 'Please select a building before continuing';
      
      // Hide the message after 3 seconds
      setTimeout(() => {
        this.statusMessage = '';
      }, 3000);
    }
  }
}
