import classNames from 'classnames';
import React, { useRef, useImperativeHandle } from 'react';

import styles from './Input.module.scss';

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> & {
  value: string;
  onChange: (value: string) => void;
  afterSlot?: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ value, onChange, className, afterSlot, disabled, ...props }, ref) => {
    const innerRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => innerRef.current!);

    const handleContainerClick = () => {
      if (!disabled) {
        innerRef.current?.focus();
      }
    };

    return (
      <div
        className={classNames(
          styles.input_container,
          { [styles.disabled]: disabled, [styles.with_after_slot]: !!afterSlot },
          className
        )}
        onClick={handleContainerClick}
      >
        <input
          ref={innerRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={styles.input}
          onMouseDown={(e) => e.stopPropagation()}
          {...props}
        />
        {afterSlot && <div className={styles.after_slot}>{afterSlot}</div>}
      </div>
    );
  }
);