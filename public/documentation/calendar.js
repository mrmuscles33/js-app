import Dates from '../../Utils/Dates.js';
import BaseElement from './baseElement.js';

export default {
  name: 'Calendar',
  properties: [
    ...BaseElement.properties,
    {
      name: 'value',
      label: 'Selected Date',
      tag: 'amr-text',
      default: Dates.toText(Dates.today(), Dates.D_M_Y)
    }, {
      name: 'min',
      label: 'Minimum Date',
      tag: 'amr-text',
      default: '01/01/1900'
    }, {
      name: 'max',
      label: 'Maximum Date',
      tag: 'amr-text',
      default: '31/12/2099'
    }, {
      name: 'format',
      label: 'Date Format',
      tag: 'amr-radio',
      default: Dates.D_M_Y,
      options: [
        { value: Dates.D_M_Y, label: Dates.D_M_Y },
        { value: Dates.M_D_Y, label: Dates.M_D_Y },
        { value: Dates.Y_M_D, label: Dates.Y_M_D },
        { value: Dates.Y_D_M, label: Dates.Y_D_M },
        { value: Dates.MDY, label: Dates.MDY },
        { value: Dates.DMY, label: Dates.DMY },
        { value: Dates.YMD, label: Dates.YMD },
        { value: Dates.YDM, label: Dates.YDM }
      ]
    }, {
      name: 'startWeek',
      label: 'Start Week',
      tag: 'amr-radio',
      default: Dates.MONDAY,
      options: [
        { value: Dates.MONDAY, label: 'Monday' },
        { value: Dates.TUESDAY, label: 'Tuesday' },
        { value: Dates.WEDNESDAY, label: 'Wednesday' },
        { value: Dates.THURSDAY, label: 'Thursday' },
        { value: Dates.FRIDAY, label: 'Friday' },
        { value: Dates.SATURDAY, label: 'Saturday' },
        { value: Dates.SUNDAY, label: 'Sunday' }
      ]
    }, {
      name: 'readonly',
      label: 'Read Only',
      tag: 'amr-checkbox',
      default: 'false'
    }
  ],
  html: function() {
    const format = document.querySelector(`amr-radio[name="calendar-format"][checked="true"]`);
    const value = document.querySelector(`amr-text[name="calendar-value"]`);
    const startWeek = document.querySelector(`amr-radio[name="calendar-startWeek"][checked="true"]`);
    const min = document.querySelector(`amr-text[name="calendar-min"]`);
    const max = document.querySelector(`amr-text[name="calendar-max"]`);
    const readonly = document.querySelector(`amr-checkbox[name="calendar-readonly"]`);

    let tpl = "";
    tpl += `<amr-calendar\n`;
    tpl += `${format.value && format.value != Dates.D_M_Y ? `\tformat="${format.value}"\n` : ''}`;
    tpl += `${value.value && value.value != Dates.toText(Dates.today(), Dates.D_M_Y) ? `\tvalue="${value.value}"\n` : ''}`;
    tpl += `${startWeek.value && startWeek.value != Dates.MONDAY ? `\tstartWeek="${startWeek.value}"\n` : ''}`;
    tpl += `${min.value && min.value != '01/01/1900' ? `\tmin="${min.value}"\n` : ''}`;
    tpl += `${max.value && max.value != '31/12/2099' ? `\tmax="${max.value}"\n` : ''}`;
    tpl += `${readonly.checked == "true" ? '\treadonly="true"\n' : ''}`;
    tpl += `\tclass="w-xs"\n`;
    tpl += `></amr-calendar>`;

    return tpl;
  },
  attributes: [
    ...BaseElement.attributes,
    { 
      name: 'format', 
      type: `
        ${Dates.D_M_Y} | ${Dates.M_D_Y} | ${Dates.Y_M_D} | ${Dates.Y_D_M}<br/>
        ${Dates.MDY} | ${Dates.DMY} | ${Dates.YMD} | ${Dates.YDM}
      `,
      default: Dates.D_M_Y,
      description: 'Format used for displaying and parsing dates'
    },
    { 
      name: 'value', 
      type: 'string',
      default: 'Current date',
      description: 'The currently selected date in the format specified by the format attribute'
    },
    { 
      name: 'startWeek', 
      type: 'number',
      default: '1 (Monday)',
      description: 'Day of the week to start the calendar (0 for Sunday, 1 for Monday, ...)'
    },
    { 
      name: 'min', 
      type: 'string',
      default: '01/01/1900',
      description: 'Minimum selectable date in the format specified by the format attribute'
    },
    { 
      name: 'max', 
      type: 'string',
      default: '31/12/2099',
      description: 'Maximum selectable date in the format specified by the format attribute'
    },
    { 
      name: 'readonly', 
      type: 'boolean',
      default: 'false',
      description: 'When set to true, prevents the user from changing the selected date or navigating the calendar'
    }
  ],
  events: [
    ...BaseElement.events,
    { 
      name: 'change', 
      description: 'Triggered when the user selects a new date in the calendar'
    }
  ],
  slots: [
    ...BaseElement.slots
  ]
};