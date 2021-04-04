import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FarmListComponent } from './farm-list/farm-list.component';
import { FarmRoutingModule } from './farm-routing/farm-routing.module';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [FarmListComponent],
  imports: [
    CommonModule,
    FarmRoutingModule,
    MaterialModule
  ],
})
export class FarmModule { }
