export function doGet(): GoogleAppsScript.HTML.HtmlOutput {
  const htmlOutput = HtmlService.createTemplateFromFile('index').evaluate();
  htmlOutput.setTitle('残業時間管理くん').addMetaTag('viewport', 'width=device-width, initial-scale=1');
  return htmlOutput;
}
