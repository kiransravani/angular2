import { NgModule, Component, Input, Output, AfterViewInit, ElementRef, EventEmitter, forwardRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export const RADIO_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioButton),
    multi: true
};

@Component({
    selector: 'atpar-radioButton',
    templateUrl:'radiobutton.html',
    styleUrls: ['radiobutton.css'],
    providers: [RADIO_VALUE_ACCESSOR]
})
export class RadioButton implements ControlValueAccessor, AfterViewInit {

    @Input() value: any;

    @Input() name: string;

    @Input() disabled: boolean;

    @Input() label: string;

    @Input() tabindex: number;

    @Output() onClick: EventEmitter<any> = new EventEmitter();

    @ViewChild('rb') inputViewChild: ElementRef;

    public input: HTMLInputElement;

    public onModelChange: Function = () => { };

    public onModelTouched: Function = () => { };

    public checked: boolean;

    public focused: boolean;

    @Input() check: any = 'VALID';

    constructor(private cd: ChangeDetectorRef) { }

    ngAfterViewInit() {
        this.input = <HTMLInputElement>this.inputViewChild.nativeElement;
    }

    handleClick() {
        if (!this.disabled) {
            this.onClick.emit(null);
            if (this.check == 'VALID') {
                this.select();
            }
           
        }
    }

    select() {
        if (!this.disabled) {
            this.input.checked = true;
            this.checked = true;
            this.onModelChange(this.value);
        }
    }

    writeValue(value: any): void {
        if (value != null && value!='')
        {
            this.onClick.emit(value);
            this.checked = (value.toString().toUpperCase() == this.value.toUpperCase());
        } else {
            this.checked = false;
        }
       

        if (this.input) {
            this.input.checked = this.checked;
        }

        this.cd.markForCheck();
    }

    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }

    setDisabledState(val: boolean): void {
        this.disabled = val;
    }

    onFocus(event) {
        this.focused = true;
    }

    onBlur(event) {
        this.focused = false;
        this.onModelTouched();
    }

    onChange(event) {
        this.select();
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [RadioButton],
    declarations: [RadioButton]
})
export class RadioButtonModule { }