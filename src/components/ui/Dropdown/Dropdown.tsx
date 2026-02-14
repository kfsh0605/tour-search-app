import type { ReactElement, ReactNode } from 'react';
import { cloneElement } from 'react';
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    useClick,
    useDismiss,
    useRole,
    useInteractions,
    FloatingFocusManager,
    FloatingPortal,
} from '@floating-ui/react';
import styles from './Dropdown.module.scss';

export interface DropdownProps {
    isOpen: boolean;
    onClose: () => void;
    trigger: ReactElement;
    children: ReactNode;
    placement?: 'bottom-start' | 'bottom-end' | 'bottom';
}

export function Dropdown({
                             isOpen,
                             onClose,
                             trigger,
                             children,
                             placement = 'bottom-start',
                         }: DropdownProps) {
    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: (open) => {
            if (!open) onClose();
        },
        placement,
        middleware: [offset(8), flip(), shift({ padding: 8 })],
        whileElementsMounted: autoUpdate,
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const role = useRole(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([
        click,
        dismiss,
        role,
    ]);

    return (
        <>
            {cloneElement(trigger, {
                ref: refs.setReference,
                ...getReferenceProps(),
            } as any)}

            {isOpen && (
                <FloatingPortal>
                    <FloatingFocusManager context={context} modal={false}>
                        <div
                            ref={refs.setFloating}
                            style={floatingStyles}
                            className={styles.dropdown}
                            {...getFloatingProps()}
                        >
                            <div className={styles.dropdown__content}>{children}</div>
                        </div>
                    </FloatingFocusManager>
                </FloatingPortal>
            )}
        </>
    );
}