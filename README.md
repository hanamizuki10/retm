# 残時間管理くん(Remaining time management)
通称：ReTM(レテム）

月の定められた業務時間の残り時間をカンレダーベースで管理するツール

詳細は以下記事にて記載
https://note.com/copipetech/n/nd33728da46b0

#### 使用技術
 - GoogleAppsScript
 - Vue.js
 - Vuetify
 - TypeScript
 - Indexed Database API

 
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
