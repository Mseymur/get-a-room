import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfflineNamesPageRoutingModule } from './offline-names-routing.module';

import { OfflineNamesPage } from './offline-names.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfflineNamesPageRoutingModule
  ],
  declarations: [OfflineNamesPage]
})
export class OfflineNamesPageModule {}
