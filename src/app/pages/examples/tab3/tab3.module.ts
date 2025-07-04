import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';

import { Tab3PageRoutingModule } from './tab3-routing.module';
import {ExampleCardComponent} from './example-card/example-card.component';
import {ExampleItemComponent} from '../../../library/examples/example-item/example-item.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab3PageRoutingModule,
    ExampleItemComponent
  ],
  declarations: [
    Tab3Page,
    ExampleCardComponent
  ]
})
export class Tab3PageModule {}
