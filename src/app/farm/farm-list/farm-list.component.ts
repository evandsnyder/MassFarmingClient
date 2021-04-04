import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../../shared/repository.service';
import { Farm } from '../../_interface/farm.model';
import { ErrorHandlerService } from '../../shared/error-handler.service';

@Component({
  selector: 'app-farm-list',
  templateUrl: './farm-list.component.html',
  styleUrls: ['./farm-list.component.css']
})
export class FarmListComponent implements OnInit {
  farms: Farm[];

  constructor(private repoService: RepositoryService, private errorService: ErrorHandlerService) { }

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

}
