import classNames from 'classnames';
import React, { useRef } from 'react';

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

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ value, onChange, className, afterSlot, disabled, ...props }) => {
    const ref = useRef<HTMLInputElement>(null);

    return (
        <div 
            className={classNames(
                styles.input_container, 
                {[styles.disabled]: disabled || false, [styles.with_after_slot]: !!afterSlot}, 
                className
            )}
            onClick={() => {
                ref.current?.focus();
            }}    
            >
            <input
                ref={ref}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={styles.input}
                onMouseDown={(e) => {
                    e.stopPropagation();
                }}
                {...props}
            />
            {afterSlot && <div className={styles.after_slot}>{afterSlot}</div>}
        </div>
    );
});
