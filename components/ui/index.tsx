import React from 'react';
import { cn } from '@/lib/utils';

// ─── Button ──────────────────────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    asChild?: boolean;
}

const buttonVariants: Record<ButtonVariant, string> = {
    primary: 'bg-[#1E3A8A] text-white hover:bg-blue-800 shadow-sm',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'bg-white border-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-blue-50',
    ghost: 'text-gray-600 hover:text-[#1E3A8A] hover:bg-gray-100',
    gold: 'bg-[#D4AF37] text-gray-900 hover:bg-yellow-500 shadow-sm',
};

const buttonSizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-xl',
    lg: 'px-8 py-3.5 text-base rounded-xl',
};

export function Button({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    className,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            disabled={disabled || isLoading}
            className={cn(
                'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
                buttonVariants[variant],
                buttonSizes[size],
                className,
            )}
            {...props}
        >
            {isLoading ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
            ) : leftIcon}
            {children}
            {!isLoading && rightIcon}
        </button>
    );
}

// ─── Input ───────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftAddon?: React.ReactNode;
}

export function Input({ label, error, leftAddon, id, className, ...props }: InputProps) {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {leftAddon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        {leftAddon}
                    </div>
                )}
                <input
                    id={inputId}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    className={cn(
                        'w-full border border-gray-300 rounded-xl py-2.5 px-4 text-gray-900 placeholder-gray-400',
                        'focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all',
                        'disabled:bg-gray-50 disabled:cursor-not-allowed',
                        error ? 'border-red-400 focus:ring-red-400' : '',
                        leftAddon ? 'pl-10' : '',
                        className,
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p id={`${inputId}-error`} role="alert" className="mt-1.5 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

// ─── Card ────────────────────────────────────────────────────────────────────
interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    padding?: 'sm' | 'md' | 'lg';
}

const cardPadding = { sm: 'p-4', md: 'p-6', lg: 'p-8' };

export function Card({ children, className, hover = false, padding = 'md' }: CardProps) {
    return (
        <div
            className={cn(
                'bg-white rounded-2xl border border-gray-100 shadow-sm',
                hover && 'hover:shadow-md hover:border-gray-200 transition-all duration-200',
                cardPadding[padding],
                className,
            )}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn('mb-4 pb-4 border-b border-gray-100', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
    return <h3 className={cn('text-lg font-bold text-gray-900', className)}>{children}</h3>;
}
