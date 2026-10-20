/**
 * The Achaar Survey → Google Sheet
 *
 * Paste this into Extensions → Apps Script of YOUR private Google Sheet,
 * then Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
 * The web app can only append rows; nobody can read the sheet through it.
 */

const SHEET_NAME = 'Responses';
const TIMESTAMP_COLUMN = 'Submitted at';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const data = JSON.parse(e.postData.contents);
    const answers = data.answers || {};
    const columns = (data.columns || Object.keys(answers)).map(String);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
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

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// A quick check you can open in the browser to confirm the deployment is live.
function doGet() {
  return json({ ok: true, message: 'Achaar survey endpoint is running.' });
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
