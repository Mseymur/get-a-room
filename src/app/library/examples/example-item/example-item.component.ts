import {Component, Input, OnInit} from '@angular/core';
import {ExampleItem} from '../../../interfaces/examples/example-item';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ],
  selector: 'app-example-item',
  templateUrl: './example-item.component.html',
  styleUrls: ['./example-item.component.scss'],
})
export class ExampleItemComponent implements OnInit {

  @Input() item: ExampleItem;

  constructor() { }

  public ngOnInit() {}

}
