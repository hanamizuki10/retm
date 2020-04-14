export class GoogleScript {
  public getSampleString(): Promise<String> {
    return this.run('getSampleString');
  }
  public getHolidays(startDate: string, endDate: string): Promise<GetHolidayResult> {
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'production') {
      return this.run('getHolidays', startDate, endDate);
    } else {
      return Promise.resolve({ '2020-03-20': '春分の日', '2020-04-29': '昭和の日' });
    }
  }

  private run(functionName: string, ...args: any[]): Promise<any> {
    if (typeof google === 'undefined' || google.script === undefined) {
      return Promise.reject('google 未定義です。' + functionName + ' の呼び出しに失敗しました。');
    }
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        [functionName](args);
    });
  }
}
