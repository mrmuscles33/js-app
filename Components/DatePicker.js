import Dates from "../Utils/Dates.js";
import Html from "../Utils/Html.js";
import TextField from "./TextField.js";

export default class DatePicker extends TextField {
	static attrs = [...TextField.attrs, "visible", "showYear", "startWeek", "minDate", "maxDate"];
	static counter = 1;
	static days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
	static months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
	connectedCallback() {
		this.id = this.id || `date-picker-${DatePicker.counter++}`;
		this.iconright = this.readonly ? "" : this.iconright || "today";
		this.format = this.format || Dates.D_M_Y;
		this.maxlength = this.format.length;
		this.visible = this.visible || "false";
		this.showYear = this.showYear || "false";
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
		me.currentMonth = Dates.format(me.tmpValue, Dates.D_M_Y, Dates.M_Y)
		
		super.render();

		// Add event listener
		// Close button
		me.closeButton = me.shadowRoot.querySelector('[name="close-button"]');
		me.closeButton.addEventListener('click', me.close.bind(me));

		// Valid button
		me.validButton = me.shadowRoot.querySelector('[name="valid-button"]');
		me.validButton.addEventListener('click', me.valid.bind(me));
	}
	onClick() {
		let me = this;
		me.ignoreChange = true;
		me.visible = me.visible == "true" ? "false" : "true";
		me.tmpValue = me.value;
		me.focusedDate = me.tmpValue;
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
	getDisplayedDate() {
		let date = Dates.toDate(this.value,this.format);
		return DatePicker.days[date.getDay()] + ' ' + date.getDate() + ' ' + DatePicker.months[date.getMonth()] + ' ' + date.getFullYear();
	}
	getDisplayedMonth(){
		let date =  Dates.toDate(this.value, this.format);
		let str = DatePicker.months[date.getMonth()] + ' ' + date.getFullYear();
		return str;
 	}
	getDisplayedDays(){
		var monthYear = Dates.format(this.tmpValue, Dates.D_M_Y, Dates.M_Y);
		// If the first day of month is not the beginning of the week, replace by first day of week
		var initFirstDay = Dates.toDate(monthYear, Dates.M_Y);
		var firstDay = Dates.copy(initFirstDay);
		if(firstDay.getDay() != this.startWeek) {
				if(firstDay.getDay() > this.startWeek) {
						firstDay.setDate(firstDay.getDate() - (firstDay.getDay() - this.startWeek));
				} else {
						firstDay.setDate(firstDay.getDate() - (7 - (this.startWeek - firstDay.getDay())));
				}
		}
		
		// If the last day of month is not the end of the week, replace by last day of week
		var initLastDay = Dates.lastDay(initFirstDay);
		var lastDay = Dates.copy(initLastDay);
		if(lastDay.getDay() != this.endWeek) {
				if(lastDay.getDay() < this.endWeek) {
						lastDay.setDate(lastDay.getDate() + (this.endWeek - lastDay.getDay()));
				} else {
						lastDay.setDate(lastDay.getDate() + (7 - (lastDay.getDay() - this.endWeek)));
				}
		}

		var days = [];
		var oneDay = firstDay;
		while(oneDay <= lastDay) {
				days.push(Dates.copy(oneDay));
				oneDay.setDate(oneDay.getDate() + 1);
		}

		return days;
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
							<tooltip-custom position="bottom" text="${this.showYears == "true" ? "Choisir le jour" : "Choisir l'année"}">
								<button-custom
									text="${this.getDisplayedMonth()}"
									bordered="false"
								></button-custom>
							</tooltip-custom>
							<span style="flex:1"></span>
							<tooltip-custom position="bottom" text="${this.showYears == "true" ? "Années précédentes" : "Mois précedent"}">
								<button-custom icon="keyboard_arrow_left" bordered="false"></button-custom>
							</tooltip-custom>
							<tooltip-custom position="bottom" text="${this.showYears == "true" ? "Années suivantes" : "Mois suivant"}">
								<button-custom icon="keyboard_arrow_right" bordered="false"></button-custom>
							</tooltip-custom>
						</toolbar-custom>
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
								>${day.getDate()}</span>
							`).join('')}
						</div>
						<toolbar-custom gap="10px">
							<button-custom 
								name="close-button" 
								text="Fermer" 
								flex="true" 
								bordered="false" 
								style="flex:1">
							</button-custom>
							<button-custom 
								name="valid-button" 
								text="Valider" 
								flex="true" 
								primary="true" 
								bordered="false" 
								style="flex:1">
							</button-custom>
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
		}, 200);
	}
	valid(){
		let me = this;
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
					margin: 0 0 5px 0;
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
