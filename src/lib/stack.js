import dynamics from 'dynamics.js';
import classie from 'classie';

const support = {
  animations: Modernizr.cssanimations
};
const animEndEventNames = {
  'WebkitAnimation': 'webkitAnimationEnd',
  'OAnimation': 'oAnimationEnd',
  'msAnimation': 'MSAnimationEnd',
  'animation': 'animationend',
};
const animEndEventName = animEndEventNames[Modernizr.prefixed('animation')];
const onEndAnimation = (el, callback) => {
  const onEndCallbackFn = function (ev) {
    if (support.animations) {
        if (ev.target != this) return;
        this.removeEventListener(animEndEventName, onEndCallbackFn);
    }
    if (callback && typeof callback === 'function') {
        callback.call();
    }
  };
  if (support.animations) {
      el.addEventListener(animEndEventName, onEndCallbackFn);
  } else {
      onEndCallbackFn();
  }
};

class Stack {
  constructor(param) {
    const { target, options } = param;
    this.el = target;
		this.options = {
      // stack's perspective value
      perspective: 1000,
      // stack's perspective origin
      perspectiveOrigin: '50% -50%',
      // number of visible items in the stack
      visible: 3,
      // infinite navigation
      infinite: true,
      // callback: when reaching the end of the stack
      onEndStack: () => {
        return false;
      },
      // animation settings for the items' movements in the stack when the items rearrange
      // object that is passed to the dynamicsjs animate function (see more at http://dynamicsjs.com/)
      // example:
      // {type: dynamics.spring,duration: 1641,frequency: 557,friction: 459,anticipationSize: 206,anticipationStrength: 392}
      stackItemsAnimation : {
        duration : 500,
        type : dynamics.bezier,
        points : [
          {
            'x': 0,
            'y': 0,
            'cp': [
              {
                'x': 0.25,
                'y': 0.1
              }
            ]
          },
          {
            'x': 1,
            'y': 1,
            'cp': [
              {
                'x': 0.25,
                'y': 1
              }
            ]
          },
        ],
      },
      // delay for the items' rearrangement / delay before stackItemsAnimation is applied
      stackItemsAnimationDelay : 0,

      ...options,
    };

    this.items = [].slice.call(this.el.children);

    this.itemsTotal = this.items.length;

		if(
      this.options.infinite &&
      this.options.visible >= this.itemsTotal || !this.options.infinite &&
      this.options.visible > this.itemsTotal || this.options.visible <=0
    ) {
			this.options.visible = 1;
    }

    this.current = 0;

    this.hasEnded = false;

    this.isAnimating = false;

    this.init();
  }

  init() {
    const perspective = `${this.options.perspective}px`;
    this.el.style.WebkitPerspective = perspective;
    this.el.style.perspective = perspective;

    const { perspectiveOrigin } = this.options;
    this.el.style.WebkitPerspectiveOrigin = perspectiveOrigin;
    this.el.style.perspectiveOrigin = perspectiveOrigin;

    for (let i = 0; i < this.itemsTotal; i += 1) {
        const item = this.items[i];
        if (i < this.options.visible) {
          item.style.opacity = 1;
          item.style.pointerEvents = 'auto';
          item.style.zIndex = i === 0 ?
            parseInt(this.options.visible + 1) :
            parseInt(this.options.visible - i);
          
          const transform = `translate3d(0px, 0px, ${parseInt(-1 * 50 * i)}px)`;
          item.style.WebkitTransform = transform;
          item.style.transform = transform;
        } else {
          const transform = `translate3d(0, 0, -${parseInt(this.options.visible * 50)}px)`;
          item.style.WebkitTransform = transform;
          item.style.transform = transform;
        }
    }
    classie.add(this.items[this.current], 'stack__item--current');
  };

  next(action, callback) {
		if (this.isAnimating || (!this.options.infinite && this.hasEnded)) return;
    this.isAnimating = true;
    const currentItem = this.items[this.current];

    classie.remove(currentItem, 'stack__item--current');
    classie.add(currentItem, action === 'accept' ? 'stack__item--accept' : 'stack__item--reject');

    const self = this;

    onEndAnimation(currentItem, function () {
      currentItem.style.opacity = 0;
      currentItem.style.pointerEvents = 'none';
      currentItem.style.zIndex = -1;
      
      const transform = `translate3d(0px, 0px, -${parseInt(self.options.visible * 50)}px)`;
      currentItem.style.WebkitTransform = transform;
      currentItem.style.transform = transform;
      classie.remove(currentItem, action === 'accept' ? 'stack__item--accept' : 'stack__item--reject');
      self.items[self.current].style.zIndex = self.options.visible + 1;
      self.isAnimating = false;
      if (callback) callback();
      if (!self.options.infinite && self.current === 0) {
        self.hasEnded = true;
        self.options.onEndStack(self);
      }
    });
    for (let i = 0; i < this.itemsTotal; i += 1) {
      if (i >= this.options.visible) break;
      let pos = this.current + i < this.itemsTotal - 1 ?
        this.current + i + 1 :
        i - (this.itemsTotal - this.current - 1);
      if (!this.options.infinite) {
        if (this.current + i >= this.itemsTotal - 1) break;
        pos = this.current + i + 1;
      }
      const item = this.items[pos];
      const animateStackItems = function (item, i) {
        item.style.pointerEvents = 'auto';
        item.style.opacity = 1;
        item.style.zIndex = parseInt(self.options.visible - i);
        dynamics.animate(item, {
          translateZ: parseInt(-1 * 50 * i)
        }, self.options.stackItemsAnimation);
      };
      setTimeout(function (item, i) {
        return function () {
          var preAnimation;
          if (self.options.stackItemsPreAnimation) {
            preAnimation = action === 'accept' ?
              self.options.stackItemsPreAnimation.accept :
              self.options.stackItemsPreAnimation.reject;
          }
          if (preAnimation) {
            var animProps = {};
            for (var key in preAnimation.animationProperties) {
              const interval = preAnimation.elastic ?
                preAnimation.animationProperties[key] / self.options.visible :
                0;
              animProps[key] = preAnimation.animationProperties[key] - Number(i * interval);
            }
            animProps.translateZ = parseInt(-1 * 50 * (i + 1));
            preAnimation.animationSettings.complete = function () {
              animateStackItems(item, i);
            };
            dynamics.animate(item, animProps, preAnimation.animationSettings);
          } else {
            animateStackItems(item, i);
          }
        };
      }(item, i), this.options.stackItemsAnimationDelay);
    }
    this.current = this.current < this.itemsTotal - 1 ? this.current + 1 : 0;
    classie.add(this.items[this.current], 'stack__item--current');
	}
  
  // restart
  restart() {
		this.hasEnded = false;
		this.init();
  }

  // reject
  reject(callback) {
		this.next('reject', callback);
  };

  // accept
  accept(callback) {
		this.next('accept', callback);
  };
  

  
};

export default Stack;