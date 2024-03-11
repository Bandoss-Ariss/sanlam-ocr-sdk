import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScanButton from 'ScanButton';

const SanlamOcr = () => {
  const [sdkInterface, setSdkInterface] = useState(null);

  useEffect(() => {
    const handleClick = async () => {
      try {
        const data = JSON.stringify({
          cle_sdk: 'L80rxMo5d9Cfsx2KnJQj275V9uCc8Yx0',
          type: 'RNN',
        });

        const config = {
          method: 'post',
          url: 'https://sanlam-ocr-sdk-credentials.goaicorporation.org/api/initiate-activity',
          headers: {
            'Content-Type': 'application/json',
          },
          data,
        };

        const response = await axios(config);
        setSdkInterface(new SDKInterface());
        response.data.Generate(); 
        document.getElementById('trigger-scan').click(); 
      } catch (error) {
        console.error(error);
      }
    };

    const handleScanEnd = () => {
      console.log('Popup fermée'); 
    };


    window.addEventListener('message', (event) => {
      if (event.origin === 'http://localhost:5000') {
        console.log(event.data);
      }
    });

    $(document).on('scanEnd', '#scan-end', handleScanEnd);

    return () => {
      window.removeEventListener('message', handleScanEnd);
      $(document).off('scanEnd', '#scan-end'); 
    };
  }, []);

  return (
    <div className="buttons-container">
      <ScanButton handleClick={handleClick} />
    </div>
  );
};

export default SanlamOcr;
