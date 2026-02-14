import type { ReactNode } from 'react';
import styles from './Dropdown.module.scss';

export interface DropdownItemProps {
    onClick: () => void;
    children: ReactNode;
    icon?: ReactNode;
    active?: boolean;
}

export function DropdownItem({
                                 onClick,
                                 children,
                                 icon,
                                 active = false,
                             }: DropdownItemProps) {
    return (
        <button
            type="button"
            className={`${styles.dropdown__item} ${
                active ? styles['dropdown__item--active'] : ''
            }`}
            onClick={onClick}
        >
            {icon && <span className={styles.dropdown__icon}>{icon}</span>}
            <span className={styles.dropdown__text}>{children}</span>
        </button>
    );
}