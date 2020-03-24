export function doGet(): GoogleAppsScript.HTML.HtmlOutput {
  const htmlOutput = HtmlService.createTemplateFromFile('index').evaluate();
  htmlOutput.setTitle('GAS+Vue.js').addMetaTag('viewport', 'width=device-width, initial-scale=1');
  return htmlOutput;
}
