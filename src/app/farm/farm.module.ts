import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FarmListComponent } from './farm-list/farm-list.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'farms', component: FarmListComponent}
]

@NgModule({
  declarations: [FarmListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class FarmModule { }
