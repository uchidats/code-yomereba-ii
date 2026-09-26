(() => {
  "use strict";

  const panel = document.querySelector(".index-search");
  if (!panel || !Array.isArray(window.siteSearchIndex)) return;

  const input = document.getElementById("index-search-input");
  const status = document.getElementById("index-search-status");
  const results = document.getElementById("index-search-results");
  // 記号を除去せず、文字列として比較する（正規表現にはしない）。
  const normalize = (value) => value.normalize("NFKC").toLowerCase().trim();
  const entries = window.siteSearchIndex.map((entry) => ({
    entry,
    names: [entry.name, entry.code].filter(Boolean).map(normalize),
    text: normalize([entry.name, entry.code, entry.description, ...entry.keywords].join("\n")),
  }));

  function element(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = text;
    return node;
  }

  function search() {
    const query = normalize(input.value);
    results.replaceChildren();
    if (!query) {
      status.textContent = "用語やコードを入力すると、候補が表示されます。";
      return;
    }

    const matches = entries
      .filter((item) => item.text.includes(query))
      .map((item) => ({
        ...item,
        rank: item.names.includes(query) ? 0 : item.names.some((name) => name.includes(query)) ? 1 : 2,
      }))
      .sort((a, b) => a.rank - b.rank);

    const fragment = document.createDocumentFragment();
    for (const { entry } of matches) {
      const item = element("li", "index-search-result", "");
      const primary = element("a", "index-search-primary", "");
      primary.href = entry.articles[0].url;
      primary.append(
        element("span", "index-search-type", entry.type),
        element(entry.type === "コード" ? "code" : "strong", "index-search-name", entry.name),
        element("span", "index-search-description", entry.description),
        element("span", "index-search-article", `関連記事：${entry.articles[0].title}`),
      );
      item.append(primary);
      for (const article of entry.articles.slice(1)) {
        const link = element("a", "index-search-extra", `関連記事：${article.title}`);
        link.href = article.url;
        item.append(link);
      }
      fragment.append(item);
    }
    results.append(fragment);
    status.textContent = matches.length
      ? `${matches.length}件の項目が見つかりました。`
      : "該当する項目が見つかりませんでした。";
  }

  panel.hidden = false;
  input.addEventListener("input", search);
  window.addEventListener("pageshow", search);
  search();
})();
