import { Component, NgZone, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { RepositoryService } from 'src/app/shared/repository.service';
import { FarmType } from 'src/app/_interface/farmType.model';
import { MatOptionSelectionChange } from '@angular/material/core';
import { TimePickerComponent } from 'src/app/components/time-picker/time-picker.component';
import { Schedule } from 'src/app/_interface/schedule.model';
import { FarmForCreation } from 'src/app/_interface/farmForCreation.model';
import { MapsAPILoader } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { Location } from '@angular/common';

declare var google: any;

const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline'
};


@Component({
  selector: 'app-farm-create',
  templateUrl: './farm-create.component.html',
  styleUrls: ['./farm-create.component.css'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: appearance
    }
  ]
})
export class FarmCreateComponent implements OnInit {
  @ViewChildren(TimePickerComponent) schedules: QueryList<TimePickerComponent>;

  public states: any = ['AK', 'AL', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL',
    'FM', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MH',
    'MI', 'MN', 'MO', 'MP', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH',
    'OK', 'OR', 'PA', 'PR', 'PW', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA',
    'WI', 'WV', 'WY'];

  public availableCategories: FarmType[];

  public farmName = new FormControl('', Validators.required);
  public ownerName = new FormControl('', Validators.required);
  public description: string;
  public isActive: string;
  public doesDeliver: boolean;
  public websiteUrl: string;
  public contactEmail = new FormControl('', Validators.required);
  public isContactable: boolean;
  public address1 = new FormControl('', Validators.required);
  public address2: string;
  public city = new FormControl('', Validators.required);
  public state = new FormControl('', Validators.required);
  public zip = new FormControl('', Validators.required);
  public categories: FarmType[] = [];
  public openSchedules: any[][] = [];

  private geocoder: any;

  constructor(private repository: RepositoryService
    , private errorHandler: ErrorHandlerService
    , private wrapper: GoogleMapsAPIWrapper
    , private zone: NgZone
    , public mapsApiLoader: MapsAPILoader
    , private location: Location) {
    this.mapsApiLoader = mapsApiLoader;
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
  }
  public selectControl: FormControl;

  ngOnInit(): void {
    this.getAllCategories();
    this.selectControl = new FormControl();
    this.openSchedules.push([]);
  }

  public createNewFarm = () => {
    this.generateNewFarm();

  }

  private async generateNewFarm() {
    let allSchedules: Schedule[] = [];
    this.schedules.forEach(schedule => allSchedules = allSchedules.concat(schedule.updateSchedules()));

    // Build the address first:
    let full_address = '';
    full_address += `${this.address1.value} `;
    full_address += `${this.address2 ? this.address2 : ''} `;
    full_address += `${this.state.value} `;
    full_address += `${this.zip.value} `;
    let lat: string;
    let lon: string;

    

    let loc = await this.getGeocode(full_address);
    lat = loc.lat;
    lon = loc.lon;

    console.log(lat)
    console.log(lon)

    let newFarm: FarmForCreation = {
      farmName: this.farmName.value,
      ownerName: this.ownerName.value,
      description: this.description,
      websiteUrl: this.websiteUrl,
      contactEmail: this.contactEmail.value,
      isContactable: this.isContactable,
      doesDeliver: this.doesDeliver,
      schedules: allSchedules,
      address: {
        address1: this.address1.value,
        address2: this.address2,
        city: this.city.value,
        state: this.state.value,
        zip: this.zip.value,
        latitude: `${lat}`,
        longitude: `${lon}`
      },
      categories: this.categories
    };

    let apiUrl = 'api/farm';
    this.repository.create(apiUrl, newFarm)
      .subscribe(res => {
        this.location.back();
      },
        (error) => {
          console.log(error);
        });
  }

  private async getGeocode(full_address: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let lat; let lon;
      if (!this.geocoder) this.geocoder = new google.maps.Geocoder();

      console.log(full_address);
      this.geocoder.geocode({ 'address': full_address }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0].geometry.location) {
            lat = results[0].geometry.location.lat();
            lon = results[0].geometry.location.lng();
            resolve({ 'lat': lat, 'lon': lon });
          }
        } else {
          reject("Could not find your address, are you sure it is correct?")
        }
      })
    })

  }


  /** Remove value from object property list */
  public remove(value: string): void {
    let farm = this.categories.find(c => c.farmTypeId == value);
    let i = this.categories.indexOf(farm);
    if (i >= 0) {
      this.categories.splice(i, 1);
    }
  }
  /** Add or remove selection from object property list via select-list */
  public change(event: MatOptionSelectionChange): void {
    if (event.isUserInput) {
      if (event.source.selected) {
        let farmType = this.availableCategories.find(c => c.farmTypeId == event.source.value)
        this.categories.push(farmType);
      }
      else this.remove(event.source.value);
    }
  }

  /** Remove selection from via chip cancel button */
  public removeSelection(value: string): void {
    let values = this.selectControl.value as string[];
    let i = values.indexOf(value);
    if (i >= 0) {
      values.splice(i, 1);
    }
    this.selectControl.setValue([]); // reset selection
    this.selectControl.setValue(values);
    this.remove(value); // remove value from object property
  }

  public findFarmCategory(uuid: string) {
    return this.availableCategories.find(c => uuid == c.farmTypeId).category;
  }

  private getAllCategories = () => {
    this.repository.getData('api/type').subscribe(res => {
      this.availableCategories = res as FarmType[];
    })
  }

  public addNewSchedule = () => {
    this.openSchedules.push([]);
  }

  public formIsInvalid(): boolean {
    return (this.farmName.invalid && this.farmName.value == '') ||
      (this.ownerName.invalid && this.ownerName.value == '') ||
      (this.contactEmail.invalid && this.contactEmail.value == '') ||
      (this.address1.invalid && this.address1.value == '') ||
      (this.city.invalid && this.city.value == '') ||
      (this.state.invalid && this.state.value == '') ||
      (this.zip.invalid && this.zip.value == '');
  }
}
