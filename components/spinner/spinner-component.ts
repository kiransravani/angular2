
import { Component } from '@angular/core';
import { SpinnerService } from './event.spinner.service';
import { SpinnerSentEvent } from './spinner.sent.event';

@Component({
    selector: 'atpar-spinner',
    templateUrl: 'spinner.html',
    styleUrls: ['atpar-spinner.css']
})

export class SpinnerComponent {

    public isSpin: boolean = false;

    constructor(private spinnerService: SpinnerService) {
      
    }

    ngOnInit() {
        this.spinnerService.getEvent(SpinnerSentEvent).subscribe(this.onSpinnerCall);
    }

    ngOnDestroy() {
        this.isSpin = null;
        this.spinnerService.getEvent(SpinnerSentEvent).unsubscribe(this.onSpinnerCall);
    }

    private onSpinnerCall = (isSpin: boolean) => {
        //if (isSpin == false) {
        //    setTimeout(() => {
        this.isSpin = isSpin;
        //    }, 1000);
        //}
        //else {
        //    this.isSpin = isSpin;
        //}
    }

}