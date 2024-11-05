import {
  type ComponentPropsWithRef,
  forwardRef,
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { clsx } from "clsx";

//   import { Button } from '../Button';

import styles from "./TimePicker.module.css";

type Props = {
  maxHour?: number;
  defaultHour?: string;
  defaultMinute?: string;
  onSubmitTime?: (time: string) => void;
  onCancel?: () => void;
} & ComponentPropsWithRef<"div">;

export const TimePicker = forwardRef<HTMLDivElement, Props>(
  (
    {
      className,
      onCancel,
      onSubmitTime,
      maxHour = 24,
      defaultHour = "00",
      defaultMinute = "00",
      ...rest
    },
    ref
  ) => {
    const { ref: hourRef, currentTime: currentHour } =
      useIntersection(defaultHour);
    const { ref: minuteRef, currentTime: currentMinute } =
      useIntersection(defaultMinute);

    useEffect(() => {
      hourRef.current?.children[Number(defaultHour)].scrollIntoView({
        block: "center",
      });
      minuteRef.current?.children[Number(defaultMinute)].scrollIntoView({
        block: "center",
      });
    }, [defaultHour, defaultMinute, hourRef, minuteRef]);

    const handleSelect = useCallback(
      (event: MouseEvent<HTMLLIElement> | KeyboardEvent<HTMLLIElement>) => {
        const target = event.target as HTMLLIElement;
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      },
      []
    );

    const handleSubmitTime = useCallback(() => {
      onSubmitTime?.(`${currentHour}:${currentMinute}`);
    }, [currentHour, currentMinute, onSubmitTime]);

    const handleCancel = useCallback(() => {
      onCancel?.();
    }, [onCancel]);

    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={clsx(styles.layout, className)} ref={ref} {...rest}>
            <ul
              className={styles.time}
              ref={hourRef}
              role="listbox"
              aria-label="時間を選択"
            >
              {[...Array(maxHour)].map((_, hour) => (
                <li
                  onClick={handleSelect}
                  onKeyDown={handleSelect}
                  key={`${hour}-hour`}
                  role="option"
                  aria-selected={Number(currentHour) === hour}
                  // aria-label={${hour}時}
                >
                  {String(hour).padStart(2, "0")}
                </li>
              ))}
            </ul>

            <ul
              className={styles.time}
              ref={minuteRef}
              role="listbox"
              aria-label="分を選択"
            >
              {[...Array(60)].map((_, minute) => (
                <li
                  onClick={handleSelect}
                  onKeyDown={handleSelect}
                  key={`${minute}-minute`}
                  role="option"
                  aria-selected={Number(currentMinute) === minute}
                  // aria-label={${minute}分}
                >
                  {String(minute).padStart(2, "0")}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.buttons}>
          <button onClick={handleCancel}>キャンセル</button>
          <button onClick={handleSubmitTime}>OK</button>
          {/* <Button intent="ghost" onClick={handleCancel}>
                キャンセル
              </Button>
              <Button intent="ghost" onClick={handleSubmitTime}>
                OK
              </Button> */}
        </div>
      </div>
    );
  }
);

TimePicker.displayName = "TimePicker";

const useIntersection = (defaultTime: string) => {
  const ref = useRef<HTMLUListElement>(null);
  const [currentTime, setCurrentTime] = useState<string>(defaultTime);

  useEffect(() => {
    const paddingTop = ref.current
      ? getComputedStyle(ref.current).getPropertyValue("padding-top")
      : "0px";
    console.info("padding top", paddingTop);

    const observer = new IntersectionObserver(
      (entries) => {
        console.info("entry", entries[0]);
        if (entries[0].isIntersecting) {
          console.info("target", entries[0].target.textContent);
          setCurrentTime(entries[0].target.textContent ?? defaultTime);
        }
      },
      //   { root: ref.current, rootMargin: `-${paddingTop} 0px` }
      { root: ref.current, rootMargin: `-95px 0px` }
    );

    Array.from(ref.current?.children ?? []).forEach((child) =>
      observer.observe(child)
    );

    return () => observer.disconnect();
  }, [defaultTime]);

  return {
    currentTime,
    ref,
  };
};
