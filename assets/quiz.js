(() => {
  "use strict";

  const questions = window.siteQuizQuestions;
  const form = document.getElementById("quiz-form");
  if (!form || !Array.isArray(questions) || questions.length < 1) return;

  const get = (id) => document.getElementById(id);

  // ── DOM 参照 ────────────────────────────────────────────
  const setup    = get("quiz-setup");
  const panel    = get("quiz-panel");
  const result   = get("quiz-result");
  const heading  = get("quiz-question");
  const choices  = get("quiz-choices");
  const submit   = get("quiz-submit");
  const feedback = get("quiz-feedback");
  const next     = get("quiz-next");
  const codePre  = get("quiz-code-pre") || (get("quiz-code") ? get("quiz-code").closest("pre") : null);
  const codeEl   = get("quiz-code");

  const categoryList        = get("quiz-category-list");
  const kindList            = get("quiz-kind-list");
  const poolInfo            = get("quiz-pool-info");
  const categoryError       = get("quiz-category-error");
  const kindError           = get("quiz-kind-error");
  const startBtn            = get("quiz-start");
  const includeSolvedCheckbox = get("quiz-include-solved");
  const allSolvedMessage    = get("quiz-all-solved-message");

  // ── localStorage 管理 (正解済み問題ID) ──────────────────
  const STORAGE_KEY = "quiz_solved_ids";

  function getSolvedIds() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return new Set();
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? new Set(parsed) : new Set();
    } catch {
      return new Set();
    }
  }

  function saveSolvedId(id) {
    if (!id) return;
    try {
      const set = getSolvedIds();
      set.add(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
    } catch {
      // クォータ超過等の例外時もクイズ動作は継続
    }
  }

  // ── テストモード管理 (quizTestMode) ──────────────────────
  const TEST_MODE_KEY = "quizTestMode";

  function handleTestModeParam() {
    try {
      const url = new URL(window.location.href);
      const modeParam = url.searchParams.get("testmode");
      if (modeParam) {
        const lower = modeParam.toLowerCase();
        if (lower === "on") {
          localStorage.setItem(TEST_MODE_KEY, "true");
        } else if (lower === "off") {
          localStorage.removeItem(TEST_MODE_KEY);
        }
        url.searchParams.delete("testmode");
        const remainingQuery = url.searchParams.toString();
        const cleanUrl = url.pathname + (remainingQuery ? `?${remainingQuery}` : "") + url.hash;
        window.history.replaceState(null, "", cleanUrl);
      }
    } catch {
      // 例外時も動作継続
    }
  }
  handleTestModeParam();

  function isTestMode() {
    try {
      return localStorage.getItem(TEST_MODE_KEY) === "true";
    } catch {
      return false;
    }
  }

  // ── GAS クイズ統計送信 (JSONP) ───────────────────────────
  const GAS_ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbzbhG9Yq-5zTr2ChxOaXNBpoOeuSuJX8dJVF_Zw8a1YZJxLThasoh5BBZ4zXcX_mOBN/exec";

  function sendQuizStats(stats) {
    if (isTestMode()) {
      return; // テストモード時は通信を完全抑止
    }
    if (!GAS_ENDPOINT_URL || !GAS_ENDPOINT_URL.startsWith("https://script.google.com/")) {
      return;
    }

    const callbackName = "gas_quiz_cb_" + Date.now() + "_" + Math.floor(Math.random() * 100000);
    const queryParams = new URLSearchParams({
      action: "quizResult",
      categories: stats.categories,
      questionCount: String(stats.questionCount),
      correctCount: String(stats.correctCount),
      accuracy: String(stats.accuracy),
      callback: callbackName,
      _nocache: String(Date.now())
    });

    const script = document.createElement("script");
    script.src = `${GAS_ENDPOINT_URL}?${queryParams.toString()}`;
    script.async = true;

    let timer = null;
    const cleanup = () => {
      if (timer) clearTimeout(timer);
      try {
        delete window[callbackName];
      } catch {
        window[callbackName] = undefined;
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    window[callbackName] = () => {
      cleanup();
    };

    script.onerror = () => {
      cleanup();
    };

    timer = setTimeout(() => {
      cleanup();
    }, 6000);

    document.head.appendChild(script);
  }

  // ── カテゴリ定義（表示名・value の順序を固定）────────────
  const CATEGORIES = [
    { value: "html",        label: "HTML編" },
    { value: "javascript",  label: "JavaScript編" },
    { value: "gas",         label: "GAS編" },
    { value: "git-github",  label: "Git / GitHub編" },
    { value: "codex",       label: "Codex / Antigravity編" },
  ];

  const CATEGORY_NAMES = {
    "html": "HTML",
    "javascript": "JavaScript",
    "gas": "GAS",
    "git-github": "Git / GitHub",
    "codex": "Codex / Antigravity"
  };

  // ── カテゴリごとの問題数を事前集計 ───────────────────────
  const countByCategory = {};
  for (const q of questions) {
    countByCategory[q.category] = (countByCategory[q.category] ?? 0) + 1;
  }

  // ── カテゴリ選択チェックボックスを動的生成 ────────────────
  for (const cat of CATEGORIES) {
    const count = countByCategory[cat.value] ?? 0;
    if (count === 0) continue; // 問題数0のカテゴリは表示しない

    const label = document.createElement("label");
    label.className = "quiz-cat-option";

    const input = document.createElement("input");
    input.type    = "checkbox";
    input.name    = "category";
    input.value   = cat.value;
    input.checked = true; // 初期状態はすべてチェック済み

    const text = document.createElement("span");
    text.textContent = `${cat.label}`;

    const badge = document.createElement("span");
    badge.className       = "quiz-cat-count";
    badge.dataset.catBadge = cat.value;

    label.append(input, text, badge);
    categoryList.append(label);
  }

  // ── カテゴリごとの進捗バッジ更新 ────────────────────────
  function updateCategoryBadges() {
    const solvedSet = getSolvedIds();
    const checkedKinds = kindList
      ? [...kindList.querySelectorAll('input[type="checkbox"]:checked')].map((el) => el.value)
      : ["knowledge", "code"];

    for (const cat of CATEGORIES) {
      const badge = categoryList.querySelector(`[data-cat-badge="${cat.value}"]`);
      if (!badge) continue;

      const catQuestions = checkedKinds.length > 0
        ? questions.filter((q) => q.category === cat.value && checkedKinds.includes(q.kind))
        : questions.filter((q) => q.category === cat.value);

      const total = catQuestions.length;
      if (total === 0) {
        badge.textContent = "0問";
        badge.classList.remove("quiz-cat-completed");
        continue;
      }

      const solvedInCat = catQuestions.filter((q) => solvedSet.has(q.id)).length;
      const unsolved = total - solvedInCat;

      if (unsolved === 0) {
        badge.textContent = `✓ ${total} / ${total}問`;
        badge.classList.add("quiz-cat-completed");
      } else {
        badge.textContent = `未正解 ${unsolved} / ${total}問`;
        badge.classList.remove("quiz-cat-completed");
      }
    }
  }

  // ── 出題形式ごとの進捗バッジ更新 ────────────────────────
  function updateKindBadges() {
    if (!kindList) return;
    const solvedSet = getSolvedIds();
    const checkedCats = [...categoryList.querySelectorAll('input[type="checkbox"]:checked')].map((el) => el.value);

    const KINDS = [
      { value: "knowledge", label: "知識問題" },
      { value: "code",      label: "コード読解" }
    ];

    for (const kindObj of KINDS) {
      const badge = kindList.querySelector(`[data-kind-badge="${kindObj.value}"]`);
      if (!badge) continue;

      const kindQuestions = checkedCats.length > 0
        ? questions.filter((q) => q.kind === kindObj.value && checkedCats.includes(q.category))
        : questions.filter((q) => q.kind === kindObj.value);

      const total = kindQuestions.length;
      if (total === 0) {
        badge.textContent = "0問";
        badge.classList.remove("quiz-cat-completed");
        continue;
      }

      const solvedInKind = kindQuestions.filter((q) => solvedSet.has(q.id)).length;
      const unsolved = total - solvedInKind;

      if (unsolved === 0) {
        badge.textContent = `✓ ${total} / ${total}問`;
        badge.classList.add("quiz-cat-completed");
      } else {
        badge.textContent = `未正解 ${unsolved} / ${total}問`;
        badge.classList.remove("quiz-cat-completed");
      }
    }
  }

  // ── 出題候補数を計算 ──────────────────────────────────
  const MAX_QUESTIONS = 10;

  function getCandidatePool() {
    const checkedCats = [...categoryList.querySelectorAll('input[type="checkbox"]:checked')]
      .map((el) => el.value);
    const checkedKinds = kindList
      ? [...kindList.querySelectorAll('input[type="checkbox"]:checked')].map((el) => el.value)
      : ["knowledge", "code"];

    if (checkedCats.length === 0 || checkedKinds.length === 0) {
      return {
        checkedCatsCount: checkedCats.length,
        checkedKindsCount: checkedKinds.length,
        totalSelected: 0,
        candidatePool: []
      };
    }

    const selectedQuestions = questions.filter((q) =>
      checkedCats.includes(q.category) && checkedKinds.includes(q.kind)
    );
    const includeSolved = includeSolvedCheckbox ? includeSolvedCheckbox.checked : false;

    if (includeSolved) {
      return {
        checkedCatsCount: checkedCats.length,
        checkedKindsCount: checkedKinds.length,
        totalSelected: selectedQuestions.length,
        candidatePool: selectedQuestions
      };
    }

    const solvedSet = getSolvedIds();
    const candidatePool = selectedQuestions.filter((q) => !solvedSet.has(q.id));
    return {
      checkedCatsCount: checkedCats.length,
      checkedKindsCount: checkedKinds.length,
      totalSelected: selectedQuestions.length,
      candidatePool
    };
  }

  // ── pool表示テキストと開始ボタン状態を更新 ──────────────
  function updatePoolInfo() {
    updateCategoryBadges();
    updateKindBadges();
    const { checkedCatsCount, checkedKindsCount, totalSelected, candidatePool } = getCandidatePool();

    const hasCatError = checkedCatsCount === 0;
    const hasKindError = checkedKindsCount === 0;

    categoryError.hidden = !hasCatError;
    if (kindError) kindError.hidden = !hasKindError;

    if (hasCatError || hasKindError) {
      poolInfo.textContent = "";
      if (allSolvedMessage) allSolvedMessage.hidden = true;
      startBtn.disabled    = true;
      return;
    }

    if (totalSelected === 0) {
      poolInfo.textContent = "出題候補：0問";
      if (allSolvedMessage) allSolvedMessage.hidden = true;
      startBtn.disabled    = true;
      return;
    }

    if (candidatePool.length === 0) {
      // 選択した条件に未正解問題が0問で、正解済みを含めるがOFF
      poolInfo.textContent = "";
      if (allSolvedMessage) allSolvedMessage.hidden = false;
      startBtn.disabled    = true;
      return;
    }

    if (allSolvedMessage) allSolvedMessage.hidden = true;
    const actual = Math.min(candidatePool.length, MAX_QUESTIONS);
    poolInfo.textContent =
      candidatePool.length < MAX_QUESTIONS
        ? `出題候補：${candidatePool.length}問 → ${actual}問出題`
        : `出題候補：${candidatePool.length}問 → ランダム${actual}問`;
    startBtn.disabled = false;
  }

  // チェックボックスが変わるたびに更新
  categoryList.addEventListener("change", updatePoolInfo);
  if (kindList) {
    kindList.addEventListener("change", updatePoolInfo);
  }
  if (includeSolvedCheckbox) {
    includeSolvedCheckbox.addEventListener("change", updatePoolInfo);
  }
  // 初期表示
  updatePoolInfo();

  // ── セットアップ画面を表示 ────────────────────────────
  setup.hidden = false;
  get("quiz-unavailable").hidden = true;

  // ── クイズ状態 ────────────────────────────────────────
  let round;
  let position;
  let score;
  let answered;
  let mistakes;
  let currentRoundCategories = "";
  let statsSentForRound = false;

  // ── 復習カードの表示 ─────────────────────────────────
  function showReview() {
    const review = get("quiz-review");
    review.replaceChildren();
    const element = (tag, text) => {
      const node = document.createElement(tag);
      node.textContent = text;
      return node;
    };
    if (mistakes.length === 0) {
      review.append(element("p", "今回は復習が必要な問題はありません。"));
      return;
    }
    for (const { question, selectedAnswer, answerStatus } of mistakes) {
      const card = document.createElement("article");
      card.className = "quiz-card quiz-review-card";
      const link = element("a", "検索・索引で確認する");
      link.href = "../indexes/index.html";

      const cardChildren = [
        element("h3", question.question)
      ];

      const hasCode = typeof question.code === "string" && question.code.trim().length > 0;
      if (hasCode) {
        const code = document.createElement("pre");
        code.append(element("code", question.code));
        cardChildren.push(code);
      }

      const yourAnswerText = (selectedAnswer === "unknown" || answerStatus === "unknown")
        ? "わからない"
        : question.choices[selectedAnswer];

      cardChildren.push(
        element("p", `あなたの回答：${yourAnswerText}`),
        element("p", `正解：${question.choices[question.answer]}`),
        element("p", question.explanation),
        link
      );

      card.append(...cardChildren);
      review.append(card);
    }
  }

  // ── 1問表示 ───────────────────────────────────────────
  function showQuestion(moveFocus) {
    answered = false;
    const question = round[position];
    get("quiz-progress").textContent = `全${round.length}問中 ${position + 1}問目`;
    heading.textContent = question.question;

    const hasCode = typeof question.code === "string" && question.code.trim().length > 0;
    if (hasCode) {
      if (codeEl) codeEl.textContent = question.code;
      if (codePre) codePre.hidden = false;
    } else {
      if (codeEl) codeEl.textContent = "";
      if (codePre) codePre.hidden = true;
    }

    feedback.hidden = true;
    next.hidden     = true;
    submit.disabled = true;
    choices.disabled = false;
    get("quiz-options").replaceChildren();
    question.choices.forEach((text, index) => {
      const label = document.createElement("label");
      label.className = "quiz-option";
      const input = document.createElement("input");
      input.type     = "radio";
      input.name     = "answer";
      input.value    = String(index);
      input.required = true;
      const caption = document.createElement("span");
      caption.textContent = text;
      label.append(input, caption);
      get("quiz-options").append(label);
    });

    // 5つ目の選択肢「わからない」を動的に追加
    const unknownLabel = document.createElement("label");
    unknownLabel.className = "quiz-option quiz-option-unknown";
    const unknownInput = document.createElement("input");
    unknownInput.type     = "radio";
    unknownInput.name     = "answer";
    unknownInput.value    = "unknown";
    unknownInput.required = true;
    const unknownCaption = document.createElement("span");
    unknownCaption.textContent = "わからない";
    unknownLabel.append(unknownInput, unknownCaption);
    get("quiz-options").append(unknownLabel);

    if (moveFocus) heading.focus();
  }

  // ── クイズ開始（出題候補プールからランダム抽出）──
  function start(moveFocus = true) {
    const { candidatePool } = getCandidatePool();
    if (candidatePool.length === 0) return;

    // Fisher–Yates シャッフル（元データを変更しない）
    round = [...candidatePool];
    for (let i = round.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [round[i], round[j]] = [round[j], round[i]];
    }
    // 最大 MAX_QUESTIONS 問
    round = round.slice(0, MAX_QUESTIONS);

    position = 0;
    score    = 0;
    mistakes = [];
    statsSentForRound = false;

    // 選択されているカテゴリ名を取得
    const checkedCats = [...categoryList.querySelectorAll('input[type="checkbox"]:checked')].map((el) => el.value);
    currentRoundCategories = checkedCats.map((c) => CATEGORY_NAMES[c] || c).join(", ") || "全分野";

    get("quiz-review").replaceChildren();
    setup.hidden  = true;
    result.hidden = true;
    panel.hidden  = false;
    showQuestion(moveFocus);
  }

  // ── イベントリスナー ──────────────────────────────────
  startBtn.addEventListener("click", () => start(true));

  form.addEventListener("change", () => {
    if (!answered) submit.disabled = false;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = form.querySelector('input[name="answer"]:checked');
    if (answered || !selected) return;
    answered = true;
    const question = round[position];

    // 回答判定：「正解」「不正解」「わからない」を内部的に区別
    let answerStatus;
    if (selected.value === "unknown") {
      answerStatus = "unknown";
    } else if (Number(selected.value) === question.answer) {
      answerStatus = "correct";
    } else {
      answerStatus = "incorrect";
    }

    const isCorrect = answerStatus === "correct";
    if (isCorrect) {
      score++;
      saveSolvedId(question.id);
    } else {
      mistakes.push({
        question,
        selectedAnswer: selected.value === "unknown" ? "unknown" : Number(selected.value),
        answerStatus: answerStatus
      });
    }

    choices.disabled = true;
    submit.disabled  = true;
    get("quiz-verdict").textContent      = isCorrect ? "○ 正解" : "× 不正解";
    feedback.dataset.correct             = String(isCorrect);
    feedback.dataset.verdict             = answerStatus;
    get("quiz-correct-answer").textContent = `正解：${question.choices[question.answer]}`;
    get("quiz-explanation").textContent  = question.explanation;
    get("quiz-article").href             = question.article;
    feedback.hidden  = false;
    next.textContent = position === round.length - 1 ? "結果を見る" : "次の問題";
    next.hidden      = false;
    feedback.focus();
  });

  next.addEventListener("click", () => {
    if (!answered) return;
    position++;
    if (position < round.length) {
      showQuestion(true);
      return;
    }
    panel.hidden  = true;
    result.hidden = false;
    get("quiz-score").textContent = `${round.length}問中${score}問正解`;
    showReview();
    get("quiz-score").focus();

    // ── クイズ完了統計を送信 (1回の完了につき1行のみ) ─────
    if (!statsSentForRound && round.length > 0) {
      statsSentForRound = true;
      const accuracy = Math.round((score / round.length) * 100);
      sendQuizStats({
        categories: currentRoundCategories,
        questionCount: round.length,
        correctCount: score,
        accuracy: accuracy
      });
    }
  });

  // 「もう一度挑戦」はセットアップ画面へ戻す
  get("quiz-restart").addEventListener("click", () => {
    result.hidden = true;
    panel.hidden  = true;
    updatePoolInfo(); // チェック状態は維持しつつ表示を再計算
    setup.hidden  = false;
    startBtn.focus();
  });
})();
