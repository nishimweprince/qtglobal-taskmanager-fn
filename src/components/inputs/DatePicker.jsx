import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const DatePicker = forwardRef(
  (
    {
      type = 'date',
      className = '',
      onChange,
      required = false,
      label = null,
      labelClassName = null,
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
        <input
          type={type}
          ref={ref}
          onChange={onChange}
          className={`px-4 w-full border py-3 text-[14px] border-gray-400 focus:border-[1.5px] focus:outline-none focus:border-primary rounded-md ring-[.5px] ring-inset ${className}`}
        />
      </label>
    );
  }
);

DatePicker.displayName = 'DatePicker';

DatePicker.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
};

export default DatePicker;
