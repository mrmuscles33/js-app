import BaseElement from "./BaseElement.js";

export default class Toolbar extends BaseElement {
	static attrs = [...BaseElement.attrs, "justify", "align", "direction", "gap"];
	static counter = 1;
	connectedCallback() {
		this.key = this.key || `amr-toolbar-${Toolbar.counter++}`;
		this.justify = this.justify || "flex-start";
		this.align = this.align || "center";
		this.direction = this.direction || "row";
		this.gap = this.gap || "0";
		this.slotContent = Array.from(this.childNodes).filter(node => node.nodeType === Node.ELEMENT_NODE);
		super.connectedCallback();
	}
	render() {
		super.render();

		// Slot rendering
		let slot = this.querySelector('.slot');
		this.slotContent.forEach(node => {
			slot.appendChild(node);
		});
	}
	template() {
		return `
			<style>
				.toolbar {
					justify-content: ${this.justify};
					align-items: ${this.align};
					flex-direction: ${this.direction};
					gap: ${this.gap};
				}
			</style>
			<div class="toolbar slot" role="toolbar" id="${this.key}">
			</div>
		`;
	}
	static style() {
		return `
			.toolbar {
				width: 100%;
				display: flex;
			}
		`;
	}
}
