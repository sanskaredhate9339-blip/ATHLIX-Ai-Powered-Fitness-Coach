import React, { createContext, useContext, useState, useEffect } from 'react';

type UnitSystem = 'metric' | 'imperial';

interface UnitContextType {
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  // Weight helpers (input is always stored as kg in db)
  convertWeight: (kg: number) => number;
  formatWeight: (kg: number) => string;
  weightUnit: string;
  // Height helpers (input is always stored as cm in db)
  convertHeight: (cm: number) => { val1: number; val2?: number };
  formatHeight: (cm: number) => string;
  heightUnit: string;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export const UnitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>('metric');

  useEffect(() => {
    const saved = localStorage.getItem('athlix_unit_system');
    if (saved === 'metric' || saved === 'imperial') {
      setUnitSystemState(saved);
    } else {
      // Check profile fallback
      const profileStr = localStorage.getItem('athlix_profile');
      if (profileStr) {
        try {
          const profile = JSON.parse(profileStr);
          if (profile.unit_preference) {
            setUnitSystemState(profile.unit_preference);
          }
        } catch (e) {
          // ignore
        }
      }
    }
  }, []);

  const setUnitSystem = (system: UnitSystem) => {
    setUnitSystemState(system);
    localStorage.setItem('athlix_unit_system', system);
    
    // Sync to profile if exists
    const profileStr = localStorage.getItem('athlix_profile');
    if (profileStr) {
      try {
        const profile = JSON.parse(profileStr);
        profile.unit_preference = system;
        localStorage.setItem('athlix_profile', JSON.stringify(profile));
      } catch (e) {
        // ignore
      }
    }
  };

  const convertWeight = (kg: number): number => {
    if (unitSystem === 'imperial') {
      return Math.round(kg * 2.20462 * 10) / 10;
    }
    return Math.round(kg * 10) / 10;
  };

  const formatWeight = (kg: number): string => {
    const val = convertWeight(kg);
    return `${val} ${unitSystem === 'imperial' ? 'lbs' : 'kg'}`;
  };

  const weightUnit = unitSystem === 'imperial' ? 'lbs' : 'kg';

  const convertHeight = (cm: number) => {
    if (unitSystem === 'imperial') {
      const totalInches = cm / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      
      if (inches === 12) {
        return { val1: feet + 1, val2: 0 };
      }
      return { val1: feet, val2: inches };
    }
    return { val1: Math.round(cm) };
  };

  const formatHeight = (cm: number): string => {
    const res = convertHeight(cm);
    if (unitSystem === 'imperial') {
      return `${res.val1}'${res.val2}"`;
    }
    return `${res.val1} cm`;
  };

  const heightUnit = unitSystem === 'imperial' ? 'ft' : 'cm';

  return (
    <UnitContext.Provider
      value={{
        unitSystem,
        setUnitSystem,
        convertWeight,
        formatWeight,
        weightUnit,
        convertHeight,
        formatHeight,
        heightUnit,
      }}
    >
      {children}
    </UnitContext.Provider>
  );
};

export const useUnit = () => {
  const context = useContext(UnitContext);
  if (!context) {
    throw new Error('useUnit must be used within a UnitProvider');
  }
  return context;
};
