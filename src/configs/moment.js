import moment from 'moment'

moment.updateLocale('en', {
  relativeTime: {
    s: function (number) {
      return number < 5 ? 'a few seconds' : `${number} seconds`
    },
  }
})
