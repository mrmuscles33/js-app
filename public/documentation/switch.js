import BaseElement from './baseElement.js';

export default {
	name: 'Switch',
	properties: [
		...BaseElement.properties,
		{
			name: 'checked',
			label: 'Checked',
			tag: 'amr-checkbox',
			default: 'false'
		}, {
			name: 'disabled',
			label: 'Disabled',
			tag: 'amr-checkbox',
			default: 'false'
		}
	],
	html: function() {
		const checked = document.querySelector(`amr-checkbox[name="switchbutton-checked"]`);
		const disabled = document.querySelector(`amr-checkbox[name="switchbutton-disabled"]`);

		let tpl = "";
		tpl += `<amr-switch\n`;
		tpl += `${checked.checked == 'true' ? '\tchecked="true"\n' : ''}`;
		tpl += `${disabled.checked == 'true' ? '\tdisabled="true"\n' : ''}`;
		tpl += `></amr-switch>`;
		return tpl;
	},
	attributes: [
		...BaseElement.attributes,
		{ 
			name: 'checked', 
			type: 'boolean',
			default: 'false',
			description: 'Indicates whether the switch button is checked or not'
		},
		{ 
			name: 'disabled', 
			type: 'boolean',
			default: 'false',
			description: 'When set to true, prevents the user from interacting with the switch button'
		}
	],
	events: [
		...BaseElement.events,
		{ 
			name: 'change', 
			description: 'Triggered when the switch button state changes (checked or unchecked)'
		}
	],
	slots: [
		...BaseElement.slots,
	]
};