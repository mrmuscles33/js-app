import BaseElement from './baseElement.js';

export default {
	name: 'List',
	properties: [
		...BaseElement.properties,
		{
			name: 'store',
			label: 'Store',
			tag: 'amr-text',
			default: 'list-store'
		}, {
			name: 'limit',
			label: 'Limit',
			tag: 'amr-number',
			default: 2
		}, {
			name: 'items',
			label: 'Items',
			tag: 'amr-number',
			default: 5
		}
	],
	html: function() {
		let store = document.querySelector(`amr-text[name="list-store"]`);
		let items = document.querySelector(`amr-number[name="list-items"]`);
		let limit = document.querySelector(`amr-number[name="list-limit"]`);

		let tpl = '';
		tpl += `<amr-list${limit.value ? ` limit="${limit.value}"` : ''}${store.value ? ` store="${store.value}"` : ''}>\n`;
		let selected = 0;
		let disabled = 1;
		for (let i = 0; i < items.value; i++) {
			tpl += `\t<amr-option value="value-${i + 1}" label="Item ${i + 1}"${selected == i ? ' selected="true"' : ''}${disabled == i ? ' disabled="true"' : ''}></amr-option>\n`;
		}
		tpl += `</amr-list>\n`;
		return tpl;
	},
	js: function() {
		let store = document.querySelector(`amr-text[name="list-store"]`);
		let items = document.querySelector(`amr-number[name="list-items"]`);

		let selected = 0;
		let disabled = 1;

		let tpl = '';
		tpl += `const list = document.querySelector('amr-list[store="${store.value}"]');\n`;
		tpl += `list.options = [\n`;
		for (let i = 0; i < items.value; i++) {
			tpl += `\t{ value: "value-${i + 1}", label: "Item ${i + 1}"${selected == i ? ', selected: "true"' : ''}${disabled == i ? ', disabled: "true"' : ''} },\n`;
		}
		tpl += `];\n`;

		return tpl;
	},
	attributes: [
		...BaseElement.attributes,
		{
			name: 'store',
			type: 'string',
			default: 'random',
			description: 'The store identifier for the options'
		}, { 
			name: 'limit', 
			type: 'number',
			default: '',
			description: 'The maximum number of items to check in the list'
		}, {
			name: 'value',
			type: 'string',
			default: '',
			description: 'The value of each item in the list'
		}, {
			name: 'selected',
			type: 'string',
			default: '',
			description: 'Defines if the item is selected'
		}, {
			name: 'disabled',
			type: 'string',
			default: '',
			description: 'Defines if the item is disabled'
		}, {
			name: 'options',
			type: 'array',
			default: '[]',
			description: 'The options configuration for the list'
		}
	],
	events: [
		...BaseElement.events,
		{
			name: 'change',
			description: 'Triggered when an item is selected'
		}
	],
	slots: [
		...BaseElement.slots,
	]
};