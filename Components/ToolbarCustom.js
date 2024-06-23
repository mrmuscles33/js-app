import BaseElement from "./BaseElement.js";

export default class ToolbarCustom extends BaseElement {
	static attrs = [...BaseElement.attrs, "justify", "align", "direction", "gap"];
	static counter = 1;
	connectedCallback() {
		this.id = this.id || `toolbar-custom-${ToolbarCustom.counter++}`;
		this.justify = this.justify || "flex-start";
		this.align = this.align || "center";
		this.direction = this.direction || "row";
		this.gap = this.gap || "0";
		super.connectedCallback();
	}
	template() {
		return [
			`<div class="toolbar" role="toolbar" id="${this.id}">`,
			`	<slot></slot>`,
			`</div>`
		];
	}
	style() {
		return [
			...super.style(),
			`.toolbar {`,
			`	width: 100%;`,
			`	display: flex;`,
			`	justify-content: ${this.justify};`,
			`	align-items: ${this.align};`,
			`	flex-direction: ${this.direction};`,
			`	gap: ${this.gap};`,
			`}`,
			this.styles || "",
		];
	}
}
