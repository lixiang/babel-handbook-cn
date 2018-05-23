import * as babylon from 'babylon'
import traverse from 'babel-traverse'
import * as t from 'babel-types'
import generate from 'babel-generator'

const code = `function square(n) { return n * n }`

const ast = babylon.parse(code)
// ->
// Node {
//   type: 'File',
//   start: 0,
//   end: 35,
//   loc:
//    SourceLocation {
//      start: Position { line: 1, column: 0 },
//      end: Position { line: 1, column: 35 } },
//   program:
//    Node {
//      type: 'Program',
//      start: 0,
//      end: 35,
//      loc: SourceLocation { start: [Object], end: [Object] },
//      sourceType: 'script',
//      body: [ [Object] ],
//      directives: [] },
//   comments: [],
//   tokens:
//    [ Token {
//        type: [Object],
//        value: 'function',
//        start: 0,
//        end: 8,
//        loc: [Object] },
//      Token {
//        type: [Object],
//        value: 'square',
//        start: 9,
//        end: 15,
//        loc: [Object] },
//      Token {
//        type: [Object],
//        value: undefined,
//        start: 15,
//        end: 16,
//        loc: [Object] },
//      Token { type: [Object], value: 'n', start: 16, end: 17, loc: [Object] },
//      Token {
//        type: [Object],
//        value: undefined,
//        start: 17,
//        end: 18,
//        loc: [Object] },
//      Token {
//        type: [Object],
//        value: undefined,
//        start: 19,
//        end: 20,
//        loc: [Object] },
//      Token {
//        type: [Object],
//        value: 'return',
//        start: 21,
//        end: 27,
//        loc: [Object] },
//      Token { type: [Object], value: 'n', start: 28, end: 29, loc: [Object] },
//      Token { type: [Object], value: '*', start: 30, end: 31, loc: [Object] },
//      Token { type: [Object], value: 'n', start: 32, end: 33, loc: [Object] },
//      Token {
//        type: [Object],
//        value: undefined,
//        start: 34,
//        end: 35,
//        loc: [Object] },
//      Token {
//        type: [Object],
//        value: undefined,
//        start: 35,
//        end: 35,
//        loc: [Object] } ] }

// babylon.parse(code, {
//   sourceType: "module", // default: "script"
//   plugins: ["jsx"] // default: []
// });
// sourceType 可以是 "module" 或者 "script"，它表示 Babylon 应该用哪种模式来解析。 "module" 将会在严格模式下解析并且允许模块定义，"script" 则不会。

traverse(ast, {
  enter(path) {
    if (t.isIdentifier(path.node, { name: 'n' })) {
      path.node.name = 'x'
    }
  },
})

const gen = generate(ast, {}, code)
console.log(gen)
