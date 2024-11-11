import Map from '../components/Map.tsx';
import PageTitle from '../components/PageTitle';
import LoggedInName from '../components/LoggedInName';
import MapButtons from '../components/MapButtons';

const MapPage = () =>
{
    return(
        <div>
            <PageTitle />
            <LoggedInName />
            <MapButtons />
            <Map />
        </div>
    );
};
export default MapPage