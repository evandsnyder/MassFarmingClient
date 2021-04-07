import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FarmListComponent } from '../farm-list/farm-list.component';
import { FarmDetailsComponent } from '../farm-details/farm-details.component';
import { FarmCreateComponent } from '../farm-create/farm-create.component';

const routes: Routes = [
  {path: '', component: FarmListComponent},
  {path: 'details/:id', component: FarmDetailsComponent},
  {path: 'new', component: FarmCreateComponent}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class FarmRoutingModule { }
