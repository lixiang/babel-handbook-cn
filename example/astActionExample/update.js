const babylon = require('babylon')
const t = require('@babel/types')
const generate = require('@babel/generator').default
const traverse = require('@babel/traverse').default

// const code = `const c = a + b`
// const ast = babylon.parse(code)

// traverse(ast, {
//   BinaryExpression(path) {
//     // 注意这里要有判断，否则会无限进入`BinaryExpression`
//     // https://stackoverflow.com/questions/37539432/babel-maximum-call-stack-size-exceeded-while-using-path-replacewith
//     if (path.node.operator === '+') {
//       path.replaceWith(t.binaryExpression('*', path.node.left, path.node.right))
//     }
//   },
// })

// console.log(generate(ast, {}, code).code) // const c = a * b;

// const code = `this.count`
// const ast = babylon.parse(code)

// traverse(ast, {
//   MemberExpression(path) {
//     if (
//       t.isThisExpression(path.node.object) &&
//       t.isIdentifier(path.node.property, {
//         name: 'count',
//       })
//     ) {
//       path
//         .get('object') // 获取`ThisExpresssion`
//         .replaceWith(
//           t.memberExpression(t.thisExpression(), t.identifier('data')), // 等价于 =》 path.get('object').replaceWithSourceString('this.data')
//         )
//     }
//   },
// })
// console.log(generate(ast, {}, code).code) // this.data.count;

const code = `
const obj = {
  count: 0,
  message: 'hello world'
}
`
const ast = babylon.parse(code)

const property = t.objectProperty(
  t.identifier('myprop'),
  t.stringLiteral('hello my property'),
)

traverse(ast, {
  ObjectExpression(path) {
    path.pushContainer('properties', property)
  },
})

// 等价于=》
// traverse(ast, {
//   ObjectProperty(path) {
//     if (
//       t.isIdentifier(path.node.key, {
//         name: 'message',
//       })
//     ) {
//       path.insertAfter(property)
//     }
//   },
// })

// remove
// traverse(ast, {
//   ObjectProperty(path) {
//     if (
//       t.isIdentifier(path.node.key, {
//         name: 'message'
//       })
//     ) {
//       path.remove()
//     }
//   }
// })

console.log(generate(ast, {}, code).code)
