import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { SpinnerComponent } from './spinner-component';
import { SpinnerService } from './event.spinner.service';


@NgModule({
    imports: [
        BrowserModule
    ],
    declarations: [SpinnerComponent],
    exports: [SpinnerComponent],
    providers: [SpinnerService]
})
export class SpinnerModule {
}