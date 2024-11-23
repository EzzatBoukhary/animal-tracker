import Home from '../components/Home';
import SidebarWithHeader from '../components/SidebarWithHeader';
const HomePage = () => {
    return (
        <div>
            <SidebarWithHeader title={'Posts'}>
                <Home />
            </SidebarWithHeader>
        </div>
    );
}
export default HomePage;

