
import {NgModule,Component,ElementRef,AfterViewInit,OnDestroy,OnInit,Input,Output,SimpleChange,EventEmitter,forwardRef,Renderer,trigger,state,style,transition,animate,ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from '../button/button';
import {InputTextModule} from '../inputtext/inputtext';
import { DomHandler } from '../../common/dom/domhandler';
import {AbstractControl, NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor} from '@angular/forms';

export const CALENDAR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AtParCalendar),
  multi: true
};

export const CALENDAR_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => AtParCalendar),
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

	selector: 'atpar-calendar',
	templateUrl: 'atparcalendar.html',
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
	providers: [DomHandler,CALENDAR_VALUE_ACCESSOR,CALENDAR_VALIDATOR]
})
export class AtParCalendar implements AfterViewInit,OnInit,OnDestroy,ControlValueAccessor {
	
	@Input() defaultDate: Date;
	
	@Input() style: string;
	
	@Input() styleClass: string;
	
	@Input() inputStyle: string;
	
	@Input() inputStyleClass: string;
	
	@Input() placeholder: string;
	
	@Input() disabled: any;
	
	@Input() dateFormat: string = 'mm/dd/yy';
		
	@Input() inline: boolean = false;
	
	@Input() showOtherMonths: boolean = true;

	@Input() selectOtherMonths: boolean;
	
	@Input() showIcon: boolean;
	
	@Input() icon: string = 'fa-calendar';
	
	@Input() appendTo: any;
	
	@Input() readonlyInput: boolean;
	
	@Input() shortYearCutoff: any = '+10';
	
	@Input() monthNavigator: boolean;

	@Input() yearNavigator: boolean;

	@Input() yearRange: string;
	
	@Input() showTime: boolean;
	
	@Input() hourFormat: string = '24';
	
	@Input() timeOnly: boolean;
	
	@Input() stepHour: number = 1;
	
	@Input() stepMinute: number = 1;
	
	@Input() stepSecond: number = 1;
	
	@Input() showSeconds: boolean = false;

	@Input() required: boolean;

	@Input() showOnFocus: boolean = true;
	
	@Input() dataType: string = 'date';
	
	@Output() onFocus: EventEmitter<any> = new EventEmitter();
	
	@Output() onBlur: EventEmitter<any> = new EventEmitter();
	
	@Output() onSelect: EventEmitter<any> = new EventEmitter();
	
	@Input() locale: LocaleSettings = {
		firstDayOfWeek: 0,
		dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"],
		monthNames: [ "January","February","March","April","May","June","July","August","September","October","November","December" ],
		monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
	};
	
	@Input() tabindex: number;
	
	@ViewChild('datepicker') overlayViewChild: ElementRef;
	
	value: Date;
	
	dates: any[];
	
	weekDays: string[] = [];
	
	currentMonthText: string;
	
	currentMonth: number;
	
	currentYear: number;
	
	currentHour: number;
	
	currentMinute: number;
	
	currentSecond: number;
	
	pm: boolean;
	
	overlay: HTMLDivElement;
	
	overlayVisible: boolean;
	
	closeOverlay: boolean = true;
	
	dateClick: boolean;
		
	onModelChange: Function = () => {};
	
	onModelTouched: Function = () => {};
	
	calendarElement: any;
	
	documentClickListener: any;
	
	ticksTo1970: number;
	
	yearOptions: number[];
	
	focus: boolean;
	
	filled: boolean;

	inputFieldValue: string = null;
	
	_minDate: Date;
	
	_maxDate: Date;

    _isValid: boolean = true;

    closeDiv: boolean;

    inputTime: string=null;

    currentInputTime: string = null;

    currentInputHour: string=null;



	@Input() get minDate(): Date {
		return this._minDate;
	}
	
	set minDate(date: Date) {
		this._minDate = date;
		this.createMonth(this.currentMonth, this.currentYear);
	}
	
	@Input() get maxDate(): Date {
		return this._maxDate;
	}
	
