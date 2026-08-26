const React = require('react');
const { View } = require('react-native');

function DateTimePicker(props) {
  return React.createElement(View, { testID: 'date-time-picker', ...props });
}

module.exports = {
  __esModule: true,
  default: DateTimePicker,
};
