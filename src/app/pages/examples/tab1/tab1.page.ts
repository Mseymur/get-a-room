import { Component } from '@angular/core';
import {AuthService} from '../../../services/core/auth.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(protected authService: AuthService) {}

}
