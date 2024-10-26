import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <div className="bg-[#312e81] text-white p-6">
      <div className="text-center">
      
        
        <p className="mb-2">We are an exceptional and fully equipped Garments Designing, Development & Manufacturing house situated in Bangalore, the Silicon Valley of India. Started in 2009 as an atelier, we have grown by leaps and bounds over the years.</p>
        
        <p className="mb-4">Our successful brands:</p>
        <ul className="list-disc list-inside mb-4">
          <li><Link href='https://www.onati-global.com/'>OnatiGlobal</Link></li>
          <li><Link href='https://www.rebblebee.com/'>RebbleBee</Link></li>
          <li><Link href='https://www.wetailor4u.com/'>Wetailor4u</Link></li>
          <li><Link href='https://www.ogiftbangalore.com/'>OGIFT</Link></li>
          <li><Link href='https://www.rakhisfashions.in/'>Career</Link></li>
          
        </ul>
     
        
        <p>&copy; {new Date().getFullYear()} Rakhis Fashions. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Footer;
