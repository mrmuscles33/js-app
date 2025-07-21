import Html from "../Utils/Html.js";
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
import Calendar from "../Components/Calendar.js";
import DatePicker from "../Components/DatePicker.js";
import TimePicker from "../Components/TimePicker.js";
import Avatar from "../Components/Avatar.js";
import Badge from "../Components/Badge.js";
import List from "../Components/List.js";
import Select from "../Components/Select.js";
import Modal from "../Components/Modal.js";
import Icon from "../Components/Icon.js";
import Card from "../Components/Card.js";
import Alert from "../Components/Alert.js";
import Tabs from "../Components/Tabs.js";

import TooltipDirective from "../Directives/TooltipDirective.js";
import ToolbarDirective from "../Directives/ToolbarDirective.js";

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
customElements.define("amr-calendar", Calendar);
customElements.define("amr-date", DatePicker);
customElements.define("amr-time", TimePicker);
customElements.define("amr-avatar", Avatar);
customElements.define("amr-badge", Badge);
customElements.define("amr-list", List);
customElements.define("amr-select", Select);
customElements.define("amr-modal", Modal);
customElements.define("amr-icon", Icon);
customElements.define("amr-card", Card);
customElements.define("amr-alert", Alert);
customElements.define("amr-tabs", Tabs);

// CSS
let componentsStyles = document.createElement("style");
componentsStyles.innerHTML = Html.clean`
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
	${Calendar.style()}
	${DatePicker.style()} 
	${TimePicker.style()}
	${Avatar.style()}
	${Badge.style()}
	${List.style()}
	${Select.style()}
	${Modal.style()}
	${Icon.style()}
	${Card.style()}
	${Alert.style()}
	${Tabs.style()}
`;
document.head.appendChild(componentsStyles);

// Directives
const tooltipDirective = new TooltipDirective();
const toolbarDirective = new ToolbarDirective();
setTimeout(() => {
	tooltipDirective.initObserver();
	toolbarDirective.initObserver();
}, 500);