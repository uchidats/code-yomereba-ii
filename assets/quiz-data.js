// 正解は choices の0始まりの位置。問題を追加する手順は README.md を参照。
window.siteQuizQuestions = [
  {
    id: "const", category: "javascript",
    question: "const の意味として、最も近いものはどれ？",
    code: 'const productName = "ノート";',
    choices: ["商品名を画面に表示する", "後から別の値を再代入できない変数を用意する", "同じ処理を何度も繰り返す", "商品名をファイルに記録する"],
    answer: 1,
    explanation: "const は、後から別の値を再代入できない変数を用意します。constant（一定の・変わらない）を短くした名前です。変数を作るだけで、ファイルに保存されるわけではありません。",
    article: "../articles/variable.html"
  },
  {
    id: "let", category: "javascript",
    question: "この2行を実行したあと、quantity に入っている値はどれ？",
    code: "let quantity = 2;\nquantity = quantity + 1;",
    choices: ["2", "1", "3", "値は入っていない"],
    answer: 2,
    explanation: "let で用意した変数は、後から値を入れ直せます。右側の quantity + 1 を先に計算し、結果の3を quantity に入れ直しています。",
    article: "../articles/variable.html"
  },
  {
    id: "function", category: "javascript",
    question: "calculateTotal を呼び出した結果、total に入る値はどれ？",
    code: "function calculateTotal(price, quantity) {\n  return price * quantity;\n}\nconst total = calculateTotal(200, 3);",
    choices: ["200", "3", "203", "600"],
    answer: 3,
    explanation: "200と3を引数として渡し、掛け算の結果600を return で返しています。function は「機能・働き」という意味で、ここでは計算を担当する処理のまとまりです。",
    article: "../articles/function.html"
  },
  {
    id: "if", category: "javascript",
    question: "GASでこの処理を実行すると、ログに表示される文字はどれ？",
    code: 'const score = 80;\nif (score >= 80) {\n  Logger.log("合格");\n} else {\n  Logger.log("復習しましょう");\n}',
    choices: ["合格", "復習しましょう", "両方が表示される", "何も表示されない"],
    answer: 0,
    explanation: "if は「もし〜なら」。>= は「以上」なので80ちょうども条件に合い、「合格」が表示されます。else は条件に合わない場合の処理です。",
    article: "../articles/if.html"
  },
  {
    id: "href", category: "html",
    question: "この href が指定しているものはどれ？",
    code: '<a href="../index.html">トップへ戻る</a>',
    choices: ["リンクの文字の色", "表示する画像の読み込み元", "クリックしたときのリンク先", "画面に表示するリンクの文字"],
    answer: 2,
    explanation: "この a タグの href は、クリックしたときのリンク先を指定します。href は Hypertext Reference の略で、reference は「参照」という意味です。",
    article: "../articles/href-src.html"
  },
  {
    id: "src", category: "html",
    question: "この src が指定しているものはどれ？",
    code: '<img src="../assets/koi.png" alt="">',
    choices: ["画像をクリックしたときの移動先", "表示する画像ファイルの読み込み元", "画像の幅", "画像に付けるグループ名"],
    answer: 1,
    explanation: "src は、ここでは画像ファイルの読み込み元を指定します。source（元・出どころ）の略です。",
    article: "../articles/href-src.html"
  },
  {
    id: "relative-path", category: "html",
    question: "articles の中のHTMLにあるこの指定で、../ の読み方はどれ？",
    code: '<img src="../assets/koi.png" alt="">',
    choices: ["今いるフォルダの中にある", "2つ上のフォルダへ進む", "必ずトップページを開く", "このHTMLがあるフォルダから1つ上へ戻る"],
    answer: 3,
    explanation: "../ は1つ上のフォルダを表します。この例ではHTMLがある articles から1つ上へ戻り、assets 内の koi.png を指定しています。",
    article: "../articles/relative-path.html"
  },
  {
    id: "class-id", category: "html",
    question: "class と id の読み方として、正しいものはどれ？",
    code: '<section id="start" class="section">\n  <p class="note">注意1</p>\n  <p class="note">注意2</p>\n</section>',
    choices: ["note は共有できるグループ名、start はこのページ内で重複させない固有名", "note は同じページで1回しか使えない名前", "start は画像ファイルの読み込み元", "class と id があると、その内容は必ず非表示になる"],
    answer: 0,
    explanation: "class は複数の要素で共有できるグループ名、id はページ内の特定の要素を識別する固有名です。id は identifier（識別子）の略です。",
    article: "../articles/class-id.html"
  },
  {
    id: "json-conversion", category: "javascript",
    question: "JSON.parse と JSON.stringify の処理の組み合わせはどれ？",
    code: 'const data = JSON.parse(\'{"weather":"sunny"}\');\nconst text = JSON.stringify(data);',
    choices: ["どちらも画像を読み込む", "parse はデータをJSON文字列にし、stringify は文字列をデータにする", "parse はJSON文字列をデータにし、stringify はデータをJSON文字列にする", "どちらもデータを画面に表示する"],
    answer: 2,
    explanation: "JSON.parse() はJSONの文字列をプログラムで扱うデータに変換し、JSON.stringify() はデータをJSONの文字列にします。JSON は JavaScript Object Notation の略です。",
    article: "../articles/json.html"
  },
  {
    id: "html-range", category: "html",
    question: "開始タグから終了タグまで追うと、span が囲んでいるのはどの部分？",
    code: '<div class="card">\n  <p>これは<span class="important">重要</span>です。</p>\n</div>',
    choices: ["カード全体", "「これは重要です。」という文章全体", "「です。」だけ", "「重要」だけ"],
    answer: 3,
    explanation: "<span> から </span> までの「重要」だけを囲っています。div はまとまりを作る箱、span は文章などの一部分を囲う目印です。span を付けただけでは、色や太さは変わりません。",
    article: "../articles/div-span.html"
  }
];
