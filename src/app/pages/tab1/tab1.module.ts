import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab1PageRoutingModule } from './tab1-routing.module';

import { Tab1Page } from './tab1.page';
import {MbscEventcalendarModule} from "@mobiscroll/angular";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        Tab1PageRoutingModule,
        MbscEventcalendarModule
    ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
