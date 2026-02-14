import styles from './Loader.module.scss';

export interface LoaderProps {
    size?: 'small' | 'medium' | 'large';
    centered?: boolean;
}

export function Loader({ size = 'medium', centered = false }: LoaderProps) {
    const classNames = [
        styles.loader,
        styles[`loader--${size}`],
        centered ? styles['loader--centered'] : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classNames} role="status" aria-live="polite" aria-label="Loading">
            <div className={styles.loader__spinner}></div>
            <span className="visually-hidden">Loading...</span>
        </div>
    );
}