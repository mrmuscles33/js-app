import BaseElement from './baseElement.js';

export default {
  name: 'Tooltip',
  properties: [
    ...BaseElement.properties,
  ],
  html: function() {
    let tpl = '';
    return tpl;
  },
  attributes: [
    ...BaseElement.attributes,
  ],
  events: [
    ...BaseElement.events,
  ],
  slots: [
    ...BaseElement.slots,
  ]
};