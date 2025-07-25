export default {
  name: 'baseElement',
  properties: [],
  html: function() {
    let tpl = '';
    return tpl;
  },
  attributes: [{ 
      name: 'key', 
      type: 'string',
      default: '',
      description: 'The unique key for the element, used as id'
    }, {
      name: 'name', 
      type: 'string',
      default: '',
      description: 'The name of the element, used for identification'
    }, {
      name: 'cls', 
      type: 'string',
      default: '',
      description: 'Additional CSS classes for styling into the element'
    }, {
      name: 'class', 
      type: 'string',
      default: '',
      description: 'Basic CSS classes for styling the element'
    }],
  events: [],
  slots: []
};