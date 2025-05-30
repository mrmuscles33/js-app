import Dates from "../Utils/Dates.js";
import TextField from "./TextField.js";
import Events from "../Utils/Events.js";
import Icon from "./Icon.js";

export default class DatePicker extends TextField {
	static attrs = [...TextField.attrs, "startWeek", "min", "max"];
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
		this.right = this.right || Array.from(this.childNodes).find(
			(node) => node.nodeType === Node.ELEMENT_NODE && node.getAttribute("slot") == "right"
		) || (() => {
			if(this.readonly == "true" || this.disabled == "true") return null;
			return Icon.get({ value: "calendar_today", action: "true", slot: "right"}, ["font-3"]);
		})();
		super.connectedCallback();
	}
	render() {
		// Dynamics variables
		let me = this;
		me.endWeek = me.startWeek == 0 ? 6 : me.startWeek - 1;
		me.minDate = Dates.toDate(me.min, me.format);
		me.maxDate = Dates.toDate(me.max, me.format);
		
		super.render();

		// Icon right
		let iconRight = me.querySelector(".textfield-main [slot='right']");
		if(iconRight && iconRight.localName == "amr-icon" && iconRight.getAttribute("action") == "true") {
			iconRight.onClick = (event) => me.onClick(event);
		}

		let modal = me.getModal();
		if (modal) {
			modal.onOpened = () => {
				let calendar = me.getCalendar();
				if (calendar) {
					// focus on selected day
					let selectedDay = calendar.querySelector(`.calendar-day.selected`);
					if (selectedDay) {
						selectedDay.focus();
					}
					calendar.onRender = () => {
						// keep focus on modal
						calendar.querySelector("amr-button[name='year-button']").addEventListener('keydown', (event) => {
							if (Events.isTab(event) && Events.isShift(event)) {
								event.preventDefault();
								event.stopPropagation();
							}
						});
					}
				}
			};
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
	onClick(event) {
		if(this.readonly == "true" || this.disabled == "true") return false;
		let me = this;
		let modal = me.getModal();
		me.tmpValue = me.value;
		modal.open(event, me.querySelector(".textfield-main input")).then(() => {
			let calendar = me.getCalendar();
			calendar.onChange = () => {
				modal.querySelector("amr-modal [slot=header] h2").innerHTML = Dates.toFullText(calendar.value, this.format);
				me.tmpValue = calendar.value;
			};
		});
		modal.querySelector("amr-modal [slot=footer] amr-button[name='valid-button']").onClick = () => me.validModal();
		modal.querySelector("amr-modal [slot=footer] amr-button[name='close-button']").onClick = () => me.closeModal();
	}
	validModal() {
		let me = this;
		me.getModal().close().then(() => {
			me.value = me.tmpValue;
		});
	}
	closeModal() {
		let me = this;
		me.getModal().close();
	}
	onKeydown(event) {
		if(Events.isSpace(event)) {
			this.onClick();
			event.preventDefault();
			event.stopPropagation();
		}
	}
	getModal() {
		return this.querySelector(`amr-modal[parent=${this.key}]`);
	}
	getCalendar() {
		let modal = this.getModal();
		if(!modal) return null;
		return modal.querySelector(`amr-calendar`);
	}
	template() {
		return `
			${super.template()}
			<amr-modal cls="min-w-s" parent="${this.key}" visible="${this.visible}">
				<div slot="header" class="flex-col">
					<h1 class="font-3 font-weight-300">${this.label}</h1>
					<h2 class="font-3 font-weight-700">${Dates.toFullText(this.value, this.format)}</h2>
				</div>
				<div slot="content" class="w-100 overflow-x-hidden">
					<amr-calendar class="w-100"
						value="${this.value}"
						format="${this.format}"
						startweek="${this.startWeek}"
						min="${this.min}"
						max="${this.max}"
					></amr-calendar>
				</div>
				<div slot="footer" class="grid grid-cols-2 w-100 gap-1">
					<amr-button name="close-button" text="Fermer" bordered="false"></amr-button>
					<amr-button name="valid-button" text="Valider" primary="true" bordered="false"></amr-button>
				</div>
			</amr-modal>
		`;
	}
	static style() {
		return ``;
	}
}
