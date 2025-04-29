import BaseElement from "./BaseElement.js";
import Events from "../Utils/Events.js";

export default class Modal extends BaseElement {
    static attrs = [...BaseElement.attrs, "visible"];
    static counter = 1;
    connectedCallback() {
        this.key = this.key || `modal-${Modal.idCounter++}`;
        this.visible = this.visible || "false";
        this.parent = this.parent || "body";
        this.title = this.title || "";
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
        me.addEventListener('click', (event) => {
            if(event.target == me) {
                me.close();
            }
        });
        me.addEventListener('keydown', (event) => {
            if(Events.isEsc(event)) {
                me.close();
            }
        });

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
    close() {
        let me = this;
        me.ignoreChange = true;
        me.visible = "false";
        me.ignoreChange = false;
        setTimeout(() => {
            me.render();
            if (me.caller) {
                me.caller.focus();
            }
        }, 300);
    }
    open(caller) {
        this.caller = caller;
        this.visible = "true";
        setTimeout(() => {
            // Focus first element in modal
            let firstFocusable = this.querySelector('input, select, textarea, button, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }, 100);
    }
    template() {
        let defaultWidth = /\bmax-w-\b/.test(this.cls) ? "" : "max-w-100";
        let defaultHeight = /\bmax-h-+\b/.test(this.cls) ? "" : "max-h-100";
        return `
            <div id="${this.key}" class="modal-main ${defaultWidth} ${defaultHeight} ${this.cls} flex-col m-2 overflow-y-hidden bg-secondary-1 p-2 gap-2">
                <div class="modal-header">${this.header ? this.header.outerHTML : `<h1 class="font-4 font-weight-700">${this.title}</h1>`}</div>
                <div class="modal-content overflow-auto flex-1">${this.content ? this.content.outerHTML : ""}</div>
                <div class="modal-footer">${this.footer ? this.footer.outerHTML : ""}</div>
            </div>
        `;
    }
    static style() {
        return `
            amr-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
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