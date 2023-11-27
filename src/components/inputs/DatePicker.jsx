import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const DatePicker = forwardRef(({ type = 'date', className = '', onChange }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      onChange={onChange}
      className={`px-4 w-full border py-[4px] text-[14px] border-gray-400 focus:border-[1.5px] focus:outline-none focus:border-primary rounded-md ring-[.5px] ring-inset ${className}`}
    />
  );
});

DatePicker.displayName = 'DatePicker';

DatePicker.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
};

export default DatePicker;
