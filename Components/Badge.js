import BaseElement from "./BaseElement.js";

export default class Badge extends BaseElement {
    static attrs = [...BaseElement.attrs, "text", "status"];
    static selector = "amr-badge";
    connectedCallback() {
        this.text = this.text || "";
        this.status = this.status || "default";
        this.left = Array.from(this.childNodes).find(node => node.nodeType === Node.ELEMENT_NODE && node.getAttribute("slot") == "left");
        this.right = Array.from(this.childNodes).find(node => node.nodeType === Node.ELEMENT_NODE && node.getAttribute("slot") == "right");
        super.connectedCallback();
    }
    render() {
        super.render();
    }
    template() {
        return `
            <div id="${this.key}" 
                class="badge-main v-align-items-center gap-x-1 round-10 font-weight-500 badge-${this.status} ${this.cls}" 
                role="status"
            >
                ${this.left ? this.left.outerHTML : ""}
                ${this.text}
                ${this.right ? this.right.outerHTML : ""}
            </div>
        `;
    }
    static style() {
        return `
            .badge-main {
			    outline: none;
			    white-space: nowrap;
                background-color: var(--status-disabled-light);
                color: var(--status-disabled-dark);
                padding: 0.5rem 1rem;
            }
            .badge-main:has([slot="left"]) {
                padding-left: 0.5rem;
            }
            .badge-main:has([slot="right"]) {
                padding-right: 0.5rem;
            }
            .badge-main.badge-info {
                background-color: var(--status-info-light);
                color: var(--status-info-dark);
            }
            .badge-main.badge-success {
                background-color: var(--status-success-light);
                color: var(--status-success-dark);
            }
            .badge-main.badge-warning {
                background-color: var(--status-warning-light);
                color: var(--status-warning-dark);
            }
            .badge-main.badge-error {
                background-color: var(--status-error-light);
                color: var(--status-error-dark);
            }


        `;
    }
}