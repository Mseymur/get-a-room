import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AppFooterComponent } from '../components/app-footer.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [
    AppFooterComponent
  ],
  exports: [
    AppFooterComponent,
    IonicModule
  ]
})
export class SharedModule { }