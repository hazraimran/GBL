import React from 'react';

interface PopupProps {
    title: string;
    content: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

const Popup: React.FC<PopupProps> = ({
    title,
    content,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel
}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <p className="text-gray-700 mb-6">{content}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Popup;
