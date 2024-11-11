const MapButtons: React.FC = () => {

    function newPost(event:any) : void
    {
        event.preventDefault();
        window.location.href = '/post';
    };
    function viewProfile(event:any) : void
    {
        event.preventDefault();
        window.location.href = '/profile';
    };
    function returnHome(event:any) : void
    {
        event.preventDefault();
        window.location.href = '/Home';
    };

    return (
        <div className="home-page">
            <button type="button" id="newPostButton" className="buttons"
                onClick={returnHome}> Home </button>  
            <button type="button" id="newPostButton" className="buttons"
                onClick={newPost}> Post </button>
            <button type="button" id="newPostButton" className="buttons"
                onClick={viewProfile}> Profile </button>          
        </div>
    );
};

export default MapButtons;