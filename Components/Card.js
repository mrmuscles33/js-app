import BaseElement from "./BaseElement.js";

export default class Card extends BaseElement {
    static attrs = [...BaseElement.attrs];
    static selector = "amr-card";
    connectedCallback() {
        this.header = this.header || Array.from(this.childNodes).find(
			(node) => node.nodeType === Node.ELEMENT_NODE && node.getAttribute("slot") == "header"
		);
        this.footer = this.footer || Array.from(this.childNodes).find(
            (node) => node.nodeType === Node.ELEMENT_NODE && node.getAttribute("slot") == "footer"
        );
        this.content = this.content || Array.from(this.childNodes).find(
            (node) => node.nodeType === Node.ELEMENT_NODE && node.getAttribute("slot") == "content"
        );
        super.connectedCallback();
    }
    render() {
        super.render();
    }
    template() {
        return `
            <div id="${this.key}" class="card-main w-100 flex-col p-2 gap-2 round-1 ${this.cls}">
                ${this.header ? `<div class="card-header">${this.header.outerHTML}</div>` : ""}
                ${this.content ? `<div class="card-content flex-1">${this.content.outerHTML}</div>` : ""}
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