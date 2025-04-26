import { useEffect, useState } from 'react';

const getInitialTheme = (): boolean => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') return true;
    if (savedTheme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const useDarkMode = () => {
    const [isDark, setIsDark] = useState(getInitialTheme);

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    return [isDark, setIsDark] as const;
};
