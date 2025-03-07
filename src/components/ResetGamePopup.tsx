import { useContext, useState } from 'react';
import GameContext from '../context/GameContext';
import { useGameStorage } from '../hooks/useStorage/useGameStorage';

const Popup = ({ setShowResetPopup }: { setShowResetPopup: (value: boolean) => void }) => {
    const { navTo } = useContext(GameContext);
    const { resetGameData } = useGameStorage();
    const [showLoading, setShowLoading] = useState(false);

    return <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
        <div className="bg-[#f4d03f] rounded-xl shadow-xl max-w-2xl border-4 border-[#8B4513]">
            <div className="bg-amber-200 p-4 border-b-2 border-amber-700">
                <h2 className="text-2xl text-amber-800 text-center">Reset Progress</h2>
            </div>

            <div className="p-6">
                <p className="text-amber-900 text-xl mb-6 text-center">
                    This action will delete your game progress.
                    <br />
                    Are you sure you want to reset?
                </p>

                <div className="flex justify-center space-x-6">
                    <button
                        onClick={async () => {
                            setShowLoading(true);
                            await resetGameData();
                            setShowLoading(false);

                            setShowResetPopup(false);
                            navTo('LANDING');
                        }}
                        className="bg-amber-600 hover:bg-amber-700 text-amber-50 py-3 px-6 rounded-md text-lg transition-colors duration-300"
                    >
                        {showLoading ? 'Loading...' : "Confirm Reset"}
                    </button>

                    <button
                        onClick={() => setShowResetPopup(false)}
                        className="bg-gray-600 hover:bg-gray-700 text-gray-100 py-3 px-6 rounded-md text-lg transition-colors duration-300"
                    >
                        'Back'

                    </button>
                </div>
            </div>
        </div>
    </div>
};

export default Popup;