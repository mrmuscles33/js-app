import TextField from "./TextField.js";
import Times from "../Utils/Times.js";
import Events from "../Utils/Events.js";
import Icon from "./Icon.js";
import Html from "../Utils/Html.js";

export default class TimePicker extends TextField {
    static attrs = [...TextField.attrs, "seconde", "opened", "min", "max"];
    static selector = "amr-time";
    connectedCallback() {
        this.iconright = this.iconright || "schedule";
        this.format = this.format || (this.seconde == "true" ? Times.H_M_S : Times.H_M);
        this.pattern = this.pattern || Times.getPattern(this.format);
        this.size = this.size || (this.seconde == "true" ? "medium" : "small");
        this.seconde = this.seconde || "false";
        this.opened = this.opened || "false";
        this.min = this.min || (this.seconde == "true" ? "00:00:00" : "00:00");
        this.max = this.max || (this.seconde == "true" ? "23:59:59" : "23:59");
        this.right = this.right || Html.nearest(this, "[slot=right]") || (() => {
            if(this.readonly == "true" || this.disabled == "true") return null;
            return Icon.get({ value: "access_time", action: "true", slot: "right"}, ["font-3"]);
        })();
        super.connectedCallback();
    }
    render() {
        let me = this;
        me.position = me.getBoundingClientRect().top + me.getBoundingClientRect().height + 280 > window.innerHeight ? "top" : "bottom";
        
        super.render();

        // Icon right
		let iconRight = me.querySelector("[slot='right']");
		if(iconRight && iconRight.localName == "amr-icon" && iconRight.getAttribute("action") == "true") {
            iconRight.onClick = () => me.onClick();
		}

        let main = me.querySelector(".timepicker-main");
        main.addEventListener("keydown", (event) => {
            if(Events.isEsc(event)) {
                me.close();
            }
            event.stopPropagation();
        });

        let mask = me.querySelector(".timepicker-mask");
        if(mask) {
            mask.addEventListener("click", () => me.close());
        }

        let items = me.querySelectorAll(".timepicker-item:not(.disabled)");
        items.forEach(item => {
            item.addEventListener("click", () => me.onClickItem(item));
            item.addEventListener("keydown", (event) => me.onKeydownItem(event, item));
        });

        // Scroll to selected item
        let selectedHour = me.querySelector(".timepicker-item.hour.selected");
        let selectedMinute = me.querySelector(".timepicker-item.minute.selected");
        let selectedSeconde = me.querySelector(".timepicker-item.seconde.selected");
        if(selectedHour) {
            selectedHour.scrollIntoView({block: "center", inline: "center"});
        }
        if(selectedMinute) {
            selectedMinute.scrollIntoView({block: "center", inline: "center"});
        }
        if(selectedSeconde) {
            selectedSeconde.scrollIntoView({block: "center", inline: "center"});
        }
    }
    onClickItem(item) {
        let me = this;
        let hour = Times.getHours(me.value);
        let minute = Times.getMinutes(me.value);
        let seconde = Times.getSeconds(me.value);
        let tmpValue = item.getAttribute("value").padStart(2,'0');
        if(item.classList.contains("hour")) {
            tmpValue = tmpValue + ":" + minute.toString().padStart(2,'0') + ":" + seconde.toString().padStart(2,'0');
        }
        if(item.classList.contains("minute")) {
            tmpValue = hour.toString().padStart(2,'0') + ":" + tmpValue + ":" + seconde.toString().padStart(2,'0');
        }
        if(item.classList.contains("seconde")) {
            tmpValue = hour.toString().padStart(2,'0') + ":" + minute.toString().padStart(2,'0') + ":" + tmpValue;
        }
        let selector = '.' + Array.from(item.classList).join('.') + '.selected';
        setTimeout(() => {
            me.querySelector(selector).focus();
        }, 100);
        me.value = Times.format(tmpValue, me.format);
    }
    onKeydownItem(event, item) {
        let me = this;
        if(Events.isEnter(event) || Events.isSpace(event)) {
            event.preventDefault();
            event.stopPropagation();
            item.click();
            me.onChange();
        } else if(Events.isArrow(event)) {
            let next = item.nextElementSibling;
            let previous = item.previousElementSibling;
            if((Events.isArrowUp(event) || Events.isArrowLeft(event)) && previous && !previous.classList.contains("disabled")) {
                previous.focus();
            }
            if((Events.isArrowDown(event) || Events.isArrowRight(event)) && next && !next.classList.contains("disabled")) {
                next.focus();
            }
            event.preventDefault();
            event.stopPropagation();
        } else if(Events.isTab(event)) {
            if( (Events.isShift(event) && item.classList.contains("hour")) || 
                (!Events.isShift(event) && item.classList.contains("minute") && me.seconde == "false") || 
                (!Events.isShift(event) && item.classList.contains("seconde"))
            ) {
                // Block tab navigation before hour, after minute (if not seconde) and after seconde
                event.preventDefault();
                event.stopPropagation();
            } else if(!Events.isShift(event)) {
                // Focus next minute/seconde with tabindex 0 or -1
                if(!me.querySelector(`.timepicker-item.${item.classList.contains("hour") ? "minute" : "seconde"}[tabindex='0']`)) {
                    let next = me.querySelector(`.timepicker-item.${item.classList.contains("hour") ? "minute" : "seconde"}[tabindex='-1']`);
                    if(next) {
                        next.setAttribute("tabindex", "0");
                        next.focus();
                    }
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        }
    }
    onChange() {
        super.onChange();
        if(!this.errormessage) {
            this.errormessage = Times.before(this.value, this.min) ? `La donnée ${this.label} doit être supérieure à ${this.min}` : "";
        }
        if(!this.errormessage) {
            this.errormessage = Times.after(this.value, this.max) ? `La donnée ${this.label} doit être inférieure à ${this.max}` : "";
        }
    }
    onClick() {
		this.open();
	}
    onKeydown(event) {
		if(Events.isSpace(event)){
			this.onClick();
			event.preventDefault();
			event.stopPropagation();
		}
	}
    open() {
        if(this.readonly == "true" || this.disabled == "true") return false;
        let me = this;
        me.opened = "true";
        setTimeout(() => {
            me.querySelector(".timepicker-item.hour.selected").focus();
        }, 100);
    }
    close() {
        let me = this;
        me.onChange();
        me.opened = "false";
        setTimeout(() => {
            let input = me.querySelector(".timepicker-main .textfield-main input");
            input.focus();
            input.selectionStart = input.selectionEnd = input.value.length;
        }, 100);
    }
    template() {
        let disableHour = (hour) => hour < Times.getHours(this.min) || hour > Times.getHours(this.max);
        let disableMinute = (minute) => {
            return  Times.before(Times.getHours(this.value).toString().padStart(2,'0') + ':' + minute.toString().padStart(2,'0') + ':55', this.min) ||
                    Times.after(Times.getHours(this.value).toString().padStart(2,'0') + ':' + minute.toString().padStart(2,'0') + ':00', this.max);
        };
        let disableSeconde = (seconde) => {
            return  Times.before(Times.getHours(this.value).toString().padStart(2,'0') + ':' + Times.getMinutes(this.value).toString().padStart(2,'0') + ':' + seconde.toString().padStart(2,'0'), this.min) ||
                    Times.after(Times.getHours(this.value).toString().padStart(2,'0') + ':' + Times.getMinutes(this.value).toString().padStart(2,'0') + ':' + seconde.toString().padStart(2,'0'), this.max);
        }

        return `
            <div class="timepicker-main relative">
                ${super.template()}
                ${this.opened == "true" ? `
                    <div class="timepicker-mask fixed t-0 l-0 w-100 h-100"></div>
                    <div class="timepicker-menu round-1 w-100 min-w-xs absolute l-0 bg-secondary-2 mt-1 p-1 font-2 ${this.position} flex-row">
                        <div class="timepicker-section text-center flex-1 block">
                            <span class="header font-weight-500 block text-center mb-1">Heure</span>
                            <div class="timepicker-list max-h-xs overflow-y-auto flex-col hour">
                                ${Array.from({ length: 24 }, (_, i) => i).map(hour => `
                                <span class="timepicker-item pointer p-1 mx-1 round-1 color-dark-0 block text-center hour
                                    ${Times.getHours(this.value) == hour ? "selected" : ""}
                                    ${disableHour(hour) ? "disabled" : ""}"
                                    value="${hour}"
                                    ${disableHour(hour) ? "" : `${Times.getHours(this.value) == hour ? "tabindex='0'" : "tabindex='-1'"}`}>
                                    ${hour.toString().padStart(2,'0')}
                                    ${Times.getHours(this.value) == hour ? "<amr-icon value='check' size='small'></amr-icon>" : ""}
                                </span>`
                                ).join('')}
                            </div>
                        </div>
                        <div class="timepicker-section text-center flex-1 block">
                            <span class="header font-weight-500 block text-center mb-1">Minute</span>
                            <div class="timepicker-list max-h-xs overflow-y-auto flex-col minute">
                                ${Array.from({ length: 12 }, (_, i) => i * 5).map(minute => `
                                <span class="timepicker-item pointer p-1 mx-1 round-1 color-dark-0 block text-center minute
                                    ${Times.getMinutes(this.value) == minute ? "selected" : ""}
                                    ${disableMinute(minute) ? "disabled" : ""}"
                                    value="${minute}"
                                    ${disableMinute(minute) ? "" : `${Times.getMinutes(this.value) == minute ? "tabindex='0'" : "tabindex='-1'"}`}>
                                    ${minute.toString().padStart(2,'0')}
                                    ${Times.getMinutes(this.value) == minute ? "<amr-icon value='check' size='small'></amr-icon>" : ""}
                                </span>`
                                ).join('')}
                            </div>
                        </div>
                        ${this.seconde == "true" ? `
                        <div class="timepicker-section text-center flex-1 block">
                            <span class="header font-weight-500 block text-center mb-1">Seconde</span>
                            <div class="timepicker-list max-h-xs overflow-y-auto flex-col seconde">
                                ${Array.from({ length: 12 }, (_, i) => i * 5).map(seconde => `
                                <span class="timepicker-item pointer p-1 mx-1 round-1 color-dark-0 block text-center seconde
                                    ${Times.getSeconds(this.value) == seconde ? "selected" : ""}
                                    ${disableSeconde(seconde) ? "disabled" : ""}"
                                    value="${seconde}"
                                    ${disableSeconde(seconde) ? "" : `${Times.getSeconds(this.value) == seconde ? "tabindex='0'" : "tabindex='-1'"}`}>
                                    ${seconde.toString().padStart(2,'0')}
                                    ${Times.getSeconds(this.value) == seconde ? "<amr-icon value='check' size='small'></amr-icon>" : ""}
                                </span>`
                                ).join('')}
                            </div>
                        </div>
                        ` : ""}
                    </div>
                ` : ""}
            </div>
        `;
    }
    static style() {
        return `
            .timepicker-main > .timepicker-mask {
                background-color: transparent;
                z-index: 1;
            }
            .timepicker-main > .timepicker-menu {
                border: 1px solid var(--secondary-shade5);
                z-index: 2;
            }
            .timepicker-main > .timepicker-menu.bottom {
                top: 100%;
                bottom: auto;
                transform: translateY(0);
            }
            .timepicker-main > .timepicker-menu.top {
                top: auto;
                bottom: 100%;
                transform: translateY(-5px);
            }
            .timepicker-main > .timepicker-menu > .timepicker-section > .header {
                color: var(--dark-shade0);
            }
            .timepicker-main > .timepicker-menu > .timepicker-section > .timepicker-list::-webkit-scrollbar {
                width: 5px;
            }
            .timepicker-main > .timepicker-menu > .timepicker-section > .timepicker-list::-webkit-scrollbar-thumb {
                background-color: var(--secondary-shade5);
            }
            .timepicker-main > .timepicker-menu > .timepicker-section > .timepicker-list > .timepicker-item {
                border: 1px solid transparent;
                outline: none;
            }
            .timepicker-main > .timepicker-menu > .timepicker-section > .timepicker-list > .timepicker-item:not(.disabled):focus-visible {
                border-color: var(--secondary-shade5);
            }
            .timepicker-main > .timepicker-menu > .timepicker-section > .timepicker-list > .timepicker-item.disabled {
                cursor: not-allowed;
                user-select: none;
                opacity: 0.5;
            }
            .timepicker-main > .timepicker-menu > .timepicker-section > .timepicker-list > .timepicker-item:not(.disabled):hover,
            .timepicker-main > .timepicker-menu > .timepicker-section > .timepicker-list > .timepicker-item:not(.disabled):focus-visible {
                background-color: var(--secondary-shade3);
                outline: none;
            }
            .timepicker-main > .timepicker-menu > .timepicker-section > .timepicker-list > .timepicker-item.selected {
                position: relative;
                color: var(--primary-shade0);
            }
            .timepicker-main > .timepicker-menu > .timepicker-section > .timepicker-list > .timepicker-item.selected,
            .timepicker-main > .timepicker-menu > .timepicker-section > .timepicker-list > .timepicker-item.selected:focus-visible {
                border-color: var(--primary-shade0);
            }
            .timepicker-main > .timepicker-menu > .timepicker-section > .timepicker-list > .timepicker-item.selected > amr-icon {
                position: absolute;
                right: 5px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--primary-shade0);
            }
        `;
    }
}