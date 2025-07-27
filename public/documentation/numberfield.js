import TextField from './textfield.js';

export default {
	name: 'Number Field',
	properties: [
		{
			name: 'label',
			label: 'Label',
			tag: 'amr-text',
			default: 'Number Field'
		}, {
			name: 'value',
			label: 'Value',
			tag: 'amr-number',
			default: '1500.00'
		}, {
			name: 'min',
			label: 'Min Value',
			tag: 'amr-number',
			default: ''
		}, {
			name: 'max',
			label: 'Max Value',
			tag: 'amr-number',
			default: ''
		}, {
			name: 'error',
			label: 'Error Message',
			tag: 'amr-text',
			default: ''
		}, {
			name: 'left',
			label: 'Left decoration',
			tag: 'amr-text',
			default: "<amr-icon value='attach_money' class='font-3'></amr-icon>"
		}, {
			name: 'right',
			label: 'Right decoration',
			tag: 'amr-text',
			default: ""
		}, {
			name: 'required',
			label: 'Required',
			tag: 'amr-checkbox',
			default: 'false',
		}, {
			name: 'readonly',
			label: 'Read Only',
			tag: 'amr-checkbox',
			default: 'false',
		}, {
			name: 'disabled',
			label: 'Disabled',
			tag: 'amr-checkbox',
			default: 'false',
		}, {
			name: 'filled',
			label: 'Filled Style',
			tag: 'amr-checkbox',
			default: 'true',
		}
	],
	html: function() {
		const label = document.querySelector(`amr-text[name="numberfield-label"]`);
		const value = document.querySelector(`amr-number[name="numberfield-value"]`);
		const required = document.querySelector(`amr-checkbox[name="numberfield-required"]`);
		const readonly = document.querySelector(`amr-checkbox[name="numberfield-readonly"]`);
		const disabled = document.querySelector(`amr-checkbox[name="numberfield-disabled"]`);
		const filled = document.querySelector(`amr-checkbox[name="numberfield-filled"]`);
		const min = document.querySelector(`amr-number[name="numberfield-min"]`);
		const max = document.querySelector(`amr-number[name="numberfield-max"]`);
		const error = document.querySelector(`amr-text[name="numberfield-error"]`);
		const left = document.querySelector(`amr-text[name="numberfield-left"]`);
		const right = document.querySelector(`amr-text[name="numberfield-right"]`);

		let tpl = "";
		tpl += `<amr-number\n`;
		tpl += `${label.value ? `\tlabel="${label.value}"\n` : ''}`;
		tpl += `${value.value ? `\tvalue="${value.value}"\n` : ''}`;
		tpl += `${required.checked === 'true' ? '\trequired="true"\n' : ''}`;
		tpl += `${readonly.checked === 'true' ? '\treadonly="true"\n' : ''}`;
		tpl += `${disabled.checked === 'true' ? '\tdisabled="true"\n' : ''}`;
		tpl += `${filled.checked === 'false' ? '\tfilled="false"\n' : ''}`;
		tpl += `${min.value ? `\tmin="${min.value}"\n` : ''}`;
		tpl += `${max.value ? `\tmax="${max.value}"\n` : ''}`;
		tpl += `${error.value ? `\terrormessage="${error.value}"\n` : ''}`;
		tpl += `>\n`;
		if(left.value) {
			tpl += `\t<span slot="left">${left.value}</span>\n`;
		}
		if(right.value) {
			tpl += `\t<span slot="right">${right.value}</span>\n`;
		}
		tpl += `</amr-number>`;

		return tpl;
	},
	attributes: [
		...TextField.attributes.filter(attr => !['value', 'pattern', 'format', 'maxlength'].includes(attr.name)),
		{ 
			name: 'value', 
			type: 'number', 
			default: '',
			description: 'The value of the number field' 
		}, {
			name: 'min',
			type: 'number',
			default: '',
			description: 'The minimum value allowed in the number field'
		}, {
			name: 'max',
			type: 'number',
			default: '',
			description: 'The maximum value allowed in the number field'
		}, {
			name: 'decimal',
			type: 'number',
			default: 2,
			description: 'The number of decimal places allowed in the number field'
		}, {
			name: 'integer',
			type: 'number',
			default: 9,
			description: 'The maximum number of integer digits allowed in the number field'
		}
	],
	events: [
		...TextField.events,
	],
	slots: [
		...TextField.slots,
	]
};