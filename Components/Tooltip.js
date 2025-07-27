import BaseElement from "./BaseElement.js";

export default class Tooltip extends BaseElement {
	static attrs = [...BaseElement.attrs, "text"];
	static selector = "amr-tooltip";
	connectedCallback() {
		this.text = this.text || "";
		super.connectedCallback();
	}
	render() {
		super.render();
	}
	template() {
		return `<div class="tooltip-main round-1 font-2 p-1">${this.text}</div>`;
	}
	static style() {
		return `
			amr-tooltip {
				display: none;
				position: absolute;
				z-index: 9999;
				opacity: 0;
				pointer-events: none;
				top: 0;
				left: 0;
			}
			amr-tooltip.show {
				opacity: 1;
				display: block;
			}
			.tooltip-main {
			    background-color: var(--secondary-shade2);
				border: 1px solid var(--secondary-shade5);
				color: var(--dark-shade0);
			}
		`;
	}
}
