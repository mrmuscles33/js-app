import BaseElement from "./BaseElement.js";
import Html from "../Utils/Html.js";

export default class Avatar extends BaseElement {
    static attrs = [...BaseElement.attrs, "src", "firstname", "lastname", "size", "status"];
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
            <amr-tooltip text="${this.firstname} ${this.lastname}${this.getStatusLabel()}">
                <div id="${this.key}" 
                    class="avatar-main ${this.cls} ${this.size} ${this.status}" 
                    role="img" 
                    tabindex="0"
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
            </amr-tooltip>
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
        const parent = this.parentElement;
        if (parent && this.status != Avatar.status.INVISIBLE) {
            const style = window.getComputedStyle(parent);
            return style.backgroundColor;
        }
        return 'transparent';
    }
    static style() {
        return `
            .avatar-main {
                overflow: visible;
                position: relative;
                margin: 0 5px 5px 0;
                outline: none;
            }
            .avatar-main:before {
                aspect-ratio: 1;
                content: " ";
                border-radius: 50%;
                display: block;
                position: absolute;
                bottom: 0;
                right: -4px;
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
                bottom: -2px;
                width: 8px;
                border-width: 2px;
            }
            .avatar-main.medium:before {
                width: 12px;
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