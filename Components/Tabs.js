import BaseElement from "./BaseElement.js";

export default class Tabs extends BaseElement {
    static attrs = [...BaseElement.attrs, "vertical"];
    static selector = "amr-tabs";
    connectedCallback() {
        this.vertical = this.vertical || "false";
        this.tabs = this.tabs || Array.from(this.childNodes)
			.filter((node) => node.nodeType === Node.ELEMENT_NODE && node.localName == "amr-tab")
			.map((node) => {
				return { 
                    label: node.getAttribute("label"),
                    content: node.innerHTML,
                    selected: node.hasAttribute("selected"),
                    disabled: node.hasAttribute("disabled")
                };
			});
        super.connectedCallback();
    }

    render() {
        super.render();

        this.querySelectorAll("amr-button").forEach((button, index) => {
            button.onClick = (event) => {
                if (button.disabled == "true") return;
                this.querySelector(`.tabs-buttons > amr-button.selected`)?.classList.remove("selected");
                button.classList.add("selected");
                this.querySelector(".tab-content.selected")?.classList.remove("selected");
                this.querySelectorAll(".tab-content")[index].classList.add("selected");
                this.fireHandler("change", event);
            };
        });
    }

    template() {
        return `
            <div class="tabs-main w-100 ${this.vertical == "true" ? "vertical" : ""} ${this.cls}" id="${this.key}">
                <div class="tabs-buttons" toolbar>
                    ${this.tabs.map((tab) => `
                        <amr-button 
                            cls="px-3" 
                            class="${tab.selected ? 'selected' : ''}" 
                            ${tab.disabled ? 'disabled="true"' : ''} 
                            text="${tab.label}" 
                            bordered="false"
                        >
                        </amr-button>
                    `).join('')}
                </div>
                <hr/>
                <div class="tabs-content grid">
                    ${this.tabs.map((tab) => `
                        <div class="tab-content flex-col ${tab.selected ? 'selected' : ''}">
                            ${tab.content}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    static style() {
        return `
            .tabs-main {
                flex-direction: column;
                gap: var(--size-1) 0;
            }
            .tabs-main > .tabs-buttons {
                width: 100%;
                height: auto;
                overflow-x: auto;
                overflow-y: hidden;
                flex-direction: row;
                gap: 0 var(--size-1);
                padding: 0 0 2px 0;
            }
            .tabs-main > .tabs-buttons::-webkit-scrollbar,
            .tabs-main > .tabs-content > .tab-content::-webkit-scrollbar {
                height: var(--size-1);
            }
            
            .tabs-main > .tabs-buttons > amr-button.selected > .btn-main {
                background-color: var(--secondary-shade2);
            }
            .tabs-main > hr {
                width: 100%;
                height: 1px;
                margin: 0;
                border: none;
                border-top: 1px solid var(--secondary-shade5);
            }
            .tabs-main > .tabs-content > .tab-content {
                flex: 1;
                grid-area: 1 / 1;
                visibility: hidden;
                overflow: auto;
            }
            .tabs-main > .tabs-content > .tab-content.selected {
                visibility: visible;
            }

            .tabs-main.vertical {
                flex-direction: row;
                gap: 0 var(--size-1);
            }
            .tabs-main.vertical > .tabs-buttons::-webkit-scrollbar,
            .tabs-main.vertical > .tabs-content > .tab-content::-webkit-scrollbar {
                width: var(--size-1);
            }
            .tabs-main.vertical > .tabs-buttons {
                width: auto;
                height: 100%;
                overflow-x: hidden;
                overflow-y: auto;
                flex-direction: column;
                gap: var(--size-1) 0;
                flex-shrink: 0;
                padding: 0 2px var(--size-1) 0;
            }
            .tabs-main.vertical > .tabs-buttons > amr-button > .btn-main {
                justify-content: flex-start;
            }
            .tabs-main.vertical > hr {
                width: 1px;
                height: 100%;
                border-left: 1px solid var(--secondary-shade5);
            }
            .tabs-main.vertical > .tabs-content {
                flex: 1;
                min-width: 0;
            }
        `;
    }
}