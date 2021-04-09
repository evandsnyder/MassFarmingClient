import { Component, OnInit, ViewChild } from '@angular/core';
import { RepositoryService } from '../../shared/repository.service';
import { Farm } from '../../_interface/farm.model';
import { ErrorHandlerService } from '../../shared/error-handler.service';
import { Router } from '@angular/router';
import { AgmMap } from '@agm/core';

interface Location {
  zoom: number;
  latitude: number;
  longitude: number;
  viewport?: Object;
}

@Component({
  selector: 'app-farm-list',
  templateUrl: './farm-list.component.html',
  styleUrls: ['./farm-list.component.css']
})
export class FarmListComponent implements OnInit {
  @ViewChild(AgmMap) map: AgmMap;
  farms: Farm[];
  public location:Location = {
    zoom: 8,
    latitude: 42.4072,
    longitude: -71.3824
  }

  constructor(private repoService: RepositoryService, private errorService: ErrorHandlerService, private router: Router) { }

  ngOnInit(): void {
    this.getAllFarms();
  }

  public getAllFarms = () => {
    this.repoService.getData('api/farm')
    .subscribe(res => {
      this.farms = res as Farm[];
    },
    (error) => {
      this.errorService.handleError(error);
    })
  }

  public redirectToDetails = (id: string) => {
    let url: string = `/farms/details/${id}`
    this.router.navigate([url]);
  }

  public redirectToCreateFarm = () => {
    this.router.navigate(['/farms/new']);
  }

  public moveToFarm(farm: Farm) {
    this.location.latitude = +farm.address.latitude;
    this.location.longitude = +farm.address.longitude;
    this.location.zoom = 12;
    this.map.triggerResize();
  }
}
