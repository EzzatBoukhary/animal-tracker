import React, { useEffect, useState } from 'react';

type Post = {
    username: string;
    location: { latitude: number; longitude: number };
    photo: string;
    description: string;
    animal: string;
    postedDate: string;
};

const Buttons: React.FC = () => {

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

    return (
        <div className="home-page">
            <button type="button" id="newPostButton" className="buttons"
                onClick={newPost}> Post </button>
            <button type="button" id="newPostButton" className="buttons"
                onClick={viewProfile}> Profile </button>          
        </div>
    );
};

export default Buttons;