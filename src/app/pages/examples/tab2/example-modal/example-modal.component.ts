import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-example-modal',
  templateUrl: './example-modal.component.html',
  styleUrls: ['./example-modal.component.scss'],
})
export class ExampleModalComponent  implements OnInit {

  constructor(protected modalController: ModalController) { }

  public ngOnInit(): void {}

}
