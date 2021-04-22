# @textlint-ja/textlint-rule-morpheme-match [![Build Status](https://travis-ci.org/textlint-ja/textlint-rule-morpheme-match.svg?branch=master)](https://travis-ci.org/textlint-ja/textlint-rule-morpheme-match)

形態素解析結果のTokenベースの辞書でマッチするtextlintルール。

[kuromoji.js](https://github.com/takuyaa/kuromoji.js)形態素解析のTokenを取得し、[morpheme-match-textlint](https://github.com/azu/morpheme-match/tree/master/packages/morpheme-match-textlint)を使い辞書とTokenが一致しているかを判定しています。

[textlint-rule-prh](https://github.com/textlint-rule/textlint-rule-prh)では正規表現のマッチができますが、品詞の一致などは見れません。
`textlint-rule-morpheme-match`は日本語を単語レベルでの一致でチェックするルールです。

- Tokenビューア: [morpheme-match](https://azu.github.io/morpheme-match/)
- 利用しているライブラリ
    - [azu/morpheme-match: match function that match token(形態素解析) with sentence.](https://github.com/azu/morpheme-match)
    - [morpheme-match-textlint](https://github.com/azu/morpheme-match/tree/master/packages/morpheme-match-textlint)

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @textlint-ja/textlint-rule-morpheme-match

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "@textlint-ja/morpheme-match": {
            "dictionaryPathList": ["./path/to/dictionary.js"] 
        }
    }
}
```

## Options

- `dictionaryPathList`: `string[]`
    - 辞書ファイルへのファイルパスの配列
    - 例) `/user/file/to/dict.js`, `~/download/dict.js`, `./path/to/dict.json` などのファイルパス形式に対応しています
    
## 辞書ファイル

辞書ファイルは`.js`または`.json`形式で記述できます。
1つの辞書ファイルには、複数のルールを含めることが可能です。

- `tokens`: マッチするTokenのパターンを配列で記述します
    - それぞれのTokenに記述しているプロパティの一致を見ます
    - どのTokenでもいいワイルドカード的なものは`{}`(空のオブジェクト)を置くことで実現できます
    - Tokenについては[morpheme-match](https://azu.github.io/morpheme-match/)を参考にしてください
    - `_capture`というプロパティには、`surface_form`をキャプチャをする正規表現の変数を指定できます。
    - 記憶した変数は`message`で`$1`のように指定すると、メッセージを出すときに置換されます
    - [String.prototype.replace() | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/replace)
- `message`: `tokens`にマッチした場合のエラーメッセージを記述します
- `expected`: `textlint --fix`で自動的に修正する結果を記述します
    - `tokens`にマッチした箇所が`expected`に置換され、自動修正ができるようになります

```js
module.exports = [
    // ルール1
    {
        // https://azu.github.io/morpheme-match/?text=省略(することが可能)。
        message: `"することが可能$1"は冗長な表現です。"することが可能"を省き簡潔な表現にすると文章が明瞭になります。
参考: http://qiita.com/takahi-i/items/a93dc2ff42af6b93f6e0`,
        tokens: [
            {
                "surface_form": "する",
                "pos": "動詞",
                "pos_detail_1": "自立",
                "pos_detail_2": "*",
                "pos_detail_3": "*",
                "conjugated_type": "サ変・スル",
                "conjugated_form": "基本形",
                "basic_form": "する",
                "reading": "スル",
                "pronunciation": "スル"
            }, {
                "surface_form": "こと",
                "pos": "名詞",
                "pos_detail_1": "非自立",
                "pos_detail_2": "一般",
                "pos_detail_3": "*",
                "conjugated_type": "*",
                "conjugated_form": "*",
                "basic_form": "こと",
                "reading": "コト",
                "pronunciation": "コト"
            }, {
                "surface_form": "が",
                "pos": "助詞",
                "pos_detail_1": "格助詞",
                "pos_detail_2": "一般",
                "pos_detail_3": "*",
                "conjugated_type": "*",
                "conjugated_form": "*",
                "basic_form": "が",
                "reading": "ガ",
                "pronunciation": "ガ"
            }, {
                "surface_form": "可能",
                "pos": "名詞",
                "pos_detail_1": "形容動詞語幹",
                "pos_detail_2": "*",
                "pos_detail_3": "*",
                "conjugated_type": "*",
                "conjugated_form": "*",
                "basic_form": "可能",
                "reading": "カノウ",
                "pronunciation": "カノー"
            }, {
                "pos": "助動詞",
                "_capture": "$1"
            }
        ]
    },
    // ルール2
    {
        "message": "\"適用\"の誤用である可能性があります。適応 => 適用",
        "expected": "を適用",
        "tokens": [
          {
            "surface_form": "を",
            "pos": "助詞",
            "pos_detail_1": "格助詞",
            "pos_detail_2": "一般",
            "pos_detail_3": "*",
            "conjugated_type": "*",
            "conjugated_form": "*",
            "basic_form": "を",
            "reading": "ヲ",
            "pronunciation": "ヲ"
          },
          {
            "surface_form": "適応",
            "pos": "名詞",
            "pos_detail_1": "サ変接続",
            "pos_detail_2": "*",
            "pos_detail_3": "*",
            "conjugated_type": "*",
            "conjugated_form": "*",
            "basic_form": "適応",
            "reading": "テキオウ",
            "pronunciation": "テキオー"
          }
        ]
    }
];
```

## 参考

- [morpheme-match](https://github.com/azu/morpheme-match)

## Changelog

See [Releases page](https://github.com/textlint-ja/textlint-rule-morpheme-match/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/textlint-ja/textlint-rule-morpheme-match/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
