import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FarmListComponent } from '../farm-list/farm-list.component';
import { FarmDetailsComponent } from '../farm-details/farm-details.component';
import { FarmCreateComponent } from '../farm-create/farm-create.component';
import { FarmEditComponent } from '../farm-edit/farm-edit.component';

const routes: Routes = [
  {path: '', component: FarmListComponent},
  {path: 'details/:id', component: FarmDetailsComponent},
  {path: 'edit/:id', component: FarmEditComponent},
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
