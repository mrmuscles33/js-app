import Card from './card.js';

export default {
	name: 'Alert',
	properties: [
		...Card.properties.map(prop => {
			switch (prop.name) {
				case 'footer':
					return {
						...prop,
						default: ''
					};
			}
			return prop;
		}), {
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
		const footer = document.querySelector(`amr-text[name="alert-footer"]`);
		const type = document.querySelector(`amr-radio[name="alert-type"][checked="true"]`);

		let tpl = '';
		tpl += `<amr-alert class="w-100"${type.value ? ` status="${type.value}"` : ''}>\n`;
		tpl += `${title.value ? `\t<span slot="header" class="font-weight-700">${title.value}</span>\n` : ''}`;
		tpl += `${message.value ? `\t<span slot="content">${message.value}</span>\n` : ''}`;
		tpl += `${footer.value ? `\t<span slot="footer">${footer.value}</span>\n` : ''}`;
		tpl += `</amr-alert>`;
		return tpl;
	},
	attributes: [
		...Card.attributes,
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
	events: [...Card.events],
	slots: [...Card.slots]
};