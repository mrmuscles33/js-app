import TextField from "./TextField.js";
import Events from "../Utils/Events.js";

export default class Select extends TextField {
	static attrs = [...TextField.attrs, "limit", "opened", "filter"];
    static counter = 1;
	connectedCallback() {
        this.key = this.key || `amr-select-${Select.counter++}`;
		this.iconright = this.iconright || "arrow_drop_down";
		this.readonly = "true";
        this.limit = this.limit || 1;
		this.opened = this.opened || "false";
        this.filter = this.filter || "";
        this.options = Array.from(this.childNodes)
            .filter(node => node.nodeType === Node.ELEMENT_NODE && node.tagName == "AMR-OPTION")
            .map((node) => {
				return { 
                    value: node.getAttribute("value"), 
                    label: node.innerHTML,
                    selected: node.hasAttribute("selected"),
                    disabled: node.hasAttribute("disabled")
                };
			});
        this.right = this.right || Array.from(this.childNodes).find(
            (node) => node.nodeType === Node.ELEMENT_NODE && node.getAttribute("slot") == "right"
        ) || (() => {
            if(this.disabled == "true") return null;
            let icon = document.createElement("amr-icon");
            icon.setAttribute("slot", "right");
            icon.setAttribute("value", "arrow_drop_down");
            icon.setAttribute("action", "true");
            icon.classList.add("font-3");
            return icon;
        })();
		super.connectedCallback();
	}
	getValue() {
		if (this.limit > 1) {
			return this.selection.length > 0 ? this.selection.length + " élément(s) sélectionné(s)" : "";
		} else {
			return this.selection.length > 0 ? this.options.find((v) => v.value == this.selection[0].value).label : "";
		}
	}
	render() {
		// Dynamics variables
		let me = this;
        me.position = me.getBoundingClientRect().top + me.getBoundingClientRect().height + 390 > window.innerHeight ? "top" : "bottom";
		me.ignoreChange = true;
        me.selection = me.options.filter((option) => option.selected);
		me.value = me.getValue();
        me.errormessage = me.selection.length > me.limit ? "Vous ne pouvez pas sélectionner plus de " + me.limit + " élément(s)" : "";
		me.ignoreChange = false;

		super.render();

        // Icon right
		let iconRight = me.querySelector("[slot='right']");
		if(iconRight && iconRight.tagName == "AMR-ICON" && iconRight.getAttribute("action") == "true") {
			iconRight.onClick = () => me.onClick();
		}

		if (me.disabled == "false") {
            let main = me.querySelector(".droplist-main");
            main.addEventListener("keydown", (event) => {
                if(Events.isEsc(event)) {
                    me.close();
                }
                event.stopPropagation();
            });

			let textfield = me.querySelector(".textfield-main");
			textfield.addEventListener("click", (event) => {
				if (me.opened == "false") {
					me.open();
				}
				event.stopPropagation();
			});

            let mask = me.querySelector(".droplist-mask");
            if(mask) {
                mask.addEventListener("click", () => {
                    me.close();
                });
            }

            let list = me.querySelector("amr-list");
            if(list) {
                let _onSelectItem = list.onSelectItem;
                list.onSelectItem = (value) => {
                    _onSelectItem.call(me, value);
                };
            }

			let options = me.querySelectorAll('amr-list > ul.list-main > li.list-item[tabindex="0"]');
            let lastOption = options.length > 0 ? options[options.length - 1] : null;
            if(lastOption) {
                lastOption.addEventListener("keydown", (event) => {
                    if(Events.isTab(event) && !Events.isShift(event)) {
                        event.preventDefault();
				        event.stopPropagation();
                    }
                });
            }

            let search = me.querySelector(".droplist-menu > amr-text");
            if(search) {
                search.onKeydown = (event) => {
                    if(Events.isTab(event) && (Events.isShift(event) || me.querySelectorAll('amr-list > ul.list-main > li.list-item[tabindex="0"]').length == 0)) {
                        event.preventDefault();
				        event.stopPropagation();
                    }
                };
                search.onInput = () => {
                    clearTimeout(me.typingTimer);
                    me.typingTimer = setTimeout(() => {
                        me.filter = search.value;
                        me.focusSearch();
                    }, 500);
                }
            }
		}
	}
    focusSearch() {
        let input = this.querySelector(".droplist-menu amr-text input");
        input.focus();
        input.selectionStart = input.selectionEnd = input.value.length;
    }
	onClick() {
		this.open();
	}
    open() {
        if(this.disabled == "true") return false;
        let me = this;
        me.opened = "true";
        setTimeout(() => {
            me.focusSearch();
        }, 100);
    }
    close() {
        let me = this;
        me.opened = "false";
        setTimeout(() => {
            me.querySelector(".droplist-main .textfield-main [slot=right]").focus();
        }, 100);
    }
	template() {
        let filteredOptions = this.options.filter(option => option.label.toLowerCase().includes(this.filter.toLowerCase()) && !option.disabled);
		return `
            <div class="droplist-main v-align-item-start" role="listbox">
                ${super.template()}
                ${this.opened == "true" ? `
                <div class="droplist-mask fixed w-100 h-100"></div>
                <div class="droplist-menu flex-col mt-1 p-1 w-100 ${this.position}">
                    <amr-text filled="false" iconleft="search" flex="true" value="${this.filter}"></amr-text>
                    <amr-list limit="${this.limit}" class="max-h-xs mt-1 overflow-y-auto overflow-x-hidden">
                        ${filteredOptions.map((option) =>
                            `<amr-option
                                value="${option.value}" 
                                ${option.disabled ? "disabled" : ""}
                                ${option.selected ? "selected" : ""}
                            >${option.label}</amr-option>`
                        ).join("")}
                    </amr-list>
                    ${filteredOptions.length == 0 ?
                        `<span class="p-1">Aucun élément trouvé</span>` : ""
                    }  
                </div>` 
                : "" }
            </div>
        `;
	}
	static style() {
		return `
            .droplist-main {
                position: relative;
                width: 100%;
            }
            .droplist-main > .droplist-mask {
                top: 0;
                left: 0;
                background-color: transparent;
                z-index: 1;
            }
            .droplist-main > .droplist-menu {
                position: absolute;
                left: 0;
                background-color: var(--secondary-shade2);
                border: 1px solid var(--secondary-shade5);
                border-radius: 10px;
                z-index: 2;
                font-size: 16px;
            }
            .droplist-main > .droplist-menu.bottom {
                top: 100%;
                bottom: auto;
                transform: translateY(0);
            }
            .droplist-main > .droplist-menu.top {
                top: auto;
                bottom: 100%;
                transform: translateY(-5px);
            }
            .droplist-main > .droplist-menu > amr-text {
                display: flex;
            }
            .droplist-main > .droplist-menu .textfield-main {
                margin-right: 0;
            }
            .droplist-main > .droplist-menu > amr-list::-webkit-scrollbar {
                width: 5px;
            }
            .droplist-main > .droplist-menu > amr-list::-webkit-scrollbar-thumb {
                background-color: var(--secondary-shade5);
            }
        `;
	}
}
