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

  const categoryList        = get("quiz-category-list");
  const poolInfo            = get("quiz-pool-info");
  const categoryError       = get("quiz-category-error");
  const startBtn            = get("quiz-start");
  const includeSolvedCheckbox = get("quiz-include-solved");
  const allSolvedMessage    = get("quiz-all-solved-message");

  // ── localStorage 管理 ──────────────────────────────────
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

  // ── カテゴリ定義（表示名・value の順序を固定）────────────
  const CATEGORIES = [
    { value: "html",        label: "HTML編" },
    { value: "javascript",  label: "JavaScript編" },
    { value: "gas",         label: "GAS編" },
    { value: "git-github",  label: "Git / GitHub編" },
    { value: "codex",       label: "Codex / Antigravity編" },
  ];

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
    for (const cat of CATEGORIES) {
      const badge = categoryList.querySelector(`[data-cat-badge="${cat.value}"]`);
      if (!badge) continue;
      const catQuestions = questions.filter((q) => q.category === cat.value);
      const total = catQuestions.length;
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

  // ── 出題候補数を計算 ──────────────────────────────────
  const MAX_QUESTIONS = 10;

  function getCandidatePool() {
    const checked = [...categoryList.querySelectorAll('input[type="checkbox"]:checked')]
      .map((el) => el.value);
    if (checked.length === 0) {
      return { checkedCount: 0, candidatePool: [] };
    }

    const selectedQuestions = questions.filter((q) => checked.includes(q.category));
    const includeSolved = includeSolvedCheckbox ? includeSolvedCheckbox.checked : false;

    if (includeSolved) {
      return { checkedCount: checked.length, candidatePool: selectedQuestions };
    }

    const solvedSet = getSolvedIds();
    const candidatePool = selectedQuestions.filter((q) => !solvedSet.has(q.id));
    return { checkedCount: checked.length, candidatePool };
  }

  // ── pool表示テキストと開始ボタン状態を更新 ──────────────
  function updatePoolInfo() {
    updateCategoryBadges();
    const { checkedCount, candidatePool } = getCandidatePool();

    if (checkedCount === 0) {
      poolInfo.textContent = "";
      categoryError.hidden = false;
      if (allSolvedMessage) allSolvedMessage.hidden = true;
      startBtn.disabled    = true;
      return;
    }

    categoryError.hidden = true;

    if (candidatePool.length === 0) {
      // 選択したカテゴリに未正解問題が0問で、正解済みを含めるがOFF
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
    for (const { question, selectedAnswer } of mistakes) {
      const card = document.createElement("article");
      card.className = "quiz-card quiz-review-card";
      const code = document.createElement("pre");
      code.append(element("code", question.code));
      const link = element("a", "検索・索引で確認する");
      link.href = "../indexes/index.html";
      card.append(
        element("h3", question.question),
        code,
        element("p", `選んだ回答：${question.choices[selectedAnswer]}`),
        element("p", `正解：${question.choices[question.answer]}`),
        element("p", question.explanation),
        link,
      );
      review.append(card);
    }
  }

  // ── 1問表示 ───────────────────────────────────────────
  function showQuestion(moveFocus) {
    answered = false;
    const question = round[position];
    get("quiz-progress").textContent = `全${round.length}問中 ${position + 1}問目`;
    heading.textContent = question.question;
    get("quiz-code").textContent = question.code;
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
    const correct  = Number(selected.value) === question.answer;
    if (correct) {
      score++;
      saveSolvedId(question.id);
    } else {
      mistakes.push({ question, selectedAnswer: Number(selected.value) });
    }
    choices.disabled = true;
    submit.disabled  = true;
    get("quiz-verdict").textContent      = correct ? "○ 正解" : "× 不正解";
    feedback.dataset.correct             = String(correct);
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
    panel.hidden  = false;
    panel.hidden  = true;
    result.hidden = false;
    get("quiz-score").textContent = `${round.length}問中${score}問正解`;
    showReview();
    get("quiz-score").focus();
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
