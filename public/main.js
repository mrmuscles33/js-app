import BaseElement from "../Components/BaseElement.js";
import TextField from "../Components/TextField.js";
import NumberField from "../Components/NumberField.js";
import PasswordField from "../Components/PasswordField.js";
import PhoneField from "../Components/PhoneField.js";
import EmailField from "../Components/EmailField.js";
import ButtonCustom from "../Components/ButtonCustom.js";
import CheckboxCustom from "../Components/CheckboxCustom.js";
import RadioCustom from "../Components/RadioCustom.js";
import TooltipCustom from "../Components/TooltipCustom.js";
import SwitchButton from "../Components/SwitchButton.js";
import DatePicker from "../Components/DatePicker.js";
import ToolbarCustom from "../Components/ToolbarCustom.js";
import Html from "../Utils/Html.js";

// HTML Elements
customElements.define("text-field", TextField);
customElements.define("number-field", NumberField);
customElements.define("password-field", PasswordField);
customElements.define("phone-field", PhoneField);
customElements.define("email-field", EmailField);
customElements.define("button-custom", ButtonCustom);
customElements.define("checkbox-custom", CheckboxCustom);
customElements.define("radio-custom", RadioCustom);
customElements.define("tooltip-custom", TooltipCustom);
customElements.define("switch-button", SwitchButton);
customElements.define("date-picker", DatePicker);
customElements.define("toolbar-custom", ToolbarCustom);

// CSS
let style = document.createElement("style");
style.innerHTML = Html.clean`
	${BaseElement.style()} 
	${TextField.style()} 
	${NumberField.style()} 
	${PasswordField.style()} 
	${PhoneField.style()} 
	${EmailField.style()} 
	${ButtonCustom.style()} 
	${CheckboxCustom.style()} 
	${RadioCustom.style()} 
	${TooltipCustom.style()} 
	${SwitchButton.style()} 
	${DatePicker.style()} 
	${ToolbarCustom.style()}
`;
document.head.appendChild(style);