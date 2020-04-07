export class GoogleScript {
  public getSampleString(): Promise<String> {
    return this.run('getSampleString');
  }
  public getHoliday(startDate: Date, endDate: Date): Promise<GetHolidayResult> {
    return this.run('getHoliday', { startDate: startDate, endDate: endDate });
  }

  private run(functionName: string, ...args: any[]): Promise<any> {
    if (typeof google === 'undefined' || google.script === undefined) {
      console.log('残念');
      return Promise.resolve('残念');
    }
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        [functionName](args);
    });
  }
}
