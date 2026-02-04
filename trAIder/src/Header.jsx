//TODO: Lets start to get the left panel done.
//TODO: Also need to set the graphs on the screen and have the top stocks/ETFs up there.

import { useState } from "react";
import SidePanel from "./sidepanel";

function Header(){
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false); {/*May use this later if there is a popup/slideout for the profile. */}

    return(
        //This is the header title and button.
        <>
        <header className="site-header">
            <div className="left-controls">
                <button
                    type = "button"
                    className="btn"
                    onClick={() => setIsPanelOpen(true)}
                    >☰</button>
            </div>

            {/*Center Screen/panel */}
            <h1 className="site-title"> Welcome to trAIder</h1>
            <div className="right-spacer"></div>

            {/*Right Screen/panel */}
            <div className="right-controls">
                <button className="header-profile-btn">
                    <div className="header-avatar-circle">U</div>
                </button>
            </div>
        </header>

        {/*Here is the side panel being called from SidePanel.jsx */}
        <SidePanel 
            isOpen={isPanelOpen}
            onClose={() => setIsPanelOpen(false)}
        />
        </>
    );
}

export default Header;