	set maxDate(date: Date) {
		this._maxDate = date;
		this.createMonth(this.currentMonth, this.currentYear);
	}

	constructor(public el: ElementRef, public domHandler: DomHandler,public renderer: Renderer) {}

	ngOnInit() {
		let date = this.defaultDate||new Date();        
        let dayIndex = this.locale.firstDayOfWeek;
        this.closeDiv = true;
		for(let i = 0; i < 7; i++) {
			this.weekDays.push(this.locale.dayNamesMin[dayIndex]);
			dayIndex = (dayIndex == 6) ? 0 : ++dayIndex;
		}
				
		this.currentMonth = date.getMonth();
		this.currentYear = date.getFullYear();
		if(this.showTime) {
			this.currentMinute = date.getMinutes();
			this.currentSecond = date.getSeconds();
			this.pm = date.getHours() > 11;
			
			if(this.hourFormat == '12')
				this.currentHour = date.getHours() == 0 ? 12 : date.getHours() % 12;
			else
				this.currentHour = date.getHours();
		}
		else if(this.timeOnly) {
			this.currentMinute = 0;
			this.currentHour = 0;
			this.currentSecond = 0;
		}

		this.createMonth(this.currentMonth, this.currentYear);
		
		this.ticksTo1970 = (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
			Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000);
			
		if(this.yearNavigator && this.yearRange) {
			this.yearOptions = [];
			let years = this.yearRange.split(':'),
			yearStart = parseInt(years[0]),
			yearEnd = parseInt(years[1]);
			
			for(let i = yearStart; i <= yearEnd; i++) {
				this.yearOptions.push(i);
			}
		}
    }
    currenthour()
    {
        let time = this.defaultDate || new Date();
        this.currentHour = time.getHours();
        this.updateTime();
        this.currentInputHour = null;
        event.preventDefault();
    }
    currentminute() {
        let minute = this.defaultDate || new Date();
        this.currentMinute = minute.getMinutes();
        this.updateTime();
        this.currentInputTime = null;
        event.preventDefault();
    }
    updatedTime(inputfield)
    {
        this.currentInputTime = inputfield.value;
        this.currentInputHour = inputfield.value;
        this.inputTime = inputfield.value;
        this.currenthour();
        this.currentminute();
        this.closeOverlay = false;
        //this.updatedTime();
        event.preventDefault();

    }
	
	ngAfterViewInit() {
		this.overlay = <HTMLDivElement> this.overlayViewChild.nativeElement;
				
		if(!this.inline && this.appendTo) {
			if(this.appendTo === 'body')
				document.body.appendChild(this.overlay);
			else
				this.domHandler.appendChild(this.overlay, this.appendTo);
		}
	}
	
	createMonth(month: number, year: number) {
		this.dates = [];
		this.currentMonth = month;
		this.currentYear = year;
		this.currentMonthText = this.locale.monthNames[month];
		let firstDay = this.getFirstDayOfMonthIndex(month, year);
		let daysLength = this.getDaysCountInMonth(month, year);
		let prevMonthDaysLength = this.getDaysCountInPrevMonth(month, year);
		let sundayIndex = this.getSundayIndex();
		let dayNo = 1;
		let today = new Date();
				
		for(let i = 0; i < 6; i++) {
			let week = [];
			
			if(i == 0) {
				for(let j = (prevMonthDaysLength - firstDay + 1); j <= prevMonthDaysLength; j++) {
					let prev = this.getPreviousMonthAndYear(month, year);
					week.push({day: j, month: prev.month, year: prev.year, otherMonth: true, 
							today: this.isToday(today, j, prev.month, prev.year), selectable: this.isSelectable(j, prev.month, prev.year)});
				}
				
				let remainingDaysLength = 7 - week.length;
				for(let j = 0; j < remainingDaysLength; j++) {
					week.push({day: dayNo, month: month, year: year, today: this.isToday(today, dayNo, month, year), 
							selectable: this.isSelectable(dayNo, month, year)});
					dayNo++;
				}
			}
			else {
				for (let j = 0; j < 7; j++) {
					if(dayNo > daysLength) {
						let next = this.getNextMonthAndYear(month, year);
						week.push({day: dayNo - daysLength, month: next.month, year: next.year, otherMonth:true,
									today: this.isToday(today, dayNo - daysLength, next.month, next.year),
									selectable: this.isSelectable((dayNo - daysLength), next.month, next.year)});
					}
					else {
						week.push({day: dayNo, month: month, year: year, today: this.isToday(today, dayNo, month, year),
							selectable: this.isSelectable(dayNo, month, year)});
					}
					
					dayNo++;
				}
			}
			
			this.dates.push(week);
		}
	}
	
