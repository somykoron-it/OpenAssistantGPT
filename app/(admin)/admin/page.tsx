'use client';
import { Icons } from '@/components/icons';
import Overlay from '@/components/overlay';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface Item {
  id: number;
  registrationId: string;
  name: string;
  email: string;
  hasAccess: boolean;
  isActive: boolean;
}
interface TableCellProps {
  children: React.ReactNode;
}

const columns = [
  'Registration Link',
  'Name',
  'Email',
  'Premium Access',
  'Active',
];
const TableCell: React.FC<TableCellProps> = ({ children }) => {
  return <td className="p-2">{children}</td>;
};
const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [items, setItems] = useState<Item[]>([]);
  // const [items, setItems] = useState<Item[]>([
  //   {
  //     id: 1,
  //     registrationId: 'R001',
  //     name: 'John Doe',
  //     email: 'john@example.com',
  //     hasAccess: false,
  //     isActive: true,
  //   },
  //   {
  //     id: 2,
  //     registrationId: 'R002',
  //     name: 'Jane Smith',
  //     email: 'jane@example.com',
  //     hasAccess: true,
  //     isActive: true,
  //   },
  //   {
  //     id: 3,
  //     registrationId: 'R003',
  //     name: 'Michael Johnson',
  //     email: 'michael@example.com',
  //     hasAccess: false,
  //     isActive: false,
  //   },
  //   {
  //     id: 4,
  //     registrationId: 'R004',
  //     name: 'Emily Brown',
  //     email: 'emily@example.com',
  //     hasAccess: true,
  //     isActive: false,
  //   },
  //   {
  //     id: 5,
  //     registrationId: 'R005',
  //     name: 'David Wilson',
  //     email: 'david@example.com',
  //     hasAccess: false,
  //     isActive: true,
  //   },
  //   {
  //     id: 6,
  //     registrationId: 'R006',
  //     name: 'Sophia Miller',
  //     email: 'sophia@example.com',
  //     hasAccess: true,
  //     isActive: true,
  //   },
  //   {
  //     id: 7,
  //     registrationId: 'R007',
  //     name: 'Daniel Martinez',
  //     email: 'daniel@example.com',
  //     hasAccess: false,
  //     isActive: false,
  //   },
  //   {
  //     id: 8,
  //     registrationId: 'R008',
  //     name: 'Madison Lee',
  //     email: 'madison@example.com',
  //     hasAccess: true,
  //     isActive: true,
  //   },
  //   {
  //     id: 9,
  //     registrationId: 'R009',
  //     name: 'William Hernandez',
  //     email: 'william@example.com',
  //     hasAccess: false,
  //     isActive: true,
  //   },
  //   {
  //     id: 10,
  //     registrationId: 'R010',
  //     name: 'Isabella Rodriguez',
  //     email: 'isabella@example.com',
  //     hasAccess: true,
  //     isActive: false,
  //   },
  //   {
  //     id: 11,
  //     registrationId: 'R011',
  //     name: 'Ethan Hall',
  //     email: 'ethan@example.com',
  //     hasAccess: false,
  //     isActive: false,
  //   },
  //   {
  //     id: 12,
  //     registrationId: 'R012',
  //     name: 'Olivia Garcia',
  //     email: 'olivia@example.com',
  //     hasAccess: true,
  //     isActive: true,
  //   },
  //   {
  //     id: 13,
  //     registrationId: 'R013',
  //     name: 'James Clark',
  //     email: 'james@example.com',
  //     hasAccess: false,
  //     isActive: true,
  //   },
  //   {
  //     id: 14,
  //     registrationId: 'R014',
  //     name: 'Amelia Rodriguez',
  //     email: 'amelia@example.com',
  //     hasAccess: true,
  //     isActive: true,
  //   },
  //   {
  //     id: 15,
  //     registrationId: 'R015',
  //     name: 'Logan Lewis',
  //     email: 'logan@example.com',
  //     hasAccess: false,
  //     isActive: true,
  //   },
  //   {
  //     id: 16,
  //     registrationId: 'R016',
  //     name: 'Ella Walker',
  //     email: 'ella@example.com',
  //     hasAccess: true,
  //     isActive: false,
  //   },
  //   {
  //     id: 17,
  //     registrationId: 'R017',
  //     name: 'Aiden Green',
  //     email: 'aiden@example.com',
  //     hasAccess: false,
  //     isActive: true,
  //   },
  //   {
  //     id: 18,
  //     registrationId: 'R018',
  //     name: 'Lily Scott',
  //     email: 'lily@example.com',
  //     hasAccess: true,
  //     isActive: true,
  //   },
  //   {
  //     id: 19,
  //     registrationId: 'R019',
  //     name: 'Alexander Adams',
  //     email: 'alexander@example.com',
  //     hasAccess: false,
  //     isActive: true,
  //   },
  //   {
  //     id: 20,
  //     registrationId: 'R020',
  //     name: 'Mason Mitchell',
  //     email: 'mason@example.com',
  //     hasAccess: true,
  //     isActive: true,
  //   },
  // ]);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [magicLink, setMagicLink] = useState<string>('');
  const [showOverlay, setShowOverlay] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const togglePopup = async () => {
    setShowPopup(!showPopup);
    if (!showPopup) {
      try {
        setLoading(true);
        // Call the GET API with fetch
        const response = await fetch('/api/admin/magic');
        const data = await response.json();
        setMagicLink(data);
        if (response.ok) {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error('Error fetching data from API:', error);
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

  // const handleToggleAccess = (id: number) => {
  //   const updatedItems = items.map((item) => {
  //     if (item.id === id) {
  //       return { ...item, hasAccess: !item.hasAccess };
  //     }
  //     return item;
  //   });
  //   setItems(updatedItems);
  // };

  const handleToggleProperty = async (
    email: string,
    currentStatus: boolean,
    property: 'premium' | 'active'
  ) => {
    try {
      // Make an API call to update the backend data
      const response = await fetch(`/api/admin/user`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          [property]: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle ${property}`);
      }

      fetchUserList();
    } catch (error) {
      console.error(`Error toggling ${property}:`, error);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(magicLink)
      .then(() => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Link copied to clipboard!',
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });
        // alert("Link copied to clipboard!");
      })
      .catch((error) => {
        console.error('Failed to copy link: ', error);
      });
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
    const correctPassword = 'admin123456';

    if (password === correctPassword) {
      setIsLoggedIn(true);
      setShowPopup(false);
    } else {
      // Show incorrect password message
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Incorrect password!',
      }).then(() => {
        // Show the password field again
        showPasswordPopup();
      });
    }
  };
  const showPasswordPopup = () => {
    Swal.fire({
      title: 'Welcome to the Admin Dashboard!',
      html: `
        <input id="password" class="swal2-input" type="password" placeholder="Enter your password">
        `,
      backdrop: `
        rgba(0,0,0,0.8)
      `,
      showCancelButton: true,
      confirmButtonText: 'Login',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const password = (
          document.getElementById('password') as HTMLInputElement
        ).value;
        return password;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const password = result.value;
        handleSubmitPassword(password);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Redirect to home page if the user cancels
        router.push('/');
      }
    });
  };

  useEffect(() => {
    showPasswordPopup();
  }, []);

  const fetchUserList = async () => {
    try {
      const response = await fetch('/api/admin/user');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const jsonData = await response.json();
      setItems(jsonData);
      console.log(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // Call fetchData function  the component mounts
    fetchUserList();
  }, []);

  return (
    <div className="bg-[#000000] min-h-screen  w-fit lg:w-full">
      {showOverlay && !isLoggedIn && <Overlay />}
      <div className="relative">
        <div className="p-6 flex flex-col gap-y-10">
          <div className="flex justify-between mb-4">
            <div className="flex items-center gap-x-4">
              <h1 className="text-[#ffffff] text-[25px] font-semibold">
                Users
              </h1>
              <div className="relative text-[#ffffff]">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-[300px] px-4 py-[8px] pr-10 rounded-full bg-[#1E1D2D] placeholder:text-[#ffffff] text-[14px]"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <Icons.search className="h-4 w-4 absolute right-4 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            <button
              className="bg-[#5151EB] text-white p-2 rounded"
              onClick={togglePopup}
            >
              Generate Link
            </button>
          </div>

          {showPopup && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]"
              onClick={handleOutsideClick}
            >
              <div className="text-white bg-[#343341] w-auto h-auto p-6 rounded shadow-lg relative">
                <button
                  className="absolute top-2 right-2"
                  onClick={() => setShowPopup(false)}
                >
                  &times;
                </button>
                <h2 className="text-lg mb-4">Generate Link</h2>

                {loading ? (
                  <div className="flex justify-center items-center w-full">
                    <Icons.spinner className="mr-2 h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <div className="flex h-[80%] gap-x-2 justify-center items-center">
                    <div className="w-full border-2 border-blue-300 p-2 rounded-lg">
                      <p>{magicLink}</p>
                    </div>

                    <button
                      className="bg-[#646ce0] text-white py-2 px-4 rounded"
                      onClick={handleCopyToClipboard}
                    >
                      <Icons.copy />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-[#1E1D2D] h-auto xl:overflow-y-hidden rounded-lg p-6 text-[#ffffff]">
            <table className="min-w-full border-b border-[#272536]">
              <thead className="p-4">
                <tr className="bg-[#343341] rounded-lg text-left">
                  {columns.map((column) => (
                    <th key={column} className="p-[12px]">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4">
                      <Icons.user className="text-center flex justify-center items-center w-full" />{' '}
                      No users found.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#252434] rounded-[24px] h-[60px]"
                    >
                      <TableCell>{item.registrationId}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>
                        <Switch
                          className="data-[state=unchecked]:bg-[#0F172A] data-[state=checked]:bg-[#646ce0]"
                          checked={item.hasAccess}
                          onCheckedChange={() =>
                            handleToggleProperty(
                              item.email,
                              item.hasAccess,
                              'premium'
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          className="data-[state=unchecked]:bg-[#0F172A] data-[state=checked]:bg-[#25B55B]"
                          checked={item.isActive}
                          onCheckedChange={() =>
                            handleToggleProperty(
                              item.email,
                              item.isActive,
                              'active'
                            )
                          }
                        />
                      </TableCell>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={`mx-2 px-4 rounded ${
                    currentPage === index + 1
                      ? 'bg-[#524DFE] text-white'
                      : 'bg-[#000000]'
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
    </div>
  );
};

export default AdminDashboard;
