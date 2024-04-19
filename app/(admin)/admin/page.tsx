"use client";
import Overlay from "@/components/overlay";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Item {
  id: number;
  registrationId: string;
  name: string;
  email: string;
  hasAccess: boolean;
  isActive: boolean;
}

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [items, setItems] = useState<Item[]>([
    {
      id: 1,
      registrationId: "R001",
      name: "John Doe",
      email: "john@example.com",
      hasAccess: false,
      isActive: true,
    },
    {
      id: 2,
      registrationId: "R002",
      name: "Jane Smith",
      email: "jane@example.com",
      hasAccess: true,
      isActive: true,
    },
    {
      id: 3,
      registrationId: "R003",
      name: "Michael Johnson",
      email: "michael@example.com",
      hasAccess: false,
      isActive: false,
    },
    {
      id: 4,
      registrationId: "R004",
      name: "Emily Brown",
      email: "emily@example.com",
      hasAccess: true,
      isActive: false,
    },
    {
      id: 5,
      registrationId: "R005",
      name: "David Wilson",
      email: "david@example.com",
      hasAccess: false,
      isActive: true,
    },
    {
      id: 6,
      registrationId: "R006",
      name: "Sophia Miller",
      email: "sophia@example.com",
      hasAccess: true,
      isActive: true,
    },
    {
      id: 7,
      registrationId: "R007",
      name: "Daniel Martinez",
      email: "daniel@example.com",
      hasAccess: false,
      isActive: false,
    },
    {
      id: 8,
      registrationId: "R008",
      name: "Madison Lee",
      email: "madison@example.com",
      hasAccess: true,
      isActive: true,
    },
    {
      id: 9,
      registrationId: "R009",
      name: "William Hernandez",
      email: "william@example.com",
      hasAccess: false,
      isActive: true,
    },
    {
      id: 10,
      registrationId: "R010",
      name: "Isabella Rodriguez",
      email: "isabella@example.com",
      hasAccess: true,
      isActive: false,
    },
    {
      id: 11,
      registrationId: "R011",
      name: "Ethan Hall",
      email: "ethan@example.com",
      hasAccess: false,
      isActive: false,
    },
    {
      id: 12,
      registrationId: "R012",
      name: "Olivia Garcia",
      email: "olivia@example.com",
      hasAccess: true,
      isActive: true,
    },
    {
      id: 13,
      registrationId: "R013",
      name: "James Clark",
      email: "james@example.com",
      hasAccess: false,
      isActive: true,
    },
    {
      id: 14,
      registrationId: "R014",
      name: "Amelia Rodriguez",
      email: "amelia@example.com",
      hasAccess: true,
      isActive: true,
    },
    {
      id: 15,
      registrationId: "R015",
      name: "Logan Lewis",
      email: "logan@example.com",
      hasAccess: false,
      isActive: true,
    },
    {
      id: 16,
      registrationId: "R016",
      name: "Ella Walker",
      email: "ella@example.com",
      hasAccess: true,
      isActive: false,
    },
    {
      id: 17,
      registrationId: "R017",
      name: "Aiden Green",
      email: "aiden@example.com",
      hasAccess: false,
      isActive: true,
    },
    {
      id: 18,
      registrationId: "R018",
      name: "Lily Scott",
      email: "lily@example.com",
      hasAccess: true,
      isActive: true,
    },
    {
      id: 19,
      registrationId: "R019",
      name: "Alexander Adams",
      email: "alexander@example.com",
      hasAccess: false,
      isActive: true,
    },
    {
      id: 20,
      registrationId: "R020",
      name: "Mason Mitchell",
      email: "mason@example.com",
      hasAccess: true,
      isActive: true,
    },
  ]);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [magicLink, setMagicLink] = useState(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const togglePopup = async () => {
    setShowPopup(!showPopup);
    if (!showPopup) {
      try {
        // Call the GET API with fetch
        const response = await fetch("/api/admin"); // Replace '/api/endpoint' with your actual API endpoint
        const data = await response.json();
        setMagicLink(data);
      } catch (error) {
        console.error("Error fetching data from API:", error);
      }
    }
  };

  const handleOutsideClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      setShowPopup(false);
    }
  };

  const handleToggleAccess = (id: number) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, hasAccess: !item.hasAccess };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const handleToggleActive = (id: number) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, isActive: !item.isActive };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Authentication logic
  const handleSubmitPassword = (password: string) => {
    const correctPassword = "admin123";

    if (password === correctPassword) {
      setIsLoggedIn(true);
      setShowPopup(false);
    } else {
      // Show incorrect password message
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Incorrect password!",
      }).then(() => {
        // Show the password field again
        showPasswordPopup();
      });
    }
  };
  const showPasswordPopup = () => {
    Swal.fire({
      title: "Welcome to the Admin Dashboard!",
      html: `
        <input id="password" class="swal2-input" type="password" placeholder="Enter your password">
        `,
      backdrop: `
        rgba(0,0,0,0.8)
      `,
      showCancelButton: true,
      confirmButtonText: "Login",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const password = (
          document.getElementById("password") as HTMLInputElement
        ).value;
        return password;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const password = result.value;
        handleSubmitPassword(password);
      }else if (result.dismiss === Swal.DismissReason.cancel) {
        // Redirect to home page if the user cancels
        router.push("/");
      }
    });
  };

  useEffect(() => {
    // Trigger welcome message when component mounts
    showPasswordPopup();
  }, []);

  return (
    <div>
      {showOverlay && !isLoggedIn && <Overlay />}
      <div className="relative text-blur">
        <div className="p-6">
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="border p-2 rounded"
              value={searchQuery}
              onChange={handleSearch}
            />
            <button
              className="bg-blue-500 text-white p-2 rounded"
              onClick={togglePopup}
            >
              Generate Link
            </button>
          </div>

          {showPopup && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
              onClick={handleOutsideClick}
            >
              <div className="bg-white p-6 rounded shadow-lg relative">
                <button
                  className="absolute top-2 right-2"
                  onClick={() => setShowPopup(false)}
                >
                  &times;
                </button>
                <h2 className="text-lg mb-4">Generate Link</h2>
                <p>{magicLink}</p>
              </div>
            </div>
          )}

          <table className="min-w-full bg-white border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="p-2 border border-gray-200">Registration ID</th>
                <th className="p-2 border border-gray-200">Name</th>
                <th className="p-2 border border-gray-200">Email</th>
                <th className="p-2 border border-gray-200">Give Access</th>
                <th className="p-2 border border-gray-200">Active</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item) => (
                <tr key={item.id}>
                  <td className="p-2 border border-gray-200">
                    {item.registrationId}
                  </td>
                  <td className="p-2 border border-gray-200">{item.name}</td>
                  <td className="p-2 border border-gray-200">{item.email}</td>
                  <td className="p-2 border border-gray-200">
                    <button
                      className={`p-2 rounded ${
                        item.hasAccess ? "bg-green-500" : "bg-gray-300"
                      }`}
                      onClick={() => handleToggleAccess(item.id)}
                    >
                      {item.hasAccess ? "Yes" : "No"}
                    </button>
                  </td>
                  <td className="p-2 border border-gray-200">
                    <button
                      className={`p-2 rounded ${
                        item.isActive ? "bg-green-500" : "bg-gray-300"
                      }`}
                      onClick={() => handleToggleActive(item.id)}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`mx-2 p-2 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
