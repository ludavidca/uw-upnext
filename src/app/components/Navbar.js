// src/app/components/Navbar.js
export default function Navbar({ onClick }) {
    return (
        <div className="flex items-center justify-between p-3 bg-transparent">
      {/* Logo */}
      <div className="flex items-center">
        <img src="./logo.svg" alt="Logo" className="w-30 h-16 " />
      </div>

      {/* Search Bar */}
      <div className="flex">
        <input
          type="text"
          placeholder="Search Topics"
          style={{ textAlign: 'center' }}
          className="flex-grow p-3  rounded-full bg-transparent transition-transform transform gradient-searchbar w-72 hover:w-96 hover:scale-110"
        />
      </div>

      {/* CTA Buttons */}
      <div className="flex items-center space-x-4">
        <button className="px-4 py-2 bg-gray-300 rounded-3xl" style={{ color: 'rgb(133,0,205)' }}>
          Sign In
        </button>
        {/*<button className="px-4 py-2 bg-white text-blue-700 rounded-3xl">
          Register
    </button>*/}
      </div>
    </div>
    );
  } 