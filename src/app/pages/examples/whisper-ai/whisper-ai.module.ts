import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WhisperAiPageRoutingModule } from './whisper-ai-routing.module';

import { WhisperAiPage } from './whisper-ai.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WhisperAiPageRoutingModule
  ],
  declarations: [WhisperAiPage]
})
export class WhisperAiPageModule {}
