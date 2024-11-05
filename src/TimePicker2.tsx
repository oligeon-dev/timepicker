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

export const TimePicker2 = forwardRef<HTMLDivElement, Props>(
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
      useScrollTimePicker(defaultHour);
    const { ref: minuteRef, currentTime: currentMinute } =
      useScrollTimePicker(defaultMinute);

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

TimePicker2.displayName = "TimePicker2";

const useScrollTimePicker = (defaultTime: string) => {
  const ref = useRef<HTMLUListElement>(null);
  const [currentTime, setCurrentTime] = useState<string>(defaultTime);

  const handleScroll = useCallback(() => {
    const list = ref.current;
    if (!list) return;

    const children = Array.from(list.children); // リスト内のすべての子要素を配列に変換
    const listCenter = list.getBoundingClientRect().top + list.clientHeight / 2; // リストの中心位置を計算

    let closest = children[0]; // 最も近い要素を初期化（最初の要素を選択）
    let closestDistance = Math.abs(
      closest.getBoundingClientRect().top - listCenter // 初期の最も近い要素とリスト中心との距離を計算
    );

    children.forEach((child) => {
      const distance = Math.abs(child.getBoundingClientRect().top - listCenter); // 各子要素とリスト中心との距離を計算
      if (distance < closestDistance) {
        // もしこの距離が最も近い要素の距離よりも短い場合
        closest = child; // 現在の子要素を最も近い要素として更新
        closestDistance = distance; // 最も近い距離を更新
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
