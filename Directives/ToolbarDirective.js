import Directive from "./Directive.js";
import Events from "../Utils/Events.js";
import Html from "../Utils/Html.js";

export default class ToolbarDirective extends Directive {
	constructor() {
		super("toolbar");
	}

	onAttributeAdded(element) {
		element._keyHandlers = new Map();
		Array.from(element.children).forEach((child) => {
			const handler = (event) => {
				this.onKeyDown(element, child, event);
			};
			element._keyHandlers.set(child, handler);
			child.addEventListener("keydown", handler);
		});
	}

	onAttributeRemoved(element) {
		if (element._keyHandlers) {
			element._keyHandlers.forEach((handler, child) => {
				child.removeEventListener("keydown", handler);
			});
			delete element._keyHandlers;
		}
	}

	onAttributeChanged(element) {
		// No specific action needed on attribute change
	}

	onKeyDown(container, element, event) {
		let itemToFocus = null;
		if (Events.isArrow(event)) {
			event.preventDefault();
			itemToFocus = Html.tabNext(container, element, Events.isArrowLeft(event) || Events.isArrowUp(event), true, false);
		} else if (Events.isTab(event)) {
			event.preventDefault();
			itemToFocus = Events.isShift(event)
				? Html.tabNext(document.body, container, true, false, true)
				: Html.tabNext(document.body, container, false, false, true);
		}
		if (itemToFocus) {
			itemToFocus.focus();
		}
	}
}