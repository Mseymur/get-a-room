import {Component, Input, OnInit} from '@angular/core';
import {ExampleItem} from '../../../../interfaces/examples/example-item';

@Component({
  selector: 'app-example-card',
  templateUrl: './example-card.component.html',
  styleUrls: ['./example-card.component.scss'],
})
export class ExampleCardComponent  implements OnInit {

  @Input() item: ExampleItem;

  constructor() { }

  public ngOnInit() {}

}
