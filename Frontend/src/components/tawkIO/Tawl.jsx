import React, { useEffect } from 'react';

function Tawl() {
  useEffect(() => {
    // Create the script element for Tawk.to widget
    const script = document.createElement('script');
    script.src = 'https://embed.tawk.to/67e3ab5f2661ae1910ac2b64/1in8larir'; // Replace with your Tawk.to widget code
    script.async = true;

    // Append the script to the body
    document.body.appendChild(script);

    // Cleanup: remove the script when the component is unmounted
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;  // This component doesn't render anything, just the script
}

export default Tawl;
