import {NgModule,Directive,ElementRef,HostListener,Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Directive({
    selector: '[atpar-inputtext]',
    host: {
        '[class.ui-inputtext]': 'true',
        '[class.ui-corner-all]': 'true',
        '[class.ui-state-default]': 'true',
        '[class.ui-widget]': 'true',
        '[class.ui-state-filled]': 'filled',
        '[class.form-control]': 'true',

    }
})
export class InputText {

    constructor(public el: ElementRef) {}
        
    get filled(): boolean {
        return this.el.nativeElement.value&&this.el.nativeElement.value.length;
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [InputText],
    declarations: [InputText]
})
export class InputTextModule { }