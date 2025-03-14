import BaseElement from "./BaseElement.js";

export default class Tooltip extends BaseElement {
	static attrs = [...BaseElement.attrs, "position", "text", "test"];
	static counter = 1;
	connectedCallback() {
		this.key = this.key || `tooltip-${Tooltip.counter++}`;
		this.position = this.position || "top";
		this.text = this.text || "";
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
			<span class="slot tooltip-main tooltip-position-${this.position}">
				<div class="tooltip-text">${this.text}</div>
			</span>
		`;
	}
	static style() {
		return `
			.tooltip-main {
			    position: relative;
			    display: inline-flex;
				vertical-align: middle;
			}
			.tooltip-text {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
				background-color: var(--secondary-shade2);
				color: var(--dark-shade0);
				font-size: 14px;
				padding: 8px 12px;
				border-radius: 5px;
				white-space: nowrap;
				text-align: center;
				visibility: hidden;
				opacity: 0;
				transition: opacity 0.2s ease-in;
				z-index: 2;
			}
			.tooltip-main:has(:focus-within, :hover) .tooltip-text {
				visibility: visible;
				opacity: 1;
			}
			.tooltip-position-top .tooltip-text{
				top: -10px;
				transform: translate(-50%,-100%);
			}
			.tooltip-position-left .tooltip-text{
				left: -10px;
				transform: translate(-100%,-50%);
			}
			.tooltip-position-right .tooltip-text{
				left: calc(100% + 10px);
				transform: translate(0%,-50%);
			}
			.tooltip-position-bottom .tooltip-text{
				top: calc(100% + 10px);
				transform: translate(-50%,0%);
			}
		`;
	}
}
