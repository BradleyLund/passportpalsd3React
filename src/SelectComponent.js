import React, { useState } from 'react';

const Dropdown = ({ options, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="dropdown">
      <button onClick={toggleDropdown}>
        {selectedOption ? selectedOption : label}
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option, index) => (
            <li key={index} onClick={() => handleOptionClick(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const App = () => {
  const options1 = ['Option 1', 'Option 2', 'Option 3'];
  const options2 = ['Option A', 'Option B', 'Option C'];

  return (
    <div>
      <h1>My React Component with Dropdowns</h1>
      <Dropdown options={options1} label="Select an option" />
      <Dropdown options={options2} label="Select another option" />
    </div>
  );
};

export default App;
