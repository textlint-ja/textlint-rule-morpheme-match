import TextLintTester from "textlint-tester";
import path from "path";

const tester = new TextLintTester();
import rule from "../src/textlint-rule-morpheme-match";

const options = {
    dictionaryPathList: [path.join(__dirname, "fixtures/dictionary.js")]
};
const multipleDictOptions = {
    dictionaryPathList: [
        path.join(__dirname, "fixtures/dictionary.js"), path.join(__dirname, "fixtures/no-abusage.json")
    ]
};
tester.run("textlint-rule-ja-no-redundant-expression", rule, {
    valid: [
        { text: "text", options },
        { text: "長さは可変だ", options: multipleDictOptions },
        { text: "人は1人では育つことができない", options }
    ],
    invalid: [
        {
            text: "これは省略することが可能だが、省略しない。",
            options,
            errors: [
                {
                    message: `"することが可能だ"は冗長な表現です。"することが可能"を省き簡潔な表現にすると文章が明瞭になります。
参考: http://qiita.com/takahi-i/items/a93dc2ff42af6b93f6e0`,
                    index: 5
                }
            ]
        },
        {
            text: "これは省略することが可能です。",
            options,
            errors: [
                {
                    message: `"することが可能です"は冗長な表現です。"することが可能"を省き簡潔な表現にすると文章が明瞭になります。
参考: http://qiita.com/takahi-i/items/a93dc2ff42af6b93f6e0`,
                    index: 5
                }
            ]
        },
        {
            text: "必要なら解析することができます。",
            output: "必要なら解析できます。",
            options,
            errors: [
                {
                    message: `"することができます"は冗長な表現です。"することが"を省き簡潔な表現にすると文章が明瞭になります。
参考: http://qiita.com/takahi-i/items/a93dc2ff42af6b93f6e0`,
                    index: 6
                }
            ]
        },
        {
            text: "これは必要であると言えます。",
            options,
            errors: [
                {
                    message: `"であると言えます"は冗長な表現です。"である" または "と言えます"を省き簡潔な表現にすると文章が明瞭になります。
参考: http://www.sekaihaasobiba.com/entry/2014/10/24/204024`,
                    index: 5
                }
            ]
        },
        //http://www.atmarkit.co.jp/ait/articles/1001/19/news106_2.html
        {
            text: "このコマンドの後には任意の値を設定することができる。このため、設定した値ごとに、システムの動作の確認を行わなければならない。この作業には時間がかかるため、テスト要員の追加が必要であると考えている。",
            options,
            errors: [
                {
                    message: `"することができる。"は冗長な表現です。"することが"を省き簡潔な表現にすると文章が明瞭になります。
参考: http://qiita.com/takahi-i/items/a93dc2ff42af6b93f6e0`,
                    line: 1,
                    column: 18
                },
                {
                    message: `"確認を行わなければ"は冗長な表現です。"確認しなければ"など簡潔な表現にすると文章が明瞭になります。
参考: http://www.atmarkit.co.jp/ait/articles/1001/19/news106_2.html`,
                    line: 1,
                    column: 49
                },
                {
                    message: `"であると考えている"は冗長な表現です。"である" または "と考えている"を省き簡潔な表現にすると文章が明瞭になります。
参考: http://www.atmarkit.co.jp/ait/articles/1001/19/news106_2.html`,
                    line: 1,
                    column: 89
                }
            ]
        },
        {
            text: "ウインドウ幅が可変すると",
            options: multipleDictOptions,
            errors: [
                {
                    message: `「可変する」という使い方は適切ではありません。「可逆」と同じ使い方になります。\nhttp://qiita.com/scivola/items/f02589968a4ca27bc52b`,
                    index: 7
                }
            ]
        }
    ]
});
