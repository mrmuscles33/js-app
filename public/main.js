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
import DatePicker from "../Components/DatePicker.js";
import TimePicker from "../Components/TimePicker.js";
import Avatar from "../Components/Avatar.js";
import Badge from "../Components/Badge.js";
import List from "../Components/List.js";
import Select from "../Components/Select.js";
import Calendar from "../Components/Calendar.js";
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
customElements.define("amr-date", DatePicker);
customElements.define("amr-time", TimePicker);
customElements.define("amr-avatar", Avatar);
customElements.define("amr-badge", Badge);
customElements.define("amr-list", List);
customElements.define("amr-select", Select);
customElements.define("amr-calendar", Calendar);
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
	${DatePicker.style()} 
	${TimePicker.style()}
	${Avatar.style()}
	${Badge.style()}
	${List.style()}
	${Select.style()}
	${Calendar.style()}
	${Modal.style()}
	${Icon.style()}
	${Card.style()}
	${Alert.style()}
	${Tabs.style()}
`;

// Directives
const tooltipDirective = new TooltipDirective();
const toolbarDirective = new ToolbarDirective();
setTimeout(() => {
	tooltipDirective.initObserver();
	toolbarDirective.initObserver();
}, 500);

// Basic style
let basicStyle = document.createElement("style");
basicStyle.innerHTML = Html.clean`
	:root {
		${[...Array(11)].map((e, i) => `--size-${i}: ${i * 0.5}rem;`).join("")}
		${["xxs","xs","s","m","l","xl","xxl"].map((e, i) => `--size-${e}: ${(i+1) * 10}rem;`).join("")}
	}
