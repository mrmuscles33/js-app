import BaseElement from "./BaseElement.js";
import Events from "../Utils/Events.js";

export default class Modal extends BaseElement {
    static attrs = [...BaseElement.attrs, "visible", "title", "closable"];
    static selector = "amr-modal";
    connectedCallback() {
        this.visible = this.visible || "false";
        this.title = this.title || "";
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
        super.connectedCallback();
    }
    render() {
        super.render();

        let me = this;
        if(me.closable == "true" && me.visible == "true") {
            me.addEventListener('click', me.onClickMask);
            me.addEventListener('keydown', me.onEscMask);
            let closeButton = me.querySelector(".modal-header > amr-icon[value='close']");
            closeButton.onClick = (event) => me.close(event);
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
        let defaultWidth = /\bmax-w-\b/.test(this.cls) ? "" : "max-w-100";
        let defaultHeight = /\bmax-h-+\b/.test(this.cls) ? "" : "max-h-100";
        return `
            ${this.visible == "true" ? `
                <div id="${this.key}" class="modal-main ${defaultWidth} ${defaultHeight} ${this.cls} flex-col m-2 overflow-y-hidden bg-secondary-1 p-2 gap-2">
                    <div class="modal-header v-align-items-center h-align-between">
                        ${this.header ? this.header.outerHTML : `<h1 class="font-4 font-weight-700">${this.title}</h1>`}
                        ${this.closable == "true" ? `<amr-icon action="true" class="font-3" value="close"></amr-icon>` : ""}
                    </div>
                    <div class="modal-content overflow-y-auto overflow-x-visible flex-1 relative">${this.content ? this.content.outerHTML : ""}</div>
                    <div class="modal-footer">${this.footer ? this.footer.outerHTML : ""}</div>
                </div>
            ` : ""}
        `;
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
            amr-modal .modal-main {
                scale: 0.8;
                transition: scale 0.3s ease-in-out;
                border-radius: 1rem;
            }
            amr-modal[visible="true"] {
                opacity: 1;
                pointer-events: all;
            }
            amr-modal[visible="true"] .modal-main {
                scale: 1;
            }
        `;
    }
}