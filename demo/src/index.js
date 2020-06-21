import React, {Component} from 'react'
import {render} from 'react-dom'

import { CardStack, CardStackItem } from '../../src'

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
      <CardStack
        options={{
          perspective: 500,
          infinite: true,
        }}
        size={{ width: 200, height: 300 }}
        onStack={this.onStack}
      >
        {[1,2,3,4].map(item => (
          <CardStackItem className={`example_item${item + 1}`} key={item}>{item}</CardStackItem>
        ))}
      </CardStack>
      <button onClick={() => this.onRun('no')}>no</button>
      <button onClick={() => this.onRun('yes')}>yes</button>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
