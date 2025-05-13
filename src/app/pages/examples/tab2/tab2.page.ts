import { Component } from '@angular/core';
import {AlertController, LoadingController, ModalController} from '@ionic/angular';
import {ExampleModalComponent} from './example-modal/example-modal.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(private modalController: ModalController,
              private alertController: AlertController,
              private loadingController: LoadingController) {}

  /**
   *
   * @param initialBreakpoint
   * @protected
   */
  protected async openExampleModal(initialBreakpoint: number = 0.75): Promise<void> {
    const exampleModal = await this.modalController.create({
      component: ExampleModalComponent,
      breakpoints: [1, 0.75, 0.5],
      initialBreakpoint: initialBreakpoint
    });

    await exampleModal.present();
  }

  /**
   *
   * @protected
   */
  protected async openAlert(): Promise<void> {
    const alert = await this.alertController.create({
      message: 'This is an alert',
      buttons: [
        {
          role: 'cancel',
          text: 'OK'
        }
      ]
    });
    await alert.present();
  }

  /**
   *
   * @protected
   */
  protected async openLoader(): Promise<void> {
    const loader = await this.loadingController.create({
      message: 'Loading...',
      duration: 3000
    });
    await loader.present();
  }

}
