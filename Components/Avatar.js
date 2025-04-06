import BaseElement from "./BaseElement.js";
import Html from "../Utils/Html.js";

export default class Avatar extends BaseElement {
    static attrs = [...BaseElement.attrs, "src", "firstname", "lastname", "size", "status", "tooltip"];
    static counter = 1;
    static status = {
        ONLINE: "online",
        OFFLINE: "offline",
        BUSY: "busy",
        AWAY: "away",
        INVISIBLE: "invisible"
    };
    connectedCallback() {
        this.src = this.src || "";
        this.alt = this.alt || "";
        this.firstname = this.firstname || "";
        this.lastname = this.lastname || "";
        this.size = this.size || "medium";
        this.status = this.status || Avatar.status.INVISIBLE;
        this.key = this.key || `avatar-${Avatar.counter++}`;
        this.tooltip = this.tooltip || "true";
        super.connectedCallback();

        Html.onThemeChange(() => {
            this.querySelector(".avatar-main").style.setProperty("--parent-background-color", this.getParentBackgroundColor());
        });
    }
    render() {
        super.render();

        // Listeners
        let me = this;
        let img = me.querySelector("img");
        if (img) {
            img.addEventListener("error", () => {
                me.src = "";
            });
        }
    }
    template() {
        return `
            ${this.tooltip == "true" ? `<amr-tooltip text="${this.firstname} ${this.lastname}${this.getStatusLabel()}">`: "" }
                <div id="${this.key}" 
                    class="avatar-main ${this.cls} ${this.size} ${this.status}" 
                    role="img" 
                    ${this.tooltip == "true" ? "tabindex='0'": "" }
                    style="--parent-background-color: ${this.getParentBackgroundColor()};"
                >
                    ${this.src ? 
                    `<img 
                        src="${this.src}" 
                        alt="${this.firstname} ${this.lastname}${this.getStatusLabel()}" 
                        loading="lazy"
                    >` : 
                    `<span class="initiales">${this.firstname[0].toUpperCase()}${this.lastname[0].toUpperCase()}</span>`}
                </div>
            ${this.tooltip == "true" ? `</amr-tooltip>`: "" }
        `;
    }
    getStatusLabel() {
        let label = "";
        switch(this.status) {
            case Avatar.status.ONLINE: label = "Connecté"; break;
            case Avatar.status.OFFLINE: label = "Déconnecté"; break;
            case Avatar.status.BUSY: label = "Occupé"; break;
            case Avatar.status.AWAY: label = "Absent"; break;
            default: return "";
        }
        return " • " + label;
    }
    getParentBackgroundColor() {
        let parent = this.parentElement;
        while (parent && this.status !== Avatar.status.INVISIBLE) {
            const style = window.getComputedStyle(parent);
            const backgroundColor = style.backgroundColor;
            if (backgroundColor && backgroundColor !== "rgba(0, 0, 0, 0)" && backgroundColor !== "transparent") {
                return backgroundColor;
            }
            parent = parent.parentElement;
        }
        return "transparent";
    }
    static style() {
        return `
            .avatar-main {
                overflow: visible;
                position: relative;
                outline: none;
            }
            .avatar-main:before {
                aspect-ratio: 1;
                content: " ";
                border-radius: 50%;
                position: absolute;
                top: 100%;
                left: 100%;
                transform: translate(-80%, -80%);
                background-color: transparent;
                border: 0px solid var(--parent-background-color);
            }
            .avatar-main.online:before {
                background-color: var(--status-success);
            }
            .avatar-main.offline:before {
                background-color: var(--status-info);
            }
            .avatar-main.busy:before {
                background-color: var(--status-error);
            }
            .avatar-main.away:before {
                background-color: var(--status-warning);
            }
            .avatar-main.small:before {
                width: 6px;
                border-width: 2px;
            }
            .avatar-main.medium:before {
                width: 10px;
                border-width: 3px;
            }
            .avatar-main.large:before {
                width: 15px;
                border-width: 4px;
            }
            .avatar-main:after {
                aspect-ratio: 1;
                content: " ";
                border-radius: 50%;
                border: 2px solid transparent;
                display: block;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            .avatar-main.small:after {
                width: 28px;
            }
            .avatar-main.medium:after {
                width: 52px;
            }
            .avatar-main.large:after {
                width: 76px;
            }
            .avatar-main:focus-visible:after {
                border-color: var(--primary-shade0);
            }
            .avatar-main img,
            .avatar-main .initiales {
                aspect-ratio: 1;
                object-fit: cover;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .avatar-main .initiales {
                font-weight: bold;
                color: var(--dark-shade2);
                background-color: var(--secondary-shade3);
            }
            .avatar-main.small img,
            .avatar-main.small .initiales {
                width: 24px;
                font-size: 10px;
            }
            .avatar-main.medium img,
            .avatar-main.medium .initiales {
                width: 48px;
                font-size: 18px;
            }
            .avatar-main.large img,
            .avatar-main.large .initiales {
                width: 72px;
                font-size: 28px;
            }
        `;
    }
}