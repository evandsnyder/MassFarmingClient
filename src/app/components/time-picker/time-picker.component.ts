import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Schedule } from 'src/app/_interface/schedule.model';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TimePickerComponent implements OnInit {
  @Input() schedule: any[];
  public openHour: number = 1;
  public openMinute: number = 0;
  public openAm: boolean = true;

  public closeHour: number = 1;
  public closeMinute: number = 0;
  public closeAm: boolean = false;

  public weekdayList: any = [];

  constructor() { }

  ngOnInit(): void {
    this.weekdayList = [
      { "name": "Sunday", "id": 0, "selected": false },
      { "name": "Monday", "id": 1, "selected": false },
      { "name": "Tuesday", "id": 2, "selected": false },
      { "name": "Wednesday", "id": 3, "selected": false },
      { "name": "Thursday", "id": 4, "selected": false },
      { "name": "Friday", "id": 5, "selected": false },
      { "name": "Saturday", "id": 6, "selected": false }
    ];
  }

  public incrementHour = (v: string) => {
    this[v] = (this[v] + 1) % 13 ? (this[v] + 1) % 13 : 1;
  }

  public decrementHour = (v: string) => {
    this[v] = (this[v] - 1 <= 0) ? 12 : this[v] - 1;
  }

  public incrementMinute = (v: string) => {
    this[v] = (this[v] + 1) % 60;
    if (this[v] == 0) {
      v.includes('open') ? this.incrementHour('openHour') : this.incrementHour('closeHour');
    }
  }

  public decrementMinute = (v: string) => {
    if (this[v] - 1 < 0) {
      this[v] = 59;
      v.includes('open') ? this.decrementHour('openHour') : this.decrementHour('closeHour');
    } else {
      this[v] -= 1
    }
  }

  public selectedDays = () => {
    let selected = this.weekdayList.filter(day => day.selected);
    return selected.map(day => day.id);
  }

  public updateSchedules(): Schedule[] {
    let schedules: Schedule[] = [];

    for (let day of this.selectedDays()) {
      schedules.push({
        dayOfWeek: day
        ,startTime: this.prepareTime(this.openHour, this.openMinute, this.openAm)
        ,endTime: this.prepareTime(this.closeHour, this.closeMinute, this.closeAm)
      });
    }
    return schedules;


  }

  private prepareTime(hour: number, minute: number, am: boolean): string {
    if (!am) hour += 12;
    return `${hour < 10 ? '0' : ''}${hour}${minute < 10 ? '0' : ''}${minute}`;
  }
}
