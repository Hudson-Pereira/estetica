const moment = require("moment");

function isValidISODateString(value) {
  return moment(value, "YYYY-MM-DD", true).isValid();
}

function isoDateStringToUtcDate(isoDate) {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

function toISODateString(value) {
  return moment.utc(value).format("YYYY-MM-DD");
}

function formatAgendaForView(agenda) {
  return agenda.map((item) => ({
    ...item,
    data: toISODateString(item.data),
  }));
}

module.exports = {
  isValidISODateString,
  isoDateStringToUtcDate,
  toISODateString,
  formatAgendaForView,
};
