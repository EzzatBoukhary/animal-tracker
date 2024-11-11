const ProfileButtons: React.FC = () => {

    function newPost(event:any) : void
    {
        event.preventDefault();
        window.location.href = '/post';
    };
    function returnHome(event:any) : void
    {
        event.preventDefault();
        window.location.href = '/Home';
    };

    return (
        <div className="home-page">
            <button type="button" id="newPostButton" className="buttons"
                onClick={newPost}> Post </button>
            <button type="button" id="newPostButton" className="buttons"
                onClick={returnHome}> Home </button>          
        </div>
    );
};

export default ProfileButtons;