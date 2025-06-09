import Dates from "../Utils/Dates.js";
import BaseElement from "./BaseElement.js";
import Events from "../Utils/Events.js";

export default class Calendar extends BaseElement {
	static attrs = [...BaseElement.attrs, "format", "value", "startWeek", "min", "max", "readonly"];
	static months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
	static selector = "amr-calendar";
	connectedCallback() {
		this.format = this.format || Dates.D_M_Y;
		this.value = this.value || Dates.toText(Dates.today(), this.format);
		this.focusedDate = this.value;
		this.focusedYear = Dates.toDate(this.value, Dates.D_M_Y).getFullYear();
		this.startWeek = this.startWeek || Dates.MONDAY;
		this.min = this.min || Dates.format('01/01/1900', Dates.D_M_Y, this.format);
		this.max = this.max || Dates.format('31/12/2099', Dates.D_M_Y, this.format);
		this.readonly = this.readonly || "false";
		super.connectedCallback();
	}
	render() {
		// Dynamics variables
		let me = this;
		me.endWeek = me.startWeek == 0 ? 6 : me.startWeek - 1;
		me.minDate = Dates.toDate(me.min, me.format);
		me.maxDate = Dates.toDate(me.max, me.format);
		me.currentMonth = Dates.format(me.focusedDate || me.value, Dates.D_M_Y, Dates.M_Y);
		me.yearsPage = me.yearsPage || 0;
		me.showYear = me.showYear || "false";
		
		super.render();

		// Year button
		let yearButton = me.querySelector('[name="year-button"]');
		if(yearButton) {
			yearButton.onClick = () =>  me.onClickYearButton(yearButton);
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

		if(me.showYear == "true") {
			// Years
			me.querySelectorAll('.calendar-year').forEach((year) => {
				year.addEventListener('click', () =>  me.onClickYear(year));
				year.addEventListener('keydown', (event) =>  me.onKeyDownYear(event, year));
			});
		} else {
			// Days
			me.querySelectorAll('.calendar-day:not(.header)').forEach((day) => {
				day.addEventListener('click', (event) =>  me.onClickDay(event, day));
				day.addEventListener('keydown', (event) =>  me.onKeyDownDay(event, day));
			});
		}
	}
	onClickYearButton() {
		let me = this;
		me.showYear = me.showYear == "true" ? "false" : "true";
		// Find the page of the current year
		me.yearsPage = Math.floor((Dates.toDate(me.focusedDate, Dates.D_M_Y).getFullYear() - me.minDate.getFullYear()) / 21);
		me.render();
		setTimeout(() => {
			if(me.showYear == "true") {
				me.querySelector('.calendar-year[tabindex="0"]').focus();
			} else {
				me.querySelector('.calendar-day[tabindex="0"]').focus();
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
			if(!me.getDisplayedDays().some(d => d == this.minDate)) {
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
			if(!me.getDisplayedDays().some(d => d == this.maxDate)) {
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
	onClickDay(event, day) {
		let me = this;
		if(me.readonly == "true") return false;
		let clickedDate = Dates.toDate(day.getAttribute('value'));
		if(clickedDate < me.minDate || clickedDate > me.maxDate) return false;
		me.value = Dates.toText(clickedDate, Dates.D_M_Y);
		me.focusedDate = me.value;
		me.render();
		setTimeout(() => {
			me.querySelector('.calendar-day[tabindex="0"]').focus();
		}, 100);
		me.fireHandler("change", event);
	}
	onClickYear(year) {
		if(this.readonly == "true") return false;
		let newDate = Dates.toDate(this.value, Dates.D_M_Y);
		newDate.setFullYear(year.getAttribute('value'));
		this.ignoreChange = true;
		this.value = Dates.toText(newDate, Dates.D_M_Y);
		this.focusedDate = this.value;
		this.currentMonth = Dates.format(this.value, Dates.D_M_Y, Dates.M_Y);
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
			if(me.minDate <= nextDate  && nextDate <= me.maxDate) {
				me.focusedDate = Dates.toText(nextDate, Dates.D_M_Y);
			}
			me.render();
			setTimeout(() => {
				me.querySelector('.calendar-day[tabindex="0"]').focus();
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
			if(me.minDate.getFullYear() <= nextYear  && nextYear <= me.maxDate.getFullYear()) {
				me.focusedYear = nextYear;
			}
			me.yearsPage = Math.floor((me.focusedYear - me.minDate.getFullYear()) / 21)
			me.render();
			setTimeout(() => {
				me.querySelector('.calendar-year[tabindex="0"]').focus();
			}, 100);
			event.preventDefault();
			event.stopPropagation();
		} else if(Events.isEnter(event) || Events.isSpace(event)) {
			year.click();
			event.preventDefault();
			event.stopPropagation();
		}
	}
	getDisplayedMonth(){
		let date =  Dates.toDate(this.currentMonth, Dates.M_Y);
		let str = Dates.MONTHS[date.getMonth()] + ' ' + date.getFullYear();
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
		for(let i = this.minDate.getFullYear(); i <= this.maxDate.getFullYear(); i++){
			years.push(i);
		}
		// Filter years to display only 21 years
		let start = this.yearsPage * 21;
		let end = start + 21;
		years = years.slice(start, end);
		return years;
	}
	getSortedDays() {
		return Dates.DAYS.slice(this.startWeek,7).concat(Dates.DAYS.slice(0,this.startWeek));
	}
	template() {
		return `
			<div class="calendar-main w-100 flex-col ${this.readonly == "true" ? "readonly" : ""}">
				<span class="gap-1">
					<amr-button 
						tooltip="${this.showYear == "true" ? "Choisir le jour" : "Choisir l'année"}"
						text="${this.getDisplayedMonth()}" 
						bordered="false" 
						name="year-button" 
						disabled="${this.readonly}">
					</amr-button>
					<span style="flex:1"></span>
					${this.readonly == "true" ? "" : `
						<amr-button 
							tooltip="${this.showYear == "true" ? "Années précédentes" : "Mois précedent"}"
							bordered="false" 
							name="previous-button" 
							disabled="${(this.showYear == "true" && this.yearsPage == 0) || (this.showYear == "false" && this.getDisplayedDays().some(d => Dates.toText(d, this.format) == this.min))}"
						>
							<amr-icon value="keyboard_arrow_left" slot="content" class="font-3"></amr-icon>
						</amr-button>
						<amr-button 
							tooltip="${this.showYear == "true" ? "Années suivantes" : "Mois suivant"}"
							bordered="false" 
							name="next-button" 
							disabled="${(this.showYear == "true" && this.getDisplayedYears().some(year => year == this.maxDate.getFullYear())) || (this.showYear == "false" && this.getDisplayedDays().some(d => Dates.toText(d, this.format) == this.max))}"
						>
							<amr-icon value="keyboard_arrow_right" slot="content" class="font-3"></amr-icon>
						</amr-button>
					`}
				</span>
				${this.showYear == "true" ? `
				<div class="calendar-years w-100 ratio-1 grid grid-cols-3 grid-rows-7 v-align-items-center h-align-items-center">
					${this.getDisplayedYears().map((year) => ` 
					<span role="button" class="calendar-year round-10 w-100 h-100 v-align-items-center h-align-center
						${year == Dates.today().getFullYear() ? "today" : ""}
						${year == Dates.toDate(this.value, Dates.D_M_Y).getFullYear() ? "selected" : ""}"
						tabindex="${this.readonly == "false" && 
							((this.getDisplayedYears().some(y => y == this.focusedYear) && this.focusedYear == year) ||
							(!this.getDisplayedYears().some(y => y == this.focusedYear) && this.getDisplayedYears()[0] == year))
							? "0" : "-1"
						}"
						value=${year}>
						${year}
					</span>
					`).join('')}
				</div>
				` : `
				<div class="calendar-days w-100 ratio-1 grid grid-cols-7 grid-rows-7 v-align-items-center h-align-items-center">
					${this.getSortedDays().map((day) => `
					<span class="calendar-day header">${day.substring(0,3) + '.'}</span>
					`).join('')}
					${this.getDisplayedDays().map((day) => `
					<span role="button" 
						class="calendar-day round-10 w-100 h-100 v-align-items-center h-align-center
							${Dates.toText(day, Dates.D_M_Y) == Dates.toText(Dates.today(), Dates.D_M_Y) ? "today" : ""}
							${Dates.toText(day, Dates.D_M_Y) == this.value ? "selected" : ""}
							${day.getMonth() != Dates.toDate(this.currentMonth, Dates.M_Y).getMonth() ? "other-month" : ""}
							${(day < this.minDate) || (day > this.maxDate) ? "disable" : ""}"
						tabindex="${this.readonly == "false" && 
							((this.getDisplayedDays().some(d => this.focusedDate == Dates.toText(d, Dates.D_M_Y)) && this.focusedDate == Dates.toText(day, Dates.D_M_Y)) ||
							(!this.getDisplayedDays().some(d => this.focusedDate == Dates.toText(d, Dates.D_M_Y)) && this.getDisplayedDays().find(d => this.minDate <= d  && d <= this.maxDate) == day))
							? "0" : "-1"
						}"
						value=${Dates.toText(day, Dates.D_M_Y)}>
						${day.getDate()}
					</span>
					`).join('')}
				</div>
				`}
			</div>
		`;
	}
	static style() {
		return `
			.calendar-main > .calendar-days > .calendar-day,
			.calendar-main > .calendar-years > .calendar-year {
				user-select: none;
				color: var(--dark-shade0);
				text-decoration: none;
				font-weight: 500;
				border: 2px solid transparent;
				cursor: pointer;
			}
			.calendar-main.readonly > .calendar-days > .calendar-day,
			.calendar-main.readonly > .calendar-years > .calendar-year {
				cursor: initial;
				pointer-events: none;
			}
			.calendar-main > .calendar-days > .calendar-day:not(.header):hover,
			.calendar-main > .calendar-years > .calendar-year:not(.header):hover,
			.calendar-main > .calendar-days > .calendar-day:not(.header):focus-visible,
			.calendar-main > .calendar-years > .calendar-year:not(.header):focus-visible {
				background-color: var(--secondary-shade2);
			}
			.calendar-main > .calendar-days > .calendar-day.today,
			.calendar-main > .calendar-days > .calendar-day:focus-visible,
			.calendar-main > .calendar-years > span.calendar-year:focus-visible {
				border-color: var(--secondary-shade3);
				outline: none;
			}
			.calendar-main > .calendar-days > .calendar-day.other-month,
			.calendar-main > .calendar-days > .calendar-day.disable {
				color: var(--secondary-shade4);
			}
			.calendar-main > .calendar-days > .calendar-day.disable {
				cursor: not-allowed;
			}
			.calendar-main > .calendar-days > .calendar-day.selected,
			.calendar-main > .calendar-days > .calendar-day.selected:hover,
			.calendar-main > .calendar-years > .calendar-year.selected,
			.calendar-main > .calendar-years > .calendar-year.selected:hover {
				color: var(--primary-shade0);
				border-color: var(--primary-shade0);
			}
		`;
	}
}
