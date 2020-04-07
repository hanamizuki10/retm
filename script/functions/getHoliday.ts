export function getHoliday(startDate: Date, endDate: Date): GetHolidayResult {
  var calendar = CalendarApp.getCalendarById(
  'ja.japanese#holiday@group.v.calendar.google.com'
  ); // 日本の祝日カレンダーを取得

  var events = calendar.getEvents(startDate, endDate);
  var holidays: GetHolidayResult = {};
  // GoogleAppsScript.Base.Date;

  for (var i = 0; i < events.length; i++) {
    var targetDate = events[i].getStartTime();
    var dateString = Utilities.formatDate(targetDate, 'JST', 'yyyy/MM/dd');
    var holidayName = events[i].getTitle();
    holidays[dateString] = holidayName;
  }
  return holidays;
}
