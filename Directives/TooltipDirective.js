import Tooltip from "../Components/Tooltip.js";
import Directive from "./Directive.js";

export default class TooltipDirective extends Directive {
    constructor() {
        super("tooltip");
    }

    onAttributeAdded(element, newValue) {
        let tooltip = document.querySelector(`amr-tooltip[parent=${element.key}]`);
        if(element.hasAttribute("disabled") && element.getAttribute("disabled") == "true") return;
        if(!tooltip) {
            tooltip = Tooltip.get({parent: element.key, text: newValue});
            document.body.appendChild(tooltip);
        }
        element.addEventListener("mouseenter", () => this.showTooltip(tooltip, element));
        element.addEventListener("focusin", () => this.showTooltip(tooltip, element));
        element.addEventListener("mouseleave", () => this.hideTooltip(tooltip));
        element.addEventListener("focusout", () => this.hideTooltip(tooltip));
    }

    onAttributeRemoved(element) {
        let tooltip = document.querySelector(`amr-tooltip[parent=${element.key}]`);
        if(tooltip) {
            tooltip.remove();
        }
        element.removeEventListener("mouseenter", () => this.showTooltip(tooltip, element));
        element.removeEventListener("focusin", () => this.showTooltip(tooltip, element));
        element.removeEventListener("mouseleave", () => this.hideTooltip(tooltip));
        element.removeEventListener("focusout", () => this.hideTooltip(tooltip));
    }

    onAttributeChanged(element, oldValue, newValue) {
        let tooltip = document.querySelector(`amr-tooltip[parent=${element.key}]`);
        if(oldValue == newValue){
            return;
        } else if(oldValue != null && !newValue) {
            this.onAttributeRemoved(element);
        } else if(tooltip) {
            tooltip.text = newValue;
        } else {
            this.onAttributeAdded(element, newValue);
        }
    }

    showTooltip(tooltip, element) {
        tooltip.classList.add("show");
        let top = element.getBoundingClientRect().top + window.scrollY - tooltip.offsetHeight - 10;
        let left = element.getBoundingClientRect().left + window.scrollX + (element.offsetWidth / 2) - (tooltip.offsetWidth / 2);
        if (top < 0) {
            top = element.getBoundingClientRect().bottom + window.scrollY + 10; 
        }
        if (left < 0) {
            left = 10; 
        } else if (left + tooltip.offsetWidth > window.innerWidth) {
            left = window.innerWidth - tooltip.offsetWidth - 10; 
        }
        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
    }

    hideTooltip(tooltip) {
        tooltip.classList.remove("show");
    }
}