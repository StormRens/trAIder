

function SidePanel({isOpen, onClose}){
    //This is The side panel code from the main header.
    return(
        <>  
            {/* Main side panel container. */}
            <div className= {`side-panel ${isOpen ? 'open' : ''}`} >
                <button
                    className = "close-btn"
                    onClick = {onClose}
                > X </button>   {/* This is the close button icon. */}

                {/* Nav Menu buttons. */}
                <nav className="panel-nav">
                    <button className="panel-btn">About Me</button>
                    <button className="panel-btn">How To Use</button>
                    <button className="panel-btn">Top Stories</button>
                    <button className="panel-btn">Top Stocks</button>
                    <button className="panel-btn">Top ETFs</button>
                    <button className="panel-btn">Top Movers</button>
                </nav>
                
                {/* Here is the Profile button on the side panel.*/}
                <div className="panel-profile">
                    <div className="profile-avatar">
                        {/* Placeholder for profile picture - you can replace with actual image */}
                        <div className="avatar-circle">U</div>
                    </div>
                    <div className="profile-info">
                        <div className="profile-name">Username</div>
                        <div className="profile-email">user@example.com</div>
                    </div>
                </div>

            {/* The click closes the panel. */}
            </div>
                {isOpen && (
                        <div 
                            className="overlay"
                            onClick={onClose}
                        ></div>
                    )}
        </>
    )
}

export default SidePanel; 