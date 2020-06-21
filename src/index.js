import React from 'react';
import './lib/modernizr.js';
import Stack from './lib/stack';
import './lib/stack.css';

class Fancy extends React.Component {

  state = {
    stack: undefined,
  }

  componentDidMount() {
    const { options } = this.props;
    const stack = new Stack({
      target: document.getElementById('stack'),
      options,
    });
    this.props.onStack(stack);
  }

  render() {
    const { effect, size, children } = this.props;
    return (
      <div className="stack-container">
        <ul id="stack" className="stack stack--yuda" style={size}>
        {children && children.map(item => (
          <li key={item.key} className="stack__item">
            {item}
          </li>
        ))}
      </ul>
    </div>);
  }
}

export default Fancy;
