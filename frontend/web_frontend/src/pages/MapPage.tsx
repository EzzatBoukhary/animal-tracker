import Map from '../components/Map.tsx';
import SidebarWithHeader from '../components/SidebarWithHeader.tsx';

const MapPage = () =>
{
    return(
        <div>
            <SidebarWithHeader title={'Map'}>
                <Map />
            </SidebarWithHeader>
        </div>
    );

};
export default MapPage