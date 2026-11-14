/**
 * Google Apps Script — lưu lời chúc & xác nhận tham dự cho thiệp thôi nôi.
 * Dán toàn bộ file này vào Extensions → Apps Script của Google Sheet, rồi Deploy → Web app
 * (Execute as: Me, Who has access: Anyone). Xem README để biết từng bước.
 *
 * Sheet "LoiChuc":  Thời gian | Tên | Lời chúc | Hiện   (đổi cột Hiện thành FALSE để ẩn một lời chúc)
 * Sheet "XacNhan":  Thời gian | Tên | Tham dự | Số người | Ghi chú
 */

var WISH_SHEET = 'LoiChuc';
var RSVP_SHEET = 'XacNhan';
var MAX_WISHES = 300;

function sheet_(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Chặn "formula injection": ô bắt đầu bằng = + - @ sẽ bị Sheet hiểu là công thức. */
function clean_(value, max) {
  var s = String(value == null ? '' : value).trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

/** GET → danh sách lời chúc đang hiện, mới nhất trước. */
function doGet() {
  var sh = sheet_(WISH_SHEET, ['Thời gian', 'Tên', 'Lời chúc', 'Hiện']);
  var last = sh.getLastRow();
  if (last < 2) return json_({ ok: true, wishes: [] });
  var rows = sh.getRange(2, 1, last - 1, 4).getValues();
  var wishes = [];
  for (var i = rows.length - 1; i >= 0 && wishes.length < MAX_WISHES; i--) {
    var r = rows[i];
    if (r[3] === false || String(r[3]).toUpperCase() === 'FALSE') continue;
    var t = r[0] instanceof Date ? r[0].toISOString() : String(r[0]);
    wishes.push({ time: t, name: String(r[1]).replace(/^'/, ''), message: String(r[2]).replace(/^'/, '') });
  }
  return json_({ ok: true, wishes: wishes });
}

/** POST (body JSON dạng text/plain) → ghi lời chúc hoặc xác nhận. */
function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: 'Dữ liệu không hợp lệ' });
  }
  // Ô bẫy bot có giá trị → giả vờ thành công, không ghi.
  if (data.website) return json_({ ok: true });

  var name = clean_(data.name, 60);
  if (!name) return json_({ ok: false, error: 'Vui lòng nhập tên' });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (data.type === 'wish') {
      var message = clean_(data.message, 500);
      if (!message) return json_({ ok: false, error: 'Vui lòng nhập lời chúc' });
      sheet_(WISH_SHEET, ['Thời gian', 'Tên', 'Lời chúc', 'Hiện']).appendRow([new Date(), name, message, true]);
      return json_({ ok: true });
    }
    if (data.type === 'rsvp') {
      var attending = data.attending === true;
      var guests = attending ? Math.max(1, Math.min(10, parseInt(data.guests, 10) || 1)) : 0;
      sheet_(RSVP_SHEET, ['Thời gian', 'Tên', 'Tham dự', 'Số người', 'Ghi chú']).appendRow([
        new Date(),
        name,
        attending ? 'Có' : 'Không',
        guests,
        clean_(data.note, 200),
      ]);
      return json_({ ok: true });
    }
    return json_({ ok: false, error: 'Loại dữ liệu không hợp lệ' });
  } finally {
    lock.releaseLock();
  }
}
