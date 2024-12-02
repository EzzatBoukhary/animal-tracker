import PageTitle from '../components/PageTitle';
import NewPost from '../components/NewPost';
import SidebarWithHeader from '../components/SidebarWithHeader';

const CreatePost = () => {
    return(
        <div>
            <SidebarWithHeader title={'New Post'}>
                <NewPost />
            </SidebarWithHeader>
        </div>
    );
}
export default CreatePost;