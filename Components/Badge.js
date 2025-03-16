import BaseElement from "./BaseElement.js";

export default class Badge extends BaseElement {
    static attrs = [...BaseElement.attrs, "text", "color", "bgcolor", "size"];
    static counter = 1;
    connectedCallback() {
        this.text = this.text || "";
        this.color = this.color || "var(--dark-shade0)";
        this.bgcolor = this.bgcolor || "var(--secondary-shade2)";
        this.size = this.size || "medium";
        this.key = this.key || `badge-${Badge.counter++}`;
        this.decoration = Array.from(this.childNodes).find(node => node.nodeType === Node.ELEMENT_NODE && node.getAttribute("slot") == "decoration");
        super.connectedCallback();
    }
    render() {
        super.render();
    }
    template() {
        return `
            <div id="${this.key}" 
                class="badge-main ${this.cls} ${this.size}" 
                role="status"
                style="background-color: ${this.bgcolor}; color: ${this.color};"
            >
                ${this.decoration ? this.decoration.outerHTML : ""}
                ${this.text}
            </div>
        `;
    }
    static style() {
        return `
            .badge-main {
			    margin: 0 5px 5px 0;
			    border-radius: 50px;
			    display: inline-flex;
			    font-weight: 500;
			    outline: none;
			    white-space: nowrap;
				vertical-align: middle;
				align-items: center;
    			justify-content: center;
				position: relative;
            }
            .badge-main.small {
                padding: 7px 14px;
                font-size: 12px;
            }
            .badge-main.small:has(> *[slot="decoration"]) {
                padding-left: 10px;
            }
            .badge-main.medium {
                padding: 9px 18px;
                font-size: 16px;
            }
            .badge-main.medium:has(> *[slot="decoration"]) {
                padding-left: 12px;
            }
            .badge-main.large {
                padding: 12px 24px;
                font-size: 20px;
            }
            .badge-main.large:has(> *[slot="decoration"]) {
                padding-left: 14px;
            }
            .badge-main.small > *[slot="decoration"] {
                margin-right: 5px; 
            }
            .badge-main.medium > *[slot="decoration"] {
                margin-right: 7px; 
            }
            .badge-main.large > *[slot="decoration"] {
                margin-right: 10px; 
            }
        `;
    }
}