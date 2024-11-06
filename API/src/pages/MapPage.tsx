import Map from '../components/Map.tsx';
import PageTitle from '../components/PageTitle';
import LoggedInName from '../components/LoggedInName';
import Buttons from '../components/Buttons';

const MapPage = () =>
{
    return(
        <div>
            <PageTitle />
            <Map />
        </div>
    );
};
export default MapPage