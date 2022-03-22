# useRequestAnimationFrame React Hook

> useRequestAnimationFrame React Hook with start, stop and pause actions and Window.requestAnimationFrame() in the background.

[![NPM](https://img.shields.io/npm/v/request-animation-frame-hook.svg)](https://www.npmjs.com/package/request-animation-frame-hook) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save request-animation-frame-hook
```

## API

```jsx
const cb = (data) => {
  const { time, fps, counter, setStop } = data;
  const { ms, s, m, h, d } = time;
};
const autoStopCb = () => {
  console.log("auto stop callback");
};
const stopValue = 2250;
const stopAfterTime = true;
const clearTimerDelay = 1000;
const stopInfo = [stopValue, stopAfterTime, clearTimerDelay, autoStopCb];
const [start, pause, setStart, setStop] = useRequestAnimationFrame(
  cb,
  stopInfo
);
```

|                 | type      | Required | Description                                                                                                                                                                                                 |
| --------------- | --------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cb              | `void`    | ✓        | callback function                                                                                                                                                                                           |
| time            | `object`  |          | time object                                                                                                                                                                                                 |
| ms, s, m, h, d  | `number`  |          | time object values                                                                                                                                                                                          |
| counter         | `number`  |          | timer amount of refreshing                                                                                                                                                                                  |
| setStart        | `void`    |          | method starting or resuming timer loop                                                                                                                                                                      |
| setStop         | `void`    |          | method stopping timer loop                                                                                                                                                                                  |
| start           | `boolean` |          | current timer start state                                                                                                                                                                                   |
| pause           | `boolean` |          | current timer pause state                                                                                                                                                                                   |
| stopInfo        | `array`   |          | stop info array                                                                                                                                                                                             |
| stopValue       | `number`  |          | depends on `stopAfterTime` takes the value of time in milliseconds or number of refresh counts (returned in `counter` variable)                                                                             |
| stopAfterTime   | `boolean` |          | if `stopAfterTime = false` timer will stop after miliseconds defined in `stopValue`. if `stopAfterTime = true` timer will stop after refresh counts (returned in `counter` variable) defined in `stopValue` |
| clearTimerDelay | `number`  |          | delay in milliseconds after which timer will reset                                                                                                                                                          |
| autoStopCb      | `void`    |          | callback after auto stop                                                                                                                                                                                    |

## Usage

```jsx
import React, { useState } from "react";

import { useRequestAnimationFrame } from "request-animation-frame-hook";

const timeDefault = {
  ms: 0,
  s: 0,
  m: 0,
  h: 0,
  d: 0,
};

const Example = () => {
  const [timer, setTimer] = useState(timeDefault);
  const [fps, setFps] = useState(0);
  const [counter, setCounter] = useState(0);

  const autoStopCb = () => {
    console.log("auto stop callback");
  };

  const [start, pause, setStart, setStop] = useRequestAnimationFrame(
    (data) => {
      setTimer(data.time);
      setFps(data.fps);
      setCounter(data.counter);
    },
    [100, true, 2000, autoStopCb]
  );

  return (
    <div className="App">
      <h1>useRequestAnimationFrame React Hook</h1>
      <p>
        useRequestAnimationFrame React Hook with <strong>start</strong>,{" "}
        <strong>stop</strong> and <strong>pause</strong> actions
      </p>

      <div className="container">
        <h3 className="time">
          {timer.ms.toFixed(1)} ms <span className="frames"> | {fps} fps</span>
        </h3>
        <h4 className="timer">
          Time: {timer.d}:{String(timer.h % 24).padStart(2, "0")}:
          {String(timer.m % 60).padStart(2, "0")}:
          {String(timer.s % 60).padStart(2, "0")}:
          {String(Math.floor(timer.ms / 10) % 100).padStart(2, "0")}
        </h4>
        <h4 className="refreshing">Counter: {counter}</h4>

        <div className="buttons">
          <button onClick={setStart}>{start ? "Pause" : "Start"}</button>
          <button onClick={setStop} disabled={!pause && !start}>
            Stop
          </button>
        </div>
      </div>
    </div>
  );
};
```

## Demo

Try it on CodeSandbox [RequestAnimationFrame React Hook](https://codesandbox.io/s/requestanimationframe-react-hook-v-1-0-0-forked-shmkje?file=/src/App.js)

## License

MIT © [ja-klaudiusz](https://github.com/ja-klaudiusz)
