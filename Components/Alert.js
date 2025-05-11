import Card from "./Card.js";

export default class Alert extends Card {
    static attrs = [...Card.attrs, "status"];
    static selector = "amr-alert";
    connectedCallback() {
        this.status = this.status || "none";
        this.cls = (this.cls || "") + ` alert-main alert-${this.status}`;
        this.header = this.header || Array.from(this.childNodes).find(
			(node) => node.nodeType === Node.ELEMENT_NODE && node.getAttribute("slot") == "header"
		);
        this.content = this.content || Array.from(this.childNodes).find(
            (node) => node.nodeType === Node.ELEMENT_NODE && node.getAttribute("slot") == "content"
        );
        this.footer = null;
        super.connectedCallback();
    }
    render() {
        super.render();
    }
    static style() {
        return `
            .alert-main {
                --alert-bg-color: var(--status-disabled);
                --alert-color: var(--status-disabled-dark);
                border: 2px solid var(--alert-color);
                background-color: color-mix(in srgb, var(--alert-bg-color) 10%, transparent);
                color: var(--alert-color);
            }
                
            .alert-main.alert-info {
                --alert-bg-color: var(--status-info);
                --alert-color: var(--status-info-dark);
            }
            .alert-main.alert-success {
                --alert-bg-color: var(--status-success);
                --alert-color: var(--status-success-dark);
            }
            .alert-main.alert-warning {
                --alert-bg-color: var(--status-warning);
                --alert-color: var(--status-warning-dark);
            }
            .alert-main.alert-error {
                --alert-bg-color: var(--status-error);
                --alert-color: var(--status-error-dark);
            }

            body[data-theme="dark"] .alert-main {
                --alert-color: var(--status-disabled-light);
            }
            body[data-theme="dark"] .alert-main.alert-info {
                --alert-color: var(--status-info-light);
            }
            body[data-theme="dark"] .alert-main.alert-success {
                --alert-color: var(--status-success-light);
            }
            body[data-theme="dark"] .alert-main.alert-warning {
                --alert-color: var(--status-warning-light);
            }
            body[data-theme="dark"] .alert-main.alert-error {
                --alert-color: var(--status-error-light);
            }
        `;
    }
}