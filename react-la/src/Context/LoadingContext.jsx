import { createContext, useState, useContext } from 'react';
import { LoadingOverlay } from '@mantine/core';

// สร้าง Context สำหรับจัดการสถานะการโหลด
export const LoadingContext = createContext({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {}
});

// สร้าง Provider ที่จะครอบ component ทั้งหมดในแอพ
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCount, setLoadingCount] = useState(0);

  // เริ่มการโหลด
  const startLoading = () => {
    setLoadingCount(prev => prev + 1);
    setIsLoading(true);
  };

  // หยุดการโหลด
  const stopLoading = () => {
    setLoadingCount(prev => {
      const newCount = prev - 1;
      if (newCount <= 0) {
        setIsLoading(false);
        return 0;
      }
      return newCount;
    });
  };

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
      <LoadingOverlay 
        visible={isLoading} 
        zIndex={1000}
        overlayProps={{ blur: 2, opacity: 0.6 }}
        loaderProps={{ size: 'xl', color: 'blue', variant: 'bars' }}
      />
    </LoadingContext.Provider>
  );
};

// Custom hook สำหรับใช้งาน loading state ได้ง่ายๆ
export const useLoading = () => useContext(LoadingContext);
