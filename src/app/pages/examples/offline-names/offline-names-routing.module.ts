import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfflineNamesPage } from './offline-names.page';

const routes: Routes = [
  {
    path: '',
    component: OfflineNamesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfflineNamesPageRoutingModule {}
