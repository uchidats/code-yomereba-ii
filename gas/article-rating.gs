/**
 * 記事評価カウンター & クイズ統計 (GAS Backend)
 * 
 * 【スプレッドシート構成】
 * 1. シート名: ArticleRatings
 *    - A列: articleId (記事ID: 英数字、ハイフン、アンダースコア)
 *    - B列: goodCount (Good数: 0以上の整数)
 * 
 * 2. シート名: QuizStats
 *    - A列: timestamp (日時: YYYY/MM/DD HH:mm:ss)
 *    - B列: categories (選択カテゴリ名: カンマ区切り)
 *    - C列: questionCount (出題数: 1以上の整数)
 *    - D列: correctCount (正解数: 0以上の整数)
 *    - E列: accuracy (正答率: 0〜100の整数)
 */

const SHEET_NAME = 'ArticleRatings';
const QUIZ_STATS_SHEET = 'QuizStats';

/**
 * GETリクエスト処理 (JSONP / 通常JSON)
 * - ?action=get&articleId=xxx : 現在のGood数を取得
 * - ?action=good&articleId=xxx : Good数を+1して更新後の最新件数を取得
 * - ?action=quizResult&categories=...&questionCount=...&correctCount=... : クイズ完了統計を記録
 */
function doGet(e) {
  return handleRequest(e ? e.parameter : {});
}

/**
 * POSTリクエスト処理 (将来の拡張用)
 */
function doPost(e) {
  var params = {};
  if (e && e.postData && e.postData.contents) {
    try {
      params = JSON.parse(e.postData.contents);
    } catch (err) {
      params = e.parameter || {};
    }
  } else if (e && e.parameter) {
    params = e.parameter;
  }
  return handleRequest(params);
}

/**
 * リクエスト処理共通ロジック
 */
function handleRequest(params) {
  var callback = params.callback;
  var action = (params.action || 'get').toLowerCase();

  // ── クイズ統計記録 (action === 'quizresult') ─────────────
  if (action === 'quizresult') {
    return handleQuizResult(params, callback);
  }

  // ── 記事評価の処理 (既存処理) ──────────────────────────
  var articleId = (params.articleId || '').trim();

  // articleIdのバリデーション (半角英数字、ハイフン、アンダースコア、1〜64文字)
  var idPattern = /^[a-zA-Z0-9_-]{1,64}$/;
  if (!articleId || !idPattern.test(articleId)) {
    return makeResponse({ success: false, error: 'Invalid articleId' }, callback);
  }

  // 同時更新の衝突を防ぐ排他制御 (最大10秒待機)
  var lock = LockService.getScriptLock();
  var hasLock = false;

  try {
    hasLock = lock.tryLock(10000);
    if (!hasLock && action === 'good') {
      return makeResponse({ success: false, error: 'Server busy. Please try again.' }, callback);
    }

    var sheet = getOrCreateSheet();
    var data = sheet.getDataRange().getValues();
    var targetRow = -1;
    var currentCount = 0;

    // 1行目のヘッダーを除いて対象記事を行検索
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === articleId) {
        targetRow = i + 1; // 1-indexed (スプレッドシートの行番号)
        var val = parseInt(data[i][1], 10);
        currentCount = (isNaN(val) || val < 0) ? 0 : val;
        break;
      }
    }

    if (action === 'good') {
      var nextCount = currentCount + 1;
      if (targetRow > 0) {
        sheet.getRange(targetRow, 2).setValue(nextCount);
      } else {
        // シートにまだ登録されていない記事IDなら新規行を追加
        sheet.appendRow([articleId, nextCount]);
      }
      return makeResponse({ success: true, articleId: articleId, goodCount: nextCount }, callback);
    } else {
      // action === 'get'
      if (targetRow === -1) {
        // まだ登録のない記事IDは初期値0として追加登録
        sheet.appendRow([articleId, 0]);
        currentCount = 0;
      }
      return makeResponse({ success: true, articleId: articleId, goodCount: currentCount }, callback);
    }
  } catch (err) {
    return makeResponse({ success: false, error: err.toString() }, callback);
  } finally {
    if (hasLock) {
      lock.releaseLock();
    }
  }
}

/**
 * クイズ統計記録ハンドラ (QuizStats)
 */
function handleQuizResult(params, callback) {
  // 1. questionCount: 1以上の整数
  var rawQCount = parseInt(params.questionCount, 10);
  if (isNaN(rawQCount) || rawQCount < 1 || rawQCount > 100) {
    return makeResponse({ success: false, error: 'Invalid questionCount' }, callback);
  }
  var questionCount = rawQCount;

  // 2. correctCount: 0以上かつquestionCount以下の整数
  var rawCCount = parseInt(params.correctCount, 10);
  if (isNaN(rawCCount) || rawCCount < 0 || rawCCount > questionCount) {
    return makeResponse({ success: false, error: 'Invalid correctCount' }, callback);
  }
  var correctCount = rawCCount;

  // 3. accuracy: GAS側で再計算 (correctCount / questionCount * 100)
  var accuracy = Math.round((correctCount / questionCount) * 100);

  // 4. categories: 安全な文字列検証
  var rawCats = String(params.categories || '').trim();
  // 制御文字の除去、最大200文字制限
  rawCats = rawCats.replace(/[\r\n\t]/g, ' ').substring(0, 200).trim();
  // スプレッドシートの式インジェクション防止 (=, +, -, @ で始まる場合はクォート)
  if (/^[=+\-@]/.test(rawCats)) {
    rawCats = "'" + rawCats;
  }
  var categories = rawCats || 'Unspecified';

  // 5. timestamp: GAS側（Asia/Tokyo）で生成
  var timestamp = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');

  // 6. 排他ロックを取得して QuizStats シートへ追加
  var lock = LockService.getScriptLock();
  var hasLock = false;

  try {
    hasLock = lock.tryLock(10000);
    if (!hasLock) {
      return makeResponse({ success: false, error: 'Server busy. Please try again.' }, callback);
    }

    var sheet = getOrCreateQuizStatsSheet();
    sheet.appendRow([timestamp, categories, questionCount, correctCount, accuracy]);
    return makeResponse({ success: true }, callback);
  } catch (err) {
    return makeResponse({ success: false, error: err.toString() }, callback);
  } finally {
    if (hasLock) {
      lock.releaseLock();
    }
  }
}

/**
 * ArticleRatings シートを取得または自動初期生成
 */
function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['articleId', 'goodCount']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * QuizStats シートを取得または自動初期生成
 */
function getOrCreateQuizStatsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(QUIZ_STATS_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(QUIZ_STATS_SHEET);
    sheet.appendRow(['timestamp', 'categories', 'questionCount', 'correctCount', 'accuracy']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * レスポンス生成 (JSONP / JSON)
 */
function makeResponse(result, callback) {
  var jsonString = JSON.stringify(result);
  if (callback) {
    // JSONPレスポンス (GitHub PagesからのクロスオリジンGET通信用)
    var safeCallback = String(callback).replace(/[^a-zA-Z0-9_$.]/g, '');
    var output = safeCallback + '(' + jsonString + ');';
    return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    // 通常のJSONレスポンス
    return ContentService.createTextOutput(jsonString).setMimeType(ContentService.MimeType.JSON);
  }
}
