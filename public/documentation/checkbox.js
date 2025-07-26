import BaseElement from './baseElement.js';

export default {
  name: 'Checkbox',
  properties: [
    ...BaseElement.properties,
    {
      name: 'label',
      label: 'Label',
      tag: 'amr-text',
      default: 'Checkbox'
    }, {
      name: 'checked',
      label: 'Checked',
      tag: 'amr-checkbox',
      default: 'false'
    }, {
      name: 'disabled',
      label: 'Disabled',
      tag: 'amr-checkbox',
      default: 'false'
    }
  ],
  html: function() {
    const label = document.querySelector(`amr-text[name="checkbox-label"]`);
    const checked = document.querySelector(`amr-checkbox[name="checkbox-checked"]`);
    const disabled = document.querySelector(`amr-checkbox[name="checkbox-disabled"]`);

    let tpl = "";
    tpl += `<amr-checkbox\n`;
    tpl += `${label.value ? `\tlabel="${label.value}"\n` : ''}`;
    tpl += `${checked.checked == 'true' ? '\tchecked="true"\n' : ''}`;
    tpl += `${disabled.checked == 'true' ? '\tdisabled="true"\n' : ''}`;
    tpl += `></amr-checkbox>`;

    return tpl;
  },
  attributes: [
    ...BaseElement.attributes,
    { 
      name: 'label', 
      type: 'string',
      default: '',
      description: 'Text label displayed next to the checkbox'
    },
    { 
      name: 'checked', 
      type: 'boolean',
      default: 'false',
      description: 'Indicates whether the checkbox is checked or not'
    },
    { 
      name: 'value', 
      type: 'string',
      default: '',
      description: 'Value associated with the checkbox, used when submitting forms'
    },
    { 
      name: 'disabled', 
      type: 'boolean',
      default: 'false',
      description: 'When set to true, prevents the user from interacting with the checkbox'
    }
  ],
  events: [
    ...BaseElement.events,
    { 
      name: 'change', 
      description: 'Triggered when the checkbox state changes (checked or unchecked)'
    }
  ],
  slots: [
    ...BaseElement.slots
  ]
};