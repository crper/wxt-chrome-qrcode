import React, { useEffect, useState } from 'react';

interface TabProps {
  label: string;
  children: React.ReactNode;
}

interface TabsProps {
  children: React.ReactElement<TabProps>[];
  defaultActiveTab?: string;
  value: string;
  onChange: (value: string) => void;
}

export const CustomTab: React.FC<TabProps> = ({ children }) => {
  return <div>{children}</div>;
};

export const CustomTabs: React.FC<TabsProps> = ({ children, defaultActiveTab, value, onChange }) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || children[0].props.label);

  useEffect(() => {
    setActiveTab(value);
  }, [value]);

  return (
    <div>
      <div className="flex space-x-2">
        {children.map((tab) => (
          <button
            key={tab.props.label}
            className={`px-4 py-2 ${activeTab === tab.props.label ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => onChange(tab.props.label)}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {children.map((tab) =>
          activeTab === tab.props.label ? <div key={tab.props.label}>{tab.props.children}</div> : null
        )}
      </div>
    </div>
  );
};