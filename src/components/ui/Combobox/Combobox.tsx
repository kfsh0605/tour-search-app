import { useState, useRef } from 'react';
import type { ReactNode } from 'react';
import { Input } from '../Input';
import { Popover } from '../Popover';
import styles from './Combobox.module.scss';

export interface ComboboxOption {
  id: string | number;
  label: string;
  value: any;
  icon?: ReactNode;
  subtitle?: string;
}

export interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (option: ComboboxOption) => void;
  options: ComboboxOption[];
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  renderOption?: (option: ComboboxOption) => ReactNode;
  'aria-label'?: string;
}

/**
 * Combobox component - handles autocomplete logic and keyboard navigation
 * Combines Input + Popover with selection logic
 */
export function Combobox({
  value,
  onChange,
  onSelect,
  options,
  placeholder = 'Search...',
  loading = false,
  disabled = false,
  renderOption,
  'aria-label': ariaLabel,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleInputClick = () => {
    setIsOpen(true);
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleOptionClick = (option: ComboboxOption) => {
    onSelect(option);
    onChange(option.label);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && options[selectedIndex]) {
          handleOptionClick(options[selectedIndex]);
        }
        break;
      case 'Escape':
        handleClose();
        break;
    }
  };

  const defaultRenderOption = (option: ComboboxOption) => (
    <>
      {option.icon && (
        <span className={styles.combobox__icon} aria-hidden="true">
          {option.icon}
        </span>
      )}
      <span className={styles.combobox__label}>
        {option.label}
        {option.subtitle && (
          <span className={styles.combobox__subtitle}>{option.subtitle}</span>
        )}
      </span>
    </>
  );

  const optionRenderer = renderOption || defaultRenderOption;

  return (
    <div className={styles.combobox} ref={triggerRef}>
      <Input
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onClick={handleInputClick}
        onKeyDown={handleKeyDown}
        onClear={value ? handleClear : undefined}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-autocomplete="list"
        aria-controls={isOpen ? 'combobox-listbox' : undefined}
        aria-expanded={isOpen}
        role="combobox"
      />

      <Popover
        isOpen={isOpen}
        onClose={handleClose}
        triggerRef={triggerRef}
        placement="bottom-start"
      >
        <div
          id="combobox-listbox"
          className={styles.combobox__listbox}
          role="listbox"
          aria-label="Options"
        >
          {loading ? (
            <div className={styles.combobox__loading} role="status" aria-live="polite">
              Loading...
            </div>
          ) : options.length > 0 ? (
            options.map((option, index) => (
              <button
                key={option.id}
                type="button"
                className={`${styles.combobox__option} ${
                  index === selectedIndex ? styles['combobox__option--selected'] : ''
                }`}
                onClick={() => handleOptionClick(option)}
                role="option"
                aria-selected={index === selectedIndex}
              >
                {optionRenderer(option)}
              </button>
            ))
          ) : (
            <div className={styles.combobox__empty} role="status">
              No results found
            </div>
          )}
        </div>
      </Popover>
    </div>
  );
}