	prevMonth(event) {
		if(this.disabled) {
			event.preventDefault();
			return;
		}
		
		if(this.currentMonth === 0) {
			this.currentMonth = 11;
			this.currentYear--;
		}
		else {
			this.currentMonth--;
		}
		
		this.createMonth(this.currentMonth, this.currentYear);
		event.preventDefault();
	}
	
	nextMonth(event) {
		if(this.disabled) {
			event.preventDefault();
			return;
		}
		
		if(this.currentMonth === 11) {
			this.currentMonth = 0;
			this.currentYear++;
		}
		else {
			this.currentMonth++;
		}
		
		this.createMonth(this.currentMonth, this.currentYear);
		event.preventDefault();
	}
	
	onDateSelect(event,dateMeta) {
		if(this.disabled || !dateMeta.selectable) {
			event.preventDefault();
			return;
		}
		
		if(dateMeta.otherMonth) {
			if(this.selectOtherMonths)
				this.selectDate(dateMeta);
		}
		else {
			 this.selectDate(dateMeta);
		}
		
		this.dateClick = true;
		this.updateInputfield();
		event.preventDefault();
	}
	
	updateInputfield() {
		if(this.value) {
			let formattedValue;
			
			if(this.timeOnly) {
				formattedValue = this.formatTime(this.value);
			}
			else {
				formattedValue = this.formatDate(this.value, this.dateFormat);
				if(this.showTime) {
					formattedValue += ' ' + this.formatTime(this.value);
				}
			}
			
            this.inputFieldValue = formattedValue;
            if (this.inputTime != null && this.inputTime != undefined && this.inputTime!='') {
                this.inputFieldValue = this.inputTime;
                this.inputTime = null;
            }
            else if (this.currentInputHour != null && this.currentInputHour != undefined && this.currentInputHour != '') {
                this.inputFieldValue = this.currentInputTime;
                this.currentInputTime = null;
            }
            else if (this.currentInputTime != null && this.currentInputTime != undefined && this.currentInputTime != '') {
                this.inputFieldValue = this.currentInputTime;
                this.currentInputTime = null;
            }
            else {
                this.inputFieldValue = formattedValue;
            }
           
		}
		else {
			this.inputFieldValue = '';
		}
		
		this.updateFilledState();
	}
	
	selectDate(dateMeta) {
		this.value = new Date(dateMeta.year, dateMeta.month, dateMeta.day);
		if(this.showTime) {
			if(this.hourFormat === '12' && this.pm && this.currentHour != 12)
				this.value.setHours(this.currentHour + 12);
			else
				this.value.setHours(this.currentHour);

			this.value.setMinutes(this.currentMinute);
			this.value.setSeconds(this.currentSecond);
		}
		this._isValid = true;
		this.updateModel();
		this.onSelect.emit(this.value);
	}
	
	updateModel() {
		if(this.dataType == 'date'){
			this.onModelChange(this.value);
		}
		else if(this.dataType == 'string') {
			if(this.timeOnly)
				this.onModelChange(this.formatTime(this.value));
			else
				this.onModelChange(this.formatDate(this.value, this.dateFormat));
		}
	}
	
