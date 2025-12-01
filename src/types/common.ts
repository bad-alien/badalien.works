/**
 * Common type definitions shared across the application
 */

/**
 * Base props for components that support custom styling
 */
export interface StylableProps {
  className?: string;
}

/**
 * Base props for clickable components
 */
export interface ClickableProps {
  onClick?: () => void;
}

/**
 * Props for components with children
 */
export interface WithChildren {
  children: React.ReactNode;
}

/**
 * Standard button props
 */
export interface ButtonProps extends StylableProps, ClickableProps {
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Standard link props
 */
export interface LinkProps extends StylableProps {
  href: string;
}

/**
 * Form input change handler
 */
export type InputChangeHandler = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => void;

/**
 * Generic event handler
 */
export type EventHandler<T = void> = () => T;

/**
 * Generic callback with parameter
 */
export type Callback<T = void, R = void> = (param: T) => R;
