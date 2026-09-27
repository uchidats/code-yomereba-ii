(() => {
  "use strict";

  const questions = window.siteQuizQuestions;
  const form = document.getElementById("quiz-form");
  if (!form || !Array.isArray(questions) || questions.length < 10) return;

  const get = (id) => document.getElementById(id);
  const panel = get("quiz-panel");
  const result = get("quiz-result");
  const heading = get("quiz-question");
  const choices = get("quiz-choices");
  const submit = get("quiz-submit");
  const feedback = get("quiz-feedback");
  const next = get("quiz-next");
  let round;
  let position;
  let score;
  let answered;

  function showQuestion(moveFocus) {
    answered = false;
    const question = round[position];
    get("quiz-progress").textContent = `全${round.length}問中 ${position + 1}問目`;
    heading.textContent = question.question;
    get("quiz-code").textContent = question.code;
    feedback.hidden = true;
    next.hidden = true;
    submit.disabled = true;
    choices.disabled = false;
    get("quiz-options").replaceChildren();
    question.choices.forEach((text, index) => {
      const label = document.createElement("label");
      label.className = "quiz-option";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "answer";
      input.value = String(index);
      input.required = true;
      const caption = document.createElement("span");
      caption.textContent = text;
      label.append(input, caption);
      get("quiz-options").append(label);
    });
    if (moveFocus) heading.focus();
  }

  function start(moveFocus = true) {
    // 元データや選択肢の順序を変えず、問題だけ Fisher–Yates で並べ替える。
    round = [...questions];
    for (let i = round.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [round[i], round[j]] = [round[j], round[i]];
    }
    round = round.slice(0, 10);
    position = 0;
    score = 0;
    result.hidden = true;
    panel.hidden = false;
    showQuestion(moveFocus);
  }

  form.addEventListener("change", () => {
    if (!answered) submit.disabled = false;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = form.querySelector('input[name="answer"]:checked');
    if (answered || !selected) return;
    answered = true;
    const question = round[position];
    const correct = Number(selected.value) === question.answer;
    if (correct) score++;
    choices.disabled = true;
    submit.disabled = true;
    get("quiz-verdict").textContent = correct ? "○ 正解" : "× 不正解";
    feedback.dataset.correct = String(correct);
    get("quiz-correct-answer").textContent = `正解：${question.choices[question.answer]}`;
    get("quiz-explanation").textContent = question.explanation;
    get("quiz-article").href = question.article;
    feedback.hidden = false;
    next.textContent = position === round.length - 1 ? "結果を見る" : "次の問題";
    next.hidden = false;
    feedback.focus();
  });

  next.addEventListener("click", () => {
    if (!answered) return;
    position++;
    if (position < round.length) {
      showQuestion(true);
      return;
    }
    panel.hidden = true;
    result.hidden = false;
    get("quiz-score").textContent = `${round.length}問中${score}問正解`;
    get("quiz-score").focus();
  });

  get("quiz-restart").addEventListener("click", () => start());
  get("quiz-unavailable").hidden = true;
  start(false);
})();
