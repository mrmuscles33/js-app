import BaseElement from './baseElement.js';

export default {
	name: 'Radio',
	properties: [
		...BaseElement.properties,
		{
			name: 'name',
			label: 'Name',
			tag: 'amr-text',
			default: 'radiogroup'
		}, {
			name: 'items',
			label: 'Items',
			tag: 'amr-number',
			default: 5
		}
	],
	html: function() {
		let name = document.querySelector(`amr-text[name="radio-name"]`);
		let items = document.querySelector(`amr-number[name="radio-items"]`);

		let tpl = '';
		tpl += `<span class="flex-col gap-1 py-1">\n`;
		for(let i = 0; i < items.value; i++) {
			tpl += `\t<amr-radio name="${name.value}" value="${i+1}" label="Radio ${i+1}"${i == 0 ? ' checked="true"' : ''}></amr-radio>\n`;
		}
		tpl += `</span>`;
		return tpl;
	},
	attributes: [
		...BaseElement.attributes,
		{ 
			name: 'label', 
			type: 'string',
			default: '',
			description: 'Text label displayed next to the radio button'
		},
		{ 
			name: 'checked', 
			type: 'boolean',
			default: 'false',
			description: 'Indicates whether the radio button is checked or not'
		},
		{ 
			name: 'value', 
			type: 'string',
			default: '',
			description: 'Value associated with the radio button, used when submitting forms'
		},
		{ 
			name: 'disabled', 
			type: 'boolean',
			default: 'false',
			description: 'When set to true, prevents the user from interacting with the radio button'
		}
	],
	events: [
		...BaseElement.events,
		{ 
			name: 'check', 
			description: 'Triggered when the radio button state changes (checked or unchecked)'
		}
	],
	slots: [
		...BaseElement.slots,
	]
};