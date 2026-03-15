# input-graph

グラフの入力・表示をすることができる軽量なWebコンポーネントです。

## デモ
https://code4fukui.github.io/input-graph/

## 機能
- グラフのノードとエッジを表示
- ノードをドラッグ&ドロップで移動
- 入力データの編集に連携したグラフの自動レイアウト

## 必要環境
ブラウザ上で動作します。

## 使い方
```html
<script type="module" src="https://code4fukui.github.io/input-graph/input-graph.js"></script>
<input-graph id="inputgraph" style="width:50vw;height:300px"></input-graph>

<script type="module">
  inputgraph.value = "s,o\ncat,animal\ndog,animal\nanimal,lives";
</script>
```

## ライセンス
MIT License