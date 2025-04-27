import Dates from "../Utils/Dates.js";
import TextField from "./TextField.js";
import Events from "../Utils/Events.js";

export default class DatePicker extends TextField {
	static attrs = [...TextField.attrs, "startWeek", "min", "max"];
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
		this.min = this.min || Dates.format('01/01/1900', Dates.D_M_Y, this.format);
		this.max = this.max || Dates.format('31/12/2099', Dates.D_M_Y, this.format);
		this.right = this.right || Array.from(this.childNodes).find(
			(node) => node.nodeType === Node.ELEMENT_NODE && node.getAttribute("slot") == "right"
		) || (() => {
			if(this.readonly == "true" || this.disabled == "true") return null;
			let icon = document.createElement("amr-icon");
			icon.setAttribute("slot", "right");
			icon.setAttribute("value", "calendar_today");
			icon.setAttribute("action", "true");
			icon.classList.add("font-3");
			return icon;
		})();
		super.connectedCallback();
	}
	render() {
		// Dynamics variables
		let me = this;
		me.tmpValue = me.tmpValue || (Dates.isValid(me.value, me.format) ? Dates.format(me.value, me.format, Dates.D_M_Y) : Dates.toText(Dates.today(), Dates.D_M_Y));
		me.endWeek = me.startWeek == 0 ? 6 : me.startWeek - 1;
		me.minDate = Dates.toDate(me.min, me.format);
		me.maxDate = Dates.toDate(me.max, me.format);
		me.currentMonth = Dates.format(me.focusedDate || me.tmpValue, Dates.D_M_Y, Dates.M_Y);
		me.yearsPage = me.yearsPage || 0;
		me.showYear = me.showYear || "false";
		me.visible = me.visible || "false";
		
		super.render();

		// Value
		let calendar = me.querySelector('amr-calendar');
		if(calendar) {
			const observer = new MutationObserver((value) => {
				me.tmpValue = me.querySelector('amr-calendar').getAttribute("value");
				me.render();
			});
			observer.observe(calendar, { attributes: true, attributeFilter: ['value'] });
		}

		// Icon right
		let iconRight = me.querySelector("[slot='right']");
		if(iconRight && iconRight.tagName == "AMR-ICON" && iconRight.getAttribute("action") == "true") {
			iconRight.onClick = () => me.onClick();
		}

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
		let yearButton = me.querySelector('amr-calendar amr-button[name="year-button"]');
		if(yearButton) {
			yearButton.addEventListener("keydown", (event) => {
				if(Events.isTab(event) && Events.isShift(event)){
					event.preventDefault();
					event.stopPropagation();
				}
			});
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
	onClick() {
		if(this.readonly == "true" || this.disabled == "true") return false;
		let me = this;
		me.ignoreChange = true;
		me.visible = "true";
		me.tmpValue = me.value;
		me.ignoreChange = false;
		me.render();
		setTimeout(() => {
			me.querySelector('.calendar-day[tabindex="0"]').focus();
		}, 100);
	}
	onKeydown(event) {
		if(Events.isSpace(event)) {
			this.onClick();
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
	template() {
		return `
			${super.template()}
			${this.visible == "true" ? `
			<div class="datepicker-mask">
				<div class="datepicker-main">
					<div class="datepicker-info">
						<h1>${this.label}</h1>
						<h2>${this.getDisplayedDate()}</h2>
					</div>
					<span class="w-100 h-100 flex-col p-1 gap-1">
						<amr-calendar class="w-100"
							value="${this.tmpValue}"
							format="${this.format}"
							startweek="${this.startWeek}"
							min="${this.min}"
							max="${this.max}"
						>
						</amr-calendar>
						<span class="grid grid-cols-2 w-100 gap-1">
							<amr-button name="close-button" text="Fermer" bordered="false"></amr-button>
							<amr-button name="valid-button" text="Valider" primary="true" bordered="false"></amr-button>
						</span>
					</span>
				</div>
			</div>` : ""}
		`;
	}
	close(){
		let me = this;
		me.visible = 'false';
		me.render();
		setTimeout(() => {
			let input = me.querySelector(".textfield-main input");
			input.focus();
            input.selectionStart = input.selectionEnd = input.value.length;
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
				display: flex;
				justify-content: center;
				align-items: center;
				z-index: 2;
			}
			.datepicker-main {
				display: block;
				width: 450px;
				background-color: var(--secondary-shade1);
				border-radius: 8px;
				box-shadow: 0 6px 25px rgba(126, 126, 126, 0.1);
				overflow: visible;
				transition: transform 0.2s;
			}
			.datepicker-main > .datepicker-info {
				display: block;
                background-color: var(--secondary-shade0);
                padding: 10px 15px;
				border-radius: 8px 8px 0 0;
			}
			.datepicker-main > .datepicker-info > h1 {
				padding: 0;
				margin: 10px 0;
				font-size: 18px;
				font-weight: 100;
				letter-spacing: 2.5px;
				color: var(--dark-shade0);
			}
			.datepicker-main > .datepicker-info > h2 {
				font-size: 30px;
				margin: 10px 0;
				font-weight: 500;
				color: var(--dark-shade0);
			}
		`;
	}
}
