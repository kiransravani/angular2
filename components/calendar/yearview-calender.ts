
import { NgModule, Component, ElementRef, AfterViewInit, OnDestroy, OnInit, Input, Output, SimpleChange, EventEmitter, forwardRef, Renderer, trigger, state, style, transition, animate, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '../button/button';
import { InputTextModule } from '../inputtext/inputtext';
import { DomHandler } from '../../common/dom/domhandler';
import { AbstractControl, NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor } from '@angular/forms';

export const CALENDAR_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => yearviewcalender),
    multi: true
};

export const CALENDAR_VALIDATOR: any = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => yearviewcalender),
    multi: true
};

export interface LocaleSettings {
    firstDayOfWeek?: number;
    dayNames: string[];
    dayNamesShort: string[];
    dayNamesMin: string[];
    monthNames: string[];
    monthNamesShort: string[];
}


declare var module: {
    id: string;
}
@Component({

    selector: 'atpar-yearviewcalender',
    templateUrl: 'yearview-calender.html',
    animations: [
        trigger('overlayState', [
            state('hidden', style({
                opacity: 0
            })),
            state('visible', style({
                opacity: 1
            })),
            transition('visible => hidden', animate('400ms ease-in')),
            transition('hidden => visible', animate('400ms ease-out'))
        ])
    ],
    host: {
        '[class.ui-inputwrapper-filled]': 'filled',
        '[class.ui-inputwrapper-focus]': 'focus'
    },
    providers: [DomHandler, CALENDAR_VALUE_ACCESSOR, CALENDAR_VALIDATOR]
})
export class yearviewcalender implements AfterViewInit, OnInit, OnDestroy, ControlValueAccessor {
   
    @Input() defaultDate: Date;

    @Input() style: string;

    @Input() styleClass: string;

    @Input() inputStyle: string;

    @Input() inputStyleClass: string;

    @Input() placeholder: string;

    @Input() disabled: any;

    @Input() dateFormat: string = 'yy';

    @Input() inline: boolean = false;    

    @Input() showIcon: boolean;

    @Input() icon: string = 'fa-calendar';

    @Input() appendTo: any;

    @Input() readonlyInput: boolean;

    @Input() shortYearCutoff: any = '+10';   

    @Input() required: boolean;

    @Input() showOnFocus: boolean = true;

    @Input() dataType: string = 'date';

    @Output() onFocus: EventEmitter<any> = new EventEmitter();

    @Output() onBlur: EventEmitter<any> = new EventEmitter();

    @Output() onSelect: EventEmitter<any> = new EventEmitter();    

    @Input() tabindex: number;

    @Input() timeOnly: boolean;

    @ViewChild('datepicker') overlayViewChild: ElementRef;

    value: Date;
    value1: string;

    dates: any[];

    weekDays: string[] = [];

    currentYear: number;

    yearss: number;

    overlay: HTMLDivElement;

    overlayVisible: boolean;

    closeOverlay: boolean = true;

    dateClick: boolean;

     currentHour: number;

    currentMinute: number;

    onModelChange: Function = () => { };

    onModelTouched: Function = () => { };

    calendarElement: any;

    documentClickListener: any;

    focus: boolean;

    filled: boolean;

    inputFieldValue: string = null;

    _isValid: boolean = true;

    closeDiv: boolean;      

    currentMonth: number;

    @Input() id: string;
    
    fixedyear: number;    

    ToShowStart: number = 2010;

    ToShowFinish: number=2019;

    dummyyear: number;

