import Card from './card.js';

export default {
	name: 'Modal',
	properties: [
		...Card.properties, {
			name: 'visible',
			label: 'Visible',
			tag: 'amr-checkbox',
			default: 'false',
			description: 'Determines if the modal is visible'
		}, {
			name: 'closable',
			label: 'Closable',
			tag: 'amr-checkbox',
			default: 'true',
			description: 'Determines if the modal can be closed by clicking outside or pressing the Escape key'
		}
	],
	html: function() {
		const title = document.querySelector(`amr-text[name="modal-title"]`);
		const message = document.querySelector(`amr-text[name="modal-message"]`);
		const footer = document.querySelector(`amr-text[name="modal-footer"]`);
		const visible = document.querySelector(`amr-checkbox[name="modal-visible"]`);
		const closable = document.querySelector(`amr-checkbox[name="modal-closable"]`);
		
		let tpl = '';
		tpl += `<amr-button onclick="this.nextElementSibling.visible = 'true'" text="Open Modal" primary="true"></amr-button>\n`;
		tpl += `<amr-modal\n`;
		tpl += `${visible.checked == 'true' ? `\tvisible="${visible.checked}"\n` : ''}`;
		tpl += `${closable.checked == 'true' ? '' : `\tclosable="${closable.checked}"\n`}`;
		tpl += `>\n`;
		tpl += `${title.value ? `\t<span slot="header" class="font-weight-700">${title.value}</span>\n` : ''}`;
		tpl += `${message.value ? `\t<span slot="content" class="min-w-s">${message.value}</span>\n` : ''}`;
		tpl += `${footer.value ? `\t<span slot="footer">${footer.value}</span>\n` : ''}`;
		tpl += `</amr-modal>`;
		return tpl;
	},
	attributes: [
		...Card.attributes,
		{ 
			name: 'visible', 
			type: `boolean`,
			default: `false`,
			description: 'Determines if the modal is visible'
		}, {
			name: 'closable',
			type: `boolean`,
			default: `true`,
			description: 'Determines if the modal can be closed by clicking outside or pressing the Escape key'
		}
	],
	events: [
		...Card.events,
		{
			name: 'close',
			description: 'Triggered when the modal starts closing'
		}, {
			name: 'closed',
			description: 'Triggered when the modal is closed'
		}, {
			name: 'open',
			description: 'Triggered when the modal starts opening'
		}, {
			name: 'opened',
			description: 'Triggered when the modal is opened'
		}
	],
	slots: [
		...Card.slots,
	]
};