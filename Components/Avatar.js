import BaseElement from "./BaseElement.js";

export default class Avatar extends BaseElement {
    static attrs = [...BaseElement.attrs, "src", "firstname", "lastname", "size"];
    static counter = 1;
    connectedCallback() {
        this.src = this.src || "";
        this.alt = this.alt || "";
        this.firstname = this.firstname || "";
        this.lastname = this.lastname || "";
        this.size = this.size || "medium";
        this.key = this.key || `avatar-${Avatar.counter++}`;
        super.connectedCallback();
    }
    template() {
        return `
            <amr-tooltip text="${this.firstname} ${this.lastname}">
                <div id="${this.key}" class="avatar-main ${this.cls} ${this.size}" role="img" tabindex="0">
                    ${this.src ? 
                    `<img src="${this.src}"/>` : 
                    `<span class="initiales">${this.firstname[0].toUpperCase()}${this.lastname[0].toUpperCase()}</span>`}
                </div>
            </amr-tooltip>
        `;
    }
    static style() {
        return `
            .avatar-main {
                overflow: visible;
                position: relative;
                margin: 0 5px 5px 0;
                outline: none;
            }
            .avatar-main:after {
                content: " ";
				border-radius: 50px;
				border: 2px solid transparent;
				display: block;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
            }
            .avatar-main.small:after {
                width: 28px;
                height: 28px;
            }
            .avatar-main.medium:after {
                width: 52px;
                height: 52px;
            }
            .avatar-main.large:after {
                width: 76px;
                height: 76px;
            }
            .avatar-main:focus-visible:after {
                border-color: var(--primary-shade0);
            }
            .avatar-main img {
                object-fit: cover;
                border-radius: 50%;
                margin: 5px 0 0 0; // TODO : fix this alignment issue
            }
            .avatar-main .initiales {
                font-weight: bold;
                color: var(--dark-shade2);
                background-color: var(--secondary-shade3);
                display: inline-flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
            }
            .avatar-main.small img,
            .avatar-main.small .initiales {
                aspect-ratio: 1/1;
                width: 24px;
                font-size: 10px;
            }
            .avatar-main.medium img,
            .avatar-main.medium .initiales {
                aspect-ratio: 1/1;
                width: 48px;
                font-size: 18px;
            }
            .avatar-main.large img,
            .avatar-main.large .initiales {
                aspect-ratio: 1/1;
                width: 72px;
                font-size: 28px;
            }
        `;
    }
}