import BaseElement from "./BaseElement.js";
import Store from "../Utils/Store.js";
import Strings from "../Utils/Strings.js";

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
			<table id="${this.key}" class="w-100">
                <thead>
                    <tr>
                        ${this.columns.map(col => `<th>${col.label}</th>`).join("")}
                    </tr>
                </thead>
                <tbody>
                    ${this.items.map(item => `
                        <tr>
                            ${this.columns.map(col => `<td>${item[col.field]}</td>`).join("")}
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
			
		`;
	}
}
