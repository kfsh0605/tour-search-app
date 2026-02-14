import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef, useId } from 'react';
import styles from './Input.module.scss';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
    error?: boolean;
    errorMessage?: string;
    label?: string;
    prefixIcon?: ReactNode;
    suffixIcon?: ReactNode;
    onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            error = false,
            errorMessage,
            label,
            prefixIcon,
            suffixIcon,
            onClear,
            className = '',
            disabled,
            id,
            'aria-label': ariaLabel,
            ...props
        },
        ref
    ) => {
        const generatedId = useId();
        const inputId = id || generatedId;
        const errorId = `${inputId}-error`;

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
                {label && (
                    <label htmlFor={inputId} className={styles.input__label}>
                        {label}
                    </label>
                )}

                <div className={styles.input__wrapper}>
                    {prefixIcon && (
                        <div className={styles.input__prefix} aria-hidden="true">
                            {prefixIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        className={styles.input__field}
                        disabled={disabled}
                        aria-label={ariaLabel || label}
                        aria-invalid={error}
                        aria-describedby={error && errorMessage ? errorId : undefined}
                        {...props}
                    />

                    {onClear && props.value && (
                        <button
                            type="button"
                            className={styles.input__clear}
                            onClick={onClear}
                            aria-label="Clear input"
                            tabIndex={-1}
                        >
                            ✕
                        </button>
                    )}

                    {suffixIcon && (
                        <div className={styles.input__suffix} aria-hidden="true">
                            {suffixIcon}
                        </div>
                    )}
                </div>

                {error && errorMessage && (
                    <div id={errorId} className={styles.input__error} role="alert">
                        {errorMessage}
                    </div>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
