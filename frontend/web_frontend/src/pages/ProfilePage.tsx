
import Profile from '../components/Profile';
import SidebarWithHeader from '../components/SidebarWithHeader';
const ProfilePage = () =>
{
return(
    <div>
        <SidebarWithHeader title={'Profile'}>
            <Profile />
        </SidebarWithHeader>
    </div>
);
}
export default ProfilePage;