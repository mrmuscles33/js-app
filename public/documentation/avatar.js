import BaseElement from './baseElement.js';

export default {
	name: 'Avatar',
	properties: [
		...BaseElement.properties,
		{
			name: 'src',
			label: 'Image URL',
			tag: 'amr-text',
			default: ''
		},
		{
			name: 'firstname',
			label: 'First name',
			tag: 'amr-text',
			default: 'John'
		},
		{
			name: 'lastname',
			label: 'Last name',
			tag: 'amr-text',
			default: 'Doe'
		},
		{
			name: 'status',
			label: 'Status',
			tag: 'amr-radio',
			default: '',
			options: [
				{ value: 'online', label: 'Online' },
				{ value: 'offline', label: 'Offline' },
				{ value: 'busy', label: 'Busy' },
				{ value: 'away', label: 'Away' },
				{ value: '', label: 'Invisible' }
			]
		}
	],
	html: function() {
		const src = document.querySelector(`amr-text[name="avatar-src"]`);
		const firstname = document.querySelector(`amr-text[name="avatar-firstname"]`);
		const lastname = document.querySelector(`amr-text[name="avatar-lastname"]`);
		const status = document.querySelector(`amr-radio[name="avatar-status"][checked="true"]`);

		let tpl = '';
		tpl += `<amr-avatar\n`;
		tpl += `${src.value ? `\tsrc="${src.value}"\n` : ''}`;
		tpl += `${firstname.value ? `\tfirstname="${firstname.value}"\n` : ''}`;
		tpl += `${lastname.value ? `\tlastname="${lastname.value}"\n` : ''}`;
		tpl += `${status.value ? `\tstatus="${status.value}"\n` : ''}`;
		tpl += `\tclass="w-10 font-3"\n`;
		tpl += `></amr-avatar>`;
		return tpl;
	},
	attributes: [
		...BaseElement.attributes,
		{ 
			name: 'src', 
			type: 'string',
			default: '',
			description: 'URL of the image to display. If not defined, the initials of the first and last name will be displayed'
		},
		{ 
			name: 'firstname', 
			type: 'string',
			default: '',
			description: 'User\'s first name, used for initials if no image is provided'
		},
		{ 
			name: 'lastname', 
			type: 'string',
			default: '',
			description: 'User\'s last name, used for initials if no image is provided'
		},
		{ 
			name: 'status', 
			type: `
				<span class="flex-row gap-x-1 v-align-items-center">
						<amr-badge text="online" status="success"></amr-badge>
						<amr-badge text="offline" status="disabled"></amr-badge>
						<amr-badge text="busy" status="error"></amr-badge>
						<amr-badge text="away" status="warning"></amr-badge>
						<amr-badge text="invisible"></amr-badge>
				</span>
			`,
			default: '<amr-badge text="invisible"></amr-badge>',
			description: 'User\'s presence status indicated by a colored indicator'
		},
		{ 
			name: 'information', 
			type: 'boolean',
			default: 'false',
			description: 'Makes the avatar focusable (tabindex=0) to allow keyboard navigation'
		}
	],
	events: [...BaseElement.events],
	slots: [...BaseElement.slots
	]
};