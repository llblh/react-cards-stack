# @carpenter/react-cards-stack

### 安装
> npm i @carpenter/react-cards-stack

### 引用
``` js
  import Reactcardstack from '@carpenter/react-cards-stack';
```

### 示例

``` js
import {CardStack, CardStackItem} from '@carpenter/react-tencent-captcha';

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
      this.state.stackData.reject();
    } else {
      this.state.stackData.accept();
    }
  }

  render() {
    return <div className="example">
      <CardStack
        options={{
          perspective: 500,
          infinite: true,
        }}
        size={{ width: 200, height: 300 }}  // 默认宽高100%
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
```

