import BaseElement from "./BaseElement.js";
import Events from "../Utils/Events.js";

export default class Icon extends BaseElement {
    static attrs = [...BaseElement.attrs, "value", "size", "action"];
    static counter = 1;
    connectedCallback() {
        this.value = this.value || "";
        this.size = this.size || "medium";
        this.key = this.key || `icon-${Icon.counter++}`;
        this.action = this.action || "false";
        super.connectedCallback();
    }
    render() {
        super.render();

        let me = this;
        if(this.action == "true") {
            let icon = me.querySelector("i");
            icon.addEventListener("click", (event) => {
                me.fireHandler("click", event);
            });
            icon.addEventListener("keydown", (event) => {
                if (Events.isEnter(event) || Events.isSpace(event)) {
                    me.fireHandler("click", event);
                    event.preventDefault();
                    event.stopPropagation();
                }
            });
        }
    }
    template() {
        return `
            <i id="${this.key}" 
                class="icon-main material-icons-round ${this.size} ${this.cls}" 
                ${this.action == "true" ? "tabindex='0' role='button'" : "role='img'"}>
                ${this.value}
            </i>`;
    }
    static style() {
        return `
            .icon-main {
                display: block;
                vertical-align: middle;
            }
            .icon-main.small {
                font-size: 12px;
            }
            .icon-main.medium {
                font-size: 24px;
            }
            .icon-main.large {
                font-size: 36px;
            }
        `;
    }
}