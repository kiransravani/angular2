import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ATPAR_VALIDATION_RULES } from '../../entities/atpar_validation_rules';
import { isPresent, isDate } from './lang';
import { minLenValidator, maxlenValidator, regExpValidator, Email, RangeLengthValidator, DigitsValidator, NumberValidator, UrlValidator, DateValidator, MinDateValidator, MaxDateValidator, EqualValidator, AlphaNumeric } from './Validators';
const noop = () => { };

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AtParTextBoxComponent),
    multi: true
};
@Component({
    selector: 'atpar-textbox',
    templateUrl: 'atpar-textbox.html',
    styleUrls: ['style.css'],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class AtParTextBoxComponent implements ControlValueAccessor {

    @Input() paramvalue: any;
    @Input() validationrules: ATPAR_VALIDATION_RULES[];
    @Input() id: any;
    disabled: boolean = false;
    @Input() readonly: boolean;
    @Output() ontxtchange = new EventEmitter();

    ShowValidations: boolean = false;
    txtwidth: any;

    //variables
    Req: ATPAR_VALIDATION_RULES;
    min: ATPAR_VALIDATION_RULES;
    max: ATPAR_VALIDATION_RULES;
    rules: ATPAR_VALIDATION_RULES;
    EmailStatus: ATPAR_VALIDATION_RULES;
    rangelength: ATPAR_VALIDATION_RULES;
    digitsstatus: ATPAR_VALIDATION_RULES;
    urlstatus: ATPAR_VALIDATION_RULES;
    numberstatus: ATPAR_VALIDATION_RULES;
    datestatus: ATPAR_VALIDATION_RULES;
    mindatestatus: ATPAR_VALIDATION_RULES;
    maxdatestatus: ATPAR_VALIDATION_RULES;
    equalstatus: ATPAR_VALIDATION_RULES;
    validatenumbers: ATPAR_VALIDATION_RULES;
    Maxlength: ATPAR_VALIDATION_RULES;
    alphanumeric: ATPAR_VALIDATION_RULES;

    //harika
    @Input() placeholder: string;
    @Input() modelstring: string;
    model: any = {};
    visibleText: boolean = false;
    activelabel: string;
    vRule: boolean = false;

    //The internal data model
    private innerValue: any = '';

    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    //get accessor
    get value(): any {
        return this.innerValue;
    };

    //set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }
    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }
    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }


    focusEvent(focuson) {
        this.ShowValidations = focuson;

        //setting the width of a div as texbox 
        //if (this.ShowValidations == true) {
        //    if (document.getElementById(this.id) != null)
        //    {
        //        this.txtwidth = (document.getElementById(this.id).clientWidth + 1) + "px";
        //    }

        //    if (document.getElementById("div_id_" + this.id) != null)
        //    {
        //        document.getElementById("div_id_" + this.id).style.width = this.txtwidth;
        //    }


        //}

        //harika
        if (this.model.modelstring == "undefined") {
            this.visibleText = !this.visibleText;
        } else { this.visibleText = true };
        this.activelabel = this.visibleText ? 'input-disturbed' : 'hide-class';

    }

    handleBlur(event) {
        
        if (!this.vRule) {
            event.target.style.border = "1px solid #ff0000";

        } else {
            event.target.style.border = "0px";
        }

    }
    handelInput(e) {
        if (this.validationrules != null && this.validationrules != undefined && this.validationrules.length > 0) {

            this.validatenumbers = this.validationrules.filter(x => x.ValidationType == "Numeric")[0];
            this.Maxlength = this.validationrules.filter(x => x.ValidationType == "Max")[0];
            if (this.validatenumbers != null) {
                var charCode = (e.which) ? e.which : e.keyCode
                if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                    return false;

                }
            }

            if (this.Maxlength != null) {
                if (this.value.length >= this.Maxlength.validationFormat) {
                    return false;
                }
            }

            let orgVal: string = "";
            if (this.value != undefined && e.key != undefined) {


                orgVal = this.value + e.key;
            } else if (e.key != undefined) {
                orgVal = e.key;
            } else {

                orgVal = this.value;
                orgVal = e.char;

            }

            let customValidations = this.validationrules.filter(x => x.ValidationType == "")
            if (customValidations != null && customValidations != undefined) {
                for (let x = 0; x < customValidations.length; x++) {
                    let rulename = customValidations[x].validationFormat;
                    if (!regExpValidator(customValidations[x].validationFormat, orgVal)) {
                        this.vRule = true;
                        break;
                    }
                }
            }

            if (this.vRule) {
                this.vRule = false;
                return false;
            }
        }
       

    }
    onKey(event) {
        this.ontxtchange.emit(this.value);
        this.onTouchedCallback();
    }
}



