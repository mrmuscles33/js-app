import TextField from './textfield.js';

export default {
	name: 'Password Field',
	properties: [
		...TextField.properties,
	],
	html: function() {
		const label = document.querySelector(`amr-text[name="passwordfield-label"]`);
		const value = document.querySelector(`amr-text[name="passwordfield-value"]`);
		const required = document.querySelector(`amr-checkbox[name="passwordfield-required"]`);
		const readonly = document.querySelector(`amr-checkbox[name="passwordfield-readonly"]`);
		const disabled = document.querySelector(`amr-checkbox[name="passwordfield-disabled"]`);
		const filled = document.querySelector(`amr-checkbox[name="passwordfield-filled"]`);
		const maxlength = document.querySelector(`amr-number[name="passwordfield-maxlength"]`);
		const error = document.querySelector(`amr-text[name="passwordfield-error"]`);
		const left = document.querySelector(`amr-text[name="passwordfield-left"]`);

		let tpl = "";
		tpl += `<amr-password\n`;
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
		tpl += `</amr-password>`;

		return tpl;
	},
	attributes: [
		...TextField.attributes.filter(attr => !['type'].includes(attr.name)),
	],
	events: [
		...TextField.events,
	],
	slots: [
		...TextField.slots.filter(slot => !['right'].includes(slot.name)),
	]
};