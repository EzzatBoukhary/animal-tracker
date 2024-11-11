import PageTitle from '../components/PageTitle';
import LoggedInName from '../components/LoggedInName';
import Profile from '../components/Profile';
import ProfileButtons from '../components/ProfileButtons';
const HomePage = () =>
{
return(
    <div>
        <PageTitle />
        <LoggedInName />
        <ProfileButtons />
        <Profile />
    </div>
);
}
export default HomePage;