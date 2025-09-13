import BaseElement from './baseElement.js';

export default {
	name: 'Tabs',
	properties: [
		...BaseElement.properties,
		{
			name: 'items',
			label: 'Items',
			tag: 'amr-number',
			default: 5
		}, {
			name: 'vertical',
			label: 'Vertical',
			tag: 'amr-checkbox',
			default: 'false'
		}
	],
	html: function() {
		let items = document.querySelector(`amr-number[name="tabs-items"]`);
		let vertical = document.querySelector(`amr-checkbox[name="tabs-vertical"]`);

		let tpl = '';
		tpl += `<amr-tabs class="w-100"${vertical.checked == "true" ? ' vertical="true"' : ''}>\n`;
		for(let i = 0; i < items.value; i++) {
			tpl += `\t<amr-tab label="Tab ${i+1}"${i == 0 ? ' selected="true"' : ''}${i == 2 ? ' disabled="true"' : ''}>Tab ${i+1} content</amr-tab>\n`;
		}
		tpl += `</amr-tabs>`;
		return tpl;
	},
	attributes: [
		...BaseElement.attributes,
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Indicates whether the tab is disabled or not'
		}, {
			name: 'label',
			type: 'string',
			default: '',
			description: 'Text label displayed into each tab button'
		}, {
			name: 'selected',
			type: 'boolean',
			default: 'false',
			description: 'Indicates whether the tab is selected or not'
		}, {
			name: 'vertical',
			type: 'boolean',
			default: 'false',
			description: 'When set to true, displays the tabs vertically instead of horizontally'
		}
	],
	events: [
		...BaseElement.events,
		{ 
			name: 'change', 
			description: 'Triggered when the user selects a different tab'
		}
	],
	slots: [
		...BaseElement.slots,
		{ 
			name: 'tab-button', 
			description: 'Custom tab button, if not provided a default button will be created using the label attribute'
		}, { 
			name: 'tab-content', 
			description: 'Custom tab content, if not provided a default content will be created using node inner HTML'
		}
	]
};