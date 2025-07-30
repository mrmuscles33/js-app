import BaseElement from "./BaseElement.js";
import Events from "../Utils/Events.js";
import Strings from "../Utils/Strings.js";
import Store from "../Utils/Store.js";
import Objects from "../Utils/Objects.js";

export default class List extends BaseElement {
	static attrs = [...BaseElement.attrs, "limit", "store"];
	static selector = "amr-list";
	connectedCallback() {
        this.limit = this.limit || 0;
        this.store = this.store || Strings.random(16);
        this._subscriptions = [];
        this._subscriptions.push(
            Store.subscribe(this.store + "-options", () => this.render()),
        );
        let _options = [];
        this.querySelectorAll("amr-option").forEach(column => {
            _options.push(Objects.elToObj(column));
        });
		this.ignoreChange = true;
        if(_options.length > 0){
            this.options = _options;
        }
        this.ignoreChange = false;
		super.connectedCallback();
	}
    disconnectedCallback() {
        if (this._subscriptions && this._subscriptions.length > 0) {
            this._subscriptions.forEach(unsubscribe => {
                if (typeof unsubscribe === 'function') {
                    unsubscribe();
                }
            });
            this._subscriptions = [];
        }
    }
    set options(data) {
        Store.set(this.store + "-options", data);
        this.render();
    }
    get options() {
        return Store.get(this.store + "-options") || [];
    }
	render() {
        // Dynamics variables
        let me = this;
        this.selection = me.options.filter((option) => option.selected == "true");

		super.render();

        let items = me.querySelectorAll("ul.list-main > li.list-item:not(.disabled)");
        items.forEach(item => {
            item.addEventListener("keydown", (event) => {
                if (Events.isEnter(event) || Events.isSpace(event)) {
                    me.onSelectItem(event, item.getAttribute("value"));
                    event.preventDefault();
                    event.stopPropagation();
                }
            });
            item.addEventListener("click", (event) => {
                me.onSelectItem(event, event.target.getAttribute("value"));
                event.preventDefault();
                event.stopPropagation();
            });
        });
	}
    onSelectItem(event, value) {
        let me = this;
        let idx = me.options.findIndex((option) => option.value === value);
        let selectedItem = me.options[idx];
        selectedItem.selected = (selectedItem.disabled == "true" || selectedItem.selected == "true") ? "false" : "true";
        me.options[idx] = { ...selectedItem };
        setTimeout(() => {
            me.querySelector("ul.list-main > li.list-item[value='" + value + "']").focus();
        }, 100);
        me.options = [...me.options];
        me.fireHandler("change", event);
    }
	template() {
        let isDisabled = (option) => option.disabled == "true" || (this.limit > 0 && this.selection.length >= this.limit && option.selected != "true");

		return `
           <ul class="list-main flex-col w-100 gap-y-1 ${this.cls}" role="listbox" id="${this.key}">
                ${this.options.map((option) =>
                `<li class="list-item round-1 px-2 py-1 ${isDisabled(option) ? "disabled" : ""}"
                    role="option" 
                    value="${option.value}" 
                    ${isDisabled(option) ? "tabindex='-1'" : "tabindex='0'"}
                >
                    <span class="label flex-1 block">${option.label}</span>
                    <amr-icon class='font-3 selected ${option.selected == "true" ? "" : "hidden w-0"}' value='check'></amr-icon>
                </li>`
                ).join("")}
           </ul>
        `;
	}
	static style() {
		return `
            .list-main {
                list-style-type: none;
            }
            .list-main > .list-item {
                cursor: pointer;
                user-select: none;
                background-color: var(--background-color);
                color: var(--dark-shade0);
                background-color: var(--secondary-shade2);
                outline: none;
                position: relative;
            }
            .list-main > .list-item:hover,
            .list-main > .list-item:focus-visible {
                background-color: var(--secondary-shade3);
            }
            .list-main > .list-item:after {
				content: " ";
				display: block;
				position: absolute;
				top: 50%;
				left: 50%;
				width: calc(100% + 6px);
				height: calc(100% + 6px);
				border-radius: calc(0.5rem + 3px);
				border: 2px solid transparent;
				transform: translate(-50%, -50%);
			}
            .list-main > .list-item:focus-visible:after {
				border-color: var(--primary-shade0);
			}
            .list-main > .list-item.disabled {
                cursor: not-allowed;
                user-select: none;
                opacity: 0.5;
            }
            .list-main > .list-item > .label {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            .list-main > .list-item > amr-icon.selected {
                color: var(--primary-shade0);
            }
        `;
	}
}
