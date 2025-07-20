import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const typeStyles = {
  success: 'bg-green-100 text-green-700 border-green-400',
  error: 'bg-red-100 text-red-700 border-red-400',
  info: 'bg-blue-100 text-blue-700 border-blue-400',
};
const typeIcons = {
  success: <FaCheckCircle className="text-green-500" />,
  error: <FaExclamationCircle className="text-red-500" />,
  info: <FaInfoCircle className="text-blue-500" />,
};

function Toast({ message, type = 'info', onClose }) {
  if (!message) return null;
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-lg border flex items-center gap-3 ${typeStyles[type]}`}> 
      {typeIcons[type]}
      <span className="font-semibold">{message}</span>
      <button onClick={onClose} className="ml-4 text-xl text-gray-400 hover:text-gray-700 focus:outline-none">
        <FaTimes />
      </button>
    </div>
  );
}

export default Toast; 