import { Component, OnInit, Input, Output, EventEmitter, forwardRef, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ATPAR_VALIDATION_RULES } from '../../entities/atpar_validation_rules';
import { isPresent, isDate } from './lang';
import { CustomValidations } from './customvalidations';
import { minLenValidator, maxlenValidator, Phone, Fax, ZipCode, regExpValidator, Email, RangeLengthValidator, DigitsValidator, NumberValidator, UrlValidator, DateValidator, MinDateValidator, MaxDateValidator, EqualValidator, AlphaNumeric } from './Validators';
const noop = () => { };

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AtParTextForGridComponent),
    multi: true
};
@Component({
    selector: 'atpar-text-grid',
    templateUrl: 'atpar-text.html',
    styleUrls: ['style.css'],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class AtParTextForGridComponent implements ControlValueAccessor, AfterViewInit {

    private paramval: string = "";
    @Input() validationrules: ATPAR_VALIDATION_RULES[];
    @Input() id: any;
    @Input() disabled: boolean = false;
    @Input() readonly: boolean = false;
    @Output() bindModelDataChange = new EventEmitter();
    ShowValidations: boolean = false;
    showerror: boolean = false;
    @Input() title: string;
    @Input() convertToUpper: boolean = false;
    @Output() onchange = new EventEmitter();
    @Input() placeholder: string;   
    @Input() style: any;
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
    PhoneStatus: ATPAR_VALIDATION_RULES;
    ZipStatus: ATPAR_VALIDATION_RULES;
    FaxStatus: ATPAR_VALIDATION_RULES;
    validateDecimal: ATPAR_VALIDATION_RULES;
    onlycaps: ATPAR_VALIDATION_RULES;
    txtwidth: any;
    xReq: ATPAR_VALIDATION_RULES;
    vRule: boolean = false;
    customValidations: CustomValidations;
    @Input() validations: any;
    @Input() isFocused: string;
    maxvalue: number;
    copiedValue: string;
    isFocusedID: any;

    errormessage: string = '';

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
            this.paramval = v;
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

    ngOnInit() {
        this.validationrules = new Array<ATPAR_VALIDATION_RULES>()
        this.customValidations = new CustomValidations();
        if (this.validations != null || this.validations != undefined) {

            for (let x = 0; x < this.validations.split(',').length; x++) {
                let rule = this.validations.split(',')[x].toString().trim();
                let validationRule = this.customValidations.validateInput(rule, '');
                if (validationRule != null && validationRule != undefined) {
                    this.validationrules.push(validationRule);
                }
            }
        }
        if (this.isFocused == "true" && this.id != undefined) {
            this.focusEvent(false);
            this.focusEvent(true);
            this.isFocusedID = this.id;
        }

        this.isFocused = "";


    }

    focusEvent(focuson) {
        this.ShowValidations = focuson;
    }

    handelInput(e) {
        let orgVal: string = "";
        if (this.value != undefined && e.key != undefined) {
            orgVal = this.value + e.key;
        }
        else if (e.key != undefined) {
            orgVal = e.key;
        }
        else {
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

        if (this.validationrules != null && this.validationrules != undefined && this.validationrules.length > 0) {
            this.validatenumbers = this.validationrules.filter(x => x.ValidationType == "Numeric" || x.ValidationType == "Number")[0];
            if (this.validatenumbers != null) {
                var charCode = (e.which) ? e.which : e.keyCode
                if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                    this.validatenumbers.status = false;
                    return false;
                }
                this.validatenumbers.status = true;
            }
            this.Maxlength = this.validationrules.filter(x => x.ValidationType == "Max")[0];
            if (this.Maxlength != null) {
                this.maxvalue = this.Maxlength.validationFormat;
                //if (this.paramval.length >= this.Maxlength.validationFormat) {
                //    return false;
                //}
            }
            this.validateDecimal = this.validationrules.filter(x => x.ValidationType == "numeric_dot")[0];
            if (this.validateDecimal != null) {
                e = (e) ? e : window.event;
                var charCode = (e.which) ? e.which : e.keyCode;
                if (charCode == 8) {
                    this.validateDecimal.status = true;
                    return true;
                } else if (charCode == 46 && this.value.indexOf('.') != -1) {
                    this.validateDecimal.status = false;
                    return false;
                } else if (charCode > 31 && charCode != 46 && (charCode < 48 || charCode > 57)) {
                    this.validateDecimal.status = false;
                    return false;
                }
                this.validateDecimal.status = true;
                return true;
            }
            this.onlycaps = this.validationrules.filter(x => x.ValidationType == "caps_only_key_res")[0];
            if (this.onlycaps != null)
            {
                var charCode = (e.which) ? e.which : e.keyCode;
                if (charCode < 65 || charCode > 90) {
                    this.onlycaps.status = false;
                    return false;
                }
                this.onlycaps.status = true;
                return true;
                
            }

        }
    }

    onKey(event) {
        //Required Field Validator
        if (this.value != null || this.value != "") {
            if (this.value != undefined) {
                if (this.convertToUpper) {
                    this.value = this.value.toUpperCase();
                }

                this.paramval = this.value.toString();

            }

        }
        if (event.type === "paste" || event.type === "cut") {
            this.paramval = this.copiedValue;
        }
        this.Req = this.validationrules.filter(x => x.ValidationType == "Mandatory")[0];
        if (this.Req != null) {
            if (this.paramval != "" && this.paramval.length > 0 && this.paramval != undefined && this.paramval != null) {
                this.Req.status = true;
                this.showerror = false;
            }
            else {
                if (this.paramval == "") {
                    // this.errormessage = "";
                    this.showerror = false;
                    this.Req.status = false;
                }
                else {
                    this.Req.status = false;
                    this.showerror = true;
                }
                this.Emitbeforereturn();
                return;
            }
        }

        //minimum Length Validator
        this.min = this.validationrules.filter(x => x.ValidationType == "Min")[0];
        if (this.min != null) {
            if (minLenValidator(parseInt(this.min.validationFormat), this.paramval.length)) {
                this.min.status = true;
                this.showerror = false;
            }
            else {
                if (this.paramval == "") {
                    this.min.status = true;
                    this.errormessage = "";
                    this.showerror = false;
                }
                else {
                    this.showerror = true;
                    this.errormessage = "Invalid Length";
                    this.min.status = false;
                }
                this.Emitbeforereturn();
                return;
            }
        }

        //maximum Length Validator
        this.max = this.validationrules.filter(x => x.ValidationType == "Max")[0];
        if (this.max != null) {
            if (maxlenValidator(parseInt(this.max.validationFormat), this.paramval.length)) {
                this.showerror = false;
                this.max.status = true;
            }
            else {
                if (this.paramval == "") {
                    this.max.status = true;
                    this.errormessage = "";
                    this.showerror = false;
                }
                else {
                    this.showerror = true;
                    this.errormessage = "Invalid Length";
                    this.max.status = false;
                }
                this.Emitbeforereturn();
                return;
            }
        }

        //regular expression Validator
        this.rules = this.validationrules.filter(x => x.ValidationType == "regExp")[0];
        if (this.rules != null) {
            if (regExpValidator(this.rules.validationFormat, this.paramval)) {
                this.showerror = false;
                this.rules.status = true;
            }
            else {
                if (this.paramval == "") {
                    this.rules.status = true;
                    this.errormessage = "";
                    this.showerror = false;
                }
                else {
                    this.showerror = true;
                    if (this.rules.validationFormat == "numeric_10" || this.rules.validationFormat == "numeric") {
                        this.errormessage = "Invalid";
                    }
                    else {
                        this.errormessage = "Invalid Character";
                    }
                    this.rules.status = false;
                }
                this.Emitbeforereturn();
                return;
            }
        }

        this.validatenumbers = this.validationrules.filter(x => x.ValidationType == "Numeric")[0];
        if (this.validatenumbers != null) {
            if (regExpValidator("numeric", this.paramval)) {
                this.showerror = false;
                this.validatenumbers.status = true;
            }
            else {
                this.showerror = true;
                this.errormessage = "Invalid";
                this.validatenumbers.status = false;
                this.Emitbeforereturn();
                return;
            }
            //var val = parseInt(this.paramval);
            //if (val == NaN) {
            //    this.validatenumbers.status = false;
            //} else {
            //    this.validatenumbers.status = true;
            //}


        }

        //Email Validator
        this.EmailStatus = this.validationrules.filter(x => x.ValidationType == "Email")[0];
        if (this.EmailStatus != null) {
            if (Email(this.paramval)) {
                this.showerror = false;
                this.EmailStatus.status = true;
            }
            else {
                if (this.paramval == "") {
                    this.EmailStatus.status = true;
                    this.errormessage = "";
                    this.showerror = false;
                }
                else {
                    this.showerror = true;
                    this.errormessage = "Invalid Email";
                    this.EmailStatus.status = false;
                }
                this.Emitbeforereturn();
                return;
            }
        }

        //phone Validator
        this.PhoneStatus = this.validationrules.filter(x => x.ValidationType == "Phone")[0];
        if (this.PhoneStatus != null) {
            if (Phone(this.paramval)) {
                this.showerror = false;
                this.PhoneStatus.status = true;
            }
            else {
                if (this.paramval == "") {
                    this.PhoneStatus.status = true;
                    this.errormessage = "";
                    this.showerror = false;
                }
                else {
                    this.showerror = true;
                    this.errormessage = "Invalid Phone number";
                    this.PhoneStatus.status = false;
                }
                this.Emitbeforereturn();
                return;
            }
        }

        //Zip Validator
        this.ZipStatus = this.validationrules.filter(x => x.ValidationType == "Zipcode")[0];
        if (this.ZipStatus != null) {
            if (ZipCode(this.paramval)) {
                this.showerror = false;
                this.ZipStatus.status = true;
            }
            else {
                if (this.paramval == "") {
                    this.ZipStatus.status = true;
                    this.errormessage = "";
                    this.showerror = false;
                }
                else {
                    this.showerror = true;
                    this.errormessage = "Invalid Zip Code";
                    this.ZipStatus.status = false;
                }
                this.Emitbeforereturn();
                return;
            }
        }

        //Fax Validator
        this.FaxStatus = this.validationrules.filter(x => x.ValidationType == "Fax")[0];
        if (this.FaxStatus != null) {
            if (Fax(this.paramval)) {
                this.showerror = false;
                this.FaxStatus.status = true;
            }
            else {
                if (this.paramval == "") {
                    this.FaxStatus.status = true;
                    this.errormessage = "";
                    this.showerror = false;
                }
                else {
                    this.showerror = true;
                    this.errormessage = "Invalid Fax number";
                    this.FaxStatus.status = false;
                }
                this.Emitbeforereturn();
                return;
            }
        }

        //RangeLengthValidator
        this.rangelength = this.validationrules.filter(x => x.ValidationType == "Range")[0];
        if (this.rangelength != null) {
            if (RangeLengthValidator(this.rangelength.validationFormat, this.paramval)) {
                this.showerror = false;
                this.rangelength.status = true;
            }
            else {
                if (this.paramval == "") {
                    this.rangelength.status = true;
                    this.errormessage = "";
                    this.showerror = false;
                }
                else {
                    this.showerror = true;
                    this.errormessage = "Invalid Range";
                    this.rangelength.status = false;
                }
                this.Emitbeforereturn();
                return;
            }
        }

        //Digits Validator
        this.digitsstatus = this.validationrules.filter(x => x.ValidationType == "Digit")[0];
        if (this.digitsstatus != null) {
            if (DigitsValidator(this.paramval)) {
                this.showerror = false;
                this.digitsstatus.status = true;
            }
            else {
                if (this.paramval == "") {
                    this.digitsstatus.status = true;
                    this.errormessage = "";
                    this.showerror = false;
                }
                else {
                    this.showerror = true;
                    this.errormessage = "Invalid Digit";
                    this.digitsstatus.status = false;
                }
                this.Emitbeforereturn();
                return;
            }


        }

        //Number Validator
        this.numberstatus = this.validationrules.filter(x => x.ValidationType == "Number")[0];
        if (this.numberstatus != null) {
            if (NumberValidator(this.paramval)) {
                this.showerror = false;
                this.numberstatus.status = true;
            }
            else {
                if (this.paramval == "") {
                    this.numberstatus.status = true;
                    this.errormessage = "";
                    this.showerror = false;
                }
                else {
                    this.showerror = true;
                    this.errormessage = "Invalid Number";
                    this.numberstatus.status = false;
                }
                this.Emitbeforereturn();
                return;
            }
        }

        //url Validator
        this.urlstatus = this.validationrules.filter(x => x.ValidationType == "URL")[0];
        if (this.urlstatus != null) {
            if (UrlValidator(this.paramval)) {
                this.showerror = false;
                this.urlstatus.status = true;
            }
            else {
                if (this.paramval == "") {
                    this.urlstatus.status = true;
                    this.errormessage = "";
                    this.showerror = false;
                }
                else {
                    this.urlstatus.status = false;
                    this.errormessage = "Invalid URL Format";
                    this.showerror = true;
                }
                this.Emitbeforereturn();
                return;
            }

        }

        //Date Validator
        this.datestatus = this.validationrules.filter(x => x.ValidationType == "Date")[0];
        if (this.datestatus != null) {

            if (DateValidator(this.paramval)) {
                this.datestatus.status = true;
                this.showerror = false;
            }
            else {
                if (this.paramval == "") {
                    this.datestatus.status = true;
                    this.errormessage = "";
                    this.showerror = false;
                }
                else {
                    this.datestatus.status = false;
                    this.errormessage = "Invalid Date Format";
                    this.showerror = true;
                }
                this.Emitbeforereturn();
                return;
            }
        }

        //Min Date Validator
        this.mindatestatus = this.validationrules.filter(x => x.ValidationType == "MinDate")[0];
        if (this.mindatestatus != null) {

            if (MinDateValidator(this.mindatestatus.validationFormat, this.paramval)) {
                this.mindatestatus.status = true;
                this.showerror = false;
            }
            else {
                if (this.paramval == "") {
                    this.mindatestatus.status = true;
                    this.errormessage = "";
                    this.showerror = false;
                }
                else {
                    this.mindatestatus.status = false;
                    this.errormessage = "Invalid Date";
                    this.showerror = true;
                }
                this.Emitbeforereturn();
                return;
            }
        }

        //Max Date Validator
        this.maxdatestatus = this.validationrules.filter(x => x.ValidationType == "MaxDate")[0];
        if (this.maxdatestatus != null) {

            if (MaxDateValidator(this.maxdatestatus.validationFormat, this.paramval)) {
                this.maxdatestatus.status = true;
                this.showerror = false;
            }
            else {
                if (this.paramval == "") {
                    this.maxdatestatus.status = true;
                    this.errormessage = "";
                    this.showerror = false;
                }
                else {
                    this.maxdatestatus.status = false;
                    this.errormessage = "Invalid Date";
                    this.showerror = true;
                }
                this.Emitbeforereturn();
                return;
            }
        }

        //equal validator
        this.equalstatus = this.validationrules.filter(x => x.ValidationType == "Equal")[0];
        if (this.equalstatus != null) {
            if (EqualValidator(this.equalstatus.validationFormat, this.paramval)) {
                this.showerror = false;
                this.equalstatus.status = true;
            }
            else {
                if (this.paramval == "") {
                    this.equalstatus.status = true;
                    this.errormessage = "";
                    this.showerror = false;
                }
                else {
                    this.equalstatus.status = false;
                    this.errormessage = "Invalid";
                    this.showerror = true;
                }
                this.Emitbeforereturn();
                return;
            }
        }

        //Output Emitting
        this.bindModelDataChange.emit({ val: this.paramval, TextBoxID: this.id, validationrules: this.validationrules });

        this.onchange.emit({ val: this.paramval, TextBoxID: this.id });
    }
    onCutPaste(event) {
        this.copiedValue = event.clipboardData.getData("text");
        this.onKey(event);
    }

    //For left border color of the textbox
    ngAfterViewInit() {
        this.xReq = this.validationrules.filter(x => x.ValidationType == "Mandatory")[0];
        if (this.xReq != null) {
            // document.getElementById(this.id).classList.add('bdr-red');
            // document.getElementById(this.id).classList.add('');
            var node = document.createElement("span");
            node.setAttribute("class", "text-danger grid-mandatory");
            var textnode = document.createTextNode("*");
            var sp2 = document.getElementById(this.id);
            var parentDiv = sp2.parentNode;
            node.appendChild(textnode);
            document.getElementById(this.id).appendChild(node);
            parentDiv.insertBefore(node, sp2);

        }
        else {
            // document.getElementById(this.id).classList.add('bdr-purple');
            var node = document.createElement("span");
            node.setAttribute("class", "grid-mandatory-white");
            var textnode = document.createTextNode("*");
            var sp2 = document.getElementById(this.id);
            var parentDiv = sp2.parentNode;
            node.appendChild(textnode);
            document.getElementById(this.id).appendChild(node);
            parentDiv.insertBefore(node, sp2);
        }

        if (this.isFocusedID != null && this.isFocusedID != undefined) {
            document.getElementById(this.isFocusedID).focus();
        }
    }

    Emitbeforereturn() {
        this.bindModelDataChange.emit({ val: this.paramval, TextBoxID: this.id, validationrules: this.validationrules });
    }
}






