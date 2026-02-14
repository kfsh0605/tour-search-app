import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    fullWidth?: boolean;
    loading?: boolean;
}

export function Button({
                           variant = 'primary',
                           fullWidth = false,
                           loading = false,
                           disabled,
                           className = '',
                           children,
                           ...props
                       }: ButtonProps) {
    const classNames = [
        styles.button,
        styles[`button--${variant}`],
        fullWidth ? styles['button--full-width'] : '',
        loading ? styles['button--loading'] : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            className={classNames}
            disabled={disabled || loading}
            {...props}
        >
            {children}
        </button>
    );
}