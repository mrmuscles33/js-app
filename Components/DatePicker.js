import TextField from "./TextField.js";

export default class DatePicker extends TextField {
	static attrs = [...TextField.attrs];
	static counter = 1;
	connectedCallback() {
		this.id = this.id || `date-picker-${DatePicker.counter++}`;
		this.iconright = this.readonly ? "" : this.iconright || "today";
		super.connectedCallback();
	}
	render() {
		super.render();
	}
	template() {
		return [
			...super.template()
		];
	}
}
