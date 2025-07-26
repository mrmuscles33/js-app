import BaseElement from './baseElement.js';

export default {
  name: 'Card',
  properties: [
    ...BaseElement.properties,
    {
      name: 'title',
      label: 'Title',
      tag: 'amr-text',
      default: 'Title'
    }, {
      name: 'message',
      label: 'Message',
      tag: 'amr-text',
      default: 'Content text'
    }, {
      name: 'footer',
      label: 'Footer',
      tag: 'amr-text',
      default: 'Footer'
    }
  ],
  html: function() {
    const title = document.querySelector(`amr-text[name="card-title"]`);
    const message = document.querySelector(`amr-text[name="card-message"]`);
    const footer = document.querySelector(`amr-text[name="card-footer"]`);

    let tpl = '';
    tpl += `<amr-card>\n`;
    tpl += `${title.value ? `\t<span slot="header" class="font-weight-700">${title.value}</span>\n` : ''}`;
    tpl += `${message.value ? `\t<span slot="content">${message.value}</span>\n` : ''}`;
    tpl += `${footer.value ? `\t<span slot="footer">${footer.value}</span>\n` : ''}`;
    tpl += `</amr-card>`;
    return tpl;
  },
  attributes: [
    ...BaseElement.attributes
  ],
  events: [...BaseElement.events],
  slots: [
    ...BaseElement.slots,
    { name: 'header', description: 'The title of the card' },
    { name: 'content', description: 'The message of the card' },
    { name: 'footer', description: 'The footer of the card' }
  ]
};