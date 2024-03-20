import { TextField } from "./TextField.js";

export class NumberField extends TextField {
    static attrs = ["value", "placeholder", "min", "max", "type", "bordercolor"];
    connectedCallback() {
        super.connectedCallback();
        this.type = "number";
        this.placeholder = "0";
    }
}