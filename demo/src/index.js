import React, {Component} from 'react'
import {render} from 'react-dom'

import Reactcardstack from '../../src'

import './index.css';

export default class Demo extends Component {

  state = {
    stackData: null
  }

  onStack = stack => {
    this.setState({
      stackData: stack,
    });
    this.stackData = stack;
  }

  onRun = key => {
    if (key === 'no') {
      this.state.stackData.reject(this.onEndStack);
    } else {
      this.state.stackData.accept(this.onEndStack);
    }
  }

  onEndStack = event => {
    console.log(event);
  }

  render() {
    return <div className="example">
      <Reactcardstack
        options={{
          perspective: 500,
          infinite: true,
        }}
        size={{ width: 400, height: 214 }}
        onStack={this.onStack}
      >
        <div key="1" className="example_item1">1</div>
        <div key="2" className="example_item2">2</div>
        <div key="3" className="example_item3">3</div>
        <div key="4" className="example_item4">4</div>
      </Reactcardstack>
      <button onClick={() => this.onRun('no')}>no</button>
      <button onClick={() => this.onRun('yes')}>yes</button>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
