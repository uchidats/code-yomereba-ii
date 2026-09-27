/**
 * 記事評価ボタン (Good / Bad)
 * - 1ブラウザ1回の投票制御 (localStorage: liked: <article-id>)
 * - 将来の Google Apps Script (GAS) 連携に対応した設計
 */
(() => {
  // 将来Googleスプレッドシート+GASと連携する場合、発行したWebアプリURLをここに設定します
  const GAS_ENDPOINT_URL = null;

  function initRating() {
    const container = document.querySelector('.article-rating[data-article-id]');
    if (!container) return;

    const articleId = container.getAttribute('data-article-id');
    const goodBtn = container.querySelector('.rating-btn-good');
    const badBtn = container.querySelector('.rating-btn-bad');
    const countEl = container.querySelector('.rating-count');
    const feedbackMsg = container.querySelector('.rating-feedback-msg');

    if (!goodBtn || !badBtn) return;

    const storageKey = `liked:${articleId}`;
    let votedAction = null;

    try {
      votedAction = localStorage.getItem(storageKey);
    } catch (e) {
      // プライベートブラウジング等でlocalStorageが無効な場合のフォールバック
    }

    // 将来GASと連携する場合のカウント取得処理（非同期）
    if (GAS_ENDPOINT_URL) {
      fetch(`${GAS_ENDPOINT_URL}?articleId=${encodeURIComponent(articleId)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data.goodCount === 'number' && countEl) {
            countEl.textContent = data.goodCount;
          }
        })
        .catch((err) => {
          console.warn('[ArticleRating] カウント取得エラー:', err);
        });
    }

    // 既に評価済みの場合は状態を反映
    if (votedAction) {
      applyVotedState(votedAction);
    }

    function applyVotedState(action) {
      goodBtn.disabled = true;
      badBtn.disabled = true;

      if (action === 'good') {
        goodBtn.classList.add('is-active');
        goodBtn.setAttribute('aria-pressed', 'true');
      } else if (action === 'bad') {
        badBtn.classList.add('is-active');
        badBtn.setAttribute('aria-pressed', 'true');
        if (feedbackMsg) {
          feedbackMsg.hidden = false;
        }
      }
    }

    // Goodボタン押下
    goodBtn.addEventListener('click', () => {
      if (goodBtn.disabled) return;

      // カウントを1増やす（Good数そのものはlocalStorageで管理せず、画面上のカウント加算として処理）
      if (countEl) {
        const currentCount = parseInt(countEl.textContent || '0', 10);
        countEl.textContent = (isNaN(currentCount) ? 0 : currentCount) + 1;
      }

      // 1ブラウザ1回の連打防止フラグのみ保存
      try {
        localStorage.setItem(storageKey, 'good');
      } catch (e) {}

      applyVotedState('good');

      // 将来GASへGoodを送信する処理
      if (GAS_ENDPOINT_URL) {
        fetch(GAS_ENDPOINT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            articleId: articleId,
            action: 'good'
          })
        }).catch((err) => {
          console.warn('[ArticleRating] 送信エラー:', err);
        });
      }
    });

    // Badボタン押下
    badBtn.addEventListener('click', () => {
      if (badBtn.disabled) return;

      // Badはサーバー保存や件数記録は行わない
      try {
        localStorage.setItem(storageKey, 'bad');
      } catch (e) {}

      applyVotedState('bad');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRating);
  } else {
    initRating();
  }
})();
