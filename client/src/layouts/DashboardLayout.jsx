import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen">

      {/* Fixed Sidebar */}
      <div className="w-64 bg-[#021238] text-white fixed h-screen">
        <Sidebar />
      </div>

      {/* Scrollable Content */}
      <div className="ml-64 flex-1 h-screen overflow-y-auto bg-gray-100">
        <Navbar />

        <div className="p-6">
          {children}
        </div>
      </div>

    </div>
  );
};

export default DashboardLayout;