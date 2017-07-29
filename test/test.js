import test from 'ava'
import { transform } from 'babel-core'

const transpile = input =>
  transform(input, {
    plugins: ['syntax-class-properties', 'syntax-object-rest-spread', 'syntax-jsx', './index']
  }).code

const transpileTest = (name, reactCode) =>
  test(name, t => {
    t.snapshot(reactCode, `${name}: React`)
    t.snapshot(transpile(reactCode))
  })

transpileTest(
  'Generic code',
  `
import ReactDOM from 'react-dom'
import React, { Component as Some } from 'react'

class App extends Some {
  state = {
    hello: 'world',
    count: 10,
    some: {
      deep: {
        object: {
          hello: 'world'
        }
      }
    }
  }
  myMethod1(a, b) {
    return a + b
  }
  myMethod2 = (a, b) => {
    console.log(a, b)
  }
  inc = () => this.setState({ ...this.state, count: this.state.count + 1 })
  deep = () =>
    this.setState({
      ...this.state,
      some: {
        ...this.state.some,
        deep: {
          ...this.state.some.deep,
          object: {
            ...this.state.some.deep.object,
            hello: 'world2'
          }
        }
      }
    })
  dec = () => {
    console.log('what will happen?')
    this.setState({ count: this.state.count + 0, hello: 'yay!' })
  }
  render() {
    return (
      <div className="App">
        <div className="App-header" onClick={this.inc} onChange={() => this.myMethod1(1, 2)}>
          <h2>
            Welcome to React {this.state.hello} {this.myMethod1()}
          </h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    )
  }
  componentDidMount = () => console.log(this.state)
}

ReactDOM.render(<App />, document.getElementById('root'))

`
)
