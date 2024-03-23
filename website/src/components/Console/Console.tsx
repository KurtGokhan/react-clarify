/* eslint-disable no-console */

import { useLayoutEffect, useRef, useState } from 'react';

import styles from './Console.module.css';

export function Console() {
  const [items, setItems] = useState<string[]>([]);

  const itemsRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const oldConsole = console.info;

    console.info = (...args: unknown[]) => {
      oldConsole(...args);
      setItems((current) => [...current, `${args.join(', ')}`]);

      setTimeout(() => {
        itemsRef.current?.scrollTo(0, itemsRef.current.scrollHeight);
      }, 100);
    };

    return () => {
      console.info = oldConsole;
    };
  }, []);

  return !items.length ? null : (
    <div className={styles.console}>
      <div className={styles.header}>Console</div>

      <div className={styles.rows} ref={itemsRef}>
        {items.map((item, index) => (
          <div className={styles.row} key={index}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
