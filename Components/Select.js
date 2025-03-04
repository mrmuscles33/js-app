import TextField from "./TextField.js";
import Events from "../Utils/Events.js";

export default class Select extends TextField {
	static attrs = [...TextField.attrs, "selection", "limit", "options", "opened", "filter"];
	connectedCallback() {
		this.iconright = this.iconright || "arrow_drop_down";
		this.selection = this.selection || "[]"; // ["1", "2"]
		this.limit = this.limit || 1;
		this.options = this.options || "[]"; // [{value: "1", label: "Option 1"}, {value: "2", label: "Option 2"}]
		this.readonly = "true";
		this.opened = this.opened || "false";
        this.filter = this.filter || "";
		super.connectedCallback();
	}
	getValue() {
		if (this.limit > 1) {
			return this.arrSelection.length > 0 ? this.arrSelection.length + " élément(s) sélectionné(s)" : "";
		} else {
			return this.arrSelection.length > 0 ? this.arrOptions.find((v) => v.value == this.arrSelection[0]).label : "";
		}
	}
	render() {
		// Dynamics variables
		let me = this;
        me.position = me.getBoundingClientRect().top + me.getBoundingClientRect().height + 250 > window.innerHeight ? "top" : "bottom";
		me.arrSelection = JSON.parse(me.selection);
		me.arrOptions = JSON.parse(me.options);
		me.ignoreChange = true;
		me.value = me.getValue();
        me.errormessage = me.arrSelection.length > me.limit ? "Vous ne pouvez pas sélectionner plus de " + me.limit + " élément(s)" : "";
		me.ignoreChange = false;

		super.render();

		if (me.disabled == "false") {
            let main = me.querySelector(".droplist-main");
            main.addEventListener("keyup", (event) => {
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
                mask.addEventListener("click", (event) => {
                    me.close();
                });
            }

			let options = me.querySelectorAll('.droplist-option[tabindex="0"]');
			options.forEach((option) => {
				option.addEventListener("click", () => me.select(option));
                option.addEventListener("keydown", (event) => {
                    if(Events.isEnter(event) || Events.isSpace(event)) {
                        event.target.click();
                    }
                });
			});
            let lastOption = options.length > 0 ? options[options.length - 1] : null;
            if(lastOption) {
                lastOption.addEventListener("keydown", (event) => {
                    if(Events.isTab(event) && !Events.isShift(event)) {
                        event.preventDefault();
				        event.stopPropagation();
                    }
                });
            }

            let search = me.querySelector(".droplist-menu amr-text");
            if(search) {
                search.onKeydown = (event) => {
                    if(Events.isTab(event) && Events.isShift(event)) {
                        event.preventDefault();
				        event.stopPropagation();
                    }
                };
                search.onInput = () => {
                    clearTimeout(me.typingTimer);
                    me.typingTimer = setTimeout(() => {
                        me.filter = search.value;
                        me.querySelector(".droplist-menu amr-text").focus();
                        let input = me.querySelector(".droplist-menu amr-text input");
                        input.selectionStart = input.selectionEnd = input.value.length;
                    }, 500);
                }
            }
		}
	}
    select(option) {
        let me = this;
        let opt = me.arrOptions.find((v) => v.value == option.getAttribute("value"));
        me.ignoreChange = true;
        if (me.limit == 1) {
            me.arrSelection = [opt.value];
            me.close();
        } else {
            if (me.arrSelection.find((v) => v == opt.value)) {
                me.arrSelection = me.arrSelection.filter((v) => v != opt.value);
            } else if (me.arrSelection.length < me.limit) {
                me.arrSelection = [...me.arrSelection, opt.value];
            }
            setTimeout(() => {
                me.querySelector(".droplist-menu .droplist-option[value='" + opt.value + "']").focus();
            }, 100);
        }
        me.ignoreChange = false;
        me.selection = JSON.stringify(me.arrSelection);
    }
	onClick() {
		this.open();
	}
    open() {
        let me = this;
        me.opened = "true";
        setTimeout(() => {
            me.querySelector(".droplist-menu amr-text").focus();
        }, 100);
    }
    close() {
        let me = this;
        me.opened = "false";
        setTimeout(() => {
            me.querySelector(".droplist-main .textfield-main .textfield-icon-right").focus();
        }, 100);
    }
	template() {
		return `
            <div class="droplist-main" role="listbox">
                ${super.template()}
                ${this.opened == "true" ? `
                <div class="droplist-mask"></div>
                <div class="droplist-menu ${this.position}">
                    <amr-text filled="false" iconleft="search" flex="true" value="${this.filter}"></amr-text>
                    <ul class="droplist-options">
                        ${this.arrOptions.filter((option) => option.label.toLowerCase().includes(this.filter.toLowerCase())).map((option) => `
                        <li role="option" class="droplist-option 
                            ${this.arrSelection.find((v) => v == option.value) ? "selected" : ""}
                            ${this.limit > 1 && this.limit == this.arrSelection.length && !this.arrSelection.find((v) => v == option.value) ? "disabled" : ""}"
                            value="${option.value}" 
                            ${this.limit == 1 || this.limit != this.arrSelection.length || this.arrSelection.find((v) => v == option.value) ? "tabindex='0'" : ""}
                        >
                            ${option.label}
                            ${this.arrSelection.find((v) => v == option.value) ? "<span class='material-icons-round'>check</span>" : ""}
                        </li>
                        `).join("")}
                    </ul>
                </div>` 
                : "" }
            </div>
        `;
	}
	static style() {
		return `
            .droplist-main {
                position: relative;
                display: inline-block;
            }
            .droplist-main > .droplist-mask {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: transparent;
                z-index: 1;
            }
            .droplist-main > .droplist-menu {
                position: absolute;
                left: 0;
                width: calc(100% - 5px);
                background-color: var(--color-background);
                border: 1px solid var(--color);
                margin: 0;
                padding: 5px 5px 0 5px;
                border-radius: 10px;
                z-index: 2;
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
            .droplist-main > .droplist-menu > .droplist-options {
                width: 100%;
                max-height: 200px;
                overflow-y: auto;
                overflow-x: hidden;
                margin: 0;
                padding: 0;
                list-style-type: none;
            }
            .droplist-main > .droplist-menu > .droplist-options > .droplist-option {
                padding: 10px;
                cursor: pointer;
                border-radius: 5px;
                white-space: nowrap;
                margin-bottom: 5px;
            }
            .droplist-main > .droplist-menu > .droplist-options > .droplist-option.selected {
                background-color: var(--color-selected);
                position: relative;
            }
            .droplist-main > .droplist-menu > .droplist-options > .droplist-option.disabled {
                cursor: not-allowed;
                user-select: none;
                opacity: 0.5;
            }
            .droplist-main > .droplist-menu > .droplist-options > .droplist-option:not(.disabled):hover,
            .droplist-main > .droplist-menu > .droplist-options > .droplist-option:not(.disabled):focus-visible {
                background-color: var(--color-background-hover);
                outline: none;
            }
            .droplist-main > .droplist-menu > .droplist-options > .droplist-option.selected > .material-icons-round {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
            }
        `;
	}
}
