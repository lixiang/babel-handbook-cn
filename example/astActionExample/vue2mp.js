// vue 转成 miniapp
const babylon = require('babylon')
const t = require('@babel/types')
const generate = require('@babel/generator').default
const traverse = require('@babel/traverse').default

// export default {
//   data() {
//     return {
//       message: 'hello vue',
//       count: 0
//     }
//   },
//   methods: {
//     add() {
//       ++this.count
//     },
//     minus() {
//       --this.count
//     }
//   }
// }

// 转化为=》

// Page({
//   data: (() => {
//     return {
//       message: 'hello vue',
//       count: 0
//     }
//   })(),
//   add() {
//     ++this.data.count
//     this.setData({
//       count: this.data.count
//     })
//   },
//   minus() {
//     --this.data.count
//     this.setData({
//       count: this.data.count
//     })
//   }
// })

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

const datas = []

traverse(ast, {
  ObjectMethod(path) {
    if (path.node.key.name === 'data') {
      // 获取第一级的 BlockStatement，也就是data函数体
      let blockStatement = null
      path.traverse({
        BlockStatement(p) {
          blockStatement = p.node
        },
      })

      const arrowFunctionExpression = t.arrowFunctionExpression(
        [],
        blockStatement,
      )
      const callExpression = t.callExpression(arrowFunctionExpression, [])
      const dataProperty = t.objectProperty(
        t.identifier('data'),
        callExpression,
      )
      path.insertAfter(dataProperty)

      path.remove()
    }
  },
  ObjectProperty(path) {
    if (path.node.key.name === 'methods') {
      // 遍历属性并插入到原methods之后
      path.node.value.properties.forEach(property => {
        path.insertAfter(property)
      })

      path.remove()
    } else if (path.node.key.name === 'data') {
      path.traverse({
        ReturnStatement(path) {
          path.traverse({
            ObjectProperty(path) {
              datas.push(path.node.key.name)
              path.skip()
            },
          })
          path.skip()
        },
      })
      path.skip()
    }
  },
  MemberExpression(path) {
    if (
      path.node.object.type === 'ThisExpression' &&
      datas.includes(path.node.property.name)
    ) {
      path.get('object').replaceWithSourceString('this.data')

      if (
        (t.isAssignmentExpression(path.parentPath) &&
          path.parentPath.get('left') === path) ||
        t.isUpdateExpression(path.parentPath)
      ) {
        // findParent
        const expressionStatement = path.findParent(parent =>
          parent.isExpressionStatement(),
        )
        // create
        if (expressionStatement) {
          const finalExpStatement = t.expressionStatement(
            t.callExpression(
              t.memberExpression(t.thisExpression(), t.identifier('setData')),
              [
                t.objectExpression([
                  t.objectProperty(
                    t.identifier(path.node.property.name),
                    t.identifier(`this.data.${path.node.property.name}`),
                  ),
                ]),
              ],
            ),
          )
          expressionStatement.insertAfter(finalExpStatement)
        }
      }
    }
  },
})

console.log(generate(ast, {}, code).code)
