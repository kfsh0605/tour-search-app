import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import styles from './Input.module.scss';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
    error?: boolean;
    prefixIcon?: ReactNode;
    suffixIcon?: ReactNode;
    onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            error = false,
            prefixIcon,
            suffixIcon,
            onClear,
            className = '',
            disabled,
            ...props
        },
        ref
    ) => {
        const wrapperClassNames = [
            styles.input,
            error ? styles['input--error'] : '',
            disabled ? styles['input--disabled'] : '',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div className={wrapperClassNames}>
                {prefixIcon && <div className={styles.input__prefix}>{prefixIcon}</div>}

                <input
                    ref={ref}
                    className={styles.input__field}
                    disabled={disabled}
                    {...props}
                />

                {onClear && props.value && (
                    <button
                        type="button"
                        className={styles.input__clear}
                        onClick={onClear}
                        tabIndex={-1}
                    >
                        ✕
                    </button>
                )}

                {suffixIcon && <div className={styles.input__suffix}>{suffixIcon}</div>}
            </div>
        );
    }
);

Input.displayName = 'Input';