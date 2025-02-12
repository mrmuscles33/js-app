import Dates from "../Utils/Dates.js";
import TextField from "./TextField.js";
import Events from "../Utils/Events.js";

export default class DatePicker extends TextField {
	static attrs = [...TextField.attrs, "startWeek", "minDate", "maxDate"];
	static counter = 1;
	static days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
	static months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
	connectedCallback() {
		this.id = this.id || `date-picker-${DatePicker.counter++}`;
		this.iconright = this.readonly ? "" : this.iconright || "today";
		this.format = this.format || Dates.D_M_Y;
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

		// Add event listener
		// Close button
		let closeButton = me.shadowRoot.querySelector('[name="close-button"]');
		closeButton.onClick = () =>  me.close();
		// Valid button
		let validButton = me.shadowRoot.querySelector('[name="valid-button"]');
		validButton.onClick = () =>  me.valid();
		validButton.addEventListener("keydown", (event) => {
			if(Events.isTab(event) && !Events.isShift(event)){
				event.preventDefault();
				event.stopPropagation();
			}
		});
		// Year button
		let yearButton = me.shadowRoot.querySelector('[name="year-button"]');
		yearButton.onClick = () =>  me.onClickYearButton(yearButton);
		yearButton.addEventListener("keydown", (event) => {
			if(Events.isTab(event) && Events.isShift(event)){
				event.preventDefault();
				event.stopPropagation();
			}
		});
		// Previous button
		let previousButton = me.shadowRoot.querySelector('[name="previous-button"]');
		previousButton.onClick = () =>  me.onClickPrevious(previousButton);
		// Next button
		let nextButton = me.shadowRoot.querySelector('[name="next-button"]');
		nextButton.onClick = () =>  me.onClickNext(nextButton);

		if(me.showYear == "true") {
			// Years
			me.shadowRoot.querySelectorAll('.datepicker-year').forEach((year) => {
				year.addEventListener('click', () =>  me.onClickYear(year));
				year.addEventListener('keydown', (event) =>  me.onKeyDownYear(event, year));
				year.addEventListener('keypress', (event) => {
					if(Events.isEnter(event)) {
						year.click();
					}
					event.stopPropagation();
				});
			});
		} else {
			// Days
			me.shadowRoot.querySelectorAll('.datepicker-day').forEach((day) => {
				day.addEventListener('click', () =>  me.onClickDay(day));
				day.addEventListener('keydown', (event) =>  me.onKeyDownDay(event, day));
				day.addEventListener('keypress', (event) => {
					if(event.key == "Enter") {
						day.click();
					}
					event.stopPropagation();
				});
			});
		}
	}
	onClick() {
		let me = this;
		me.ignoreChange = true;
		me.visible = me.visible == "true" ? "false" : "true";
		me.tmpValue = me.value;
		me.focusedDate = me.tmpValue;
		me.focusedYear = Dates.toDate(me.tmpValue, Dates.D_M_Y).getFullYear();
		me.showYear = "false";
		me.shadowRoot.querySelector(".datepicker-mask").classList.add("datepicker-visible");
		me.ignoreChange = false;
		// Wait for animation to finish
		setTimeout(() => {
			me.render();
			setTimeout(() => {
				me.shadowRoot.querySelector('.datepicker-day[tabindex="0"]').focus();
			}, 100);
		}, 200);
	}
	onClickYearButton() {
		let me = this;
		me.showYear = me.showYear == "true" ? "false" : "true";
		// Find the page of the current year
		me.yearsPage = Math.floor((Dates.toDate(me.focusedDate, Dates.D_M_Y).getFullYear() - me.realMinDate.getFullYear()) / 21);
		me.render();
		setTimeout(() => {
			if(me.showYear == "true") {
				me.shadowRoot.querySelector('.datepicker-year[tabindex="0"]').focus();
			} else {
				me.shadowRoot.querySelector('.datepicker-day[tabindex="0"]').focus();
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
			me.shadowRoot.querySelector('[name="previous-button"]').focus();
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
			me.shadowRoot.querySelector('[name="next-button"]').focus();
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
			me.shadowRoot.querySelector('.datepicker-day[tabindex="0"]').focus();
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
				me.shadowRoot.querySelector('.datepicker-day[tabindex="0"]').focus();
			}, 100);
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
				me.shadowRoot.querySelector('.datepicker-year[tabindex="0"]').focus();
			}, 100);
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
		for(var i = this.realMinDate.getFullYear(); i <= this.realMaxDate.getFullYear(); i++){
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
			<div class="datepicker-mask ${this.visible == "true" ? "datepicker-visible" : ""}">
				<div class="datepicker-main">
					<div class="datepicker-info">
						<h1>${this.label}</h1>
						<h2>${this.getDisplayedDate()}</h2>
					</div>
					<div class="datepicker-calendar">
						<toolbar-custom justify="space-between">
							<tooltip-custom position="bottom" text="${this.showYear == "true" ? "Choisir le jour" : "Choisir l'année"}">
								<button-custom text="${this.getDisplayedMonth()}" bordered="false" name="year-button"></button-custom>
							</tooltip-custom>
							<span style="flex:1"></span>
							<tooltip-custom position="bottom" text="${this.showYear == "true" ? "Années précédentes" : "Mois précedent"}">
								<button-custom icon="keyboard_arrow_left" bordered="false" name="previous-button" 
									disabled="${(this.showYear == "true" && this.yearsPage == 0) || (this.showYear == "false" && this.getDisplayedDays().some(d => Dates.toText(d, this.format) == this.minDate))}">
								</button-custom>
							</tooltip-custom>
							<tooltip-custom position="bottom" text="${this.showYear == "true" ? "Années suivantes" : "Mois suivant"}">
								<button-custom icon="keyboard_arrow_right" bordered="false" name="next-button" 
									disabled="${(this.showYear == "true" && this.getDisplayedYears().some(year => year == this.realMaxDate.getFullYear())) || (this.showYear == "false" && this.getDisplayedDays().some(d => Dates.toText(d, this.format) == this.maxDate))}">
								</button-custom>
							</tooltip-custom>
						</toolbar-custom>
						${this.showYear == "true" ? `
						<div class="datepicker-years">
							${this.getDisplayedYears().map((year) => ` 
								<span role="button" class="datepicker-year 
									${year == Dates.today().getFullYear() ? "datepicker-today" : ""}
									${year == Dates.toDate(this.tmpValue, Dates.D_M_Y).getFullYear() ? "datepicker-selected" : ""}"
									tabindex="${
										(this.getDisplayedYears().some(y => y == this.focusedYear) && this.focusedYear == year) ||
										(!this.getDisplayedYears().some(y => y == this.focusedYear) && this.getDisplayedYears()[0] == year)
										? "0" : "-1"
									}"
									value=${year}>${year}</span>
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
										${Dates.toText(day, Dates.D_M_Y) == Dates.toText(Dates.today(), Dates.D_M_Y) ? "datepicker-today" : ""}
										${Dates.toText(day, Dates.D_M_Y) == this.tmpValue ? "datepicker-selected" : ""}
										${day.getMonth() != Dates.toDate(this.currentMonth, Dates.M_Y).getMonth() ? "datepicker-other-month" : ""}
										${(day < this.realMinDate) || (day > this.realMaxDate) ? "datepicker-day-disable" : ""}"
									tabindex="${
										(this.getDisplayedDays().some(d => this.focusedDate == Dates.toText(d, Dates.D_M_Y)) && this.focusedDate == Dates.toText(day, Dates.D_M_Y)) ||
										(!this.getDisplayedDays().some(d => this.focusedDate == Dates.toText(d, Dates.D_M_Y)) && this.getDisplayedDays().find(d => this.realMinDate <= d  && d <= this.realMaxDate) == day)
										? "0" : "-1"
									}"
									value=${Dates.toText(day, Dates.D_M_Y)}>${day.getDate()}</span>
							`).join('')}
						</div>
						`}
						<toolbar-custom gap="10px">
							<button-custom name="close-button" text="Fermer" flex="true" bordered="false" style="flex:1"></button-custom>
							<button-custom name="valid-button" text="Valider" flex="true" primary="true" bordered="false" style="flex:1"></button-custom>
						</toolbar-custom>
					</div>
				</div>
			</div>
		`;
	}
	close(){
		let me = this;
		me.ignoreChange = true;
		me.visible = 'false';
		me.shadowRoot.querySelector(".datepicker-mask").classList.remove("datepicker-visible");
		me.ignoreChange = false;
		// Wait for animation to finish
		setTimeout(() => {
			me.render();
			setTimeout(() => {
				me.shadowRoot.querySelector('.textfield-main input').focus();
			}, 200);
		}, 200);
	}
	valid(){
		let me = this;
		me.value = Dates.format(me.tmpValue, Dates.D_M_Y, me.format);
		me.close();
	}
	style() {
		return `
			${super.style()}
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
			.datepicker-visible {
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
			.datepicker-visible .datepicker-main {
					transform: scale(1);
			}
			.datepicker-info {
                background-color: var(--color-primary);
                color: var(--color-font-selected);
                padding: 10px 15px;
				border-radius: 8px 8px 0 0;
			}
			h1 {
				padding: 0;
				margin: 10px 0;
				font-size: 18px;
				font-weight: 100;
				letter-spacing: 2.5px;
			}
			h2 {
				font-size: 30px;
				margin: 10px 0;
				font-weight: 500;
			}
			.datepicker-calendar {
				width: 100%;
				padding: 10px;
				box-sizing: border-box;
			}
			.datepicker-days,
			.datepicker-years {
					display: grid;
					grid-template-columns: repeat(7, 1fr);
					grid-template-rows: repeat(7, 50px);
					margin: 0 0 10px 0;
			}
			.datepicker-years {
					grid-template-columns: repeat(3, 1fr);
					min-height: 270px;
					grid-auto-rows: minmax(min-content, max-content);
			}
			.datepicker-day,
			.datepicker-year {
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
			span.datepicker-day,
			span.datepicker-year {
					cursor: pointer;
					border-radius: 50px;
					text-decoration: none;
					font-weight: 500;
			}
			span.datepicker-day:hover,
			span.datepicker-year:hover,
			span.datepicker-day:focus-visible,
			span.datepicker-year:focus-visible {
					background-color: var(--color-hover);
					color: var(--color-font);
			}
			span.datepicker-today,
			span.datepicker-day:focus-visible,
			span.datepicker-year:focus-visible {
					border: 2px solid var(--color-font);
					outline: none;
			}
			span.datepicker-other-month,
			span.datepicker-day-disable {
					color: var(--color-font-other);
			}
			span.datepicker-day-disable {
					cursor: not-allowed;
			}
			span.datepicker-selected,
			span.datepicker-selected:hover {
					background-color: var(--color-primary);
					color: var(--color-font-selected);
			}
		`;
	}
}