	getFirstDayOfMonthIndex(month: number, year: number) {
		let day = new Date();
		day.setDate(1);
		day.setMonth(month);
		day.setFullYear(year);
		
		let dayIndex = day.getDay() + this.getSundayIndex();
		return dayIndex >= 7 ? dayIndex - 7 : dayIndex;
	}
	
	getDaysCountInMonth(month: number, year: number) {
		return 32 - this.daylightSavingAdjust(new Date(year, month, 32)).getDate();
	}
	
	getDaysCountInPrevMonth(month: number, year: number) {
		let prev = this.getPreviousMonthAndYear(month, year);
		return this.getDaysCountInMonth(prev.month, prev.year);
	}
	
	getPreviousMonthAndYear(month: number, year: number) {
		let m, y;
		
		if(month === 0) {
			m = 11;
			y = year - 1;
		}
		else {
			m = month - 1;
			y = year;
		}
		
		return {'month':m,'year':y};
	}
	
	getNextMonthAndYear(month: number, year: number) {
		let m, y;
		
		if(month === 11) {
			m = 0;
			y = year + 1;
		}
		else {
			m = month + 1;
		}
		
		return {'month':m,'year':y};
	}
	
	getSundayIndex() {
		return this.locale.firstDayOfWeek > 0 ? 7 - this.locale.firstDayOfWeek : 0;
	}
	
	isSelected(dateMeta): boolean {     
		if(this.value)
			return this.value.getDate() === dateMeta.day && this.value.getMonth() === dateMeta.month && this.value.getFullYear() === dateMeta.year;
		else
			return false;
	}
	
	isToday(today, day, month, year): boolean {     
		return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
	}
	
	isSelectable(day, month, year): boolean {
		let validMin = true;
		let validMax = true;
		
		if(this.minDate) {
			 if(this.minDate.getFullYear() > year) {
				 validMin = false;
			 }
			 else if(this.minDate.getFullYear() === year) {
				 if(this.minDate.getMonth() > month) {
					 validMin = false;
				 }
				 else if(this.minDate.getMonth() === month) {
					 if(this.minDate.getDate() > day) {
						 validMin = false;
					 }
				 }
			 }  
		}
		
		if(this.maxDate) {
			 if(this.maxDate.getFullYear() < year) {
				 validMax = false;
			 }
			 else if(this.maxDate.getFullYear() === year) {
				 if(this.maxDate.getMonth() < month) {
					 validMax = false;
				 }
				 else if(this.maxDate.getMonth() === month) {
					 if(this.maxDate.getDate() < day) {
						 validMax = false;
					 }
				 }
			 }  
		}
		
		return validMin && validMax;
	}
	
	onInputFocus(inputfield, event) {
        this.focus = true;
        this.closeDiv = true;
		if(this.showOnFocus) {
			this.showOverlay(inputfield);
		}
		this.onFocus.emit(event);
	}
	
	onInputBlur(event) {
		this.focus = false;
		this.onBlur.emit(event);
		this.onModelTouched();
	}
	
	onButtonClick(event,inputfield) {
        this.closeOverlay = false;
        this.closeDiv = true;
		if(!this.overlay.offsetParent) {
			inputfield.focus();
			this.showOverlay(inputfield);
		}
		else
			this.closeOverlay = true;
	}
	
	onInputKeydown(event) {
		if(event.keyCode === 9) {
			this.overlayVisible = false;
		}
	}

    onClose()
    {
        this.closeDiv = false;
    }
	onMonthDropdownChange(m: string) {
		this.currentMonth = parseInt(m);
		this.createMonth(this.currentMonth, this.currentYear);
	}
	
	onYearDropdownChange(y: string) {
		this.currentYear = parseInt(y);
		this.createMonth(this.currentMonth, this.currentYear);
	}
	
	incrementHour(event) {
		let newHour = this.currentHour + this.stepHour;
		if(this.hourFormat == '24')
			this.currentHour = (newHour >= 24) ? (newHour - 24) : newHour;        
		else if(this.hourFormat == '12')
			this.currentHour = (newHour >= 12) ? (newHour - 12) : newHour;
        
		this.updateTime();
				
		event.preventDefault();
	}
	
