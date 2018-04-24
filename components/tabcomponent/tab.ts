import { Component, Input } from '@angular/core';

@Component({
  selector: 'atpar-tab',
  templateUrl: 'tab.html'
})
export class Tab {
  @Input('tabTitle') title: string;
  @Input() active = false;
}