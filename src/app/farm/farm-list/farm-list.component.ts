import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { RepositoryService } from 'src/app/shared/repository.service';
import { Farm } from 'src/app/_interface/farm.model';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { Router } from '@angular/router';
import { AgmMap } from '@agm/core';
import { FarmType } from 'src/app/_interface/farmType.model';
import { FormControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';

interface Location {
  zoom: number;
  latitude: number;
  longitude: number;
  viewport?: Object;
}

@Component({
  selector: 'app-farm-list',
  templateUrl: './farm-list.component.html',
  styleUrls: ['./farm-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FarmListComponent implements OnInit {
  @ViewChild(AgmMap) map: AgmMap;
  farms: Farm[];
  public location: Location = {
    zoom: 9,
    latitude: 42.4072,
    longitude: -71.3824
  }
  public availableCategories: FarmType[];
  public selectControl: FormControl;

  public stringFilter: string;
  public visibleFarms: Farm[];
  public categories: FarmType[] = [];

  constructor(private repoService: RepositoryService, private errorService: ErrorHandlerService, private router: Router) { }

  ngOnInit(): void {
    this.getAllFarms();
    this.getAllCategories();
    this.selectControl = new FormControl();
    this.stringFilter = '';
  }

  public getAllFarms = () => {
    this.repoService.getData('api/farm')
      .subscribe(res => {
        this.farms = res as Farm[];
        this.visibleFarms = this.farms;
      },
        (error) => {
          this.errorService.handleError(error);
        })
  }

  private getAllCategories = () => {
    this.repoService.getData('api/type').subscribe(res => {
      this.availableCategories = res as FarmType[];
    })
  }

  public redirectToDetails = (id: string) => {
    let url: string = `/farms/details/${id}`
    this.router.navigate([url]);
  }

  public moveToFarm(farm: Farm) {
    this.location.latitude = +farm.address.latitude;
    this.location.longitude = +farm.address.longitude;
    this.location.zoom = 13;
    this.map.triggerResize();
  }

  public applyFilter() {
    let ids: string[] = []
    this.categories.forEach(e => ids.push(e.farmTypeId))

    this.visibleFarms = this.farms.filter(
      f => f.farmName.toLowerCase().includes(this.stringFilter.toLowerCase())
    ).filter((f) => {
      if (ids.length == 0) return true;
      return f.categories?.some(c => ids.includes(c.farmTypeId))
    })

  }

  public clearFilter() {
    this.stringFilter = '';
    this.visibleFarms = this.farms;
    this.categories.forEach(c => this.remove(c.farmTypeId))
    this.selectControl.setValue([])
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

  public focusFarm(farm) {
    document.getElementById(farm.farmId).scrollIntoView();
    Array.from(document.getElementsByClassName("mat-list-single-selected-option")).forEach(e => e.classList.remove("mat-list-single-selected-option"));

    document.getElementById(farm.farmId).classList.add("mat-list-single-selected-option")
  }
}