	decrementHour(event) {
		let newHour = this.currentHour - this.stepHour;
		if(this.hourFormat == '24')
			this.currentHour = (newHour < 0) ? (24 + newHour) : newHour;        
		else if(this.hourFormat == '12')
            this.currentHour = (newHour < 0) ? (12 + newHour) : newHour;
         
		this.updateTime();

		event.preventDefault();
	}
	
	incrementMinute(event) {
		let newMinute = this.currentMinute + this.stepMinute;
		this.currentMinute = (newMinute > 59) ? newMinute - 60 : newMinute;
        
		this.updateTime();
				
		event.preventDefault();
	}
	
	decrementMinute(event) {
		let newMinute = this.currentMinute - this.stepMinute;
		this.currentMinute = (newMinute < 0) ? 60 + newMinute : newMinute;
        
		this.updateTime();
			
		event.preventDefault();
	}
	
	incrementSecond(event) {
		let newSecond = this.currentSecond + this.stepSecond;
		this.currentSecond = (newSecond > 59) ? newSecond - 60 : newSecond;
			
		this.updateTime();
				
		event.preventDefault();
	}
	
	decrementSecond(event) {
		let newSecond = this.currentSecond - this.stepSecond;
		this.currentSecond = (newSecond < 0) ? 60 + newSecond : newSecond;
			
		this.updateTime();
			
		event.preventDefault();
	}
	
    updateTime() {
        if (this.currentHour > 11) {
            this.pm = true;
            this.currentHour = this.currentHour - 12;

        }
        this.value = this.value || new Date();
        if (this.hourFormat.toString() === '12' && this.pm && this.currentHour != 12)
            {
            this.value.setHours(this.currentHour + 12);
        }
        else
        {
            //if (this.currentHour > 11)
            //{ 
            //    this.pm = true;
            //    this.currentHour = this.currentHour - 12;
               
            //}
            this.value.setHours(this.currentHour);
           
        }
        if (this.currentHour == 0 && this.pm) {
            this.currentHour = 12;
        }
		this.value.setMinutes(this.currentMinute);
		this.value.setSeconds(this.currentSecond);
		this.updateModel();
		this.onSelect.emit(this.value);
		this.updateInputfield();
	}
	
	toggleAMPM(event) {
		this.pm = !this.pm;
		this.updateTime();
		event.preventDefault();
	}
	
	onInput(event) {        
		try {
			this.value = this.parseValueFromString(event.target.value);
			this.updateUI();
			this._isValid = true;
		} 
		catch(err) {
			//invalid date
			this.value = null;
			this._isValid = false;
		}
		
		this.updateModel();
		this.updateFilledState();
	}
	
	parseValueFromString(text: string): Date {
		let dateValue;
		let parts: string[] = text.split(' ');
		
		if(this.timeOnly) {
			dateValue = new Date();
			this.populateTime(dateValue, parts[0], parts[1]);
		}
		else {
			if(this.showTime) {
				dateValue = this.parseDate(parts[0], this.dateFormat);
				this.populateTime(dateValue, parts[1], parts[2]);
			}
			else {
				 dateValue = this.parseDate(text, this.dateFormat);
			}
		}
		
		return dateValue;
	}
	
	populateTime(value, timeString, ampm) {
		if(this.hourFormat == '12' && !ampm) {
			throw 'Invalid Time';
		}
		
		this.pm = (ampm === 'PM' || ampm === 'pm');
		let time = this.parseTime(timeString);
		value.setHours(time.hour);
		value.setMinutes(time.minute);
		value.setSeconds(time.second);
	}
	
	updateUI() {
		let val = this.value||this.defaultDate||new Date();
		this.createMonth(val.getMonth(), val.getFullYear());
		
		if(this.showTime||this.timeOnly) {
			let hours = val.getHours();
			
			if(this.hourFormat === '12') {
				if(hours >= 12) {
					this.currentHour = (hours == 12) ? 12 : hours - 12;
				}
				else {
					this.currentHour = (hours == 0) ? 12 : hours;
				}
			}
			else {
				this.currentHour = val.getHours();
			}
			
			this.currentMinute = val.getMinutes();
			this.currentSecond = val.getSeconds();
		}
	}
	
