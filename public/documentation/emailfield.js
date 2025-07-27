import TextField from './textfield.js';

export default {
	name: 'Email Field',
	properties: [
		...TextField.properties.map(prop => {
			switch (prop.name) {
				case 'right' :
					return {
						...prop,
						default: ""
					};
				case 'left' :
					return {
						...prop,
						default: "<amr-icon value='alternate_email' class='font-3'></amr-icon>"
					};
				case 'value' :
					return {
						...prop,
						default: "exemple@domaine.com"
					};
			}
			return prop;
		}),
	],
	html: function() {
		const label = document.querySelector(`amr-text[name="emailfield-label"]`);
		const value = document.querySelector(`amr-text[name="emailfield-value"]`);
		const required = document.querySelector(`amr-checkbox[name="emailfield-required"]`);
		const readonly = document.querySelector(`amr-checkbox[name="emailfield-readonly"]`);
		const disabled = document.querySelector(`amr-checkbox[name="emailfield-disabled"]`);
		const filled = document.querySelector(`amr-checkbox[name="emailfield-filled"]`);
		const maxlength = document.querySelector(`amr-number[name="emailfield-maxlength"]`);
		const error = document.querySelector(`amr-text[name="emailfield-error"]`);
		const left = document.querySelector(`amr-text[name="emailfield-left"]`);
		const right = document.querySelector(`amr-text[name="emailfield-right"]`);

		let tpl = "";
		tpl += `<amr-email\n`;
		tpl += `${label.value ? `\tlabel="${label.value}"\n` : ''}`;
		tpl += `${value.value ? `\tvalue="${value.value}"\n` : ''}`;
		tpl += `${required.checked === 'true' ? '\trequired="true"\n' : ''}`;
		tpl += `${readonly.checked === 'true' ? '\treadonly="true"\n' : ''}`;
		tpl += `${disabled.checked === 'true' ? '\tdisabled="true"\n' : ''}`;
		tpl += `${filled.checked === 'false' ? '\tfilled="false"\n' : ''}`;
		tpl += `${maxlength.value !== '128' ? `\tmaxlength="${maxlength.value}"\n` : ''}`;
		tpl += `${error.value ? `\terrormessage="${error.value}"\n` : ''}`;
		tpl += `>\n`;
		if(left.value) {
			tpl += `\t<span slot="left">${left.value}</span>\n`;
		}
		if(right.value) {
			tpl += `\t<span slot="right">${right.value}</span>\n`;
		}
		tpl += `</amr-email>`;

		return tpl;
	},
	attributes: [
		...TextField.attributes.map(attr => {
			switch (attr.name) {
				case 'pattern':
					return {
						...attr,
						default: "^[a-zA-Z0-9_\\.\\-]+@[a-zA-Z0-9_\\.\\-]+\\.[a-zA-Z]{2,4}$"
					};
				case 'format':
					return {
						...attr,
						default: "exemple@domaine.com"
					};
			}
			return attr;
		}),
	],
	events: [
		...TextField.events,
	],
	slots: [
		...TextField.slots,
	]
};