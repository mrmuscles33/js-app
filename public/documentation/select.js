import TextField from './textfield.js';

export default {
	name: 'Select',
	properties: [
		...TextField.properties
			.filter(prop => !['value', 'format', 'maxlength', 'pattern'].includes(prop.name))
			.map(prop => {
			switch (prop.name) {
				case 'right':
					return {
						...prop,
						default: ''
					};
			}
			return prop;
		}), {
			name: 'store',
			label: 'Store',
			tag: 'amr-text',
			default: 'select-store'
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
		const store = document.querySelector(`amr-text[name="select-store"]`);
		const items = document.querySelector(`amr-number[name="select-items"]`);
		const limit = document.querySelector(`amr-number[name="select-limit"]`);
		const label = document.querySelector(`amr-text[name="select-label"]`);
		const required = document.querySelector(`amr-checkbox[name="select-required"]`);
		const readonly = document.querySelector(`amr-checkbox[name="select-readonly"]`);
		const disabled = document.querySelector(`amr-checkbox[name="select-disabled"]`);
		const filled = document.querySelector(`amr-checkbox[name="select-filled"]`);
		const error = document.querySelector(`amr-text[name="select-error"]`);
		const left = document.querySelector(`amr-text[name="select-left"]`);
		const right = document.querySelector(`amr-text[name="select-right"]`);

		let tpl = '';
		tpl += `<amr-select\n`;
		tpl += `${label.value ? `\tlabel="${label.value}"\n` : ''}`;
		tpl += `${required.checked === 'true' ? '\trequired="true"\n' : ''}`;
		tpl += `${readonly.checked === 'true' ? '\treadonly="true"\n' : ''}`;
		tpl += `${disabled.checked === 'true' ? '\tdisabled="true"\n' : ''}`;
		tpl += `${filled.checked === 'false' ? '\tfilled="false"\n' : ''}`;
		tpl += `${error.value ? `\terrormessage="${error.value}"\n` : ''}`;
		tpl += `${store.value ? `\tstore="${store.value}"\n` : ''}`;
		tpl += `${limit.value ? `\tlimit="${limit.value}"\n` : ''}`;
		tpl += `>\n`;
		if(left.value) {
			tpl += `\t<span slot="left">${left.value}</span>\n`;
		}
		if(right.value) {
			tpl += `\t<span slot="right">${right.value}</span>\n`;
		}
		let selectedIdx = 0;
		let disabledIdx = 1;
		for (let i = 0; i < items.value; i++) {
			tpl += `\t<amr-option value="value-${i + 1}" label="Item ${i + 1}"${selectedIdx == i ? ' selected="true"' : ''}${disabledIdx == i ? ' disabled="true"' : ''}></amr-option>\n`;
		}
		tpl += `</amr-select>\n`;
		return tpl;
	},
	js: function() {
		let store = document.querySelector(`amr-text[name="select-store"]`);
		let items = document.querySelector(`amr-number[name="select-items"]`);

		let selectedIdx = 0;
		let disabledIdx = 1;

		let tpl = '';
		tpl += `const select = document.querySelector('amr-select[store="${store.value}"]');\n`;
		tpl += `select.options = [\n`;
		for (let i = 0; i < items.value; i++) {
			tpl += `\t{ value: "value-${i + 1}", label: "Item ${i + 1}"${selectedIdx == i ? ', selected: "true"' : ''}${disabledIdx == i ? ', disabled: "true"' : ''} },\n`;
		}
		tpl += `];\n`;

		return tpl;
	},
	attributes: [
		...TextField.attributes.filter(prop => !['value', 'format', 'maxlength', 'pattern'].includes(prop.name)),
	],
	events: [
		...TextField.events,
	],
	slots: [
		...TextField.slots,
	]
};