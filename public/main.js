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
import Toolbar from "../Components/Toolbar.js";
import TimePicker from "../Components/TimePicker.js";
import Avatar from "../Components/Avatar.js";
import Icon from "../Components/Icon.js";
import Badge from "../Components/Badge.js";
import List from "../Components/List.js";
import Select from "../Components/Select.js";

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
customElements.define("amr-time", TimePicker);
customElements.define("amr-avatar", Avatar);
customElements.define("amr-icon", Icon);
customElements.define("amr-badge", Badge);
customElements.define("amr-list", List);
customElements.define("amr-select", Select);

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
	${Toolbar.style()}
	${TimePicker.style()}
	${Avatar.style()}
	${Icon.style()}
	${Badge.style()}
	${List.style()}
	${Select.style()}
`;

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
		}
	});
});

// Width and height
["width","height"].forEach(v => {
	let v2 = v.charAt(0);
	["xxs","xs","s","m","l","xl","xxl"].forEach(v3 => {
		basicStyle.innerHTML += `.${v2}-${v3}{${v}:var(--size-${v3});}`;
		basicStyle.innerHTML += `.m${v2}-${v3}{max-${v}:var(--size-${v3});}`;
	});
	[...Array(5)].forEach((e, i) => {
		let v3 = i * 25;
		basicStyle.innerHTML += `.${v2}-${v3}{${v}:${v3}%;}`;
		basicStyle.innerHTML += `.m${v2}-${v3}{max-${v}:${v3}%;}`;
	});
	basicStyle.innerHTML += `.${v2}-auto{${v}:auto;}`;
	basicStyle.innerHTML += `.${v2}-screen{${v}:100v${v2};}`;
});

// Overflow
["hidden","scroll","auto"].forEach(v => {
	basicStyle.innerHTML += `.overflow-${v}{overflow:${v};}`;
	basicStyle.innerHTML += `.overflow-x-${v}{overflow-x:${v};}`;
	basicStyle.innerHTML += `.overflow-y-${v}{overflow-y:${v};}`;
});

// Add styles to the document head
document.head.appendChild(basicStyle);
document.head.appendChild(componentsStyles);