import type { InputHTMLAttributes, Ref } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
}

export default function Input({ label, error, className = '', id, ref, ...props }: InputProps) {
  return (
    <div className="input-group">
      <label htmlFor={id} className="input-group__label">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        className={`input-group__field ${error ? 'input-group__field--error' : ''} ${className}`}
        {...props}
      />
      {error && <span className="input-group__error">{error}</span>}
    </div>
  );
}
