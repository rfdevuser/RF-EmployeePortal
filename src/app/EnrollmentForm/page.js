"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import HeaderNav from '@/components/HeaderNav';
import Link from 'next/link';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_EMPLOYEE_PERSONAL_DETAILS } from '@/utils/gql/GQL_MUTATION';
import { GET_EMPLOYEE_PERSONAL_DETAILS } from '@/utils/gql/GQL_QUERIES';

const Page = () => {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [dob, setDob] = useState('');
    const[employeeIDD, setEmp]=useState('')
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [maritalStatus, setMaritalStatus] = useState('');
    const [additionalContact, setAdditionalContact] = useState('');
    const [additionalEmail, setAdditionalEmail] = useState('');
    const [emergencyContacts, setEmergencyContacts] = useState([{ name: '', relation: '', contact: '' }, { name: '', relation: '', contact: '' }]);
    const [loading, setLoading] = useState(false);

    const [addEmployeePersonalDetails] = useMutation(ADD_EMPLOYEE_PERSONAL_DETAILS);

    useEffect(() => {
        const employeeData = localStorage.getItem('employeeData');
        if (!employeeData) {
            router.push('/');
        } else {
            const parsedData = JSON.parse(employeeData);
            setEmp(parsedData.employeeID)
            setData(parsedData);
        }
    }, [router]);

    const { loading: queryLoading, data: queryData, error } = useQuery(GET_EMPLOYEE_PERSONAL_DETAILS, {
        variables: { employeeID: employeeIDD },
    });

    useEffect(() => {
        if (queryData) {
            const employeeDetails = queryData.getEmployeeDetailsByEmployeeID;
            setData(employeeDetails);
            setDob(employeeDetails.dob);
            setAge(employeeDetails.age);
            setGender(employeeDetails.gender);
            setBloodGroup(employeeDetails.blood);
            setMaritalStatus(employeeDetails.marital);
            setAdditionalContact(employeeDetails.add_contact);
            setAdditionalEmail(employeeDetails.add_email);
            setEmergencyContacts([{
                name: employeeDetails.emergencyName1,
                relation: employeeDetails.emergencyRelation1,
                contact: employeeDetails.emergencyContact1
            }, {
                name: employeeDetails.emergencyName2,
                relation: employeeDetails.emergencyRelation2,
                contact: employeeDetails.emergencyContact2
            }]);
        }
    }, [queryData]);

    const handleLogout = () => {
        localStorage.removeItem('employeeData');
        router.push('/');
    };

    const handleDobChange = (event) => {
        const dobValue = event.target.value;
        setDob(dobValue);
        if (dobValue) {
            const birthDate = new Date(dobValue);
            const today = new Date();
            const ageValue = today.getFullYear() - birthDate.getFullYear();
            setAge(ageValue);
        } else {
            setAge('');
        }
    };

    const handleEmergencyChange = (index, field, value) => {
        const newContacts = [...emergencyContacts];
        newContacts[index][field] = value;
        setEmergencyContacts(newContacts);
    };

    const handleSubmit = async () => {
        setLoading(true);
        const submittedData = {
            add_contact: additionalContact,
            add_email: additionalEmail,
            age: age.toString(),
            blood: bloodGroup,
            clientMutationId: "", // Provide a value if necessary
            contact: data.contact,
            department: data.dept,
            dob,
            email: data.email,
            emergencyContact1: emergencyContacts[0].contact,
            emergencyName1: emergencyContacts[0].name,
            emergencyRelation1: emergencyContacts[0].relation,
            emergencyContact2: emergencyContacts[1].contact,
            emergencyName2: emergencyContacts[1].name,
            emergencyRelation2: emergencyContacts[1].relation,
            employeeID: data.employeeID,
            gender,
            marital: maritalStatus,
            name: data.name,
        };

        try {
            const { data: response } = await addEmployeePersonalDetails({
                variables: submittedData,
            });
            console.log(response);
            // Optionally navigate or show success message
        } catch (error) {
            console.error("Error submitting data:", error);
            // Optionally handle error (e.g., show an error message)
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {data && <HeaderNav name={data.name} highlight='Employee Personal Details' />}
            <div className='h-full flex flex-col items-center'>
                <div className='w-full bg-white p-6'>
                    {data ? (
                        <div className='max-w-full mx-auto'>
                            <h2 className='text-lg font-semibold mb-4'>Employee Basic Details</h2>
                            <div className='space-y-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Name</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        readOnly
                                        className='mt-1 block w-full bg-gray-300 border border-gray-300 rounded-md shadow-sm p-2'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Employee ID</label>
                                    <input
                                        type="text"
                                        value={data.employeeID}
                                        readOnly
                                        className='mt-1 block w-full bg-gray-300 border border-gray-300 rounded-md shadow-sm p-2'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Contact</label>
                                    <input
                                        type="text"
                                        value={data.contact}
                                        readOnly
                                        className='mt-1 block w-full bg-gray-300 border border-gray-300 rounded-md shadow-sm p-2'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        readOnly
                                        className='mt-1 block w-full bg-gray-300 border border-gray-300 rounded-md shadow-sm p-2'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Department</label>
                                    <input
                                        type="text"
                                        value={data.dept}
                                        readOnly
                                        className='mt-1 block w-full bg-gray-300 border border-gray-300 rounded-md shadow-sm p-2'
                                    />
                                </div>
                            </div>

                            <h2 className='text-lg font-semibold mt-6 mb-4'>Additional Employee Information</h2>
                            <div className='space-y-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Date of Birth</label>
                                    <input
                                        type="date"
                                        value={dob}
                                        onChange={handleDobChange}
                                        className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Age</label>
                                    <input
                                        type="text"
                                        value={age}
                                        readOnly
                                        className='mt-1 block w-full bg-gray-300 border border-gray-300 rounded-md shadow-sm p-2'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Gender</label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Transgender">Transgender</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Blood Group</label>
                                    <select
                                        value={bloodGroup}
                                        onChange={(e) => setBloodGroup(e.target.value)}
                                        className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
                                    >
                                        <option value="">Select Blood Group</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                    </select>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Marital Status</label>
                                    <select
                                        value={maritalStatus}
                                        onChange={(e) => setMaritalStatus(e.target.value)}
                                        className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
                                    >
                                        <option value="">Select Marital Status</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Divorced">Divorced</option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Additional Contact No</label>
                                    <input
                                        type="text"
                                        value={additionalContact}
                                        onChange={(e) => setAdditionalContact(e.target.value)}
                                        className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Additional Email ID</label>
                                    <input
                                        type="email"
                                        value={additionalEmail}
                                        onChange={(e) => setAdditionalEmail(e.target.value)}
                                        className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
                                    />
                                </div>

                                <h2 className='text-lg font-semibold mt-6 mb-4'>Emergency Contacts</h2>
                                <div className="overflow-x-auto">
                                    <table className='min-w-full divide-y divide-gray-200'>
                                        <thead>
                                            <tr>
                                                <th className='px-4 py-2 text-left'>Name</th>
                                                <th className='px-4 py-2 text-left'>Relation</th>
                                                <th className='px-4 py-2 text-left'>Contact Number</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {emergencyContacts.map((contact, index) => (
                                                <tr key={index}>
                                                    <td className='px-4 py-2'>
                                                        <input
                                                            type="text"
                                                            value={contact.name}
                                                            onChange={(e) => handleEmergencyChange(index, 'name', e.target.value)}
                                                            className='border border-gray-300 rounded-md shadow-sm p-1'
                                                        />
                                                    </td>
                                                    <td className='px-4 py-2'>
                                                        <input
                                                            type="text"
                                                            value={contact.relation}
                                                            onChange={(e) => handleEmergencyChange(index, 'relation', e.target.value)}
                                                            className='border border-gray-300 rounded-md shadow-sm p-1 text-black'
                                                        />
                                                    </td>
                                                    <td className='px-4 py-2'>
                                                        <input
                                                            type="text"
                                                            value={contact.contact}
                                                            onChange={(e) => handleEmergencyChange(index, 'contact', e.target.value)}
                                                            className='border border-gray-300 rounded-md shadow-sm p-1 text-black'
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className='flex justify-center'>
                                <Link href='/EmployeeAddress'>
                                    <button
                                        onClick={handleSubmit}
                                        className='mt-4 px-4 py-2 bg-[#334155] hover:bg-black text-white rounded-md'
                                        disabled={loading} // Disable button when loading
                                    >
                                        {loading ? "Please wait..." : "Submit and Next ➤"} {/* Change button text based on loading state */}
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
                <div className='absolute top-3 right-3 text-white flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4'>
                    <button
                        onClick={handleLogout}
                        className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors'
                    >
                        Logout
                    </button>

                    <Link href={`/EmployeeDashboard?id=${employeeIDD}`} as={`/EmployeeDashboard/${employeeIDD}`}>
                        <button
                            className='bg-green-400 text-black px-4 py-2 rounded-md hover:bg-green-500 transition-colors'
                        >
                            Dashboard
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Page;
