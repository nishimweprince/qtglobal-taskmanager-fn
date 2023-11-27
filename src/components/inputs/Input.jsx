import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(
  (
    {
      type,
      className,
      onChange,
      defaultValue,
      name,
      required = false,
      placeholder,
      readonly,
      error,
      onBlur
    },
    ref
  ) => {

    if (type === 'radio') {
      return (
        <label
          className={`flex w-full items-center gap-2 rounded-md text-[1rem] border border-gray-400 cursor-pointer p-4 ring-[.5px] ring-inset ring-gray-300 ${className}`}
        >
          <input
            type={type}
            onChange={onChange}
            defaultChecked={defaultValue}
            className=''
            value={defaultValue}
          />
          {placeholder}
        </label>
      );
    }
    
    if (type === 'file') {
      return (
        <input
          type={type || 'file'}
          name={name}
          required={false}
          accept="image/*"
          ref={ref}
          className={`border border-gray-400 flex items-center justify-center px-4 py-[7px] text-[15px] w-full focus:border-[1.5px] focus:outline-none focus:border-primary rounded-md ring-[.5px] ring-inset ${
            error ? 'ring-red-600' : 'ring-gray-300'
          } ${className}`}
        />
      );
    }

    return (
      <input
        type={type || 'text'}
        name={name}
        required={required}
        defaultValue={defaultValue}
        readOnly={readonly ? 'readOnly' : null}
        placeholder={placeholder}
        ref={ref}
        onBlur={onBlur}
        onChange={onChange}
        className={`border border-gray-400 flex items-center justify-center px-4 py-[7px] text-[15px] w-full focus:border-[1.5px] focus:outline-none focus:border-primary rounded-md ring-[.5px] ring-inset ${
          error ? 'ring-red-600' : 'ring-gray-300'
        } ${className}`}
      />
    );
  }
);

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  readonly: PropTypes.bool,
  error: PropTypes.bool,
  defaultValue: PropTypes.string,
  onBlur: PropTypes.func
};

export default Input;
