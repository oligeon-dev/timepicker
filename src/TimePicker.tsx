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
    const { ref: hourRef, currentTime: currentHour } = useScrollTimePicker(
      defaultHour,
      maxHour
    );
    const { ref: minuteRef, currentTime: currentMinute } = useScrollTimePicker(
      defaultMinute,
      60
    );

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
              className={clsx(styles.time, styles.scrollable)}
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
                >
                  {String(hour).padStart(2, "0")}
                </li>
              ))}
            </ul>

            <ul
              className={clsx(styles.time, styles.scrollable)}
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
        </div>
      </div>
    );
  }
);

TimePicker.displayName = "TimePicker";

const useScrollTimePicker = (defaultTime: string, _maxTime: number) => {
  const ref = useRef<HTMLUListElement>(null);
  const [currentTime, setCurrentTime] = useState<string>(defaultTime);

  const handleScroll = useCallback(() => {
    const list = ref.current;
    if (!list) return;

    const children = Array.from(list.children);
    const listCenter = list.getBoundingClientRect().top + list.clientHeight / 2;

    let closest = children[0];
    let closestDistance = Math.abs(
      closest.getBoundingClientRect().top - listCenter
    );

    children.forEach((child) => {
      const distance = Math.abs(child.getBoundingClientRect().top - listCenter);
      if (distance < closestDistance) {
        closest = child;
        closestDistance = distance;
      }
    });

    setCurrentTime(closest.textContent ?? defaultTime);
  }, [defaultTime]);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;

    list.addEventListener("scroll", handleScroll);

    return () => {
      list.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return {
    currentTime,
    ref,
  };
};
