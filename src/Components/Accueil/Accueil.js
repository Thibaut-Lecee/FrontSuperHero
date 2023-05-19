import React, { useEffect, useState } from 'react';
import { Player, Controls } from '@lottiefiles/react-lottie-player';

const Accueil = () => {
    const [isLoading,setIsLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2500);
    }, [isLoading]);
    return (
        <React.Fragment>
            {isLoading && (
                <Player
                    autoplay
                    loop
                    src="https://assets1.lottiefiles.com/packages/lf20_poqmycwy.json"
                    style={{ height: '300px', width: '300px' }}
                >
                    <Controls visible={false} />
                </Player>
            )}
        </React.Fragment>
    );
};

export default Accueil;