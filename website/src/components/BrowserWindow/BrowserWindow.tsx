import clsx from 'clsx';
import type { CSSProperties, ReactNode } from 'react';

import { Console } from '../Console';

import styles from './BrowserWindow.module.css';

interface Props {
  children: ReactNode;
  minHeight?: number;
  url?: string;
  theme?: string;
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
}

export function BrowserWindow({
  children,
  minHeight,
  url = 'http://localhost:3000',
  style,
  bodyStyle,
  theme = 'light',
}: Props): JSX.Element {
  return (
    <div className={clsx(styles.browserWindow, 'sb-unstyled')} style={{ ...style, minHeight }} data-theme={theme}>
      <div className={styles.browserWindowHeader}>
        <div className={styles.buttons}>
          <span className={styles.dot} style={{ background: '#f25f58' }} />
          <span className={styles.dot} style={{ background: '#fbbe3c' }} />
          <span className={styles.dot} style={{ background: '#58cb42' }} />
        </div>
        <div className={styles.browserWindowAddressBar}>{url}</div>
        <div className={styles.browserWindowMenuIcon}>
          <div>
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </div>
        </div>
      </div>

      <div className={styles.browserWindowBody} style={bodyStyle}>
        {children}
      </div>

      <Console />
    </div>
  );
}
