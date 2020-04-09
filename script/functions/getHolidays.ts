export function getHolidays(params: string[]): GetHolidayResult {
  Logger.log(params); // TODO:あとでデバックログ削除
  Logger.log(JSON.stringify(params));// TODO:あとでデバックログ削除
  Logger.log('startDate=' + params[0]);// TODO:あとでデバックログ削除
  Logger.log('endDate=' + params[1]);// TODO:あとでデバックログ削除
  var startDate = new Date(params[0]);
  var endDate = new Date(params[1]);
  Logger.log('startDate=' + Utilities.formatDate(startDate, 'JST', 'yyyy/MM/dd'));// TODO:あとでデバックログ削除
  Logger.log('endDate=' + Utilities.formatDate(endDate, 'JST', 'yyyy/MM/dd'));// TODO:あとでデバックログ削除
  var calendar = CalendarApp.getCalendarById('ja.japanese#holiday@group.v.calendar.google.com'); // 日本の祝日カレンダーを取得
  Logger.log(calendar.getName());// TODO:あとでデバックログ削除
  var events = calendar.getEvents(startDate, endDate);
  Logger.log('events.length=' + events.length);// TODO:あとでデバックログ削除
  var holidays: GetHolidayResult = {};
  for (var i = 0; i < events.length; i++) {
    var targetDate = events[i].getStartTime();
    var dateString = Utilities.formatDate(targetDate, 'JST', 'yyyy/MM/dd');
    var holidayName = events[i].getTitle();
    holidays[dateString] = holidayName;
    Logger.log(dateString + ':' + holidayName);// TODO:あとでデバックログ削除
  }
  return holidays;
}
