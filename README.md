# input-graph

Interactive graph visualization component for creating and editing relationships.

## Demo
https://code4fukui.github.io/input-graph/

## Features
- Drag and drop nodes to rearrange the graph
- Select and highlight nodes
- Automatic layout and spacing between nodes

## Requirements
None, this is a client-side JavaScript component.

## Usage
To use the `<input-graph>` element, include the `input-graph.js` script:

```html
<script type="module" src="input-graph.js"></script>
<input-graph id="mygraph" style="width:600px;height:400px"></input-graph>
```

You can set the `value` property to provide the initial data:

```javascript
mygraph.value = "s,o\ncat,animal\ndog,animal\nanimal,lives";
```

The data should be in CSV format with `s` and `o` columns representing the source and destination nodes.

## License
MIT License