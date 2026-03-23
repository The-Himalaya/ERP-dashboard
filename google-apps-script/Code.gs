/**
 * FRP Production Dashboard — Google Sheets Webhook
 *
 * Deploy this as a Google Apps Script Web App:
 *   1. Open your Google Sheet → Extensions → Apps Script
 *   2. Paste this entire file
 *   3. Click Deploy → New deployment → Web App
 *      Execute as: Me
 *      Who has access: Anyone
 *   4. Copy the Web App URL → set as VITE_SHEETS_WEBHOOK_URL in your .env.local
 *
 * The script will create 3 sheets automatically:
 *   - "Production"  : one row per production entry
 *   - "Finishing"   : one row per finishing entry
 *   - "Dispatch"    : one row per dispatch entry
 *
 * The frontend sends POST requests with Content-Type: text/plain
 * and a JSON body: { sheet: "Production", row: [...] }
 */

var SHEET_HEADERS = {
  Production: [
    "Date", "Code", "Color",
    "Cover Qty", "Frame Qty", "Set Qty",
    "Cover KG", "Frame KG", "Total Weight KG",
    "Synced At"
  ],
  Finishing: [
    "Date", "Code", "Color",
    "Cover Finished", "Frame Finished", "Set Finished",
    "Synced At"
  ],
  Dispatch: [
    "Date", "Code", "Color",
    "Cover Dispatched", "Frame Dispatched", "Set Dispatched",
    "Cover KG", "Frame KG", "Total Weight KG",
    "Synced At"
  ]
};

function doPost(e) {
  try {
    var raw  = e.postData.contents;
    var data = JSON.parse(raw);

    var sheetName = data.sheet;
    var row       = data.row;

    if (!sheetName || !Array.isArray(row)) {
      return jsonResponse({ success: false, error: "Missing 'sheet' or 'row'" });
    }

    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);

    // Auto-create the sheet with headers if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      var headers = SHEET_HEADERS[sheetName];
      if (headers) {
        sheet.appendRow(headers);
        sheet.getRange(1, 1, 1, headers.length)
          .setFontWeight("bold")
          .setBackground("#f3f4f6");
        sheet.setFrozenRows(1);
      }
    }

    sheet.appendRow(row);

    return jsonResponse({ success: true });

  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Optional: run this manually once to pre-create all sheets with headers
function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(SHEET_HEADERS).forEach(function(name) {
    var sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
    }
    var headers = SHEET_HEADERS[name];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length)
        .setFontWeight("bold")
        .setBackground("#f3f4f6");
      sheet.setFrozenRows(1);
    }
  });
  SpreadsheetApp.getUi().alert("Sheets created successfully!");
}
