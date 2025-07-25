import BaseElement from './baseElement.js';

export default {
  name: 'Alert',
  properties: [
    ...BaseElement.properties,
    {
      name: 'title',
      label: 'Title',
      tag: 'amr-text',
      default: 'Alert'
    },
    {
      name: 'message',
      label: 'Message',
      tag: 'amr-text',
      default: 'Alert message !'
    },
    {
      name: 'type',
      label: 'Type',
      tag: 'amr-radio',
      default: '',
      options: [
        { value: '', label: 'Default' },
        { value: 'info', label: 'Information' },
        { value: 'warning', label: 'Warning' },
        { value: 'error', label: 'Error' },
        { value: 'success', label: 'Success' }
      ]
    }
  ],
  html: function() {
    const title = document.querySelector(`amr-text[name="alert-title"]`);
    const message = document.querySelector(`amr-text[name="alert-message"]`);
    const type = document.querySelector(`amr-radio[name="alert-type"][checked="true"]`);

    let tpl = '';
    tpl += `<amr-alert${type.value ? ` status="${type.value}"` : ''}>\n`;
    tpl += `    <span slot="header" class="font-weight-700">${title.value}</span>\n`;
    tpl += `    <span slot="content">${message.value}</span>\n`;
    tpl += `</amr-alert>`;
    return tpl;
  },
  attributes: [
    ...BaseElement.attributes,
    { 
      name: 'status', 
      type: `
        <span class="flex-row gap-x-1 v-align-items-center">
            <amr-badge text="default"></amr-badge>
            <amr-badge status="info" text="info"></amr-badge>
            <amr-badge status="warning" text="warning"></amr-badge>
            <amr-badge status="error" text="error"></amr-badge>
            <amr-badge status="success" text="success"></amr-badge>
        </span>
      `,
      default: `<amr-badge text="default"></amr-badge>`,
      description: 'The status of the alert which determines its visual representation'
    }
  ],
  events: [...BaseElement.events],
  slots: [
    ...BaseElement.slots,
    { name: 'header', description: 'The title of the alert' },
    { name: 'content', description: 'The message of the alert' }
  ]
};