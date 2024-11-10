import PageTitle from '../components/PageTitle';
import LoggedInName from '../components/LoggedInName';
import HomeListView from '../components/HomeListView';
import Buttons from '../components/Buttons';
const ListViewPage = () =>
{
return(
    <div>
        <PageTitle />
        <LoggedInName />
        <Buttons />
        <HomeListView />
    </div>
);
}
export default ListViewPage;
