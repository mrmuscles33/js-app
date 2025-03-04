import Dates from "../Utils/Dates.js";
import TextField from "./TextField.js";
import Events from "../Utils/Events.js";

export default class DatePicker extends TextField {
	static attrs = [...TextField.attrs, "startWeek", "minDate", "maxDate"];
	static counter = 1;
	static days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
	static months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
	connectedCallback() {
		this.key = this.key || `amr-date-${DatePicker.counter++}`;
		this.iconright = this.readonly ? "" : this.iconright || "today";
		this.format = this.format || Dates.D_M_Y;
		this.pattern = this.pattern || Dates.getPattern(this.format);
		this.maxlength = this.format.length;
		this.visible = this.visible || "false";
		this.startWeek = this.startWeek || Dates.MONDAY;
		this.minDate = this.minDate || Dates.format('01/01/1900', Dates.D_M_Y, this.format);
		this.maxDate = this.maxDate || Dates.format('31/12/2099', Dates.D_M_Y, this.format);
		super.connectedCallback();
	}
	render() {
		// Dynamics variables
		let me = this;
		me.tmpValue = me.tmpValue || (Dates.isValid(me.value, me.format) ? Dates.format(me.value, me.format, Dates.D_M_Y) : Dates.toText(Dates.today(), Dates.D_M_Y));
		me.endWeek = me.startWeek == 0 ? 6 : me.startWeek - 1;
		me.realMinDate = Dates.toDate(me.minDate, me.format);
		me.realMaxDate = Dates.toDate(me.maxDate, me.format);
		me.currentMonth = Dates.format(me.focusedDate || me.tmpValue, Dates.D_M_Y, Dates.M_Y);
		me.yearsPage = me.yearsPage || 0;
		me.showYear = me.showYear || "false";
		me.visible = me.visible || "false";
		
		super.render();

		// Close button
		let closeButton = me.querySelector('[name="close-button"]');
		if(closeButton) {
			closeButton.onClick = () =>  me.close();
		}
		
		// Valid button
		let validButton = me.querySelector('[name="valid-button"]');
		if(validButton){
			validButton.onClick = () =>  me.valid();
			validButton.addEventListener("keydown", (event) => {
				if(Events.isTab(event) && !Events.isShift(event)){
					event.preventDefault();
					event.stopPropagation();
				}
			});
		}
		
		// Year button
		let yearButton = me.querySelector('[name="year-button"]');
		if(yearButton) {
			yearButton.onClick = () =>  me.onClickYearButton(yearButton);
			yearButton.addEventListener("keydown", (event) => {
				if(Events.isTab(event) && Events.isShift(event)){
					event.preventDefault();
					event.stopPropagation();
				}
			});
		}
		
		// Previous button
		let previousButton = me.querySelector('[name="previous-button"]');
		if(previousButton) {
			previousButton.onClick = () =>  me.onClickPrevious(previousButton);
		}
		
		// Next button
		let nextButton = me.querySelector('[name="next-button"]');
		if(nextButton) {
			nextButton.onClick = () =>  me.onClickNext(nextButton);
		}

		// Mask
		let mask = me.querySelector('.datepicker-mask');
		if(mask) {
			mask.addEventListener('click', (event) => {
				if(event.target == mask) {
					me.close();
				}
			});
			mask.addEventListener('keydown', (event) => {
				if(Events.isEsc(event)) {
					me.close();
				}
			});
		}

		if(me.showYear == "true") {
			// Years
			me.querySelectorAll('.datepicker-year').forEach((year) => {
				year.addEventListener('click', () =>  me.onClickYear(year));
				year.addEventListener('keydown', (event) =>  me.onKeyDownYear(event, year));
			});
		} else {
			// Days
			me.querySelectorAll('.datepicker-day').forEach((day) => {
				day.addEventListener('click', () =>  me.onClickDay(day));
				day.addEventListener('keydown', (event) =>  me.onKeyDownDay(event, day));
			});
		}
	}
	onChange() {
		super.onChange();
		if(this.errormessage == "" && this.value != ""){
			this.errormessage = !Dates.isValid(this.value, this.format) ? "La date n'est pas valide" : "";
		}
		if(this.errormessage == "" && this.value != ""){
			this.errormessage = Dates.toDate(this.value, this.format) < this.realMinDate || Dates.toDate(this.value, this.format) > this.realMaxDate ? "La date doit etre comprise entre " + this.minDate + " et " + this.maxDate : "";
		}
	}
	onClick() {
		let me = this;
		me.ignoreChange = true;
		me.visible = "true";
		me.tmpValue = me.value;
		me.focusedDate = me.tmpValue;
		me.focusedYear = Dates.toDate(me.tmpValue, Dates.D_M_Y).getFullYear();
		me.showYear = "false";
		me.ignoreChange = false;
		me.render();
		setTimeout(() => {
			me.querySelector('.datepicker-day[tabindex="0"]').focus();
		}, 100);
	}
	onKeydown(event) {
		if(Events.isSpace(event)){
			this.onClick();
			event.preventDefault();
			event.stopPropagation();
		}
	}
	onClickYearButton() {
		let me = this;
		me.showYear = me.showYear == "true" ? "false" : "true";
		// Find the page of the current year
		me.yearsPage = Math.floor((Dates.toDate(me.focusedDate, Dates.D_M_Y).getFullYear() - me.realMinDate.getFullYear()) / 21);
		me.render();
		setTimeout(() => {
			if(me.showYear == "true") {
				me.querySelector('.datepicker-year[tabindex="0"]').focus();
			} else {
				me.querySelector('.datepicker-day[tabindex="0"]').focus();
			}
		}, 100);
	}
	onClickPrevious() {
		let me = this;
		if(me.showYear == "true") {
			if(me.yearsPage > 0) {
				me.yearsPage--;
			}
		} else {
			if(!me.getDisplayedDays().some(d => d == this.realMinDate)) {
				let date = Dates.toDate(me.currentMonth, Dates.M_Y);
				date.setMonth(date.getMonth() - 1);
				me.currentMonth = Dates.toText(date, Dates.M_Y);
			}
			me.focusedDate = Dates.toText(Dates.toDate(me.currentMonth, Dates.M_Y), Dates.D_M_Y);
		}
		me.render();
		setTimeout(() => {
			me.querySelector('[name="previous-button"]').focus();
		}, 100);
	}
	onClickNext() {
		let me = this;
		if(me.showYear == "true") {
			if(me.getDisplayedYears().length == 21) {
				me.yearsPage++;
			}
		} else {
			if(!me.getDisplayedDays().some(d => d == this.realMaxDate)) {
				let date = Dates.toDate(me.currentMonth, Dates.M_Y);
				date.setMonth(date.getMonth() + 1);
				me.currentMonth = Dates.toText(date, Dates.M_Y);
			}
			me.focusedDate = Dates.toText(Dates.toDate(me.currentMonth, Dates.M_Y), Dates.D_M_Y);
		}
		me.render();
		setTimeout(() => {
			me.querySelector('[name="next-button"]').focus();
		}, 100);
	}
	onClickDay(day) {
		let me = this;
		let clickedDate = Dates.toDate(day.getAttribute('value'));
		if(clickedDate < me.realMinDate || clickedDate > me.realMaxDate) return false;
		me.tmpValue = Dates.toText(clickedDate, Dates.D_M_Y);
		me.focusedDate = me.tmpValue;
		me.render();
		setTimeout(() => {
			me.querySelector('.datepicker-day[tabindex="0"]').focus();
		}, 100);
	}
	onClickYear(year) {
		let newDate = Dates.toDate(this.tmpValue, Dates.D_M_Y);
		newDate.setFullYear(year.getAttribute('value'));
		this.ignoreChange = true;
		this.tmpValue = Dates.toText(newDate, Dates.D_M_Y);
		this.focusedDate = this.tmpValue;
		this.currentMonth = Dates.format(this.tmpValue, Dates.D_M_Y, Dates.M_Y);
		this.ignoreChange = false;
		this.onClickYearButton();
	}
	onKeyDownDay(event, day) {
		let me = this;
		let clickedDate = Dates.toDate(day.getAttribute('value'));
		let nextDate = null;
		if(Events.isArrow(event)) {
			if(Events.isArrowRight(event)) {
				nextDate = Dates.addDays(clickedDate, 1);
			} else if(Events.isArrowLeft(event)) {
				nextDate = Dates.addDays(clickedDate, -1);
			} else if(Events.isArrowDown(event)) {
				nextDate = Dates.addDays(clickedDate, 7);
			} else if(Events.isArrowUp(event)) {
				nextDate = Dates.addDays(clickedDate, -7);
			} 
			if(me.realMinDate <= nextDate  && nextDate <= me.realMaxDate) {
				me.focusedDate = Dates.toText(nextDate, Dates.D_M_Y);
			}
			me.render();
			setTimeout(() => {
				me.querySelector('.datepicker-day[tabindex="0"]').focus();
			}, 100);
			event.preventDefault();
			event.stopPropagation();
		} else if(Events.isEnter(event) || Events.isSpace(event)) {
			day.click();
			event.preventDefault();
			event.stopPropagation();
		}
	}
	onKeyDownYear(event, year) {
		let me = this;
		let clickedYear = parseInt(year.getAttribute('value'));
		let nextYear = null;
		if(Events.isArrow(event)) {
			if(Events.isArrowRight(event)) {
				nextYear = clickedYear + 1;
			} else if(Events.isArrowLeft(event)) {
				nextYear = clickedYear - 1;
			} else if(Events.isArrowDown(event)) {
				nextYear = clickedYear + 3;
			} else if(Events.isArrowUp(event)) {
				nextYear = clickedYear - 3;
			}
			if(me.realMinDate.getFullYear() <= nextYear  && nextYear <= me.realMaxDate.getFullYear()) {
				me.focusedYear = nextYear;
			}
			me.yearsPage = Math.floor((me.focusedYear - me.realMinDate.getFullYear()) / 21)
			me.render();
			setTimeout(() => {
				me.querySelector('.datepicker-year[tabindex="0"]').focus();
			}, 100);
			event.preventDefault();
			event.stopPropagation();
		} else if(Events.isEnter(event) || Events.isSpace(event)) {
			year.click();
			event.preventDefault();
			event.stopPropagation();
		}
	}
	getDisplayedDate() {
		let date = Dates.toDate(this.tmpValue,Dates.D_M_Y);
		return DatePicker.days[date.getDay()] + ' ' + date.getDate() + ' ' + DatePicker.months[date.getMonth()] + ' ' + date.getFullYear();
	}
	getDisplayedMonth(){
		let date =  Dates.toDate(this.currentMonth, Dates.M_Y);
		let str = DatePicker.months[date.getMonth()] + ' ' + date.getFullYear();
		return str;
 	}
	getDisplayedDays(){
		// If the first day of month is not the beginning of the week, replace by first day of week
		let initFirstDay = Dates.toDate(this.currentMonth, Dates.M_Y);
		let firstDay = Dates.copy(initFirstDay);
		if(firstDay.getDay() != this.startWeek) {
			if(firstDay.getDay() > this.startWeek) {
				firstDay.setDate(firstDay.getDate() - (firstDay.getDay() - this.startWeek));
			} else {
				firstDay.setDate(firstDay.getDate() - (7 - (this.startWeek - firstDay.getDay())));
			}
		}
		
		// If the last day of month is not the end of the week, replace by last day of week
		let initLastDay = Dates.lastDay(initFirstDay);
		let lastDay = Dates.copy(initLastDay);
		if(lastDay.getDay() != this.endWeek) {
			if(lastDay.getDay() < this.endWeek) {
				lastDay.setDate(lastDay.getDate() + (this.endWeek - lastDay.getDay()));
			} else {
				lastDay.setDate(lastDay.getDate() + (7 - (lastDay.getDay() - this.endWeek)));
			}
		}

		let days = [];
		let oneDay = firstDay;
		while(oneDay <= lastDay) {
			days.push(Dates.copy(oneDay));
			oneDay.setDate(oneDay.getDate() + 1);
		}

		return days;
	}
	getDisplayedYears(){
		let years = [];
		for(let i = this.realMinDate.getFullYear(); i <= this.realMaxDate.getFullYear(); i++){
			years.push(i);
		}
		// Filter years to display only 21 years
		let start = this.yearsPage * 21;
		let end = start + 21;
		years = years.slice(start, end);
		return years;
	}
	getSortedDays() {
		return DatePicker.days.slice(this.startWeek,7).concat(DatePicker.days.slice(0,this.startWeek));
	}
	template() {
		return `
			${super.template()}
			${this.visible == "true" ? `
			<div class="datepicker-mask ${this.visible == "true" ? "datepicker-visible" : ""}">
				<div class="datepicker-main">
					<div class="datepicker-info">
						<h1>${this.label}</h1>
						<h2>${this.getDisplayedDate()}</h2>
					</div>
					<div class="datepicker-calendar">
						<amr-toolbar justify="space-between">
							<amr-tooltip position="bottom" text="${this.showYear == "true" ? "Choisir le jour" : "Choisir l'année"}">
								<amr-button text="${this.getDisplayedMonth()}" bordered="false" name="year-button"></amr-button>
							</amr-tooltip>
							<span style="flex:1"></span>
							<amr-tooltip position="bottom" text="${this.showYear == "true" ? "Années précédentes" : "Mois précedent"}">
								<amr-button icon="keyboard_arrow_left" bordered="false" name="previous-button" 
									disabled="${(this.showYear == "true" && this.yearsPage == 0) || (this.showYear == "false" && this.getDisplayedDays().some(d => Dates.toText(d, this.format) == this.minDate))}">
								</amr-button>
							</amr-tooltip>
							<amr-tooltip position="bottom" text="${this.showYear == "true" ? "Années suivantes" : "Mois suivant"}">
								<amr-button icon="keyboard_arrow_right" bordered="false" name="next-button" 
									disabled="${(this.showYear == "true" && this.getDisplayedYears().some(year => year == this.realMaxDate.getFullYear())) || (this.showYear == "false" && this.getDisplayedDays().some(d => Dates.toText(d, this.format) == this.maxDate))}">
								</amr-button>
							</amr-tooltip>
						</amr-toolbar>
						${this.showYear == "true" ? `
						<div class="datepicker-years">
							${this.getDisplayedYears().map((year) => ` 
							<span role="button" class="datepicker-year 
								${year == Dates.today().getFullYear() ? "today" : ""}
								${year == Dates.toDate(this.tmpValue, Dates.D_M_Y).getFullYear() ? "selected" : ""}"
								tabindex="${
									(this.getDisplayedYears().some(y => y == this.focusedYear) && this.focusedYear == year) ||
									(!this.getDisplayedYears().some(y => y == this.focusedYear) && this.getDisplayedYears()[0] == year)
									? "0" : "-1"
								}"
								value=${year}>
								${year}
							</span>
							`).join('')}
						</div>
						` : `
						<div class="datepicker-days">
							${this.getSortedDays().map((day) => `
							<span class="datepicker-day">${day.substring(0,3)}</span>
							`).join('')}
							${this.getDisplayedDays().map((day) => `
							<span role="button" 
								class="datepicker-day 
									${Dates.toText(day, Dates.D_M_Y) == Dates.toText(Dates.today(), Dates.D_M_Y) ? "today" : ""}
									${Dates.toText(day, Dates.D_M_Y) == this.tmpValue ? "selected" : ""}
									${day.getMonth() != Dates.toDate(this.currentMonth, Dates.M_Y).getMonth() ? "other-month" : ""}
									${(day < this.realMinDate) || (day > this.realMaxDate) ? "disable" : ""}"
								tabindex="${
									(this.getDisplayedDays().some(d => this.focusedDate == Dates.toText(d, Dates.D_M_Y)) && this.focusedDate == Dates.toText(day, Dates.D_M_Y)) ||
									(!this.getDisplayedDays().some(d => this.focusedDate == Dates.toText(d, Dates.D_M_Y)) && this.getDisplayedDays().find(d => this.realMinDate <= d  && d <= this.realMaxDate) == day)
									? "0" : "-1"
								}"
								value=${Dates.toText(day, Dates.D_M_Y)}>
								${day.getDate()}
							</span>
							`).join('')}
						</div>
						`}
						<amr-toolbar gap="10px">
							<amr-button name="close-button" text="Fermer" flex="true" bordered="false" style="flex:1"></amr-button>
							<amr-button name="valid-button" text="Valider" flex="true" primary="true" bordered="false" style="flex:1"></amr-button>
						</amr-toolbar>
					</div>
				</div>
			</div>` : ""}
		`;
	}
	close(){
		let me = this;
		me.visible = 'false';
		me.render();
		setTimeout(() => {
			me.querySelector('.textfield-main input').focus();
		}, 200);
	}
	valid(){
		let me = this;
		me.ignoreChange = true;
		me.value = Dates.format(me.tmpValue, Dates.D_M_Y, me.format);
		me.onChange();
		me.close();
	}
	static style() {
		return `
			.datepicker-mask {
				position: fixed;
				width: 100%;
				height: 100%;
				background-color: var(--mask-color);
				top: 0;
				left: 0;
				backdrop-filter: blur(2px);
				visibility: hidden;
				pointer-events: none;
				opacity: 0;
				transition: 0.2s;
				display: flex;
				justify-content: center;
				align-items: center;
				z-index: 2;
			}
			.datepicker-mask.datepicker-visible {
				visibility: visible;
				pointer-events: auto;
				opacity: 1;
			}
			.datepicker-main {
				width: 450px;
				transform: scale(0.8);
				background-color: var(--color-background);
				border-radius: 8px;
				box-shadow: 0 6px 25px rgba(150,150,150,0.7);
				overflow: visible;
				transition: transform 0.2s;
			}
			.datepicker-mask.datepicker-visible > .datepicker-main {
				transform: scale(1);
			}
			.datepicker-main > .datepicker-info {
                background-color: var(--color-primary);
                color: var(--color-font-selected);
                padding: 10px 15px;
				border-radius: 8px 8px 0 0;
			}
			.datepicker-main > .datepicker-info > h1 {
				padding: 0;
				margin: 10px 0;
				font-size: 18px;
				font-weight: 100;
				letter-spacing: 2.5px;
			}
			.datepicker-main > .datepicker-info > h2 {
				font-size: 30px;
				margin: 10px 0;
				font-weight: 500;
			}
			.datepicker-main > .datepicker-calendar {
				width: 100%;
				padding: 10px;
				box-sizing: border-box;
			}
			.datepicker-main > .datepicker-calendar > .datepicker-days,
			.datepicker-main > .datepicker-calendar > .datepicker-years {
				display: grid;
				grid-template-columns: repeat(7, 1fr);
				grid-template-rows: repeat(7, 50px);
				margin: 0 0 10px 0;
			}
			.datepicker-main > .datepicker-calendar > .datepicker-years {
				grid-template-columns: repeat(3, 1fr);
				min-height: 270px;
				grid-auto-rows: minmax(min-content, max-content);
			}
			.datepicker-main > .datepicker-calendar > .datepicker-days > .datepicker-day,
			.datepicker-main > .datepicker-calendar > .datepicker-years > .datepicker-year {
				text-align: center;
				width: 100%;
				height: 50px;
				display: flex;
				align-items: center;
				justify-content: center;
				box-sizing: border-box;
				user-select: none;
				color: var(--color-font);
			}
			.datepicker-main > .datepicker-calendar > .datepicker-days > .datepicker-day,
			.datepicker-main > .datepicker-calendar > .datepicker-years > .datepicker-year {
				cursor: pointer;
				border-radius: 50px;
				text-decoration: none;
				font-weight: 500;
			}
			.datepicker-main > .datepicker-calendar > .datepicker-days > .datepicker-day:hover,
			.datepicker-main > .datepicker-calendar > .datepicker-years > .datepicker-year:hover,
			.datepicker-main > .datepicker-calendar > .datepicker-days > .datepicker-day:focus-visible,
			.datepicker-main > .datepicker-calendar > .datepicker-years > .datepicker-year:focus-visible {
				background-color: var(--color-hover);
				color: var(--color-font);
			}
			.datepicker-main > .datepicker-calendar > .datepicker-days > .datepicker-day.today,
			.datepicker-main > .datepicker-calendar > .datepicker-days > .datepicker-day:focus-visible,
			.datepicker-main > .datepicker-calendar > .datepicker-years > span.datepicker-year:focus-visible {
				border: 2px solid var(--color-font);
				outline: none;
			}
			.datepicker-main > .datepicker-calendar > .datepicker-days > .datepicker-day.other-month,
			.datepicker-main > .datepicker-calendar > .datepicker-days > .datepicker-day.disable {
				color: var(--color-font-other);
			}
			.datepicker-main > .datepicker-calendar > .datepicker-days > .datepicker-day.disable {
				cursor: not-allowed;
			}
			.datepicker-main > .datepicker-calendar > .datepicker-days > .datepicker-day.selected,
			.datepicker-main > .datepicker-calendar > .datepicker-days > .datepicker-day.selected:hover {
				background-color: var(--color-primary);
				color: var(--color-font-selected);
			}
		`;
	}
}
