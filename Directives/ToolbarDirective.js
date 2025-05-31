import Directive from "./Directive.js";
import Events from "../Utils/Events.js";
import Html from "../Utils/Html.js";

export default class ToolbarDirective extends Directive {
    constructor() {
        super("toolbar");
    }

    onAttributeAdded(element) {
        Array.from(element.children).forEach(child => {
            child.addEventListener("keydown", (event) => {
                let itemToFocus = null;
                if (Events.isArrow(event)) {
                    event.preventDefault();
                    itemToFocus = Html.getNextFocusableElement(element, child, (Events.isArrowLeft(event) || Events.isArrowUp(event)), true, false);
                } else if (Events.isTab(event)) {
                    event.preventDefault();
                    itemToFocus = Events.isShift(event) ? 
                        Html.getNextFocusableElement(document.body, element, true, false, true) : 
                        Html.getNextFocusableElement(document.body, element, false, false, true);
                }
                if(itemToFocus) {
                    itemToFocus.focus();
                }
            });
        });
    }

    onAttributeRemoved(element) {
        
    }

}