import BaseElement from "./BaseElement.js";
import Html from "../Utils/Html.js";

export default class Avatar extends BaseElement {
    static attrs = [...BaseElement.attrs, "src", "firstname", "lastname", "status", "information"];
    static status = {
        ONLINE: "online",
        OFFLINE: "offline",
        BUSY: "busy",
        AWAY: "away",
        INVISIBLE: "invisible"
    };
    static selector = "amr-avatar";
    connectedCallback() {
        this.src = this.src || "";
        this.alt = this.alt || "";
        this.firstname = this.firstname || "";
        this.lastname = this.lastname || "";
        this.status = this.status || Avatar.status.INVISIBLE;
        this.information = this.information || "true";
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
            <div id="${this.key}" 
                class="avatar-main ${this.cls} ${this.status}" 
                role="img" ${this.information == "true" ? "" : "tabindex='0'" }
                style="--parent-background-color: ${this.getParentBackgroundColor()};"
            >
                ${this.src ? 
                `<img 
                    src="${this.src}" 
                    alt="${this.firstname} ${this.lastname} • ${Avatar.getStatusLabel(this.status)}" 
                    loading="lazy"
                >` : 
                `<span class="initiales">${this.firstname[0].toUpperCase()}${this.lastname[0].toUpperCase()}</span>`}
            </div>
        `;
    }
    static getStatusLabel(status) {
        let label;
        switch(status) {
            case Avatar.status.ONLINE: label = "Connecté"; break;
            case Avatar.status.OFFLINE: label = "Déconnecté"; break;
            case Avatar.status.BUSY: label = "Occupé"; break;
            case Avatar.status.AWAY: label = "Absent"; break;
            default: label = "";
        }
        return label;
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
                width: 100%;
            }
            .avatar-main:before {
                width: 25%;
                aspect-ratio: 1;
                content: " ";
                border-radius: 50%;
                position: absolute;
                top: 100%;
                left: 100%;
                transform: translate(-70%, -80%);
                background-color: transparent;
                border: 4px solid var(--parent-background-color);
            }
            .avatar-main.online:before {
                background-color: var(--status-success);
            }
            .avatar-main.offline:before {
                background-color: var(--status-disabled);
            }
            .avatar-main.busy:before {
                background-color: var(--status-error);
            }
            .avatar-main.away:before {
                background-color: var(--status-warning);
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
            .avatar-main:after {
                width: calc(100% + 4px);
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
                font-weight: 600;
                color: var(--dark-shade2);
                background-color: var(--secondary-shade3);
            }
            .avatar-main img,
            .avatar-main .initiales {
                width: 100%;
            }
        `;
    }
}