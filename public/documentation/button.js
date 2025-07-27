import BaseElement from './baseElement.js';

export default {
	name: 'Button',
	properties: [
		...BaseElement.properties,
		{
			name: 'text',
			label: 'Text',
			tag: 'amr-text',
			default: 'Button'
		}, {
			name: 'type',
			label: 'Type',
			tag: 'amr-radio',
			default: 'primary',
			options: [
				{ value: 'primary', label: 'Primary' },
				{ value: 'secondary', label: 'Secondary' },
				{ value: 'tertiary', label: 'Tertiary' }
			]
		}, {
			name: 'disabled',
			label: 'Disabled',
			tag: 'amr-checkbox',
			default: 'false'
		}
	],
	html: function() {
		const text = document.querySelector(`amr-text[name="button-text"]`);
		const type = document.querySelector(`amr-radio[name="button-type"][checked="true"]`);
		const disabled = document.querySelector(`amr-checkbox[name="button-disabled"]`);

		let tpl = "";
		tpl += `<amr-button\n`;
		tpl += `${text.value ? `\ttext="${text.value}"\n` : ''}`;
		tpl += `${type.value == "primary" ? `\tprimary="true"\n` : ''}`;
		tpl += `${type.value == "secondary" ? '' : '\tbordered="false"\n'}`;
		tpl += `${disabled.checked === 'true' ? '\tdisabled="true"\n' : ''}`;
		tpl += `></amr-button>`;
		
		return tpl;
	},
	attributes: [
		...BaseElement.attributes,
		{ 
			name: 'text', 
			type: 'string',
			default: '',
			description: 'The text content to display inside the button. If not provided, the content will be empty or use the content slot.'
		},
		{ 
			name: 'primary', 
			type: 'boolean',
			default: 'false',
			description: 'When set to true, applies the primary style to the button with background color based on the primary theme color.'
		},
		{ 
			name: 'bordered', 
			type: 'boolean',
			default: 'true',
			description: 'When set to true, displays a border around the button. When false, the button has no border.'
		},
		{ 
			name: 'disabled', 
			type: 'boolean',
			default: 'false',
			description: 'When set to true, disables the button, preventing user interaction and applying a visual disabled state.'
		}
	],
	events: [
		...BaseElement.events,
		{ 
			name: 'click', 
			description: 'Triggered when the button is clicked or when Enter/Space is pressed while the button has focus.'
		}
	],
	slots: [
		...BaseElement.slots,
		{ 
			name: 'content', 
			description: 'Custom content to be displayed inside the button. Overrides the text attribute if both are provided.'
		}
	]
};