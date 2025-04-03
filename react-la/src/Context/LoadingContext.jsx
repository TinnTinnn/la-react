import { createContext, useState, useContext } from 'react';
import { Loader, Overlay, Center, Box } from '@mantine/core';

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
      {isLoading && (
        <Overlay opacity={0.6} color="#fff" zIndex={1000} />
      )}
      {isLoading && (
        <Box 
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
            pointerEvents: 'none'
          }}
        >
          <Center>
            <Loader size="xl" color="blue" />
          </Center>
        </Box>
      )}
    </LoadingContext.Provider>
  );
};

// Custom hook สำหรับใช้งาน loading state ได้ง่ายๆ
export const useLoading = () => useContext(LoadingContext);

// Higher-order function สำหรับครอบ API call ให้แสดง loading อัตโนมัติ
export const withLoading = (apiCall) => {
  return async (...args) => {
    const { startLoading, stopLoading } = useLoading();
    try {
      startLoading();
      return await apiCall(...args);
    } finally {
      stopLoading();
    }
  };
};
