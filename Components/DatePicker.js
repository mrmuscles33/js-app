import Dates from "../Utils/Dates.js";
import Html from "../Utils/Html.js";
import TextField from "./TextField.js";

export default class DatePicker extends TextField {
	static attrs = [...TextField.attrs, "visible", "showYear"];
	static counter = 1;
	static days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
	static months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
	connectedCallback() {
		this.id = this.id || `date-picker-${DatePicker.counter++}`;
		this.iconright = this.readonly ? "" : this.iconright || "today";
		this.visible = this.visible || "false";
		this.format = this.format || Dates.D_M_Y;
		this.showYear = this.showYear || "false";
		super.connectedCallback();
	}
	render() {
		let me = this;
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
		me.shadowRoot.querySelector(".datepicker-mask").classList.add("datepicker-visible");
		Html.search("input", me.shadowRoot)[0].focus();
		me.ignoreChange = false;
		// Wait for animation to finish
		setTimeout(() => {
			me.render();
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
							<tooltip-custom position="bottom" text="${this.showYears ? "Choisir le jour" : "Choisir l'année"}">
								<button-custom
									text="${this.getDisplayedMonth()}"
									bordered="false"
								></button-custom>
							</tooltip-custom>
							<span style="flex:1"></span>
							<button-custom icon="keyboard_arrow_left" bordered="false"></button-custom>
							<button-custom icon="keyboard_arrow_right" bordered="false"></button-custom>
						</toolbar-custom>
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
		me.visible = 'false';
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
					overflow: hidden;
					transition: transform 0.2s;
			}
			.datepicker-visible .datepicker-main {
					transform: scale(1);
			}
			.datepicker-info {
                width: 100%;
                background-color: var(--color-primary);
                color: var(--color-font-selected);
                padding: 10px 15px;
			}
			h1 {
				padding: 0;
				margin: 0;
				font-size: 18px;
				font-weight: 100;
				letter-spacing: 2.5px;
			}
			h2 {
				font-size: 30px;
				margin: 0;
				font-weight: 500;
			}
			.datepicker-calendar {
				width: 100%;
				padding: 10px;
				box-sizing: border-box;
			}
		`;
	}
}
