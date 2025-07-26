import TextField from './textfield.js';

export default {
  name: 'Password Field',
  properties: [
    ...TextField.properties,
  ],
  html: function() {
    let tpl = '';
    return tpl;
  },
  attributes: [
    ...TextField.attributes,
  ],
  events: [
    ...TextField.events,
  ],
  slots: [
    ...TextField.slots,
  ]
};