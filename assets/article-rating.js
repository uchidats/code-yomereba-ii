/**
 * 記事評価ボタン (Good / Bad)
 * - 全ユーザー共通Goodカウンター (Google Apps Script + スプレッドシート連携)
 * - 1ブラウザ1回の投票制御 (localStorage: liked: <article-id>)
 * - JSONP通信方式により、GitHub Pages環境におけるCORSや302リダイレクト問題を完全回避
 */
(() => {
  // ★ Google Apps Script (GAS) をデプロイ後、発行された「ウェブアプリのURL」をここに設定してください
  // 例: 'https://script.google.com/macros/s/AKfycb.../exec'
  const GAS_ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbzbhG9Yq-5zTr2ChxOaXNBpoOeuSuJX8dJVF_Zw8a1YZJxLThasoh5BBZ4zXcX_mOBN/exec';

  /**
   * JSONPリクエスト送信ヘルパー
   * 静的サイトからGAS Webアプリへ確実にクロスオリジン通信を行うための軽量実装
   */
  function requestGasJsonp(url, params, timeoutMs = 6000) {
    return new Promise((resolve, reject) => {
      const callbackName = 'gas_rating_cb_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
      const queryParams = new URLSearchParams({
        ...params,
        callback: callbackName,
        _nocache: Date.now()
      });

      const script = document.createElement('script');
      script.src = `${url}?${queryParams.toString()}`;
      script.async = true;

      let timer = null;

      const cleanup = () => {
        if (timer) clearTimeout(timer);
        try {
          delete window[callbackName];
        } catch (e) {
          window[callbackName] = undefined;
        }
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };

      window[callbackName] = (data) => {
        cleanup();
        resolve(data);
      };

      script.onerror = () => {
        cleanup();
        reject(new Error('JSONP load error'));
      };

      timer = setTimeout(() => {
        cleanup();
        reject(new Error('JSONP timeout'));
      }, timeoutMs);

      document.head.appendChild(script);
    });
  }

  function initRating() {
    const container = document.querySelector('.article-rating[data-article-id]');
    if (!container) return;

    // 更新日の表示 (data-updated="YYYY-MM-DD" -> "更新：YYYY年M月D日")
    const updatedDate = container.getAttribute('data-updated');
    if (updatedDate && !container.querySelector('.article-updated')) {
      const match = updatedDate.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
      const timeEl = document.createElement('time');
      timeEl.className = 'article-updated';
      if (match) {
        const year = match[1];
        const month = parseInt(match[2], 10);
        const day = parseInt(match[3], 10);
        const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        timeEl.setAttribute('datetime', iso);
        timeEl.textContent = `更新：${year}年${month}月${day}日`;
      } else {
        timeEl.textContent = updatedDate.startsWith('更新：') ? updatedDate : `更新：${updatedDate}`;
      }
      container.appendChild(timeEl);
    }

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
      // プライベートブラウズ等の制限環境フォールバック
    }

    // 既に評価済みの場合は状態をボタンへ反映
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

    const isGasConfigured = typeof GAS_ENDPOINT_URL === 'string' &&
      GAS_ENDPOINT_URL.startsWith('https://script.google.com/');

    // 1. 初期カウントの取得（GASから全ユーザー共通のGood数を取得）
    if (isGasConfigured) {
      requestGasJsonp(GAS_ENDPOINT_URL, { action: 'get', articleId: articleId })
        .then((res) => {
          if (res && res.success && typeof res.goodCount === 'number' && countEl) {
            countEl.textContent = res.goodCount;
          }
        })
        .catch((err) => {
          // 通信エラー時も記事の閲覧や他の動作を妨げない
          console.warn('[ArticleRating] カウント取得スキップ:', err.message);
        });
    }

    // 2. Goodボタン押下処理
    goodBtn.addEventListener('click', () => {
      if (goodBtn.disabled) return;

      // 画面上のカウントを即座に+1（Optimistic UI Update）
      if (countEl) {
        const currentCount = parseInt(countEl.textContent || '0', 10);
        countEl.textContent = (isNaN(currentCount) ? 0 : currentCount) + 1;
      }

      // localStorageには投票済みフラグ（liked）のみを記録（Good数は保存しない）
      try {
        localStorage.setItem(storageKey, 'good');
      } catch (e) {}

      applyVotedState('good');

      // GASへGood加算リクエストを送信
      if (isGasConfigured) {
        requestGasJsonp(GAS_ENDPOINT_URL, { action: 'good', articleId: articleId })
          .then((res) => {
            // スプレッドシート側の確定最新値で画面を同期
            if (res && res.success && typeof res.goodCount === 'number' && countEl) {
              countEl.textContent = res.goodCount;
            }
          })
          .catch((err) => {
            console.warn('[ArticleRating] Goodカウント送信エラー:', err.message);
          });
      }
    });

    // 3. Badボタン押下処理
    badBtn.addEventListener('click', () => {
      if (badBtn.disabled) return;

      // Badはサーバー/GAS送信・スプレッドシート記録は一切行わない
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
