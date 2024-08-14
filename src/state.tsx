import React, { createContext, useContext, useEffect, useState } from 'react';
import Config from './docuflow/config';

interface ConfigContextType {
    config: Config | null;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<Config | null>(null);

    useEffect(() => {
        (async () => {
            const loadedConfig = await Config.load();
            setConfig(loadedConfig);
        })();
    }, []);

    return (
        <ConfigContext.Provider value={{ config }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = (): ConfigContextType => {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};