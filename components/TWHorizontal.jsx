const TWHorizontal = ({ className, children }) => {
  return (
    <div className={`${className} flex flex-row`}>
      {children}
    </div>
  );
}

TWHorizontal.defaultProps = {
  children: ['child1', 'child2', 'child3'].map(
    (child, index) => <div key={'child-' + index}>{child}</div>
  ),
  className: ""
}

export default TWHorizontal;