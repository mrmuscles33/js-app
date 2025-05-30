import Card from "./Card.js";
import Events from "../Utils/Events.js";

export default class Modal extends Card {
    static attrs = [...Card.attrs, "visible", "closable"];
    static selector = "amr-modal";
    connectedCallback() {
        this.visible = this.visible || "false";
        this.closable = this.closable || "true";
        this.header = this.header || Array.from(this.childNodes).find(
			(node) => node.nodeType === Node.ELEMENT_NODE && node.getAttribute("slot") == "header"
		);
        this.footer = this.footer || Array.from(this.childNodes).find(
            (node) => node.nodeType === Node.ELEMENT_NODE && node.getAttribute("slot") == "footer"
        );
        this.content = this.content || Array.from(this.childNodes).find(
            (node) => node.nodeType === Node.ELEMENT_NODE && node.getAttribute("slot") == "content"
        );
        let defaultWidth = /\bmax-w-\b/.test(this.cls) ? "max-w-auto" : "max-w-100";
        let defaultHeight = /\bmax-h-+\b/.test(this.cls) ? "" : "max-h-100";
        this.cls = (this.cls || "") + ` ${defaultWidth} ${defaultHeight} bg-secondary-1`

        super.connectedCallback();
    }
    render() {
        super.render();

        let me = this;
        if(me.closable == "true" && me.visible == "true") {
            me.addEventListener('click', me.onClickMask);
            me.addEventListener('keydown', me.onEscMask);
        }

        // Keep focus in modal
        let focusebleElements = me.querySelectorAll('input, select, textarea, button, [tabindex]:not([tabindex="-1"])');
        let firstFocusable = focusebleElements.length ? focusebleElements[0] : null;
        let lastFocusable = focusebleElements.length ? focusebleElements[focusebleElements.length - 1] : null;
        if (firstFocusable) {
            firstFocusable.addEventListener('keydown', (event) => {
                if (Events.isTab(event) && Events.isShift(event)) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            });
        }
        if (lastFocusable) {
            lastFocusable.addEventListener('keydown', (event) => {
                if (Events.isTab(event) && !Events.isShift(event)) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            });
        }
    }
    onClickMask(event) {
        if(event.target == this && !this.querySelector("amr-modal[visible='true']")) {
            event.preventDefault();
            event.stopPropagation();
            this.close(event);
        }
    }
    onEscMask(event) {
        if(Events.isEsc(event) && !this.querySelector("amr-modal[visible='true']")) {
            event.preventDefault();
            event.stopPropagation();
            this.close(event);
        }
    }
    close(event) {
        let me = this;
        me.ignoreChange = true;
        me.visible = "false";
        me.ignoreChange = false;
        (me.closest(".relative") || document.body).classList.remove("overflow-hidden");
        me.fireHandler("close", event);
        return new Promise((resolve) => setTimeout(() => {
            me.render();
            if (me.caller) {
                me.caller.focus();
            }
            me.fireHandler("closed", event);
            resolve();
        }, 300));
    }
    open(event, caller = event?.target) {
        let me = this;
        me.caller = caller;
        me.visible = "true";
        (me.closest(".relative") || document.body).classList.add("overflow-hidden");
        me.fireHandler("open", event);
        return new Promise((resolve) => setTimeout(() => {
            // Focus first element in modal
            let firstFocusable = me.querySelector('input, select, textarea, button, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
            resolve();
            me.fireHandler("opened", event);
        }, 100));
    }
    template() {
        return this.visible == "true" ? super.template() : "";
    }
    static style() {
        return `
            amr-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
                justify-content: center;
                align-items: center;
                background-color: var(--mask-color);
                backdrop-filter: blur(2px);
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
                pointer-events: none;
            }
            amr-modal .card-main {
                width: auto;
                scale: 0.8;
                transition: scale 0.3s ease-in-out;
                border-color: transparent;
                box-shadow: 0 4px 15px 0 color-mix(in srgb, var(--secondary-shade5) 10%, transparent);
            }
            amr-modal[visible="true"] {
                opacity: 1;
                pointer-events: all;
            }
            amr-modal[visible="true"] .card-main {
                scale: 1;
            }
        `;
    }
}