import PageTitle from '../components/PageTitle';
import LoggedInName from '../components/LoggedInName';
import Home from '../components/Home';
import Buttons from '../components/Buttons';
const HomePage = () =>
{
return(
    <div>
        <PageTitle />
        <LoggedInName />
        <Buttons />
        <Home />
    </div>
);
}
export default HomePage;

