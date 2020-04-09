export class GoogleScript {
  public getSampleString(): Promise<String> {
    return this.run('getSampleString');
  }
  public getHolidays(startDate: string, endDate: string): Promise<GetHolidayResult> {
    return this.run('getHolidays', startDate, endDate);
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
