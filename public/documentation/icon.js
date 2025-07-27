import BaseElement from './baseElement.js';

export default {
  name: 'Icon',
  properties: [
    ...BaseElement.properties,
    {
      name: 'value',
      label: 'Icon Name',
      tag: 'amr-text',
      default: 'home'
    },
    {
      name: 'action',
      label: 'Clickable',
      tag: 'amr-checkbox',
      default: 'false',
    }
  ],
  html: function() {
    const value = document.querySelector(`amr-text[name="icon-value"]`);
    const action = document.querySelector(`amr-checkbox[name="icon-action"]`);

    let tpl = "";
	tpl += `<amr-icon class="font-5"\n`;
	tpl += `${value.value ? `\tvalue="${value.value}"\n` : ''}`;
	tpl += `${action.checked == 'true' ? '\taction="true"\n' : ''}`;
	tpl += `></amr-icon>`;

    return tpl;
  },
  attributes: [
    ...BaseElement.attributes,
    { 
      name: 'value', 
      type: 'string',
      default: '',
      description: 'Name of the Material Design icon to display. Uses the Google Material Icons font.'
    },
    { 
      name: 'action', 
      type: 'boolean',
      default: 'false',
      description: 'When set to true, makes the icon clickable, adding pointer cursor, tabindex, and keyboard accessibility.'
    }
  ],
  events: [
    ...BaseElement.events,
    { 
      name: 'click', 
      description: 'Triggered when the icon is clicked (only available when action="true").'
    }
  ],
  slots: [
    ...BaseElement.slots
  ]
};