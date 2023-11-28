import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const TextArea = forwardRef(
  (
    {
      cols = 50,
      rows = 5,
      className,
      defaultValue = null,
      resize = false,
      onChange,
      placeholder = null,
      required = false,
      readonly,
      onBlur,
      label = null,
      labelClassName = null
    },
    ref
  ) => {
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
        <textarea
          cols={cols}
          rows={rows}
          ref={ref}
          readOnly={readonly}
          placeholder={placeholder}
          required={required}
          className={`border border-gray-400 flex items-center justify-center px-4 py-[8px] w-full focus:border-[1.5px] focus:outline-none focus:border-primary rounded-md ring-[.5px] ring-inset ${
            resize ? null : 'resize-none'
          } ${className}`}
          onChange={onChange}
          onBlur={onBlur}
          defaultValue={defaultValue && defaultValue}
        ></textarea>
      </label>
    );
  }
);

TextArea.displayName = 'TextArea';

TextArea.propTypes = {
  cols: PropTypes.number,
  rows: PropTypes.number,
  className: PropTypes.string,
  defaultValue: PropTypes.string,
  resize: PropTypes.bool,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  readonly: PropTypes.bool,
  onBlur: PropTypes.func,
  label: PropTypes.string,
  labelClassName: PropTypes.string
};

export default TextArea;