    count: number = 0;

    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer) { }

    ngOnInit() {       
        let date = this.defaultDate || new Date();
        this.closeDiv = true;  
        this.currentYear = date.getFullYear();  
        this.fixedyear =2005;    
        let week = []; 
        this.dates = []; 
        this.dummyyear = this.dummyyear + 10;       
        this.createDecade(this.ToShowStart, this.ToShowStart + 11); 
        
    }
   
    ngAfterViewInit() {
        this.overlay = <HTMLDivElement>this.overlayViewChild.nativeElement;

        if (!this.inline && this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.overlay);
            else
                this.domHandler.appendChild(this.overlay, this.appendTo);
        }


        if (this.required == true) {
            var node = document.createElement("span");
            node.setAttribute("class", "text-danger autocomplete-mandatory");
            var textnode = document.createTextNode("*");
            var sp2 = document.getElementById(this.id);
            var parentDiv = sp2.parentNode;
            node.appendChild(textnode);
            document.getElementById(this.id).appendChild(node);
            parentDiv.insertBefore(node, sp2);

        }
    }

    createDecade(month: number, year: number) {
        this.dates = [];    
        this.yearss = year;
        let week = [];        
        this.count = 0;       
        week = [];
        for (let i = month; i <= year; i++)
        {
                this.count = this.count + 1;
                week.push({
                        day: i, selectable: this.isSelectable(i)
                }); 
                if (this.count === 3) {
                    this.dates.push(week);
                    week = [];
                    this.count = 0;
                }              
        }            
}
              

       
    prevDecade(event) {
        if (this.disabled) {
            event.preventDefault();
            return;
        }       
        this.ToShowFinish = this.ToShowStart - 1;
        this.ToShowStart = this.ToShowFinish - 9;          

        
        this.createDecade(this.ToShowStart, this.ToShowStart + 11);
        event.preventDefault();
    }

    nextDecade(event) {
        if (this.disabled) {
            event.preventDefault();
            return; 
        } 
        this.ToShowStart = this.ToShowFinish + 1;  
        this.ToShowFinish = this.ToShowStart + 9;
              
        this.createDecade(this.ToShowStart, this.ToShowStart + 11);
        event.preventDefault();
    }


    onYearSelect(event, dateMeta) {
        if (this.disabled || !dateMeta.selectable) {
            event.preventDefault();
            return;
        }        
        else {
            this.selectDate(dateMeta);
        }

        this.dateClick = true;
        this.updateInputfield();
        event.preventDefault();
    }


    updateInputfield() {
        if (this.value) {
            let formattedValue;
          
                formattedValue = this.formatDate(this.value, this.dateFormat);
                
            this.inputFieldValue = formattedValue;
        }
        else {
            this.inputFieldValue = '';
        }

        this.updateFilledState();
    }


    selectDate(dateMeta) {
        this.value = new Date(dateMeta.day, 1, 1);       
        this._isValid = true;
        this.updateModel();
        this.onSelect.emit(this.value);
    }


    updateModel() {
            if (this.timeOnly)
                this.onModelChange(this.formatTime(this.value));
            else
                this.onModelChange(this.formatDate(this.value, this.dateFormat));
    }

    getFirstDayOfMonthIndex(month: number, year: number) {
        let day = new Date();
        day.setDate(1);
        day.setMonth(month);
        day.setFullYear(year);

       
    }

    getDaysCountInMonth(month: number, year: number) {
        return 32 - this.daylightSavingAdjust(new Date(year+1, month, 32)).getDate();
    }

    getDaysCountInPrevMonth(month: number, year: number) {
        let prev = this.getPreviousMonthAndYear(month, year);
        return this.getDaysCountInMonth(prev.month, prev.year);
    }

    getPreviousMonthAndYear(month: number, year: number) {
        let m, y;

        if (month === 0) {
            m = 11;
            y = year - 1;
        }
        else {
            m = month - 1;
            y = year;
        }

        return { 'month': m, 'year': y };
    }

    getNextMonthAndYear(month: number, year: number) {
        let m, y;

        if (month === 11) {
            m = 0;
            y = year + 1;
        }
        else {
            m = month + 1;
        }

        return { 'month': m, 'year': y };
    }

   
    isSelected(dateMeta): boolean {
        if (this.value)
            return this.value.getDate() === dateMeta.day && this.value.getMonth() === dateMeta.month && this.value.getFullYear() === dateMeta.year;
        else
            return false;
    }

    isToday(today, day, month, year): boolean {
        return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
    }

    isSelectable(year): boolean {
        let validMin = true;
        let validMax = true;
        if (this.yearss < this.currentYear + 10) {
            validMax = false;
        } else {
            validMin = false;
        }
        return true;
    }

    onInputFocus(inputfield, event) {
        this.focus = true;
        this.closeDiv = true;
        if (this.showOnFocus) {
            this.showOverlay(inputfield);
        }
        this.onFocus.emit(event);
    }

    onInputBlur(event) {
        this.focus = false;
        this.onBlur.emit(event);
        this.onModelTouched();
    }

    onButtonClick(event, inputfield) {
        this.closeOverlay = false;
        this.closeDiv = true;
        if (!this.overlay.offsetParent) {
            inputfield.focus();
            this.showOverlay(inputfield);
        }
        else
            this.closeOverlay = true;
    }

    onInputKeydown(event) {
        if (event.keyCode === 9) {
            this.overlayVisible = false;
        }
    }

    onClose() {
        this.closeDiv = false;
    }  
   
    updateTime() {               
        this.updateModel();
        this.onSelect.emit(this.value);
        this.updateInputfield();
    }

    toggleAMPM(event) {       
        this.updateTime();
        event.preventDefault();
    }

    onInput(event) {
        try {
            this.value = this.parseValueFromString(event.target.value);         
            
            this._isValid = true;
        }
        catch (err) {           
            this.value = null;
            this._isValid = false;
        }        
       this.updateModel();
       this.updateFilledState();     
    }

    parseValueFromString(text: string): Date {
        let dateValue;
        let parts: string[] = text.split(' ');       
        dateValue = this.parseDate(text, this.dateFormat);      

        return dateValue;
    }

    populateTime(value, timeString, ampm) {
      
    }

    updateUI() {
        let val = this.value || this.defaultDate || new Date();
        this.createDecade(this.ToShowStart, this.ToShowStart+11);

    }

    onDatePickerClick(event) {
        this.closeOverlay = this.dateClick;
    }

    showOverlay(inputfield) {
        if (this.appendTo)
            this.domHandler.absolutePosition(this.overlay, inputfield);
        else
            this.domHandler.relativePosition(this.overlay, inputfield);

        this.overlayVisible = true;
        this.overlay.style.zIndex = String(++DomHandler.zindex);

        this.bindDocumentClickListener();
    }

    writeValue(value: any): void {
       
        this.value = value;
        if (value != null && value != "")
        {
            this.selectDate({ selectable: true, day: value });
            this.updateInputfield();
            this.updateUI();
        }
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

    currenthour() {
        let time = this.defaultDate || new Date();
        this.currentHour = time.getHours();
        this.updateTime();
        event.preventDefault();
    }
    currentminute() {
        let minute = this.defaultDate || new Date();
       this.currentMinute = minute.getMinutes();
        this.updateTime();
        event.preventDefault();
    }

     updatedTime() {
       this.currenthour();
       this.currentminute();
       this.closeOverlay = false;       
       event.preventDefault();       
    }

    // Ported from jquery-ui datepicker formatDate    
    formatDate(date, format) {
        if (!date) {
            return "";
        }

        let iFormat,
            lookAhead = (match) => {
                let matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
                if (matches) {
                    iFormat++;
                }
                return matches;
            },
            formatNumber = (match, value, len) => {
                let num = "" + value;
                if (lookAhead(match)) {
                    while (num.length < len) {
                        num = "0" + num;
                    }
                }
                return num;
            },
            formatName = (match, value, shortNames, longNames) => {
                return (lookAhead(match) ? longNames[value] : shortNames[value]);
            },
            output = "",
            literal = false;

        if (date) {
            for (iFormat = 0; iFormat < format.length; iFormat++) {
                if (literal) {
                    if (format.charAt(iFormat) === "'" && !lookAhead("'"))
                        literal = false;
                    else
                        output += format.charAt(iFormat);
                }
                else {
                    switch (format.charAt(iFormat)) {
                        case "d":
                            output += formatNumber("d", date.getDate(), 2);
                            break;
                        case "D":
                              break;
                        case "o":
                            output += formatNumber("o",
                                Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
                            break;
                        case "m":
                            output += formatNumber("m", date.getMonth() + 1, 2);
                            break;
                        case "M":
                        
                            break;
                        case "y":
                            output += (lookAhead("y") ? date.getFullYear() :
                                (date.getFullYear() % 100 < 10 ? "0" : "") + date.getFullYear() % 100);
                            break;
                        case "@":
                            output += date.getTime();
                            break;
                        case "!":
                           
                            break;
                        case "'":
                            if (lookAhead("'"))
                                output += "'";
                            else
                                literal = true;

                            break;
                        default:
                            output += format.charAt(iFormat);
                    }
                }
            }
        }
        return output;
    }

    formatTime(date) {
        if (!date) {
            return '';
        }

        let output = '';
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();       

        output += (hours < 10) ? '0' + hours : hours;
        output += ':';
        output += (minutes < 10) ? '0' + minutes : minutes;

        
        return output;
    }

    parseTime(value) {
        let tokens: string[] = value.split(':');
     
        let h = parseInt(tokens[0]);
        let m = parseInt(tokens[1]);
      
    }

    // Ported from jquery-ui datepicker parseDate 
    parseDate(value, format) {
        if (format == null || value == null) {
            throw "Invalid arguments";
        }

        value = (typeof value === "object" ? value.toString() : value + "");
        if (value === "") {
            return null;
        }

        let iFormat, dim, extra,
            iValue = 0,
            shortYearCutoff = (typeof this.shortYearCutoff !== "string" ? this.shortYearCutoff : new Date().getFullYear() % 100 + parseInt(this.shortYearCutoff, 10)),
            year = -1,
            month = -1,
            day = -1,
            doy = -1,
            literal = false,
            date,
            lookAhead = (match) => {
                let matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
                if (matches) {
                    iFormat++;
                }
                return matches;
            },
            getNumber = (match) => {
                let isDoubled = lookAhead(match),
                    size = (match === "@" ? 14 : (match === "!" ? 20 :
                        (match === "y" && isDoubled ? 4 : (match === "o" ? 3 : 2)))),
                    minSize = (match === "y" ? size : 1),
                    digits = new RegExp("^\\d{" + minSize + "," + size + "}"),
                    num = value.substring(iValue).match(digits);
                if (!num) {
                    throw "Missing number at position " + iValue;
                }
                iValue += num[0].length;
                return parseInt(num[0], 10);
            },
            getName = (match, shortNames, longNames) => {
                let index = -1;
                let arr = lookAhead(match) ? longNames : shortNames;
                let names = [];

                for (let i = 0; i < arr.length; i++) {
                    names.push([i, arr[i]]);
                }
                names.sort((a, b) => {
                    return -(a[1].length - b[1].length);
                });

                for (let i = 0; i < names.length; i++) {
                    let name = names[i][1];
                    if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
                        index = names[i][0];
                        iValue += name.length;
                        break;
                    }
                }

                if (index !== -1) {
                    return index + 1;
                } else {
                    throw "Unknown name at position " + iValue;
                }
            },
            checkLiteral = () => {
                if (value.charAt(iValue) !== format.charAt(iFormat)) {
                    throw "Unexpected literal at position " + iValue;
                }
                iValue++;
            };

        for (iFormat = 0; iFormat < format.length; iFormat++) {
            if (literal) {
                if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
                    literal = false;
                } else {
                    checkLiteral();
                }
            } else {
                switch (format.charAt(iFormat)) {
                    case "d":
                        day = getNumber("d");
                        break;
                    case "D":
                    
                        break;
                    case "o":
                        doy = getNumber("o");
                        break;
                    case "m":
                        month = getNumber("m");
                        break;
                    case "M":
                      
                        break;
                    case "y":
                        year = getNumber("y");
                        break;
                    case "@":
                        date = new Date(getNumber("@"));
                        year = date.getFullYear();
                        month = date.getMonth() + 1;
                        day = date.getDate();
                        break;
                    case "!":
                      
                        year = date.getFullYear();
                        month = date.getMonth() + 1;
                        day = date.getDate();
                        break;
                    case "'":
                        if (lookAhead("'")) {
                            checkLiteral();
                        } else {
                            literal = true;
                        }
                        break;
                    default:
                        checkLiteral();
                }
            }
        }

        if (iValue < value.length) {
            extra = value.substr(iValue);
            if (!/^\s+/.test(extra)) {
                throw "Extra/unparsed characters found in date: " + extra;
            }
        }

        if (year === -1) {
            year = new Date().getFullYear();
        } else if (year < 100) {
            year += new Date().getFullYear() - new Date().getFullYear() % 100 +
                (year <= shortYearCutoff ? 0 : -100);
        }

        if (doy > -1) {
            month = 1;
            day = doy;
            do {
                dim = this.getDaysCountInMonth(year, month - 1);
                if (day <= dim) {
                    break;
                }
                month++;
                day -= dim;
            } while (true);
        }

        date = this.daylightSavingAdjust(new Date(year+1, month - 1, day));
        if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
            throw "Invalid date"; // E.g. 31/02/00
        }
        return date;
    }

    daylightSavingAdjust(date) {
        if (!date) {
            return null;
        }
        date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
        return date;
    }

    updateFilledState() {
        this.filled = this.inputFieldValue && this.inputFieldValue != '';
    }

    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listenGlobal('body', 'click', () => {
                if (this.closeOverlay) {
                    this.overlayVisible = false;
                }

                this.closeOverlay = true;
                this.dateClick = false;
            });
        }
    }

    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
        }
    }

    ngOnDestroy() {
        this.unbindDocumentClickListener();

        if (!this.inline && this.appendTo) {
            this.el.nativeElement.appendChild(this.overlay);
        }
    }

    validate(c: AbstractControl) {
        if (!this._isValid) {
            return { invalidDate: true };
        }

        return null;
    }
}

@NgModule({
    imports: [CommonModule, ButtonModule, InputTextModule],
    exports: [yearviewcalender, ButtonModule, InputTextModule],
    declarations: [yearviewcalender]
})
export class AtparCalendarModule { }