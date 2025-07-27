import Calendar from './calendar.js';
import TextField from './textfield.js';
import Dates from '../../Utils/Dates.js';
import baseElement from './baseElement.js';

export default {
	name: 'Date Picker',
	properties: [
		...TextField.properties.filter(prop => !['maxlength', 'value'].includes(prop.name)).map(prop => {
			switch(prop.name) {
				case 'right':
					return {
						...prop,
						default: "<amr-icon value='calendar_today' class='font-3'></amr-icon>"
					};
			}
			return prop;
		}),
		...Calendar.properties.filter(prop => !['readonly'].includes(prop.name)),
	],
	html: function() {
		const label = document.querySelector(`amr-text[name="datepicker-label"]`);
		const required = document.querySelector(`amr-checkbox[name="datepicker-required"]`);
		const readonly = document.querySelector(`amr-checkbox[name="datepicker-readonly"]`);
		const disabled = document.querySelector(`amr-checkbox[name="datepicker-disabled"]`);
		const filled = document.querySelector(`amr-checkbox[name="datepicker-filled"]`);
		const error = document.querySelector(`amr-text[name="datepicker-error"]`);
		const left = document.querySelector(`amr-text[name="datepicker-left"]`);
		const right = document.querySelector(`amr-text[name="datepicker-right"]`);
		const format = document.querySelector(`amr-radio[name="datepicker-format"][checked="true"]`);
		const value = document.querySelector(`amr-text[name="datepicker-value"]`);
		const startWeek = document.querySelector(`amr-radio[name="datepicker-startWeek"][checked="true"]`);
		const min = document.querySelector(`amr-text[name="datepicker-min"]`);
		const max = document.querySelector(`amr-text[name="datepicker-max"]`);

		let tpl = "";
		tpl += `<amr-date\n`;
		tpl += `${label.value ? `\tlabel="${label.value}"\n` : ''}`;
		tpl += `${value.value ? `\tvalue="${value.value}"\n` : ''}`;
		tpl += `${required.checked == 'true' ? '\trequired="true"\n' : ''}`;
		tpl += `${readonly.checked == 'true' ? '\treadonly="true"\n' : ''}`;
		tpl += `${disabled.checked == 'true' ? '\tdisabled="true"\n' : ''}`;
		tpl += `${filled.checked == 'false' ? '\tfilled="false"\n' : ''}`;
		tpl += `${error.value ? `\terrormessage="${error.value}"\n` : ''}`;
		tpl += `${format.value && format.value != 'DD/MM/YYYY' ? `\tformat="${format.value}"\n` : ''}`;
		tpl += `${startWeek.value && startWeek.value != Dates.MONDAY ? `\tstartWeek="${startWeek.value}"\n` : ''}`;
		tpl += `${min.value && min.value != '01/01/1900' ? `\tmin="${min.value}"\n` : ''}`;
		tpl += `${max.value && max.value != '31/12/2099' ? `\tmax="${max.value}"\n` : ''}`;
		tpl += `>\n`;
		if(left.value) {
			tpl += `\t<span slot="left">${left.value}</span>\n`;
		}
		if(right.value && right.value != "<amr-icon value='calendar_today' class='font-3'></amr-icon>") {
			tpl += `\t<span slot="right">${right.value}</span>\n`;
		}
		tpl += `</amr-date>`;

		return tpl;
	},
	attributes: [
		...TextField.attributes.filter(prop => !['maxlength', 'value', 'pattern', 'format'].includes(prop.name)),
		...Calendar.attributes.filter(prop => !['readonly', ...baseElement.attributes.map(attr => attr.name)].includes(prop.name))
	],
	events: [
		...TextField.events,
	],
	slots: [
		...TextField.slots,
	]
};