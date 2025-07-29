import BaseElement from './baseElement.js';

export default {
	name: 'Grid',
	properties: [
		...BaseElement.properties,
		{
			name: 'store',
			label: 'Store',
			tag: 'amr-text',
			default: 'store-id'
		}
	],
	html: function() {
		let store = document.querySelector(`amr-text[name="grid-store"]`);

		let tpl = '';
		tpl += `<amr-grid\n`;
		tpl += `\tclass="w-100"\n`;
		tpl += `${store.value ? `\tstore="${store.value}"\n` : ''}`;
		tpl += `>\n`;
		tpl += `\t<amr-column field="name" label="Name"></amr-column>\n`;
		tpl += `\t<amr-column field="value" label="Value"></amr-column>\n`;
		tpl += `\t<amr-data name="Item 1" value="Value 1"></amr-data>\n`;
		tpl += `\t<amr-data name="Item 2" value="Value 2"></amr-data>\n`;
		tpl += `\t<amr-data name="Item 3" value="Value 3"></amr-data>\n`;
		tpl += `</amr-grid>`;

		return tpl;
	},
	js: function() {
		let store = document.querySelector(`amr-text[name="grid-store"]`);

		let tpl = '';
		tpl += `const grid = document.querySelector('amr-grid[store="${store.value}"]');\n`;
		tpl += `grid.columns = [\n`;
		tpl += `	{ field: "name", label: "Name" },\n`;
		tpl += `	{ field: "value", label: "Value" }\n`;
		tpl += `];\n`;
		tpl += `grid.items = [\n`;
		tpl += `	{ name: "Item 1", value: "Value 1" },\n`;
		tpl += `	{ name: "Item 2", value: "Value 2" },\n`;
		tpl += `	{ name: "Item 3", value: "Value 3" }\n`;
		tpl += `];\n`;

		return tpl;
	},
	attributes: [
		...BaseElement.attributes,
		{
			name: 'store',
			type: 'string',
			default: 'random',
			description: 'The store identifier for the grid data'
		}, {
			name: 'columns',
			type: 'array',
			default: '[]',
			description: 'The columns configuration for the grid'
		}, {
			name: 'items',
			type: 'array',
			default: '[]',
			description: 'The items to display in the grid'
		}
	],
	events: [
		...BaseElement.events,
	],
	slots: [
		...BaseElement.slots,
	]
};