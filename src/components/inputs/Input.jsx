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
      onBlur,
      label = null,
      labelClassName = null,
      multiple = false
    },
    ref
  ) => {

    if (type === 'radio') {
      return (
        <label
          className={`flex w-full items-center gap-2 rounded-md text-[1rem] cursor-pointer p-2 ring-[.1px] ring-inset ring-gray-300 ${className}`}
        >
          <input
            type={type}
            name={name}
            onChange={onChange}
            defaultChecked={defaultValue}
            className={className}
            value={defaultValue}
          />
          {placeholder}
        </label>
      );
    }
    
    if (type === 'file') {
      return (
        <label
          className={`flex flex-col items-start gap-[6px] w-full ${labelClassName}`}
        >
          <p
            className={`${
              label ? 'flex' : 'null'
            } flex items-center gap-[3px] font-medium text-[15px]`}
          >
            {label}{' '}
            <span className={required ? 'text-red-600' : 'hidden'}>*</span>
          </p>
          <input
            type={type || 'file'}
            name={name}
            required={false}
            multiple={multiple}
            accept="image/*"
            ref={ref}
            className={`border border-gray-400 flex items-center justify-center px-4 py-[7px] text-[15px] w-full focus:border-[1.5px] focus:outline-none focus:border-primary rounded-md ring-[.5px] ring-inset ${
              error ? 'ring-red-600' : 'ring-gray-300'
            } ${className}`}
          />
        </label>
      );
    }

    return (
      <label className={`flex flex-col items-start gap-[6px] w-full ${labelClassName}`}>
      <p className={`${label ? 'flex' : 'null'} flex items-center gap-[3px] font-normal text-[15px]`}>
        {label}
        {' '}
        <span className={required ? 'text-red-600' : 'hidden'}>*</span>
      </p>
      <input
        type={type || 'text'}
        name={name}
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
      </label>
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
  onBlur: PropTypes.func,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  multiple: PropTypes.bool,
};

export default Input;
