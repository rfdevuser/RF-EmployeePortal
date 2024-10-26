import React, { useState } from 'react';

const HeaderNav = ({ name, highlight }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // List of menu items
  const menuItems = [
    { name: 'Employee Personal Details', path: '/EnrollmentForm' },
    { name: 'Employee Address', path: '/EmployeeAddress' },
    { name: 'Employee Qualification', path: '/EmployeeQualification' },
    { name: 'Employee Family Details', path: '/EmployeeFamily' },
    { name: 'Employee Employment History', path: '/EmploymentHistory' },
    { name: 'Employee Extra Details', path: '/EmploymentExtraDetails' },
    { name: 'Documents', path: '/DocumentUpload' },
  ];

  return (
    <div className="bg-[#172554] text-white shadow-lg mt-4">
      <div className="max-w-full mx-auto p-4 flex justify-between items-center">
        <h1 className='text-lg lg:text-xl text-white mb-4'>
          <b> Welcome {name} to Rakhis Fashions</b>   
        </h1>
        <button 
          className="md:hidden focus:outline-none hover:bg-gray-700 p-2 rounded transition duration-300"
          onClick={toggleMenu}
        >
          {isOpen ? 'Close' : 'Menu'}
        </button>
      </div>
      <nav className={`md:flex ${isOpen ? 'block' : 'hidden'} bg-gray-800 md:bg-transparent p-4 md:p-0`}>
        <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
          {menuItems.map((item) => (
            <li key={item.name}>
              <a 
                href={item.path} 
                className={`block py-2 px-4 rounded transition duration-300 
                  ${highlight === item.name ? 'bg-gray-700 text-yellow-400' : 'hover:bg-gray-700 hover:text-yellow-400'}`}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default HeaderNav;
