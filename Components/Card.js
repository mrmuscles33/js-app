import BaseElement from "./BaseElement.js";
import Html from "../Utils/Html.js";

export default class Card extends BaseElement {
    static attrs = [...BaseElement.attrs];
    static selector = "amr-card";
    connectedCallback() {
        this.header = this.header || Html.nearest(this, "[slot='header']") || null;
        this.footer = this.footer || Html.nearest(this, "[slot='footer']") || null;
        this.content = this.content || Html.nearest(this, "[slot='content']") || null;
        super.connectedCallback();
    }
    render() {
        super.render();
    }
    template() {
        return `
            <div id="${this.key}" class="card-main w-100 flex-col p-2 gap-2 round-1 ${this.cls}">
                ${this.header ? `<div class="card-header">${this.header.outerHTML}</div>` : ""}
                ${this.content ? `<div class="card-content overflow-y-auto overflow-x-visible flex-1 relative">${this.content.outerHTML}</div>` : ""}
                ${this.footer ? `<div class="card-footer">${this.footer.outerHTML}</div>` : ""}
            </div>
        `;
    }
    static style() {
        return `
            .card-main {
                border: 1px solid var(--secondary-shade5);
            }
        `;
    }
}