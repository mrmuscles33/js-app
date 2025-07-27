export default {
	name: 'Tooltip',
	properties: [{
		name: 'text',
		label: 'Tooltip Text',
		tag: 'amr-text',
		default: 'Really cool tooltip text'
	}],
	html: function() {
		const tooltip = document.querySelector(`amr-text[name="tooltip-text"]`);

		let tpl = '';
		tpl += `<amr-button\n`;
		tpl += `	text="Hover me"\n`;
		tpl += `	primary="true"\n`;
		tpl += `${tooltip.value ? `\ttooltip="${tooltip.value}"` : ''}\n`;
		tpl += `></amr-button>`;
		return tpl;
	},
	attributes: [{
		name: 'tooltip',
		type: 'string',
		default: '',
		description: 'The text to display in the tooltip'
	}],
	events: [],
	slots: []
};