	onDatePickerClick(event) {
		this.closeOverlay = this.dateClick;
	}
	
	showOverlay(inputfield) {
		if(this.appendTo)
			this.domHandler.absolutePosition(this.overlay, inputfield);
		else
			this.domHandler.relativePosition(this.overlay, inputfield);
		
		this.overlayVisible = true;
		this.overlay.style.zIndex = String(++DomHandler.zindex);
		
		this.bindDocumentClickListener();
	}

	writeValue(value: any) : void {
		this.value = value;
		if(this.value && typeof this.value === 'string') {
			this.value = this.parseValueFromString(this.value);
		}
		
		this.updateInputfield();
		this.updateUI();
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
	
	// Ported from jquery-ui datepicker formatDate    
	formatDate(date, format) {
		if(!date) {
			return "";
		}

		let iFormat,
		lookAhead = (match) => {
			let matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
			if(matches) {
				iFormat++;
			}
			return matches;
		},
		formatNumber = (match, value, len) => {
			let num = "" + value;
			if(lookAhead(match)) {
				while (num.length < len) {
					num = "0" + num;
				}
			}
			return num;
		},
		formatName = (match, value, shortNames, longNames) => {
			return (lookAhead(match) ? longNames[ value ] : shortNames[ value ]);
		},
		output = "",
		literal = false;

		if(date) {
			for(iFormat = 0; iFormat < format.length; iFormat++) {
				if(literal) {
					if(format.charAt(iFormat) === "'" && !lookAhead("'"))
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
							output += formatName("D", date.getDay(), this.locale.dayNamesShort, this.locale.dayNames);
							break;
						case "o":
							output += formatNumber("o",
								Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
							break;
						case "m":
							output += formatNumber("m", date.getMonth() + 1, 2);
							break;
						case "M":
							output += formatName("M", date.getMonth(), this.locale.monthNamesShort, this.locale.monthNames);
							break;
						case "y":
							output += (lookAhead("y") ? date.getFullYear() :
								(date.getFullYear() % 100 < 10 ? "0" : "") + date.getFullYear() % 100);
							break;
						case "@":
							output += date.getTime();
							break;
						case "!":
							output += date.getTime() * 10000 + this.ticksTo1970;
							break;
						case "'":
							if(lookAhead("'"))
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
		if(!date) {
			return '';
		}
		
		let output = '';
		let hours = date.getHours();
		let minutes = date.getMinutes();
		let seconds = date.getSeconds();
        if (this.pm)
        {
            if (hours < 12)
            {
                hours += 12;
            }
        }
        if (this.hourFormat == '12' && this.pm && hours != 12) {
            hours = parseInt(hours)- 12;
		}
		
		output += (hours < 10) ? '0' + hours : hours;
		output += ':';
		output += (minutes < 10) ? '0' + minutes : minutes;
		
		if(this.showSeconds) {
			output += ':';
			output += (seconds < 10) ? '0' + seconds : seconds;
		}
		
		if(this.hourFormat == '12') {
			output += this.pm ? ' PM' : ' AM';
		}
		
		return output;
	}
	
	parseTime(value) {
		let tokens: string[] = value.split(':');
		let validTokenLength = this.showSeconds ? 3 : 2;
		
		if(tokens.length !== validTokenLength) {
			throw "Invalid time";
		}
		
		let h = parseInt(tokens[0]);
		let m = parseInt(tokens[1]);
		let s = this.showSeconds ? parseInt(tokens[2]) : null;
		
		if(isNaN(h) || isNaN(m) || h > 23 || m > 59 || (this.hourFormat == '12' && h > 12) || (this.showSeconds && (isNaN(s) || s > 59))) {
			throw "Invalid time";
		}
		else {
			if(this.hourFormat == '12' && h !== 12 && this.pm) {
				h+= 12;
			}
			
			return {hour: h, minute: m, second: s};
		}
	}
	
	// Ported from jquery-ui datepicker parseDate 
	parseDate(value, format) {
		if(format == null || value == null) {
			throw "Invalid arguments";
		}

		value = (typeof value === "object" ? value.toString() : value + "");
		if(value === "") {
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
			if(matches) {
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
			if(!num) {
				throw "Missing number at position " + iValue;
			}
			iValue += num[ 0 ].length;
			return parseInt(num[ 0 ], 10);
		},
		getName = (match, shortNames, longNames) => {
			let index = -1;
			let arr = lookAhead(match) ? longNames : shortNames;
			let names = [];
			
			for(let i = 0; i < arr.length; i++) {
				names.push([i,arr[i]]);
			}
			names.sort((a,b) => {
				return -(a[ 1 ].length - b[ 1 ].length);
			});
			
			for(let i = 0; i < names.length; i++) {
				let name = names[i][1];
				if(value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
					index = names[i][0];
					iValue += name.length;
					break;
				}
			}

			if(index !== -1) {
				return index + 1;
			} else {
				throw "Unknown name at position " + iValue;
			}
		},
		checkLiteral = () => {
			if(value.charAt(iValue) !== format.charAt(iFormat)) {
				throw "Unexpected literal at position " + iValue;
			}
			iValue++;
		};

		for (iFormat = 0; iFormat < format.length; iFormat++) {
			if(literal) {
				if(format.charAt(iFormat) === "'" && !lookAhead("'")) {
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
						getName("D", this.locale.dayNamesShort, this.locale.dayNames);
						break;
					case "o":
						doy = getNumber("o");
						break;
					case "m":
						month = getNumber("m");
						break;
					case "M":
						month = getName("M", this.locale.monthNamesShort, this.locale.monthNames);
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
						date = new Date((getNumber("!") - this.ticksTo1970) / 10000);
						year = date.getFullYear();
						month = date.getMonth() + 1;
						day = date.getDate();
						break;
					case "'":
						if(lookAhead("'")) {
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

		if(iValue < value.length) {
			extra = value.substr(iValue);
			if(!/^\s+/.test(extra)) {
				throw "Extra/unparsed characters found in date: " + extra;
			}
		}

		if(year === -1) {
			year = new Date().getFullYear();
		} else if(year < 100) {
			year += new Date().getFullYear() - new Date().getFullYear() % 100 +
				(year <= shortYearCutoff ? 0 : -100);
		}

		if(doy > -1) {
			month = 1;
			day = doy;
			do {
				dim = this.getDaysCountInMonth(year, month - 1);
				if(day <= dim) {
					break;
				}
				month++;
				day -= dim;
			} while (true);
		}

		date = this.daylightSavingAdjust(new Date(year, month - 1, day));
		if(date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
			throw "Invalid date"; // E.g. 31/02/00
		}
		return date;
	}
	
	daylightSavingAdjust(date) {
		if(!date) {
			return null;
		}
		date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
		return date;
	}
	
	updateFilledState() {
		this.filled = this.inputFieldValue && this.inputFieldValue != '';
	}
	
	bindDocumentClickListener() {
		if(!this.documentClickListener) {
			this.documentClickListener = this.renderer.listenGlobal('body', 'click', () => {
				if(this.closeOverlay) {
					this.overlayVisible = false;
				}
				
				this.closeOverlay = true;
				this.dateClick = false;
			});
		}
	}
	
	unbindDocumentClickListener() {
		if(this.documentClickListener) {
			this.documentClickListener();
		}
	}
		
	ngOnDestroy() {
		this.unbindDocumentClickListener();
		
		if(!this.inline && this.appendTo) {
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
	imports: [CommonModule,ButtonModule,InputTextModule],
	exports: [AtParCalendar,ButtonModule,InputTextModule],
	declarations: [AtParCalendar]
})
export class AtparCalendarModule { }