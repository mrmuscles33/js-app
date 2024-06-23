import BaseElement from "./BaseElement.js";

export default class TooltipCustom extends BaseElement {
	static attrs = [...BaseElement.attrs, "position", "text"];
	static counter = 1;
	connectedCallback() {
		this.id = this.id || `tooltip-${TooltipCustom.counter++}`;
		this.position = this.position || "top";
		this.text = this.text || "";
		super.connectedCallback();
	}
	template() {
		return [
			`<span class="tooltip-main tooltip-position-${this.position}">`,
			`	<slot></slot>`,
			`	<div class="tooltip-text">${this.text}</div>`,
			`</span>`,
		];
	}
	style() {
		return [
			...super.style(),
			`.tooltip-main {`,
			`    position: relative;`,
			`    display: inline-flex;`,
			`}`,
			`.tooltip-text {`,
			`	position: absolute;`,
			`	top: 50%;`,
			`	left: 50%;`,
			`	transform: translate(-50%,-50%);`,
			`	background-color: var(--color-background);`,
			`	color: var(--color-font);`,
			`	font-size: 14px;`,
			`	padding: 8px 12px;`,
			`	border-radius: 5px;`,
			`	white-space: nowrap;`,
			`	text-align: center;`,
			`	visibility: hidden;`,
			`	opacity: 0;`,
			`	transition: opacity 0.2s ease-in;`,
			`	z-index: 2;`,
			`}`,
			`.tooltip-main:hover .tooltip-text,`,
			`.tooltip-main:focus-within .tooltip-text {`,
			`	visibility: visible;`,
			`	opacity: 1;`,
			`}`,
			`.tooltip-position-top .tooltip-text{`,
			`	top: -10px;`,
			`	transform: translate(-50%,-100%);`,
			`}`,
			`.tooltip-position-left .tooltip-text{`,
			`	left: -10px;`,
			`	transform: translate(-100%,-50%);`,
			`}`,
			`.tooltip-position-right .tooltip-text{`,
			`	left: calc(100% + 10px);`,
			`	transform: translate(0%,-50%);`,
			`}`,
			`.tooltip-position-bottom .tooltip-text{`,
			`	top: calc(100% + 10px);`,
			`	transform: translate(-50%,0%);`,
			`}`,
			this.styles || "",
		];
	}
}
