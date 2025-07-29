import BaseElement from "./BaseElement.js";
import Store from "../Utils/Store.js";
import Strings from "../Utils/Strings.js";
import Objects from "../Utils/Objects.js";

export default class Grid extends BaseElement {
	static attrs = [...BaseElement.attrs, "store"];
	static selector = "amr-grid";
	connectedCallback() {
        this.store = this.store || Strings.random(16);
        this._subscriptions = [];
        this._subscriptions.push(
            Store.subscribe(this.store + "-items", () => this.render()),
            Store.subscribe(this.store + "-columns", () => this.render())
        );
        let _columns = [];
        this.querySelectorAll("amr-column").forEach(column => {
            _columns.push(Objects.elToObj(column));
        });
        let _items = [];
        this.querySelectorAll("amr-data").forEach(data => {
            _items.push(Objects.elToObj(data));
        });
        this.ignoreChange = true;
        if(_columns.length > 0){
            this.columns = _columns;
        }
        if (_items.length > 0){
            this.items = _items;
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
	render() {
		// Dynamics variables
		let me = this;

		// The update methods breaks listeners and bindings
		super.render();
	}
	template() {
		return `
			<table id="${this.key}" name="${this.name}" class="main-grid w-100 ${this.cls} color-dark-0">
                <thead>
                    <tr>
                        ${this.columns.map(col => `
                            <th class="text-left p-2">
                                ${col.label}
                            </th>`
                        ).join("")}
                    </tr>
                </thead>
                <tbody>
                ${this.items.length === 0 ? `
                    <tr>
                        <td colspan="${this.columns.length}" class="text-center py-1">
                            No data available
                        </td>
                    </tr>
                    ` : this.items.map(item => `
                        <tr>
                            ${this.columns.map(col => `
                                <td class="text-left py-1 px-2">
                                    ${item[col.field] || ''}
                                </td>`
                            ).join("")}
                        </tr>
                    `).join("")}
                </tbody>
            </table>
		`;
	}
    set items(data) {
        Store.set(this.store + "-items", data);
        this.render();
    }
    get items() {
        return Store.get(this.store + "-items") || [];
    }
    set columns(data) {
        Store.set(this.store + "-columns", data);
        this.render();
    }
    get columns() {
        return Store.get(this.store + "-columns") || [];
    }
	static style() {
		return `
			table.main-grid {
                display: table;
                border-collapse: collapse;
                table-layout: auto;
                height: fit-content;
            }
            table.main-grid > thead {
                display: table-header-group;
            }
            table.main-grid > tbody {
                display: table-row-group;
            }
            table.main-grid > thead > tr {
                background-color: var(--secondary-shade2);
            }
            table.main-grid > thead > tr > th:first-child {
                border-top-left-radius: var(--size-1);
            }
            table.main-grid > thead > tr > th:last-child {
                border-top-right-radius: var(--size-1);
            }
            table.main-grid > thead > tr,
            table.main-grid > tbody > tr {
                display: table-row;
            }
            table.main-grid > thead > tr > th,
            table.main-grid > tbody > tr > td {
                display: table-cell;
            }
            table.main-grid > thead > tr {
                border-bottom: 1px solid var(--secondary-shade5);
            }
            table.main-grid > tbody > tr:not(:last-child) {
                border-bottom: 1px solid var(--secondary-shade5);
            }
		`;
	}
}
