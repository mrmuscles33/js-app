import TextField from './textfield.js';

export default {
	name: 'Phone Field',
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
						default: "<amr-icon value='call' class='font-3'></amr-icon>"
					};
				case 'value' :
					return {
						...prop,
						default: "01.23.45.67.89"
					};
				case 'maxlength' :
					return {
						...prop,
						default: "20"
					};
			}
			return prop;
		}),
	],
	html: function() {
		const label = document.querySelector(`amr-text[name="phonefield-label"]`);
		const value = document.querySelector(`amr-text[name="phonefield-value"]`);
		const required = document.querySelector(`amr-checkbox[name="phonefield-required"]`);
		const readonly = document.querySelector(`amr-checkbox[name="phonefield-readonly"]`);
		const disabled = document.querySelector(`amr-checkbox[name="phonefield-disabled"]`);
		const filled = document.querySelector(`amr-checkbox[name="phonefield-filled"]`);
		const maxlength = document.querySelector(`amr-number[name="phonefield-maxlength"]`);
		const error = document.querySelector(`amr-text[name="phonefield-error"]`);
		const left = document.querySelector(`amr-text[name="phonefield-left"]`);
		const right = document.querySelector(`amr-text[name="phonefield-right"]`);

		let tpl = "";
		tpl += `<amr-phone\n`;
		tpl += `${label.value ? `\tlabel="${label.value}"\n` : ''}`;
		tpl += `${value.value ? `\tvalue="${value.value}"\n` : ''}`;
		tpl += `${required.checked === 'true' ? '\trequired="true"\n' : ''}`;
		tpl += `${readonly.checked === 'true' ? '\treadonly="true"\n' : ''}`;
		tpl += `${disabled.checked === 'true' ? '\tdisabled="true"\n' : ''}`;
		tpl += `${filled.checked === 'false' ? '\tfilled="false"\n' : ''}`;
		tpl += `${maxlength.value !== '20' ? `\tmaxlength="${maxlength.value}"\n` : ''}`;
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
						default: "^\\+?(\\d[\\d\\-\\. ]+)?(\\([\\d\\-\\. ]+\\))?\\d[\\d\\-\\. ]+\\d$"
					};
				case 'format':
					return {
						...attr,
						default: "01.23.45.67.89"
					};
				case 'maxlength':
					return {
						...attr,
						default: "20"
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