import { Component, OnInit } from '@angular/core';
import {NamesStore} from './store/names.store';

@Component({
  selector: 'app-names',
  templateUrl: './names.page.html',
  styleUrls: ['./names.page.scss'],
  providers: [NamesStore]
})
export class NamesPage implements OnInit {

  constructor() { }

  public ngOnInit(): void {
  }

}
