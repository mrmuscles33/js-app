import BaseElement from './baseElement.js';

export default {
  name: 'Badge',
  properties: [
    ...BaseElement.properties,
    {
      name: 'text',
      label: 'Text',
      tag: 'amr-text',
      default: 'Badge'
    }, {
      name: 'left',
      label: 'Left decoration',
      tag: 'amr-text',
      default: "<amr-icon value='star'></amr-icon>"
    }, {
      name: 'right',
      label: 'Right decoration',
      tag: 'amr-text',
      default: ''
    }, {
      name: 'status',
      label: 'Status',
      tag: 'amr-radio',
      default: '',
      options: [
        { value: '', label: 'Default' },
        { value: 'info', label: 'Information' },
        { value: 'success', label: 'Success' },
        { value: 'warning', label: 'Warning' },
        { value: 'error', label: 'Error' }
      ]
    }
  ],
  html: function() {
    const text = document.querySelector(`amr-text[name="badge-text"]`);
    const status = document.querySelector(`amr-radio[name="badge-status"][checked="true"]`);
    const left = document.querySelector(`amr-text[name="badge-left"]`);
    const right = document.querySelector(`amr-text[name="badge-right"]`);

    let tpl = "";
    tpl += `<amr-badge`;
    tpl += `${text.value ? ` text="${text.value}"` : ''}`;
    tpl += `${status.value ? ` status="${status.value}"` : ''}`;
    tpl += `>\n`;
    if(left.value) {
      tpl += `  <span slot="left">${left.value}</span>\n`;
    }
    if(right.value) {
      tpl += `  <span slot="right">${right.value}</span>\n`;
    }
    tpl += `</amr-badge>`;

    return tpl;
  },
  attributes: [
    ...BaseElement.attributes,
    { 
      name: 'text', 
      type: 'string',
      default: '',
      description: 'The text content to display inside the badge'
    },
    { 
      name: 'status', 
      type: `
        <span class="flex-row gap-x-1 v-align-items-center">
            <amr-badge text="default"></amr-badge>
            <amr-badge text="info" status="info"></amr-badge>
            <amr-badge text="success" status="success"></amr-badge>
            <amr-badge text="warning" status="warning"></amr-badge>
            <amr-badge text="error" status="error"></amr-badge>
        </span>
      `,
      default: 'default',
      description: 'The status of the badge which determines its visual representation'
    }
  ],
  events: [
    ...BaseElement.events
  ],
  slots: [
    ...BaseElement.slots,
    { 
      name: 'left', 
      description: 'Content to be placed at the left side of the badge text. Useful for icons or additional indicators' 
    },
    { 
      name: 'right', 
      description: 'Content to be placed at the right side of the badge text. Useful for icons or additional indicators' 
    }
  ]
};