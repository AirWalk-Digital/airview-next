import React from "react";

export const Steps = ({ children }) => {
  const renderChildren = () => {
    return React.Children.map(children, (element, index) => {
      if (element == null) {
      console.log('Steps : ' + element)
      return (
        <element.type order={index} {...element.props}>
          {element.props.children}
        </element.type>
      )};
    });
  };
  return <div>{renderChildren()}</div>;
};

export default Steps;
