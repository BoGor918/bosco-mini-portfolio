// mantine
import { Loader } from '@mantine/core';
import { useContext } from 'react';
import { getLoaderColor } from '../../globalVariable/GlobalVariable';
import { MapperContext } from '../../globalVariable/MapperContextProvider';

export default function MainLoading() {
    const { theme } = useContext(MapperContext);

    return (
        <div>
            <div className={`flex justify-center items-center h-screen ` + (theme === 'light' ? 'bg-white' : 'bg-[#0B1A33]')}>
                <Loader size="lg" color={getLoaderColor(theme)} />
            </div>
        </div>
    )
}
