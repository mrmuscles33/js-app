import Times from '../../Utils/Times.js';
import TextField from './textfield.js';

export default {
	name: 'Time Picker',
	properties: [
		...TextField.properties.filter(prop => !['maxlength'].includes(prop.name)).map(prop => {
			switch(prop.name) {
				case 'right':
					return {
						...prop,
						default: "<amr-icon value='access_time' class='font-3'></amr-icon>"
					};
				case 'value':
					return {
						...prop,
						default: Times.toText(Times.now(), Times.H_M)
					};
			}
			return prop;
		}), {
			name: 'format',
			label: 'Hours Format',
			tag: 'amr-radio',
			default: Times.H_M,
			options: [
				{ value: Times.H_M, label: Times.H_M },
				{ value: Times.H_M_S, label: Times.H_M_S },
				{ value: Times.HM, label: Times.HM },
				{ value: Times.HMS, label: Times.HMS }
			]
		}, {
			name: 'min',
			label: 'Minimum Hour',
			tag: 'amr-text',
			default: '00:00:00'
		}, {
			name: 'max',
			label: 'Maximum Hour',
			tag: 'amr-text',
			default: '23:59:59'
		}, {
			name: 'second',
			label: 'Show seconds',
			tag: 'amr-checkbox',
			default: 'false'
		}
	],
	html: function() {
		const label = document.querySelector(`amr-text[name="timepicker-label"]`);
		const required = document.querySelector(`amr-checkbox[name="timepicker-required"]`);
		const readonly = document.querySelector(`amr-checkbox[name="timepicker-readonly"]`);
		const disabled = document.querySelector(`amr-checkbox[name="timepicker-disabled"]`);
		const filled = document.querySelector(`amr-checkbox[name="timepicker-filled"]`);
		const error = document.querySelector(`amr-text[name="timepicker-error"]`);
		const left = document.querySelector(`amr-text[name="timepicker-left"]`);
		const right = document.querySelector(`amr-text[name="timepicker-right"]`);
		const format = document.querySelector(`amr-radio[name="timepicker-format"][checked="true"]`);
		const value = document.querySelector(`amr-text[name="timepicker-value"]`);
		const min = document.querySelector(`amr-text[name="timepicker-min"]`);
		const max = document.querySelector(`amr-text[name="timepicker-max"]`);
		const second = document.querySelector(`amr-checkbox[name="timepicker-second"]`);

		let tpl = "";
		tpl += `<amr-time\n`;
		tpl += `${label.value ? `\tlabel="${label.value}"\n` : ''}`;
		tpl += `${value.value ? `\tvalue="${value.value}"\n` : ''}`;
		tpl += `${required.checked == 'true' ? '\trequired="true"\n' : ''}`;
		tpl += `${readonly.checked == 'true' ? '\treadonly="true"\n' : ''}`;
		tpl += `${disabled.checked == 'true' ? '\tdisabled="true"\n' : ''}`;
		tpl += `${filled.checked == 'false' ? '\tfilled="false"\n' : ''}`;
		tpl += `${error.value ? `\terrormessage="${error.value}"\n` : ''}`;
		tpl += `${format.value && format.value != Times.H_M ? `\tformat="${format.value}"\n` : ''}`;
		tpl += `${min.value && min.value != '00:00:00' ? `\tmin="${min.value}"\n` : ''}`;
		tpl += `${max.value && max.value != '23:59:59' ? `\tmax="${max.value}"\n` : ''}`;
		tpl += `${second.checked == 'true' ? '\tsecond="true"\n' : ''}`;
		tpl += `>\n`;
		if(left.value) {
			tpl += `\t<span slot="left">${left.value}</span>\n`;
		}
		if(right.value && right.value != "<amr-icon value='access_time' class='font-3'></amr-icon>") {
			tpl += `\t<span slot="right">${right.value}</span>\n`;
		}
		tpl += `</amr-time>`;

		return tpl;
	},
	attributes: [
		...TextField.attributes.filter(prop => !['maxlength', 'pattern', 'format'].includes(prop.name)),
		{ 
			name: 'format', 
			type: `
				${Times.H_M} | ${Times.H_M_S} | ${Times.HM} | ${Times.HMS}
			`,
			default: Times.H_M,
			description: 'Format used for displaying and parsing hours'
		}, { 
			name: 'value', 
			type: 'string',
			default: 'Current date',
			description: 'The currently selected date in the format specified by the format attribute'
		}, { 
			name: 'startWeek', 
			type: 'number',
			default: '1 (Monday)',
			description: 'Day of the week to start the calendar (0 for Sunday, 1 for Monday, ...)'
		}, { 
			name: 'min', 
			type: 'string',
			default: '01/01/1900',
			description: 'Minimum selectable date in the format specified by the format attribute'
		}, { 
			name: 'max', 
			type: 'string',
			default: '31/12/2099',
			description: 'Maximum selectable date in the format specified by the format attribute'
		}
	],
	events: [
		...TextField.events,
	],
	slots: [
		...TextField.slots,
	]
};