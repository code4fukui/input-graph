# input-graph

グラフの入力・編集・表示ができる軽量な Webコンポーネントです。ノードの移動、選択、自動レイアウトなどの機能を備えています。

## デモ
https://code4fukui.github.io/input-graph/

## 機能
- ノードをドラッグ&ドロップで移動
- ノードの選択と強調表示
- グラフの自動レイアウトと間隔調整

## 必要環境
ブラウザ上で動作します。クライアントサイドのみの実装です。

## 使い方
以下のようにHTMLに `<input-graph>` 要素を追加し、初期データを `value` プロパティで設定できます。

```html
<script type="module" src="https://code4fukui.github.io/input-graph/input-graph.js"></script>
<input-graph id="inputgraph" style="width:50vw;height:300px"></input-graph>

<script type="module">
  inputgraph.value = "s,o\ncat,animal\ndog,animal\nanimal,lives";
</script>
```

## ライセンス
MIT License