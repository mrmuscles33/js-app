import { BaseElement } from "./BaseElement.js";

export class TextField extends BaseElement {
    static attrs = ["value", "placeholder", "type", "bordercolor", "mychange"];
    connectedCallback() {
        super.connectedCallback();
        this.placeholder = this.placeholder || "Text";
    }
    template() {
        return `
            <input 
                type="${this.type || "text"}" 
                value="${this.value || ""}" 
                placeholder="${this.placeholder}" 
                onChange="${this.mychange || function(){}}"
            />`;
    }
    style() {
        return `
            input {
                border: 1px solid ${this.bordercolor || "black"};
            }
        `;
    }
}