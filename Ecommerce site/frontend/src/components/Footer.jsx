import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-white border-t mt-12 py-6 px-4 w-full">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-gray-600 text-sm">&copy; {new Date().getFullYear()} Your Dream Store. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <a href="#" className="text-gray-400 hover:text-blue-600 transition" title="GitHub"><FaGithub size={22} /></a>
          <a href="#" className="text-gray-400 hover:text-blue-600 transition" title="LinkedIn"><FaLinkedin size={22} /></a>
          <a href="#" className="text-gray-400 hover:text-blue-600 transition" title="Twitter"><FaTwitter size={22} /></a>
        </div>
        <div className="text-gray-500 text-xs">Made with <span className="text-blue-600">&hearts;</span> Gabrial Deora</div>
      </div>
    </footer>
  );
}

export default Footer; 