const babylon = require('babylon')
const t = require('@babel/types')
const generate = require('@babel/generator').default
const traverse = require('@babel/traverse').default

const code = `
export default {
  data() {
    return {
      message: 'hello vue',
      count: 0
    }
  },
  methods: {
    add() {
      ++this.count
    },
    minus() {
      --this.count
    }
  }
}
`

const ast = babylon.parse(code, {
  sourceType: 'module',
  plugins: ['flow'],
})

traverse(ast, {
  ObjectMethod(path) {
    if (path.node.key.name === 'data') {
      // const parent = path.parent
      const parent = path.findParent(p => p.isExportDefaultDeclaration())
      const container = path.container
      console.log(parent.type) // output: ObjectExpression
      console.log(container)

      const sibling0 = path.getSibling(0)
      console.log(sibling0 === path) // true
      const sibling1 = path.getSibling(path.key + 1)
      console.log(sibling1.node.key.name) // methods
    }
  },
})
