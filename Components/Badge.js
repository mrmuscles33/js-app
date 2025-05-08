import BaseElement from "./BaseElement.js";

export default class Badge extends BaseElement {
    static attrs = [...BaseElement.attrs, "text", "color", "bgcolor", "size"];
    static selector = "amr-badge";
    connectedCallback() {
        this.text = this.text || "";
        this.color = this.color || "var(--dark-shade0)";
        this.bgcolor = this.bgcolor || "var(--secondary-shade2)";
        this.size = this.size || "medium";
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
                class="badge-main v-align-items-center p-1 gap-x-1 ${this.cls} ${this.size}" 
                role="status"
                style="background-color: ${this.bgcolor}; color: ${this.color};"
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
			    margin: 0;
			    border-radius: 50px;
			    font-weight: 500;
			    outline: none;
			    white-space: nowrap;
            }
        `;
    }
}