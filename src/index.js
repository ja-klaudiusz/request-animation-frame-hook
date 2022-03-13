import { useLayoutEffect, useState, useRef } from "react";

const timeDefault = {
  ms: 0,
  s: 0,
  m: 0,
  h: 0,
  d: 0,
};

export const useRequestAnimationFrame = (cb, stopInfo) => {
  const [stop, setStop] = useState(false);
  const [start, setStart] = useState(false);
  const timeRef = useRef(timeDefault);
  const timerRef = useRef();
  const timestampRef = useRef();
  const pauseTimestampRef = useRef(0);
  const pauseTimeRef = useRef(0);
  const counterTimeRef = useRef(0);
  const lastCalledTimeRef = useRef(performance.now());

  const actionReset = () => {
    setStop(false);
    setStart(false);
    timeRef.current = timeDefault;
    timerRef.current = undefined;
    pauseTimestampRef.current = 0;
    pauseTimeRef.current = 0;
    counterTimeRef.current = 0;
    timestampRef.current = undefined;
  };

  const actionStart = () => {
    setStart(!start);
  };

  const actionStop = () => {
    setStop(true);
  };

  const delayStop = () => {
    const delayTime = stopInfo[2];

    if (delayTime) {
      actionStart();
      setTimeout(() => {
        actionStop();
      }, delayTime);
    } else {
      actionStop();
    }
  };

  const actionStopCb = () => {
    actionStop();
    setTimeout(() => {
      cb({
        time: timeDefault,
        counter: 0,
        fps: 0,
        ...cbData,
      });
    }, 10);
  };

  const pause = !start && timeRef.current.ms > 0;

  const cbData = {
    setStop: actionStopCb,
    pause,
  };

  const animate = () => {
    const now = performance.now();
    const ms = now - timestampRef.current - pauseTimeRef.current;
    const delta = (now - lastCalledTimeRef.current) / 1000;

    lastCalledTimeRef.current = performance.now();
    timeRef.current = {
      ms,
      s: Math.floor(ms / 1000),
      m: Math.floor(ms / 1000 / 60),
      h: Math.floor(ms / 1000 / 3600),
      d: Math.floor(ms / 1000 / 3600 / 24),
    };

    if (!pause && !!stopInfo && !stopInfo[1] && ms >= stopInfo[0]) {
      delayStop();
      return;
    }

    if (start && timeRef.current.ms > 0) {
      cb({
        counter: counterTimeRef.current,
        time: timeRef.current,
        fps: parseFloat((1 / delta).toFixed(0)),
        ...cbData,
      });

      if (stopInfo[1] && stopInfo[0] === counterTimeRef.current) {
        delayStop();
        return;
      }
      counterTimeRef.current++;
    }

    timerRef.current = requestAnimationFrame(animate);
  };

  useLayoutEffect(() => {
    if (start) {
      if (!timestampRef.current) {
        timestampRef.current = performance.now();
      } else {
        pauseTimeRef.current =
          pauseTimeRef.current +
          (performance.now() - pauseTimestampRef.current);
      }
      timerRef.current = requestAnimationFrame(animate);
    } else {
      if (timestampRef.current) {
        pauseTimestampRef.current = performance.now();
      }
    }

    if (!stop && pause) {
      cb({
        time: timeRef.current,
        counter: counterTimeRef.current,
        fps: 0,
        ...cbData,
      });
    }

    if (stop) {
      cancelAnimationFrame(timerRef.current);
      actionReset();
      cb({
        time: timeDefault,
        counter: 0,
        fps: 0,
        ...cbData,
      });
    }
    return () => cancelAnimationFrame(timerRef.current);
  }, [start, stop]);

  return [start, pause, actionStart, actionStop];
};
