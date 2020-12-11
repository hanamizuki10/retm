# 残時間管理くん(Remaining time management)
通称：ReTM(レテム）くん

月の定められた業務時間の残り時間をカンレダーベースで管理するツール
vueとnodeとgasの勉強がてらに作ったツールです。

詳細は以下記事にて記載

https://note.com/copipetech/n/nd33728da46b0

#### 使用技術
 - GoogleAppsScript
 - Vue.js
 - Vuetify
 - TypeScript
 - Indexed Database API

#### 事前準備ファイル
指定のGASへデータを転送するために、事前にGASファイルを作成する必要がある。
プロジェクトルートディレクトリ直下に `.clasp.json` ファイルを作成して格納する。
```
{
  "scriptId": "作成したGASのスクリプトIDをここに記載する",
  "rootDir": "dist"
}

```
## セットアップ
```
npm install
```

### ローカル開発用
```
npm run serve
```

### ビルド
```
# Vue側のビルド
npm run build:vue

# GAS側のビルド
npm run build:gas

# ビルド時に生成される仮フォルダの削除
npm run build:cleanup

# すべて
npm run build

```

### ファイルのlintと修正
```
npm run lint
```

### ユニットテストの実行
```
npm run test:unit
```


### GASのアップロード
```
npm run push
```

### Google AppsScriptページをブラウザ上でオープン
```
npm run open
```


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
