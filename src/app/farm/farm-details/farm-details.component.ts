import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';
import { RepositoryService } from 'src/app/shared/repository.service';
import { Farm } from 'src/app/_interface/farm.model';
import { Weekday } from 'src/app/_interface/weekday.model';

@Component({
  selector: 'app-farm-details',
  templateUrl: './farm-details.component.html',
  styleUrls: ['./farm-details.component.css']
})
export class FarmDetailsComponent implements OnInit {
  public farm: Farm;
  public loaded: boolean = false;

  constructor(private repository: RepositoryService, private router: Router,
    private activeRoute: ActivatedRoute, private errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {
    this.getFarmDetails();
  }

  private getFarmDetails = () => {
    let id: string = this.activeRoute.snapshot.params['id'];
    let apiUrl: string = `api/farm/${id}`

    this.repository.getData(apiUrl)
      .subscribe(res => {
        this.farm = res as Farm;
        this.farm.schedules.sort((a, b) => {
          return a.dayOfWeek > b.dayOfWeek ? 1:-1
        })
        this.loaded = true;
      },
        (error) => {
          this.errorHandler.handleError(error);
        })
  }

  public getDayOfWeek(day: number): string {
    return Weekday[day];
  }

  public formatTime(time: string): string {
    let hour: number = +time.slice(0, 2);
    return `${hour > 12 ? hour - 12 : hour}:${time.slice(2)} ${hour > 12 ? "pm" : "am"}`;
  }

  public redirectToEditFarm(id: string) {
    let url: string = `/farms/edit/${id}`
    this.router.navigate([url]);
  }
}
