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
        <div className={classNames}>
            <div className={styles.loader__spinner}></div>
        </div>
    );
}