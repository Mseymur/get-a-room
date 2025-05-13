import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WhisperAiPage } from './whisper-ai.page';

const routes: Routes = [
  {
    path: '',
    component: WhisperAiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WhisperAiPageRoutingModule {}
