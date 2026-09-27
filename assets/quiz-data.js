// 問題データ。新しい記事を追加したら、対応するキーワード・概念の問題をここに追加する。
// ─ id: 重複させない一意の文字列
// ─ category: html / javascript / gas / git-github / codex のいずれか
// ─ question: 問題文
// ─ code: コード例（なければ空文字 "" でも可）
// ─ choices: 4択の文字列配列（正解を含む）
// ─ answer: 正解の位置（0〜3）。choices の順を変えたら必ず見直す
// ─ explanation: 1〜3文の解説
// ─ article: クイズページを基点とした出典記事の相対パス
//
// 出題は全問題からランダムに10問選択。問題が10問以下にならないよう維持すること。

window.siteQuizQuestions = [

  // ── HTML編 ──────────────────────────────────────────────

  {
    id: "html-open-tag",
    category: "html",
    question: "このコードで「ここからpの要素が始まる」と読む部分はどれ？",
    code: "<p>コードは読めればいい。</p>",
    choices: ["</p>", "<p>", "コードは読めればいい。", "すべてまとめて1つの記号"],
    answer: 1,
    explanation: "<p> のように山かっこでタグ名を囲んだものが開始タグです。「ここからこの要素が始まる」と読みます。",
    article: "../articles/html-tags.html"
  },
  {
    id: "html-close-tag",
    category: "html",
    question: "終了タグの特徴として正しいものはどれ？",
    code: "<h2>見出し</h2>",
    choices: ["タグ名の後ろに / を付ける", "タグ名の前に / を付ける", "タグ名を大文字にする", "タグ名を省略する"],
    answer: 1,
    explanation: "終了タグはタグ名の前に / を付けて </h2> のように書きます。「/ が付いたらここで終わり」と読みます。",
    article: "../articles/html-tags.html"
  },
  {
    id: "html-attribute",
    category: "html",
    question: "このコードで「属性」にあたるものはどれ？",
    code: '<a href="../index.html">トップへ</a>',
    choices: ["<a>", "href", "トップへ", "</a>"],
    answer: 1,
    explanation: "属性はタグに追加情報を与えるもので、href・src・class・id などが該当します。attribute は英語で「特徴・属性」の意味です。",
    article: "../articles/html-tags.html"
  },
  {
    id: "html-void-element",
    category: "html",
    question: "終了タグを持たないHTML要素（空要素）はどれ？",
    code: "",
    choices: ["<p>", "<div>", "<img>", "<section>"],
    answer: 2,
    explanation: "<img> は終了タグを持たない空要素（void element）です。src で画像の場所を指定し、それ自体で完結します。",
    article: "../articles/html-tags.html"
  },
  {
    id: "html-nesting",
    category: "html",
    question: "このコードで「入れ子（ネスト）」の構造になっているのはどれ？",
    code: "<div>\n  <p>こんにちは</p>\n</div>",
    choices: ["div の中に p が入っている", "p の中に div が入っている", "div と p は並列に並んでいる", "どちらも独立している"],
    answer: 0,
    explanation: "タグの中に別のタグを入れる構造を入れ子（nesting）と言います。このコードでは div の中に p が収まっています。",
    article: "../articles/html-tags.html"
  },
  {
    id: "href",
    category: "html",
    question: "この href が指定しているものはどれ？",
    code: '<a href="../index.html">トップへ戻る</a>',
    choices: ["リンクの文字の色", "表示する画像の読み込み元", "クリックしたときのリンク先", "画面に表示するリンクの文字"],
    answer: 2,
    explanation: "この a タグの href は、クリックしたときのリンク先を指定します。href は Hypertext Reference の略で、reference は「参照」という意味です。",
    article: "../articles/href-src.html"
  },
  {
    id: "src",
    category: "html",
    question: "この src が指定しているものはどれ？",
    code: '<img src="../assets/koi.png" alt="">',
    choices: ["画像をクリックしたときの移動先", "表示する画像ファイルの読み込み元", "画像の幅", "画像に付けるグループ名"],
    answer: 1,
    explanation: "src は、ここでは画像ファイルの読み込み元を指定します。source（元・出どころ）の略です。",
    article: "../articles/href-src.html"
  },
  {
    id: "html-alt",
    category: "html",
    question: "imgタグの alt 属性が主に果たす役割はどれ？",
    code: '<img src="../assets/koi.png" alt="鯉のイラスト">',
    choices: ["画像の大きさを指定する", "画像が読み込めないときや音声読み上げのときに使われる代替テキスト", "画像をクリックしたときの移動先を指定する", "画像に付けるグループ名"],
    answer: 1,
    explanation: "alt は画像の代替テキストです。画像が読み込めない場合や、スクリーンリーダーで読み上げる際に使われます。alt は alternative（代わりの）の略です。",
    article: "../articles/href-src.html"
  },
  {
    id: "relative-path",
    category: "html",
    question: "articles の中のHTMLにあるこの指定で、../ の読み方はどれ？",
    code: '<img src="../assets/koi.png" alt="">',
    choices: ["今いるフォルダの中にある", "2つ上のフォルダへ進む", "必ずトップページを開く", "このHTMLがあるフォルダから1つ上へ戻る"],
    answer: 3,
    explanation: "../ は1つ上のフォルダを表します。この例ではHTMLがある articles から1つ上へ戻り、assets 内の koi.png を指定しています。",
    article: "../articles/relative-path.html"
  },
  {
    id: "html-current-folder",
    category: "html",
    question: "パス指定で ./ が表す意味はどれ？",
    code: '<img src="./photo.png" alt="">',
    choices: ["1つ上のフォルダ", "今いるフォルダ（同じ場所）", "サイトのトップ", "絶対パスで指定する"],
    answer: 1,
    explanation: "./ は今いるフォルダを表します。./photo.png は同じフォルダにある photo.png を指し、./ を省略しても同じ場所になります。",
    article: "../articles/relative-path.html"
  },
  {
    id: "class-id",
    category: "html",
    question: "class と id の読み方として、正しいものはどれ？",
    code: '<section id="start" class="section">\n  <p class="note">注意1</p>\n  <p class="note">注意2</p>\n</section>',
    choices: ["note は共有できるグループ名、start はこのページ内で重複させない固有名", "note は同じページで1回しか使えない名前", "start は画像ファイルの読み込み元", "class と id があると、その内容は必ず非表示になる"],
    answer: 0,
    explanation: "class は複数の要素で共有できるグループ名、id はページ内の特定の要素を識別する固有名です。id は identifier（識別子）の略です。",
    article: "../articles/class-id.html"
  },
  {
    id: "html-div",
    category: "html",
    question: "div の標準的な表示の特徴として正しいものはどれ？",
    code: '<div class="card">\n  <p>カードの内容</p>\n</div>',
    choices: ["文章の流れの中に続くインライン表示", "新しい行から始まり親の横幅を使うブロック表示", "常に非表示になる", "テキストだけを囲える"],
    answer: 1,
    explanation: "div は標準ではブロック表示で、新しい行から始まり親の横幅を使います。division（区分・分割された部分）の略です。",
    article: "../articles/div-span.html"
  },
  {
    id: "html-span",
    category: "html",
    question: "このコードで span が囲んでいるのはどの部分？",
    code: '<div class="card">\n  <p>これは<span class="important">重要</span>です。</p>\n</div>',
    choices: ["カード全体", "「これは重要です。」という文章全体", "「です。」だけ", "「重要」だけ"],
    answer: 3,
    explanation: "<span> から </span> までの「重要」だけを囲っています。span は文章などの一部分を囲う目印です。span を付けただけでは、色や太さは変わりません。",
    article: "../articles/div-span.html"
  },
  {
    id: "html-div-vs-span",
    category: "html",
    question: "div と span の違いとして正しいものはどれ？",
    code: "",
    choices: ["div は文章の一部分、span は複数の要素をまとめる箱", "div はブロック表示で複数の要素をまとめる、span はインライン表示で文章の一部を囲う", "div はリンク専用、span は画像専用", "どちらも同じ役割で使い分けは不要"],
    answer: 1,
    explanation: "div はブロック表示でまとまりを作る箱、span はインライン表示で文章などの一部を囲う目印です。役割の違いで使い分けます。",
    article: "../articles/div-span.html"
  },
  {
    id: "html-header",
    category: "html",
    question: "HTMLで <header> が表す内容として正しいものはどれ？",
    code: "",
    choices: ["ページの主な内容を囲う部分", "ページや区画の冒頭部分（サイト名・ロゴなど）", "移動用のリンク群をまとめる部分", "それ単独でも意味が通る独立したコンテンツ"],
    answer: 1,
    explanation: "<header> はページや区画の冒頭部分を表すHTML要素です。サイト名・ロゴ・タグラインなどが入ることがあります。",
    article: "../articles/semantic-html.html"
  },
  {
    id: "html-nav",
    category: "html",
    question: "<nav> が表す内容として正しいものはどれ？",
    code: "",
    choices: ["そのページの主な内容", "ページや区画の冒頭部分", "移動用の主要なリンク群をまとめる部分", "それ単独で成立する独立したコンテンツ"],
    answer: 2,
    explanation: "<nav> は navigation の略で、他のページやページ内の場所へ移動するための主要なリンク群をまとめる要素です。",
    article: "../articles/semantic-html.html"
  },
  {
    id: "html-main",
    category: "html",
    question: "<main> が表す内容として正しいものはどれ？",
    code: "",
    choices: ["ページや区画の冒頭部分", "意味のあるひとまとまりの話題", "そのページの主な内容", "サイトの著作権情報などのフッター"],
    answer: 2,
    explanation: "<main> はそのページの主な内容を囲うHTML要素です。記事ページであれば記事タイトルや本文が中に入ります。",
    article: "../articles/semantic-html.html"
  },
  {
    id: "html-section-vs-article",
    category: "html",
    question: "section と article の違いとして正しいものはどれ？",
    code: "",
    choices: ["section は独立した記事、article は章や話題のまとまり", "section は意味のあるまとまり（章など）、article は切り取っても成立する独立したコンテンツ", "どちらも同じ用途で使い分けは不要", "section は画像専用、article はテキスト専用"],
    answer: 1,
    explanation: "<section> は見出しを持つ意味のある章や話題のまとまり、<article> は単独で読み物として成立する独立したコンテンツを表します。",
    article: "../articles/semantic-html.html"
  },
  {
    id: "html-p-tag",
    category: "html",
    question: "<p> タグが表すものはどれ？",
    code: "<p>これが段落です。</p>",
    choices: ["ページ全体のヘッダー", "段落（ひとまとまりの文章）", "リンク", "画像"],
    answer: 1,
    explanation: "<p> は段落（paragraph）を表すHTML要素です。p は paragraph の略で、ひとつの話題の文章のまとまりを囲います。",
    article: "../articles/html-tags.html"
  },

  // ── JavaScript編 ──────────────────────────────────────

  {
    id: "const",
    category: "javascript",
    question: "const の意味として、最も近いものはどれ？",
    code: 'const productName = "ノート";',
    choices: ["商品名を画面に表示する", "後から別の値を再代入できない変数を用意する", "同じ処理を何度も繰り返す", "商品名をファイルに記録する"],
    answer: 1,
    explanation: "const は、後から別の値を再代入できない変数を用意します。constant（一定の・変わらない）を短くした名前です。変数を作るだけで、ファイルに保存されるわけではありません。",
    article: "../articles/variable.html"
  },
  {
    id: "let",
    category: "javascript",
    question: "この2行を実行したあと、quantity に入っている値はどれ？",
    code: "let quantity = 2;\nquantity = quantity + 1;",
    choices: ["2", "1", "3", "値は入っていない"],
    answer: 2,
    explanation: "let で用意した変数は、後から値を入れ直せます。右側の quantity + 1 を先に計算し、結果の3を quantity に入れ直しています。",
    article: "../articles/variable.html"
  },
  {
    id: "js-const-vs-let",
    category: "javascript",
    question: "const と let の違いとして正しいものはどれ？",
    code: "",
    choices: ["const は後から値を入れ直せる、let は入れ直せない", "const は後から値を入れ直せない、let は入れ直せる", "どちらも同じで使い分けは不要", "const は数値専用、let は文字列専用"],
    answer: 1,
    explanation: "const は後から別の値を再代入できない変数、let は再代入できる変数を用意します。変わらない値には const、後で変わる値には let を使います。",
    article: "../articles/variable.html"
  },
  {
    id: "js-assignment",
    category: "javascript",
    question: "このコードで = が意味することはどれ？",
    code: 'const city = "東京";',
    choices: ["左と右が等しいかを比べる", "「東京」を city という名前で扱えるようにする（代入）", "city を画面に表示する", "city を削除する"],
    answer: 1,
    explanation: "= は代入の記号です。右側の値を左側の名前に入れます。等しいかを比べる比較（== や ===）とは異なります。",
    article: "../articles/variable.html"
  },
  {
    id: "function",
    category: "javascript",
    question: "calculateTotal を呼び出した結果、total に入る値はどれ？",
    code: "function calculateTotal(price, quantity) {\n  return price * quantity;\n}\nconst total = calculateTotal(200, 3);",
    choices: ["200", "3", "203", "600"],
    answer: 3,
    explanation: "200と3を引数として渡し、掛け算の結果600を return で返しています。function は「機能・働き」という意味で、ここでは計算を担当する処理のまとまりです。",
    article: "../articles/function.html"
  },
  {
    id: "js-return",
    category: "javascript",
    question: "このコードで return が果たす役割はどれ？",
    code: "function double(n) {\n  return n * 2;\n}",
    choices: ["関数の名前を変える", "処理を繰り返す", "結果を呼び出し元へ返して関数を終える", "変数を削除する"],
    answer: 2,
    explanation: "return は「この値を呼び出し元へ返して、ここで関数を終える」という目印です。return の後ろが戻り値（もどりち）になります。",
    article: "../articles/function.html"
  },
  {
    id: "js-arguments",
    category: "javascript",
    question: "このコードで「引数（ひきすう）」にあたるものはどれ？",
    code: "const result = calculateTotal(200, 3);",
    choices: ["calculateTotal", "result", "200 と 3", "= の記号"],
    answer: 2,
    explanation: "関数を呼び出すとき、丸かっこの中に渡す値が引数です。ここでは 200 と 3 が引数で、関数の中で price と quantity として使われます。",
    article: "../articles/function.html"
  },
  {
    id: "if",
    category: "javascript",
    question: "GASでこの処理を実行すると、ログに表示される文字はどれ？",
    code: 'const score = 80;\nif (score >= 80) {\n  Logger.log("合格");\n} else {\n  Logger.log("復習しましょう");\n}',
    choices: ["合格", "復習しましょう", "両方が表示される", "何も表示されない"],
    answer: 0,
    explanation: "if は「もし〜なら」。>= は「以上」なので80ちょうども条件に合い、「合格」が表示されます。else は条件に合わない場合の処理です。",
    article: "../articles/if.html"
  },
  {
    id: "js-else",
    category: "javascript",
    question: "この処理でログに表示されるのはどれ？",
    code: 'const score = 60;\nif (score >= 80) {\n  Logger.log("合格");\n} else {\n  Logger.log("復習しましょう");\n}',
    choices: ["合格", "復習しましょう", "両方が表示される", "何も表示されない"],
    answer: 1,
    explanation: "score が60で、条件 score >= 80 を満たさないため else の処理が実行され、「復習しましょう」が表示されます。else は「それ以外なら」という分かれ道です。",
    article: "../articles/if.html"
  },
  {
    id: "js-triple-equals",
    category: "javascript",
    question: "=== と == の違いとして正しいものはどれ？",
    code: "",
    choices: ["どちらも同じで使い分けは不要", "=== は型を変換しない比較、== は型の変換を伴うことがある比較", "=== は代入、== は比較", "=== は3つの値を比べる"],
    answer: 1,
    explanation: "=== は値と型が両方とも同じかを比べます。== は型の変換を伴うことがあり、例えば 1 == \"1\" が true になる場合があります。",
    article: "../articles/if.html"
  },
  {
    id: "json-conversion",
    category: "javascript",
    question: "JSON.parse と JSON.stringify の処理の組み合わせはどれ？",
    code: 'const data = JSON.parse(\'{"weather":"sunny"}\');\nconst text = JSON.stringify(data);',
    choices: ["どちらも画像を読み込む", "parse はデータをJSON文字列にし、stringify は文字列をデータにする", "parse はJSON文字列をデータにし、stringify はデータをJSON文字列にする", "どちらもデータを画面に表示する"],
    answer: 2,
    explanation: "JSON.parse() はJSONの文字列をプログラムで扱うデータに変換し、JSON.stringify() はデータをJSONの文字列にします。JSON は JavaScript Object Notation の略です。",
    article: "../articles/json.html"
  },
  {
    id: "js-json-object",
    category: "javascript",
    question: "このJSONで「キー」と「値」の組み合わせとして正しいものはどれ？",
    code: '{"name": "Masa", "score": 90}',
    choices: ["{ } が キー、\" \" が値", "name が キー、\"Masa\" が値", "JSON が キー、parse が値", ": が キー、, が値"],
    answer: 1,
    explanation: "JSONでは \"name\" がキー（項目名）、\"Masa\" が値（中身）です。コロン : でキーと値を対応させ、カンマ , で複数の項目を区切ります。",
    article: "../articles/json.html"
  },
  {
    id: "js-array",
    category: "javascript",
    question: "このコードで「配列（はいれつ）」を表しているのはどれ？",
    code: 'const fruits = ["りんご", "みかん", "ぶどう"];',
    choices: ['fruits = "りんご"', '["りんご", "みかん", "ぶどう"]', "const fruits", "= の記号"],
    answer: 1,
    explanation: "[ ] で囲まれた複数の値が配列です。値を順番に並べた一覧で、ひとまとまりとして扱います。",
    article: "../articles/json.html"
  },

  // ── GAS編 ──────────────────────────────────────────────

  {
    id: "gas-what-is",
    category: "gas",
    question: "GAS（Google Apps Script）の説明として正しいものはどれ？",
    code: "",
    choices: ["Googleのデザインツール", "JavaScriptを使ってGmailやスプレッドシートなどを操作する仕組み", "Googleが作ったプログラミング言語", "Googleドライブにファイルを保存するだけのツール"],
    answer: 1,
    explanation: "GASはGoogle Apps Scriptの略称で、JavaScriptを使いGmailやGoogleカレンダー・スプレッドシートなどのGoogleサービスを操作できます。",
    article: "../articles/gas.html"
  },
  {
    id: "gas-logger",
    category: "gas",
    question: "GASでこのコードを実行したとき、ログに表示される内容はどれ？",
    code: 'const name = "Masa";\nLogger.log(name);',
    choices: ["name", "Logger", "Masa", "何も表示されない"],
    answer: 2,
    explanation: "Logger.log() は丸かっこの中の値を実行ログに表示します。name には \"Masa\" が入っているため、「Masa」が表示されます。",
    article: "../articles/variable.html"
  },
  {
    id: "gas-spreadsheet",
    category: "gas",
    question: "GASでスプレッドシートを操作するときの入口として使うものはどれ？",
    code: "",
    choices: ["GmailApp", "DriveApp", "SpreadsheetApp", "CalendarApp"],
    answer: 2,
    explanation: "SpreadsheetApp はGASからGoogleスプレッドシートを操作する入口です。シートやセルの値を読み書きする処理で登場します。",
    article: "../articles/gas.html"
  },
  {
    id: "trigger",
    category: "gas",
    question: "GASのトリガーの説明として正しいものはどれ？",
    code: "",
    choices: ["コードのエラーを表示する機能", "処理を自動で始めるきっかけ（指定時刻・フォーム送信など）", "スプレッドシートを開く操作", "実行ログを消去する操作"],
    answer: 1,
    explanation: "トリガーは処理を自動で始めるきっかけです。英語では「引き金」を意味し、指定時刻やフォーム送信などをきっかけに処理を実行できます。",
    article: "../articles/trigger.html"
  },

  // ── Git / GitHub編 ──────────────────────────────────────

  {
    id: "git-what-is",
    category: "git-github",
    question: "Git の説明として正しいものはどれ？",
    code: "",
    choices: ["コードをオンラインで共有するサービス", "ファイルの変更履歴を記録する仕組み", "コードを実行するアプリ", "HTMLをデザインするツール"],
    answer: 1,
    explanation: "Git はファイルの変更履歴を記録する仕組みです。過去の状態と比べたり、変更を追ったりできます。",
    article: "../articles/git-github.html"
  },
  {
    id: "github-what-is",
    category: "git-github",
    question: "GitHubの説明として正しいものはどれ？",
    code: "",
    choices: ["ファイルの変更履歴を手元に記録するだけのツール", "GitとJavaScriptをまとめたフレームワーク", "Gitで管理するコードや履歴をオンラインで保存・共有するサービス", "HTMLの文法を確認するツール"],
    answer: 2,
    explanation: "GitHubはGitで管理するコードや履歴をオンラインで保存・共有するサービスです。Hub（集まる場所）と結び付けると覚えやすくなります。",
    article: "../articles/git-github.html"
  },
  {
    id: "git-commit",
    category: "git-github",
    question: "Gitの「commit（コミット）」の説明として正しいものはどれ？",
    code: "",
    choices: ["GitHubへファイルを送信すること", "ファイルを保存すること", "選んだ変更をローカルの履歴に記録すること", "過去のcommitを取り消すこと"],
    answer: 2,
    explanation: "commit は選んだ変更をローカルの履歴に記録する操作です。ファイルの保存やGitHubへの送信（push）とは別の操作です。",
    article: "../articles/git-github.html"
  },
  {
    id: "git-push",
    category: "git-github",
    question: "Git の「push（プッシュ）」の説明として正しいものはどれ？",
    code: "",
    choices: ["接続先の履歴を取得して手元に取り込む", "手元でcommitした履歴を接続先（GitHubなど）へ送る", "過去のcommitを取り消す", "新しいリポジトリを作る"],
    answer: 1,
    explanation: "push は手元でcommitした履歴を接続先へ送ることです。英語の「押し出す」と方向を結び付けて覚えられます。",
    article: "../articles/git-github.html"
  },
  {
    id: "git-pull",
    category: "git-github",
    question: "Git の「pull（プル）」の説明として正しいものはどれ？",
    code: "",
    choices: ["手元の変更を接続先へ送る", "接続先の履歴を取得して手元に取り込む", "直前のcommitを作り直す", "変更をステージングに追加する"],
    answer: 1,
    explanation: "pull は接続先の履歴を取得して手元の作業へ取り込む操作です。英語の「引き寄せる」と方向を結び付けて覚えられます。",
    article: "../articles/git-github.html"
  },
  {
    id: "git-staging",
    category: "git-github",
    question: "Gitの「ステージング」の説明として正しいものはどれ？",
    code: "",
    choices: ["GitHubへの送信が完了した状態", "次のcommitに含める変更を選ぶ準備の操作", "過去のcommitに戻ること", "リポジトリを新たに作成すること"],
    answer: 1,
    explanation: "ステージングは次のcommitに含める変更を選ぶことです。履歴へ記録する前の準備の段階です。",
    article: "../articles/git-github.html"
  },
  {
    id: "git-repository",
    category: "git-github",
    question: "「リポジトリ（repository）」の説明として正しいものはどれ？",
    code: "",
    choices: ["プログラムを実行するサーバー", "プロジェクトのファイルと変更履歴を管理する場所", "ファイルを圧縮する操作", "コードの変更内容の差分"],
    answer: 1,
    explanation: "リポジトリはプロジェクトのファイルと変更履歴を管理する場所です。手元のPCにも、GitHub上にも置けます。",
    article: "../articles/git-github.html"
  },

  // ── Codex / Antigravity編 ────────────────────────────────

  {
    id: "codex-what-is",
    category: "codex",
    question: "Codex（コーデックス）の説明として正しいものはどれ？",
    code: "",
    choices: ["GoogleのAI開発環境", "OpenAIのAIコーディング支援エージェント", "GitHubのコード共有ツール", "JavaScriptのフレームワーク"],
    answer: 1,
    explanation: "Codex はOpenAIのAIコーディング支援エージェントです。指示に沿ってコードを調べたり、ファイルを修正したりする作業を支援します。",
    article: "../articles/codex.html"
  },
  {
    id: "antigravity-what-is",
    category: "codex",
    question: "Antigravity（アンチグラビティ）の説明として正しいものはどれ？",
    code: "",
    choices: ["OpenAIのAIコーディング支援エージェント", "GitHubの公式エディタ", "GoogleのAI開発環境（エージェント支援ツール）", "JavaScriptの実行環境"],
    answer: 2,
    explanation: "AntigravityはGoogleのAI開発環境（エージェント支援ツール）です。プロジェクトのファイルを直接読み込み、編集や確認などの作業を支援します。",
    article: "../articles/antigravity-backup.html"
  },
  {
    id: "api-what-is",
    category: "codex",
    question: "API（エーピーアイ）の説明として正しいものはどれ？",
    code: "",
    choices: ["HTMLのデザインを指定するファイル", "プログラム同士が決められた方法で機能やデータをやり取りする窓口", "Googleのスプレッドシートサービス", "ファイルの変更履歴を記録する仕組み"],
    answer: 1,
    explanation: "APIはApplication Programming Interfaceの略で、プログラム同士が決められた方法で機能やデータをやり取りする窓口です。天気情報の取得やログイン連携などで使われます。",
    article: "../articles/api.html"
  },

  // ── 属性編（attribute.html 追加分）──────────────────────

  {
    id: "html-attribute-meaning",
    category: "html",
    question: "このコードで「属性」にあたるものはどれ？",
    code: '<a href="https://example.com" class="link">リンク</a>',
    choices: ["a", "href と class", "リンク", "</a>"],
    answer: 1,
    explanation: "属性はタグに追加情報を与えるものです。href と class はどちらも属性で、タグ名（a）の後ろにスペースで区切って書きます。",
    article: "../articles/attribute.html"
  },
  {
    id: "html-attribute-name-value",
    category: "html",
    question: "class=\"card\" の「属性名」と「属性値」の組み合わせとして正しいものはどれ？",
    code: '<div class="card">',
    choices: ["div が属性名、card が属性値", "class が属性名、\"card\" が属性値", "\"card\" が属性名、class が属性値", "class と card のどちらも属性名"],
    answer: 1,
    explanation: "属性は「属性名 = 属性値」の形で書きます。class が属性名で、引用符の中の \"card\" が属性値です。",
    article: "../articles/attribute.html"
  },
  {
    id: "html-multiple-attributes",
    category: "html",
    question: "このコードに付いている属性の数はいくつ？",
    code: '<img class="site-logo" src="../assets/koi.png" alt="">',
    choices: ["1つ", "2つ", "3つ", "4つ"],
    answer: 2,
    explanation: "class・src・alt の3つの属性が付いています。属性はスペースで区切って並べられ、タグによって使えるものが異なります。",
    article: "../articles/attribute.html"
  },
  {
    id: "html-alt-attribute",
    category: "html",
    question: "imgタグの alt 属性の役割として正しいものはどれ？",
    code: '<img src="../assets/koi.png" alt="鯉のロゴ">',
    choices: ["画像のサイズを指定する", "画像のリンク先を指定する", "画像が表示できないときや読み上げ時に使われる代替テキストを指定する", "画像の読み込み元を指定する"],
    answer: 2,
    explanation: "alt は alternative（代わりの）の略で、画像の代替テキストを指定します。画像が読み込めないときや、スクリーンリーダーによる読み上げ時に内容を伝えます。",
    article: "../articles/attribute.html"
  },

  // ── CSSセレクタ編（css-selector.html 追加分）──────────────

  {
    id: "css-selector-dot",
    category: "html",
    question: "CSSで .card { padding: 16px; } と書かれているとき、先頭の . が表しているものはどれ？",
    code: ".card {\n  padding: 16px;\n}",
    choices: [
      "HTMLの id=\"card\" を持つ要素を対象にする",
      "HTMLの class=\"card\" を持つ要素を対象にする",
      "card という名前のファイルを読み込む",
      "ページ内のすべてのカードを削除する"
    ],
    answer: 1,
    explanation: "CSSでは class の値の前に . を付けて指定します。.card は class=\"card\" を持つ要素を対象にします。",
    article: "../articles/css-selector.html"
  },
  {
    id: "css-selector-sharp",
    category: "html",
    question: "CSSで #start { margin-top: 20px; } と書かれているとき、この指定が適用される対象はどれ？",
    code: "#start {\n  margin-top: 20px;\n}",
    choices: [
      "class=\"start\" を持つすべての要素",
      "start という名前の新しいHTMLタグ",
      "ページ内のリンク先がすべて無効化された要素",
      "id=\"start\" を持つ特定の要素"
    ],
    answer: 3,
    explanation: "CSSでは id の値の前に # を付けて指定します。#start はページ内で特定の id=\"start\" を持つ要素を対象にします。",
    article: "../articles/css-selector.html"
  },
  {
    id: "css-selector-element",
    category: "html",
    question: "CSSでタグ名そのまま p { line-height: 1.8; } と書いた場合、対象になるものはどれ？",
    code: "p {\n  line-height: 1.8;\n}",
    choices: [
      "ページ内にある最初の1つだけの p タグ",
      "class=\"p\" が付いている要素",
      "ページ内にあるすべての p タグ（段落）",
      "id=\"p\" が付いている要素"
    ],
    answer: 2,
    explanation: "タグ名を直接セレクタとして書く指定を要素セレクタと呼びます。p { } はページ内のすべての <p> タグをまとめて対象にします。",
    article: "../articles/css-selector.html"
  },
  {
    id: "css-selector-html-pairing",
    category: "html",
    question: "HTMLで <div class=\"site-box\"> と書かれた要素にスタイルを当てる場合、CSS側のセレクタとして正しいものはどれ？",
    code: '<div class="site-box">内容</div>',
    choices: [
      "#site-box",
      ".site-box",
      "div.box#site",
      "@site-box"
    ],
    answer: 1,
    explanation: "HTMLの class 属性に対応するCSSセレクタは、先頭に . を付けた .site-box です。# は id を指定するときに使います。",
    article: "../articles/css-selector.html"
  },

  // ── . と () 編（dot-parentheses.html 追加分）─────────────

  {
    id: "js-dot-meaning",
    category: "javascript",
    question: "GASやJavaScriptのコードで SpreadsheetApp.getActiveSpreadsheet() とあるとき、.（ドット）の役割として最も適切なものはどれ？",
    code: "SpreadsheetApp.getActiveSpreadsheet()",
    choices: [
      "2つの文章を足し算して連結する",
      "左のもの（SpreadsheetApp）の中にある右の機能（getActiveSpreadsheet）を参照する",
      "プログラムの実行を一時停止する",
      "新しいスプレッドシートファイルを削除する"
    ],
    answer: 1,
    explanation: "ドット（.）は「左のものの中にある右のもの」を参照する記号です。SpreadsheetAppという道具箱の中から、getActiveSpreadsheetという機能を取り出しています。",
    article: "../articles/dot-parentheses.html"
  },
  {
    id: "js-parentheses-execution",
    category: "javascript",
    question: "コード内の機能名の後ろにある ()（かっこ）が表している意味として正しいものはどれ？",
    code: "SpreadsheetApp.getActiveSpreadsheet()",
    choices: [
      "その関数・機能を実際に呼び出して実行する",
      "機能の名前を別の名前に書き換える",
      "この機能はまだ使えない（無効化されている）ことを示す",
      "Googleドライブ上のファイルサイズを表す"
    ],
    answer: 0,
    explanation: "() は関数や機能を実際に実行（呼び出し）する合図です。機能名だけでは動かず、() が付くことで処理が開始されます。",
    article: "../articles/dot-parentheses.html"
  },
  {
    id: "js-arguments-meaning",
    category: "javascript",
    question: "GmailApp.search(\"label:todo\") のように、() の中に文字や値が入っている場合、その中身は何と呼ばれる？",
    code: 'GmailApp.search("label:todo")',
    choices: [
      "セレクタ",
      "引数（ひきすう / argument）",
      "タグ名",
      "クラス名"
    ],
    answer: 1,
    explanation: "関数や機能の () の中に渡す材料・情報を「引数（ひきすう）」と呼びます。ここでは検索機能に \"label:todo\" という検索条件を渡しています。",
    article: "../articles/dot-parentheses.html"
  },
  {
    id: "js-dot-chaining",
    category: "javascript",
    question: "次のコードのように .（ドット）が連続してつながっている場合、どのように読むのが基本？",
    code: "SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()",
    choices: [
      "一番右の機能だけが動き、左側の記述は無視される",
      "右から左へ逆順に処理をたどる",
      "左から順番に実行結果を受け取りながら次の機能へつなげて読む",
      "エラーになる書き方なので読まなくてよい"
    ],
    answer: 2,
    explanation: "ドットが連続している場合（メソッドチェーン）は、左から順に読みます。まずスプレッドシートを取得し、その結果に対してさらにgetActiveSheet()を実行しています。",
    article: "../articles/dot-parentheses.html"
  }
];
