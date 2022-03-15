const BoldTitleAndValue = ({ title, value, className }) => (
  <div className={className || ''}>
    <span className='font-bold mr-1'>
      {title}:
    </span>
    {value}
  </div>
);

export default BoldTitleAndValue;