`;

// Display
["block","inline-block","inline","flex","inline-flex","grid","none"].forEach((v) => basicStyle.innerHTML += `.${v}{display:${v};}`);

// Visibility
["hidden","visible"].forEach(v => basicStyle.innerHTML += `.${v}{visibility: ${v};}`);

// Position
["absolute","fixed","relative","sticky"].forEach(v => basicStyle.innerHTML += `.${v}{position:${v};}`);

// Flex and grid
["row","column","row-reverse","column-reverse"].forEach(v => basicStyle.innerHTML += `.flex-${v.replace("column", "col")}{flex-direction:${v};}`);

const flexProperties = {
	"h-align" :"justify-content","h-align-items":"justify-items","h-align-item":"justify-self",
	"v-align":"align-items","v-align-items":"align-items","v-align-item":"align-self"
};
for(let k in flexProperties) {
	["flex-start","flex-end","center","stretch","space-between","space-around"].forEach(v2 => { basicStyle.innerHTML += `.${k}-${v2.replace("space-", "").replace("flex-", "")}{${flexProperties[k]}:${v2};}`});
}

[...Array(11)].forEach((e, i) => {
	basicStyle.innerHTML += `.flex-${i}{flex:${i};}`;
	basicStyle.innerHTML += `.gap-${i}{gap:var(--size-${i});}`;
	basicStyle.innerHTML += `.gap-x-${i}{gap:0 var(--size-${i});}`;
	basicStyle.innerHTML += `.gap-y-${i}{gap:var(--size-${i}) 0;}`;
	basicStyle.innerHTML += `.grid-cols-${i}{grid-template-columns:repeat(${i}, 1fr);}`;
	basicStyle.innerHTML += `.grid-rows-${i}{grid-template-rows:repeat(${i}, 1fr);}`;
	basicStyle.innerHTML += `.grid-col-${i}{grid-column: span ${i};}`;
	basicStyle.innerHTML += `.grid-row-${i}{grid-row: span ${i};}`;
	basicStyle.innerHTML += `.font-${i}{font-size:var(--size-${i});}`;
});

// Margin and padding
["", "top","bottom","left","right","x","y"].forEach(v => {
	let v2 = v == "" ? "" : `${v.charAt(0)}`;
	let v3 = v == "" ? "" : `-${v}`;
	if(v == "x") {
		basicStyle.innerHTML += `.m${v2}-auto{margin-left:auto; margin-right:auto;}`;
		basicStyle.innerHTML += `.p${v2}-auto{padding-left:auto; padding-right:auto;}`;
	} else if(v == "y") {
		basicStyle.innerHTML += `.m${v2}-auto{margin-top:auto; margin-bottom:auto;}`;
		basicStyle.innerHTML += `.p${v2}-auto{padding-top:auto; padding-bottom:auto;}`;
	} else {
		basicStyle.innerHTML += `.m${v2}-auto{margin${v3}:auto;}`;
		basicStyle.innerHTML += `.p${v2}-auto{padding${v3}:auto;}`;
	}
	[...Array(11)].forEach((e, i) => {
		if(v == "x") {
			basicStyle.innerHTML += `.m${v2}-${i}{margin-left:var(--size-${i}); margin-right:var(--size-${i});}`;
			basicStyle.innerHTML += `.p${v2}-${i}{padding-left:var(--size-${i}); padding-right:var(--size-${i});}`;
		} else if(v == "y") {
			basicStyle.innerHTML += `.m${v2}-${i}{margin-top:var(--size-${i}); margin-bottom:var(--size-${i});}`;
			basicStyle.innerHTML += `.p${v2}-${i}{padding-top:var(--size-${i}); padding-bottom:var(--size-${i});}`;
		} else {
			basicStyle.innerHTML += `.m${v2}-${i}{margin${v3}:var(--size-${i});}`;
			basicStyle.innerHTML += `.p${v2}-${i}{padding${v3}:var(--size-${i});}`;
			if(v != "") {
				basicStyle.innerHTML += `.${v2}-${i}{${v}:var(--size-${i});}`;
				basicStyle.innerHTML += `.${v2}-${i}{${v}:var(--size-${i});}`;
			}
		}
	});
	[...Array(4)].forEach((e, i) => {
		let v3 = (i + 1) * 25;
		if(v == "x") {
			basicStyle.innerHTML += `.m${v2}-${v3}{margin-left:${v3}%; margin-right:${v3}%;}`;
			basicStyle.innerHTML += `.p${v2}-${v3}{padding-left:${v3}%; padding-right:${v3}%;}`;
		} else if(v == "y") {
			basicStyle.innerHTML += `.m${v2}-${v3}{margin-top:${v3}%; margin-bottom:${v3}%;}`;
			basicStyle.innerHTML += `.p${v2}-${v3}{padding-top:${v3}%; padding-bottom:${v3}%;}`;
		} else {
			basicStyle.innerHTML += `.m${v2}-${v3}{margin${v3}:${v3}%;}`;
			basicStyle.innerHTML += `.p${v2}-${v3}{padding${v3}:${v3}%;}`;
			if(v != "") {
				basicStyle.innerHTML += `.${v2}-${v3}{${v}:${v3}%;}`;
				basicStyle.innerHTML += `.${v2}-${v3}{${v}:${v3}%;}`;
			}
		}
	});
});

// Width and height
["width","height"].forEach(v => {
	let v2 = v.charAt(0);
	["xxs","xs","s","m","l","xl","xxl"].forEach(v3 => {
		basicStyle.innerHTML += `.${v2}-${v3}{${v}:var(--size-${v3});}`;
		basicStyle.innerHTML += `.max-${v2}-${v3}{max-${v}:var(--size-${v3});}`;
		basicStyle.innerHTML += `.min-${v2}-${v3}{min-${v}:var(--size-${v3});}`;
	});
	[...Array(10)].forEach((e, i) => {
		basicStyle.innerHTML += `.${v2}-${i+1}{${v}:var(--size-${i+1});}`;
		basicStyle.innerHTML += `.max-${v2}-${i+1}{max-${v}:var(--size-${i+1});}`;
		basicStyle.innerHTML += `.min-${v2}-${i+1}{min-${v}:var(--size-${i+1});}`;
	});
	[...Array(5)].forEach((e, i) => {
		let v3 = i * 25;
		basicStyle.innerHTML += `.${v2}-${v3}{${v}:${v3}%;}`;
		basicStyle.innerHTML += `.max-${v2}-${v3}{max-${v}:${v3}%;}`;
		basicStyle.innerHTML += `.min-${v2}-${v3}{min-${v}:${v3}%;}`;
	});
	basicStyle.innerHTML += `.${v2}-auto{${v}:auto;}`;
	basicStyle.innerHTML += `.${v2}-screen{${v}:100v${v2};}`;
});

// Overflow
["hidden","scroll","auto","visible"].forEach(v => {
	basicStyle.innerHTML += `.overflow-${v}{overflow:${v};}`;
	basicStyle.innerHTML += `.overflow-x-${v}{overflow-x:${v};}`;
	basicStyle.innerHTML += `.overflow-y-${v}{overflow-y:${v};}`;
});

// Cursor
["pointer","text","not-allowed","move","grab"].forEach(v => {
	basicStyle.innerHTML += `.${v}{cursor:${v};}`;
});

// Ratio
["1","2-1","3-2","4-3","5-4","16-9","21-9", "2-3","3-4","4-5","9-16","9-21"].forEach(v => {
	basicStyle.innerHTML += `.ratio-${v}{aspect-ratio:${v.replace("-", "/")};}`;
});

// Colors
["primary","secondary","light","dark"].forEach(v => {
	[...Array(6)].forEach((e, i) => {
		basicStyle.innerHTML += `.color-${v}-${i}{color:var(--${v}-shade${i});}`;
		basicStyle.innerHTML += `.bg-${v}-${i}{background-color:var(--${v}-shade${i});}`;
	});
});

// Fonts
[...Array(11)].forEach((e, i) => {
	basicStyle.innerHTML += `.font-${i}{font-size:var(--size-${i});}`;
});
[...Array(9)].forEach((e, i) => {
	let v = 100 + i * 100;
	basicStyle.innerHTML += `.font-weight-${v}{font-weight:${v};}`;
});

// Border radius
[...Array(11)].forEach((e, i) => {
	basicStyle.innerHTML += `.round-${i}{border-radius:var(--size-${i});}`;
});

// Add styles to the document head
document.head.appendChild(basicStyle);
document.head.appendChild(componentsStyles);