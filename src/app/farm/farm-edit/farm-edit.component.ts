import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { TimePickerComponent } from 'src/app/components/time-picker/time-picker.component';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { RepositoryService } from 'src/app/shared/repository.service';
import { Farm } from 'src/app/_interface/farm.model';
import { FarmType } from 'src/app/_interface/farmType.model';
import { Schedule } from 'src/app/_interface/schedule.model';
import { Location } from '@angular/common'
import { FarmForUpdate } from 'src/app/_interface/farmForUpdate.model';
import { MapsAPILoader } from '@agm/core';
import { IsAForCreation } from 'src/app/_interface/isAForCreation.model';

declare var google: any;

const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline'
};

@Component({
  selector: 'app-farm-edit',
  templateUrl: './farm-edit.component.html',
  styleUrls: ['./farm-edit.component.css'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: appearance
    }
  ]
})
export class FarmEditComponent implements OnInit {
  private geocoder: any;
  public loaded: boolean = false;

  @ViewChildren(TimePickerComponent) schedules: QueryList<TimePickerComponent>;
  public openSchedules: Schedule[][] = [];

  public categories: FarmType[] = [];
  public availableCategories: FarmType[];

  public farmName = new FormControl('', Validators.required);
  public ownerName = new FormControl('', Validators.required);
  public description: string;
  public doesDeliver: boolean;
  public websiteUrl: string;
  public contactEmail = new FormControl('', Validators.required);
  public isContactable: boolean;
  public address1 = new FormControl('', Validators.required);
  public address2: string;
  public city = new FormControl('', Validators.required);
  public state = new FormControl('', Validators.required);
  public zip = new FormControl('', Validators.required);

  public farm: Farm;


  public selectControl: FormControl;

  public states: any = ['AK', 'AL', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL',
    'FM', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MH',
    'MI', 'MN', 'MO', 'MP', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH',
    'OK', 'OR', 'PA', 'PR', 'PW', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA',
    'WI', 'WV', 'WY'];

  constructor(private repository: RepositoryService
    , private router: Router
    , private activeRoute: ActivatedRoute
    , private errorHandler: ErrorHandlerService
    , private location: Location
    , public mapsApiLoader: MapsAPILoader) {
    this.mapsApiLoader = mapsApiLoader;
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
  }

  ngOnInit(): void {
    this.getAllCategories();
    this.getFarm();
  }

  private getFarm() {
    let id: string = this.activeRoute.snapshot.params['id'];
    let apiUrl: string = `api/farm/${id}`

    this.repository.getData(apiUrl)
      .subscribe(res => {
        this.farm = res as Farm;
        this.farmName.setValue(this.farm.farmName);
        this.ownerName.setValue(this.farm.ownerName);
        this.description = this.farm.description;
        this.doesDeliver = this.farm.doesDeliver;
        this.websiteUrl = this.farm.websiteUrl;
        this.contactEmail.setValue(this.farm.contactEmail);
        this.isContactable = this.farm.isContactable;
        this.address1.setValue(this.farm.address.address1);
        this.address2 = this.farm.address.address2;
        this.city.setValue(this.farm.address.city);
        this.state.setValue(this.farm.address.state);
        this.zip.setValue(this.farm.address.zip);
        let list: string[] = [];
        this.farm.categories.forEach(a => this.categories.push(a.farmType))
        this.farm.categories.forEach(a => list.push(a.farmType.farmTypeId))

        this.selectControl = new FormControl(list);


        if (this.farm.schedules && this.farm.schedules.length > 0) {
          let knownTimes = new Set();
          this.farm.schedules.forEach(a => knownTimes.add(`${a.startTime}:${a.endTime}`))
          knownTimes.forEach(time => {
            let sTime = String(time).split(":")[0]
            let eTime = String(time).split(":")[1]
            let sched = this.farm.schedules.filter(s => s.startTime == sTime && s.endTime == eTime)
            this.openSchedules.push(sched)
          })
        }

        if (this.openSchedules.length < 1) {
          this.openSchedules.push([])
        }

        this.loaded = true;
      },
        (error) => {
          this.errorHandler.handleError(error);
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

  public async saveFarm() {
    this.farm.farmName = this.farmName.value;
    this.farm.ownerName = this.ownerName.value;
    this.farm.contactEmail = this.contactEmail.value;
    this.farm.description = this.description;
    this.farm.websiteUrl = this.websiteUrl;
    this.farm.isContactable = this.isContactable;
    this.farm.doesDeliver = this.doesDeliver;
    this.farm.address.address1 = this.address1.value;
    this.farm.address.address2 = this.address2;
    this.farm.address.zip = this.zip.value;
    this.farm.address.city = this.city.value;
    this.farm.address.state = this.state.value;

    // Need to check for address changes and do the whole geocode process...

    let allSchedules: Schedule[] = [];
    // Schedules
    this.schedules.forEach(sched => allSchedules = allSchedules.concat(sched.updateSchedules()))
    this.farm.schedules = allSchedules;

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

    // Prepare the categories? ....
    let allTypes: IsAForCreation[] = [];
    this.categories.forEach(c => allTypes.push({farmId: this.farm.farmId,farmTypeId: c.farmTypeId}))

    let updatedFarm: FarmForUpdate = {
      farmId: this.farm.farmId,
      farmName: this.farmName.value,
      ownerName: this.ownerName.value,
      description: this.description,
      doesDeliver: this.doesDeliver,
      websiteUrl: this.websiteUrl,
      contactEmail: this.contactEmail.value,
      isContactable: this.isContactable,
      isActive: true,
      schedules: allSchedules,
      address: {
        address1: this.address1.value,
        address2: this.address2,
        city: this.city.value,
        state: this.state.value,
        zip: this.zip.value,
        latitude: `${lat}`,
        longitude: `${lon}`,
      },
      categories: allTypes
    }

    this.submitFarm(updatedFarm);
  }

  public cancel() {
    this.location.back();
  }

  public deleteFarm() {
    let allTypes: IsAForCreation[] = [];
    this.categories.forEach(c => allTypes.push({farmId: this.farm.farmId,farmTypeId: c.farmTypeId}))
    let updatedFarm: FarmForUpdate = {
      farmId: this.farm.farmId,
      farmName: this.farm.farmName,
      ownerName: this.farm.ownerName,
      description: this.farm.description,
      doesDeliver: this.farm.doesDeliver,
      websiteUrl: this.farm.websiteUrl,
      contactEmail: this.farm.contactEmail,
      isContactable: this.farm.isContactable,
      isActive: false,
      schedules: this.farm.schedules,
      address: {
        address1: this.farm.address.address1,
        address2: this.farm.address.address2,
        city: this.farm.address.city,
        state: this.farm.address.state,
        zip: this.farm.address.zip,
        latitude: this.farm.address.latitude,
        longitude: this.farm.address.longitude,
      },
      categories: allTypes
    }

    this.farm.isActive = false;
    this.submitFarm(updatedFarm);
  }

  private submitFarm(updatedFarm: FarmForUpdate) {
    let apiUrl = `api/farm/${updatedFarm.farmId}`;
    this.repository.update(apiUrl, updatedFarm)
      .subscribe(res => {
        this.location.back();
      }, (error) => {
        console.log(error)
      })
  }

  private async getGeocode(full_address: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let lat; let lon;
      if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
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
}
