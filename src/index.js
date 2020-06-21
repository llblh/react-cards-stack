import React, { useEffect } from 'react';
import './stack.css';
import './modernizr.js';
import Stack from './stack';


const CardStack = ({
  size, options, onStack, children,
}) => {
  useEffect(() => {
    const stack = new Stack({
      target: document.getElementById('stack'),
      options,
    });
    onStack(stack);
  }, []);

  return (
    <div id="stack" className="stack stack--yuda" style={size}>
      {children}
    </div>
  );
}

const CardStackItem = props => {
  console.log(props);
  const { children, className, ...rema } = props;
  return <div className={`stack__item ${className}`} { ...rema }>
    {children}
  </div>
};

export {
  CardStack,
  CardStackItem,
};
