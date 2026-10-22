/**
 * The Achaar Survey → Google Sheet
 *
 * Paste this into Extensions → Apps Script of YOUR private Google Sheet,
 * then Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
 * The web app can only append rows; nobody can read the sheet through it.
 */

// Optional: the ID from your sheet's URL (docs.google.com/spreadsheets/d/<THIS PART>/edit).
// Only needed if this script was created at script.google.com instead of from the sheet's
// Extensions → Apps Script menu.
const SPREADSHEET_ID = '';
const SHEET_NAME = 'Responses';
const TIMESTAMP_COLUMN = 'Submitted at';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const data = JSON.parse(e.postData.contents);
    const answers = data.answers || {};
    const columns = (data.columns || Object.keys(answers)).map(String);

    appendResponse(answers, columns);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function appendResponse(answers, columns) {
  const ss = book();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  // Keep the header row in sync with the survey, adding any new questions at the end.
  let headers = sheet.getLastColumn() > 0
    ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String)
    : [];
  if (headers.length === 0) headers = [TIMESTAMP_COLUMN];
  columns.forEach(function (c) {
    if (headers.indexOf(c) === -1) headers.push(c);
  });
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
  sheet.setFrozenRows(1);

  const row = headers.map(function (h) {
    if (h === TIMESTAMP_COLUMN) return new Date();
    return clean(answers[h]);
  });
  sheet.appendRow(row);
}

function book() {
  if (SPREADSHEET_ID) return SpreadsheetApp.openById(SPREADSHEET_ID);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('This script is not attached to a sheet. Create it from the sheet (Extensions → Apps Script) or set SPREADSHEET_ID at the top.');
  return ss;
}

// Open the web app URL in a browser to check the setup.
// Add ?test=1 to the end of the URL to write a test row.
function doGet(e) {
  try {
    const ss = book();
    if (e && e.parameter && e.parameter.test) {
      // goes in its own tab so it doesn't disturb the Responses columns
      const test = ss.getSheetByName('Setup test') || ss.insertSheet('Setup test');
      test.appendRow([new Date(), 'The survey can write to this sheet. You can delete this tab.']);
      return json({ ok: true, message: 'Test row added to the "Setup test" tab of "' + ss.getName() + '".' });
    }
    return json({ ok: true, message: 'Achaar survey endpoint is running.', sheet: ss.getName() });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// Store everything as plain text and stop answers from being treated as spreadsheet formulas.
function clean(value) {
  if (value === undefined || value === null) return '';
  const s = String(value).slice(0, 5000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
