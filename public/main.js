import BaseElement from "../Components/BaseElement.js";
import TextField from "../Components/TextField.js";
import NumberField from "../Components/NumberField.js";
import PasswordField from "../Components/PasswordField.js";
import PhoneField from "../Components/PhoneField.js";
import EmailField from "../Components/EmailField.js";
import Button from "../Components/Button.js";
import Checkbox from "../Components/Checkbox.js";
import Radio from "../Components/Radio.js";
import Tooltip from "../Components/Tooltip.js";
import Switch from "../Components/Switch.js";
import DatePicker from "../Components/DatePicker.js";
import Toolbar from "../Components/Toolbar.js";
import Select from "../Components/Select.js";
import Html from "../Utils/Html.js";

// HTML Elements
customElements.define("amr-text", TextField);
customElements.define("amr-number", NumberField);
customElements.define("amr-password", PasswordField);
customElements.define("amr-phone", PhoneField);
customElements.define("amr-email", EmailField);
customElements.define("amr-button", Button);
customElements.define("amr-checkbox", Checkbox);
customElements.define("amr-radio", Radio);
customElements.define("amr-tooltip", Tooltip);
customElements.define("amr-switch", Switch);
customElements.define("amr-date", DatePicker);
customElements.define("amr-toolbar", Toolbar);
customElements.define("amr-select", Select);

// CSS
let style = document.createElement("style");
style.innerHTML = Html.clean`
	${BaseElement.style()} 
	${TextField.style()} 
	${NumberField.style()} 
	${PasswordField.style()} 
	${PhoneField.style()} 
	${EmailField.style()} 
	${Button.style()} 
	${Checkbox.style()} 
	${Radio.style()} 
	${Tooltip.style()} 
	${Switch.style()} 
	${DatePicker.style()} 
	${Toolbar.style()}
	${Select.style()}
`;
document.head.appendChild(style);