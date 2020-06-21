# @carpenter/react-cards-stack

### 安装
> npm i @carpenter/react-cards-stack

### 引用
``` js
  import Reactcardstack from '@carpenter/react-cards-stack';
```

### 示例

``` js
import Reactcardstack from '@carpenter/react-tencent-captcha';

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
      <Reactcardstack
        options={{
          infinite: true,
        }}
        size={{ width: 400, height: 214 }}
        onStack={this.onStack}
      >
        <div className="example_item1">1</div>
        <div className="example_item2">2</div>
        <div className="example_item3">3</div>
        <div className="example_item4">4</div>
      </Reactcardstack>
      <button onClick={() => this.onRun('no')}>no</button>
      <button onClick={() => this.onRun('yes')}>yes</button>
    </div>
  }
}
```

