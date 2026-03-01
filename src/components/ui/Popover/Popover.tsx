import { useRef, useEffect } from 'react';
import type { ReactNode, RefObject } from 'react';
import styles from './Popover.module.scss';

export interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  triggerRef: RefObject<HTMLElement | null>;
  placement?: 'bottom-start' | 'bottom-end' | 'bottom';
  offset?: number;
}

/**
 * Popover component - handles positioning and click-outside logic
 * Responsible only for presentation layer, not business logic
 */
export function Popover({
  isOpen,
  onClose,
  children,
  triggerRef,
  placement = 'bottom-start',
  offset = 8,
}: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is outside both popover and trigger
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className={`${styles.popover} ${styles[`popover--${placement}`]}`}
      style={{ 
        top: `calc(100% + ${offset}px)`
      }}
      role="dialog"
      aria-modal="false"
    >
      {children}
    </div>
  );
}
