import BaseElement from "./BaseElement.js";
import Events from "../Utils/Events.js";

export default class ButtonCustom extends BaseElement {
	static attrs = [...BaseElement.attrs, "text", "icon", "primary", "bordered", "disable", "flex"];
	static counter = 1;
	connectedCallback() {
		this.text = this.text || "";
		this.icon = this.icon || "";
		this.primary = this.primary || "false";
		this.bordered = this.bordered || "true";
		this.disable = this.disable || "false";
		this.flex = this.flex || "false";
		this.id = this.id || `button-${ButtonCustom.counter++}`;
		super.connectedCallback();
	}
	update() {
		// Dynamics variables
		let me = this;

		// The update methods breaks listeners and bindings
		super.update();
            me.button = me.shadowRoot.querySelector("span.btn-main");
            me.button.addEventListener("keyup", (event) => {
                  if(Events.isEnter(event)) {
                        Events.dispatch(me, "click", event, this.getDetail());
                  }
            });

		// Listeners

		// Dispatch event to real component
            me.dispatch(me.input, "click");
            me.dispatch(me.input, "keydown");
	}
	template() {
		return [
            `<span class="btn-main ${this.cls} `,
            `    ${this.icon ? "btn-with-icon" : ""} `,
            `    ${this.primary == "true" ? "primary" : ""} `,
            `    ${this.bordered == "true" ? "border" : ""} `,
            `    ${this.disable == "true" ? "disable" : ""} `,
            `    ${this.flex == "true" ? "flex" : ""}" `,
            `    role="button" `,
            `    tabindex=${this.disable == "true" ? "-1" : "0"}>`,
            `        <span class="btn-icon material-icons-round" role="presentation">${this.icon}</span>`,
            `        <span class="btn-text">${this.text}</span>`,
            `</span>`
        ];
	}
	style() {
		return [
            ...super.style(), 
            `.btn-main {`,
            `    padding: 0 16px;`,
            `    margin: 0 5px 5px 0;`,
            `    height: 36px;`,
            `    color: var(--color-font);`,
            `    border: 1px solid transparent;`,
            `    border-radius: 5px;`,
            `    display: inline-block;`,
            `    line-height: 32px;`,
            `    cursor: pointer;`,
            `    font-weight: 500;`,
            `    user-select: none;`,
            `    text-decoration: none;`,
            `    outline: none;`,
            `    white-space: nowrap;`,
            `    overflow: hidden;`,
            `    text-overflow: ellipsis;`,
            `}`,
            `.btn-main.disable {`,
            `        cursor: not-allowed;`,
            `        opacity: .5;`,
            `}`,
            `.btn-main.primary {`,
            `        background-color: var(--color-primary);`,
            `}`,
            `.btn-main.border {`,
            `        border-color: var(--color-primary);`,
            `}`,
            `.btn-main:hover,`,
            `.btn-main:focus,`,
            `.btn-main:focus-visible {`,
            `        background-color: var(--color-hover);`,
            `}`,
            `.btn-main.primary:hover,`,
            `.btn-main.primary:focus,`,
            `.btn-main.primary:focus-visible {`,
            `        border-color: var(--color-hover);`,
            `}`,
            `.btn-main.flex {`,
            `        flex-grow: 1;`,
            `        text-align: center;`,
            `}`,
            `.btn-with-icon {`,
            `        padding: var(${this.text == "" ? "0 12px" : "0 16px 0 12px"});`,
            `}`,
            `.btn-icon {`,
            `        font-size: inherit;`,
            `        vertical-align: middle;`,
            `        margin: 0;`,
            `        padding: 0;`,
            `}`,
            `.btn-text {`,
            `        letter-spacing: .7px;`,
            `        margin: 0;`,
            `        padding: 0;`,
            `        vertical-align: middle;`,
            `}`,
            this.styles ? this.styles : ""];
	}
}
