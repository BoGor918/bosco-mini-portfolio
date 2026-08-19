import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { NavigateOptions, To } from 'react-router-dom';

type NavigationLoadingContextType = {
    isNavigating: boolean;
    startNavigation: () => void;
};

const MIN_LOADING_DURATION_MS = 350;

const NavigationLoadingContext = createContext<NavigationLoadingContextType>({
    isNavigating: false,
    startNavigation: () => { },
});

export function NavigationLoadingProvider({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const [isNavigating, setIsNavigating] = useState(false);
    const startTimeRef = useRef<number>(0);
    const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearHideTimer = useCallback(() => {
        if (hideTimerRef.current) {
            clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
        }
    }, []);

    const startNavigation = useCallback(() => {
        clearHideTimer();
        startTimeRef.current = Date.now();
        setIsNavigating(true);
    }, [clearHideTimer]);

    useEffect(() => {
        if (!isNavigating) {
            return;
        }

        const elapsed = Date.now() - startTimeRef.current;
        const remaining = Math.max(MIN_LOADING_DURATION_MS - elapsed, 0);

        hideTimerRef.current = setTimeout(() => {
            setIsNavigating(false);
            hideTimerRef.current = null;
        }, remaining);

        return clearHideTimer;
    }, [location, isNavigating, clearHideTimer]);

    const value = useMemo(() => ({
        isNavigating,
        startNavigation,
    }), [isNavigating, startNavigation]);

    return (
        <NavigationLoadingContext.Provider value={value}>
            {children}
        </NavigationLoadingContext.Provider>
    );
}

export function useNavigationLoading() {
    return useContext(NavigationLoadingContext);
}

export function useAppNavigate() {
    const navigate = useNavigate();
    const { startNavigation } = useNavigationLoading();

    return useCallback((to: To | number, options?: NavigateOptions) => {
        startNavigation();

        if (typeof to === 'number') {
            navigate(to);
            return;
        }

        navigate(to, options);
    }, [navigate, startNavigation]);
}
