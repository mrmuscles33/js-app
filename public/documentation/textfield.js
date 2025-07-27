import BaseElement from './baseElement.js';

export default {
	name: 'Text Field',
	properties: [
		...BaseElement.properties,
		{
			name: 'label',
			label: 'Label',
			tag: 'amr-text',
			default: 'Field label'
		}, {
			name: 'value',
			label: 'Value',
			tag: 'amr-text',
			default: 'Value'
		}, {
			name: 'maxlength',
			label: 'Max Length',
			tag: 'amr-number',
			default: '128'
		}, {
			name: 'error',
			label: 'Error Message',
			tag: 'amr-text',
			default: ''
		}, {
			name: 'left',
			label: 'Left decoration',
			tag: 'amr-text',
			default: ''
		}, {
			name: 'right',
			label: 'Right decoration',
			tag: 'amr-text',
			default: "<amr-icon value='backspace' class='font-3'></amr-icon>"
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
		const label = document.querySelector(`amr-text[name="textfield-label"]`);
		const value = document.querySelector(`amr-text[name="textfield-value"]`);
		const required = document.querySelector(`amr-checkbox[name="textfield-required"]`);
		const readonly = document.querySelector(`amr-checkbox[name="textfield-readonly"]`);
		const disabled = document.querySelector(`amr-checkbox[name="textfield-disabled"]`);
		const filled = document.querySelector(`amr-checkbox[name="textfield-filled"]`);
		const maxlength = document.querySelector(`amr-number[name="textfield-maxlength"]`);
		const error = document.querySelector(`amr-text[name="textfield-error"]`);
		const left = document.querySelector(`amr-text[name="textfield-left"]`);
		const right = document.querySelector(`amr-text[name="textfield-right"]`);

		let tpl = "";
		tpl += `<amr-text\n`;
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
		tpl += `</amr-text>`;

		return tpl;
	},
	attributes: [
		...BaseElement.attributes,
		{ 
			name: 'value', 
			type: 'string',
			default: '',
			description: 'The current value of the text field'
		}, { 
			name: 'label', 
			type: 'string',
			default: '',
			description: 'Text label displayed above the input field'
		}, { 
			name: 'required', 
			type: 'boolean',
			default: 'false',
			description: 'When set to true, the field must have a value for validation to pass. A red asterisk is displayed next to the label'
		}, { 
			name: 'readonly', 
			type: 'boolean',
			default: 'false',
			description: 'When set to true, the field value cannot be modified but is still submitted with forms'
		}, { 
			name: 'disabled', 
			type: 'boolean',
			default: 'false',
			description: 'When set to true, the field is completely disabled and not interactive'
		}, { 
			name: 'errormessage', 
			type: 'string',
			default: '',
			description: 'Custom error message to display below the field. Automatically set based on validation rules if not provided'
		}, { 
			name: 'pattern', 
			type: 'string',
			default: '',
			description: 'Regular expression pattern for input validation'
		}, { 
			name: 'format', 
			type: 'string',
			default: '',
			description: 'Human-readable format description shown in error messages when pattern validation fails'
		}, { 
			name: 'filled', 
			type: 'boolean',
			default: 'true',
			description: 'When set to true, applies the filled style with background color and bottom border only'
		}, { 
			name: 'maxlength', 
			type: 'number',
			default: '128',
			description: 'Maximum number of characters allowed in the input field'
		}
	],
	events: [
		...BaseElement.events,
		{ 
			name: 'change', 
			description: 'Triggered when the input value changes and focus is lost'
		},
		{ 
			name: 'input', 
			description: 'Triggered on every keystroke as the user types'
		},
		{ 
			name: 'focus', 
			description: 'Triggered when the input field receives focus'
		},
		{ 
			name: 'blur', 
			description: 'Triggered when the input field loses focus'
		},
		{ 
			name: 'keydown', 
			description: 'Triggered when a key is pressed down in the input field'
		},
		{ 
			name: 'keyup', 
			description: 'Triggered when a key is released in the input field'
		}
	],
	slots: [
		...BaseElement.slots,
		{ 
			name: 'left', 
			description: 'Content (typically an icon) to be displayed at the left side of the input field'
		},
		{ 
			name: 'right', 
			description: 'Content (typically an icon) to be displayed at the right side of the input field'
		}
	]
};