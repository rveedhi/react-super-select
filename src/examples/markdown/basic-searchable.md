### JSX Markup
```html
<ReactSuperSelect placeholder=\"Make a Selection\" dataSource={testData} onChange={handlerExample} searchable={true} />
```

### Properties

#### handlerExample
```js
var handlerExample = function(option) {
  var output = [
    'Searchable Option Item Chosen = {\n',
    '\tid: ', option.id, '\n',
    '\tname: ', option.name, '\n',
    '\tsize: ', option.size, '\n\t};'];
  exampleOutput('basic_example_output', output.join(''));
};
```

#### dataSource
```js
var testData = [
{
  "id": "5507c0528152e61f3c348d56",
  "name": "elit laborum et",
  "size": "Large"
},
{
  "id": "5507c0526305bceb0c0e2c7a",
  "name": "dolor nulla velit",
  "size": "Medium"
}, ...(option objects continue)
];
```