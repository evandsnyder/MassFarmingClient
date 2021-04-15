import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FarmListComponent } from './farm-list/farm-list.component';
import { FarmRoutingModule } from './farm-routing/farm-routing.module';
import { MaterialModule } from '../material/material.module';
import { FarmDetailsComponent } from './farm-details/farm-details.component';
import { FarmCreateComponent } from './farm-create/farm-create.component';
import { ReactiveFormsModule} from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FarmEditComponent } from './farm-edit/farm-edit.component';


@NgModule({
  declarations: [FarmListComponent, FarmDetailsComponent, FarmCreateComponent, FarmEditComponent],
  imports: [
    CommonModule,
    FarmRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    ComponentsModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapsApiKey
    }),
    FlexLayoutModule
  ],
})
export class FarmModule { }
