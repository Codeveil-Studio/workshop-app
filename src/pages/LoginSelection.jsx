import { Link, useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";
import contractorIcon from "../assets/signup/contractor.png";
import technicianIcon from "../assets/signup/technician.png";
import supplierIcon from "../assets/signup/supplier.png";
import arrowIcon from "../assets/signup/arrow.png";

export default function LoginSelection() {
  const navigate = useNavigate();

  function go(role) {
    const params = new URLSearchParams({ role });
    navigate(`/login?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white w-[350px] p-6 rounded-xl shadow-md">
        <img
          src={logo}
          alt="Logo"
          className="mx-auto mb-6 h-16"
        />

        <h2 className="text-center text-xl font-semibold text-gray-800">
          Login/Signup
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Enter your login details below to access your account.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => go('contractor')}
            className="group flex items-center justify-between border border-gray-200 rounded-lg py-3 px-4 text-gray-900 font-medium hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <span className="flex items-center gap-3">
              <img
                src={contractorIcon}
                alt="Contractor"
                className="h-6 w-6 rounded-md bg-gray-100 p-1 transition-colors group-hover:bg-green-100"
              />
              <span className="transition-colors group-hover:text-green-600">Login As Contractor</span>
            </span>
            <img
              src={arrowIcon}
              alt="Go"
              className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-1"
            />
          </button>

          <button
            onClick={() => go('technician')}
            className="group flex items-center justify-between border border-gray-200 rounded-lg py-3 px-4 text-gray-900 font-medium hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <span className="flex items-center gap-3">
              <img
                src={technicianIcon}
                alt="Technician"
                className="h-6 w-6 rounded-md bg-gray-100 p-1 transition-colors group-hover:bg-green-100"
              />
              <span className="transition-colors group-hover:text-green-600">Login As Technician</span>
            </span>
            <img
              src={arrowIcon}
              alt="Go"
              className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-1"
            />
          </button>

          <button
            onClick={() => go('supplier')}
            className="group flex items-center justify-between border border-gray-200 rounded-lg py-3 px-4 text-gray-900 font-medium hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <span className="flex items-center gap-3">
              <img
                src={supplierIcon}
                alt="Supplier"
                className="h-6 w-6 rounded-md bg-gray-100 p-1 transition-colors group-hover:bg-green-100"
              />
              <span className="transition-colors group-hover:text-green-600">Login As Supplier</span>
            </span>
            <img
              src={arrowIcon}
              alt="Go"
              className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-1"
            />
          </button>

          <button
            onClick={() => go('consultant')}
            className="group flex items-center justify-between border border-gray-200 rounded-lg py-3 px-4 text-gray-900 font-medium hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <span className="flex items-center gap-3">
              <img
                src={contractorIcon}
                alt="Consultant"
                className="h-6 w-6 rounded-md bg-gray-100 p-1 transition-colors group-hover:bg-green-100"
              />
              <span className="transition-colors group-hover:text-green-600">Login As Consultant</span>
            </span>
            <img
              src={arrowIcon}
              alt="Go"
              className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
