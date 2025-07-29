import BaseElement from './baseElement.js';

export default {
	name: 'List',
	properties: [
		...BaseElement.properties,
		{
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
		let items = document.querySelector(`amr-number[name="list-items"]`);
		let limit = document.querySelector(`amr-number[name="list-limit"]`);

		let tpl = '';
		tpl += `<amr-list${limit ? ` limit="${limit.value}"` : ''}>\n`;
		for (let i = 0; i < items.value; i++) {
			tpl += `\t<amr-option value="value-${i + 1}">Item ${i + 1}</amr-option>\n`;
		}
		tpl += `</amr-list>\n`;
		return tpl;
	},
	attributes: [
		...BaseElement.attributes,
		{ 
			name: 'limit', 
			type: 'number',
			default: '1',
			description: 'The maximum number of items to check in the list'
		}, {
			name: 'value',
			type: 'string',
			default: '',
			description: 'The value of each item in the list'
		}
	],
	events: [
		...BaseElement.events,
	],
	slots: [
		...BaseElement.slots,
	]
};