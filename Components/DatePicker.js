import Dates from "../Utils/Dates.js";
import TextField from "./TextField.js";
import Icon from "./Icon.js";
import Html from "../Utils/Html.js";
import Events from "../Utils/Events.js";

export default class DatePicker extends TextField {
	static attrs = [...TextField.attrs, "startWeek", "min", "max", "opened"];
	static selector = "amr-date";
	static days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
	static months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
	connectedCallback() {
		this.iconright = this.readonly ? "" : this.iconright || "today";
		this.format = this.format || Dates.D_M_Y;
		this.pattern = this.pattern || Dates.getPattern(this.format);
		this.maxlength = this.format.length;
		this.startWeek = this.startWeek || Dates.MONDAY;
		this.min = this.min || Dates.format('01/01/1900', Dates.D_M_Y, this.format);
		this.max = this.max || Dates.format('31/12/2099', Dates.D_M_Y, this.format);
		this.right = this.right || Html.nearest(this, "[slot='right']") || (() => {
			if(this.readonly == "true" || this.disabled == "true") return null;
			return Icon.get({ value: "calendar_today", action: "true", slot: "right"}, ["font-3"]);
		})();
		this.opened = this.opened || "false";
		super.connectedCallback();
	}
	render() {
		// Dynamics variables
		let me = this;
		me.endWeek = me.startWeek == 0 ? 6 : me.startWeek - 1;
		me.minDate = Dates.toDate(me.min, me.format);
		me.maxDate = Dates.toDate(me.max, me.format);
		me.position = me.getBoundingClientRect().top + me.getBoundingClientRect().height + 280 > window.innerHeight ? "top" : "bottom";
		
		super.render();

		let main = me.querySelector(".datepicker-main");
        main.addEventListener("keydown", (event) => {
            if(Events.isEsc(event)) {
                me.close();
            }
            event.stopPropagation();
        });

		let mask = me.querySelector(".datepicker-mask");
        if(mask) {
            mask.addEventListener("click", () => me.close());
        }

		// Icon right
		let iconRight = me.querySelector(".textfield-main [slot='right']");
		if(iconRight && iconRight.localName == "amr-icon" && iconRight.getAttribute("action") == "true") {
			iconRight.onClick = () => me.open();
		}

		let calendar = me.getCalendar();
		if (this.opened == "true" && calendar) {
			calendar.onChange = () => {
				me.value = calendar.value;
				me.close();
				me.onChange();
			};
			calendar.onRender = () => {
				// Lock focus on calendar
				let firstFocusable = Html.tabFirst(calendar);
				if (firstFocusable) {
					firstFocusable.addEventListener("keydown", (event) => {
						if (Events.isTab(event) && Events.isShift(event)) {
							event.preventDefault();
							event.stopPropagation();
						}
					});
				}
				let days = calendar.querySelectorAll(".calendar-day");
				days.forEach(day => {
					day.addEventListener("keydown", (event) => {
						if (Events.isTab(event) && !Events.isShift(event)) {
							event.preventDefault();
							event.stopPropagation();
						}
					});
				});
				let years = calendar.querySelectorAll(".calendar-year");
				years.forEach(year => {
					year.addEventListener("keydown", (event) => {
						if (Events.isTab(event) && !Events.isShift(event)) {
							event.preventDefault();
							event.stopPropagation();
						}
					});
				});
			};
			calendar.render();
		}
	}
	onChange() {
		super.onChange();
		if(this.errormessage == "" && this.value != ""){
			this.errormessage = !Dates.isValid(this.value, this.format) ? "La date n'est pas valide" : "";
		}
		if(this.errormessage == "" && this.value != ""){
			this.errormessage = Dates.toDate(this.value, this.format) < this.minDate || Dates.toDate(this.value, this.format) > this.maxDate ? "La date doit etre comprise entre " + this.min + " et " + this.max : "";
		}
	}
	open() {
        if(this.readonly == "true" || this.disabled == "true") return false;
        let me = this;
        me.opened = "true";
        setTimeout(() => {
			let focus = me.querySelector("amr-calendar .calendar-day.selected");
			if (focus) {
				focus.focus();
			}
        }, 100);
    }
	close() {
		let me = this;
        me.onChange();
        me.opened = "false";
        setTimeout(() => {
            let input = me.querySelector(".datepicker-main .textfield-main input");
            input.focus();
            input.selectionStart = input.selectionEnd = input.value.length;
        }, 100);
	}
	getCalendar() {
		return this.querySelector(`amr-calendar`);
	}
	template() {
		return `
			<div class="datepicker-main relative">
				${super.template()}
				${this.opened == "true" ? `
					<div class="datepicker-mask fixed t-0 l-0 w-100 h-100"></div>
					<div class="datepicker-menu round-1 w-100 min-w-xs absolute l-0 bg-secondary-2 mt-1 p-1 ${this.position}">
						<amr-calendar class="w-100"
							value="${this.value}"
							format="${this.format}"
							startweek="${this.startWeek}"
							min="${this.min}"
							max="${this.max}"
						></amr-calendar>
					</div>
				` : ''}
			</div>
		`;
	}
	static style() {
		return `
            .datepicker-main > .datepicker-mask {
                background-color: transparent;
                z-index: 1;
            }
            .datepicker-main > amr-textfield > {
                display: block;
            }
            .datepicker-main > .datepicker-menu {
                border: 1px solid var(--secondary-shade5);
                z-index: 2;
            }
            .datepicker-main > .datepicker-menu.bottom {
                top: 100%;
                bottom: auto;
                transform: translateY(0);
            }
            .datepicker-main > .datepicker-menu.top {
                top: auto;
                bottom: 100%;
                transform: translateY(-5px);
            }
			.datepicker-main amr-calendar > .calendar-main .btn-main:not(.disabled):hover,
			.datepicker-main amr-calendar > .calendar-main .btn-main:focus-visible {
				background-color: var(--secondary-shade3);
			}
			.datepicker-main amr-calendar > .calendar-main > .calendar-days > .calendar-day:not(.header):hover,
			.datepicker-main amr-calendar > .calendar-main > .calendar-years > .calendar-year:not(.header):hover,
			.datepicker-main amr-calendar > .calendar-main > .calendar-days > .calendar-day:not(.header):focus-visible,
			.datepicker-main amr-calendar > .calendar-main > .calendar-years > .calendar-year:not(.header):focus-visible {
				background-color: var(--secondary-shade3);
			}
		`;
	}
}
