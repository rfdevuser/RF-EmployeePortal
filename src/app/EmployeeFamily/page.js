"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HeaderNav from '@/components/HeaderNav';
import Link from 'next/link';
import { useQuery, useMutation } from '@apollo/client';
import { EMPLOYEE_FAMILY_UPDATE } from '@/utils/gql/GQL_MUTATION';
import { GET_EMPLOYEE_FAMILY } from '@/utils/gql/GQL_QUERIES';
// import { GET_EMPLOYEE_FAMILY } from '@/utils/gql/GQL_QUERY'; // Adjust the import path as needed

const EmployeeFamily = () => {
    const [data, setData] = useState('');
    const [familyMembers, setFamilyMembers] = useState([
        { name: '', relation: '', age: '', occupation: '', contactNo: '' }
    ]);
    const router = useRouter();

    useEffect(() => {
        const employeeData = localStorage.getItem('employeeData');
        if (!employeeData) {
            router.push('/');
        } else {
            const parsedData = JSON.parse(employeeData);
            setData(parsedData);
        }
    }, [router]);

    const { loading, error, data: queryData, refetch } = useQuery(GET_EMPLOYEE_FAMILY, {
        variables: { employeeID: data.employeeID },
        skip: !data.employeeID, // Skip if employeeID is not set
    });

    useEffect(() => {
        if (queryData) {
            // setFamilyMembers(queryData.employeeFamily);
        }
    }, [queryData]);

    const handleLogout = () => {
        localStorage.removeItem('employeeData');
        router.push('/');
    };

    const handleChange = (index, field, value) => {
        const newFamilyMembers = [...familyMembers];
        newFamilyMembers[index][field] = value;
        setFamilyMembers(newFamilyMembers);
    };

    const [updateFamilyMember, { loading: mutationLoading }] = useMutation(EMPLOYEE_FAMILY_UPDATE, {
        onCompleted: async(response) => {
           await refetch();
         console.log(response)
            // Handle successful update (e.g., show a message)
        },
        onError: (error) => {
            console.error('Error updating family member:', error);
            // Handle error (e.g., show an error message)
        }
    });

    const handleSubmit = async () => {
        try {
            // Loop through family members and call the mutation for each
            for (const member of familyMembers) {
                await updateFamilyMember({
                    variables: {
                        clientMutationId: 'unique-id', // Generate or set a unique ID
                        employeeID: data.employeeID,
                        name: member.name,
                        age: member.age,
                        relation: member.relation,
                        occupation: member.occupation,
                        contact: member.contactNo,
                    }
                });
                setFamilyMembers([ { name: '', relation: '', age: '', occupation: '', contactNo: '' }]);
            }
            // Optionally, redirect or show a success message after submission
        } catch (error) {
            console.error('Failed to update family members:', error);
        }
        
    };

    return (
        <>
            {data && <HeaderNav name={data.name} highlight='Employee Family Details' />}
            <div className='flex-grow flex items-center justify-center mt-6'>
                    <div className='w-full max-w-full bg-white p-6 rounded-lg shadow-lg'>
                        <h2 className='text-lg font-semibold mb-4 text-center'>Existing Family Members</h2>
                        {loading ? (
                            <p>Loading family data...</p>
                        ) : error ? (
                            <p>Error fetching family data.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className='min-w-full divide-y divide-gray-200 bg-blue-50'>
                                    <thead>
                                        <tr>
                                            <th className='px-4 py-2 text-left'>Name</th>
                                            <th className='px-4 py-2 text-left'>Relation</th>
                                            <th className='px-4 py-2 text-left'>Age</th>
                                            <th className='px-4 py-2 text-left'>Occupation</th>
                                            <th className='px-4 py-2 text-left'>Contact No</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {queryData?.employeeFamily.map((member) => (
                                            <tr key={member.id}>
                                                <td className='px-4 py-2'>{member.name}</td>
                                                <td className='px-4 py-2'>{member.relation}</td>
                                                <td className='px-4 py-2'>{member.age}</td>
                                                <td className='px-4 py-2'>{member.occupation}</td>
                                                <td className='px-4 py-2'>{member.contact}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

            <div className='flex flex-col h-full bg-white mt-8 mb-8'>
                <div className='flex-grow flex items-center justify-center'>
                    <div className='w-full max-w-full bg-white p-6 rounded-lg shadow-lg'>
                        <h2 className='text-lg font-semibold mb-4 text-center'>Employee Family Details</h2>
                        {/* Form Section */}
                        <div className="overflow-x-auto mb-6">
                            <table className='min-w-full divide-y divide-gray-200'>
                                <thead>
                                    <tr>
                                        <th className='px-4 py-2 text-left'>Name</th>
                                        <th className='px-4 py-2 text-left'>Relation</th>
                                        <th className='px-4 py-2 text-left'>Age</th>
                                        <th className='px-4 py-2 text-left'>Occupation</th>
                                        <th className='px-4 py-2 text-left'>Contact No</th>
                                    </tr>
                                </thead>
                                
                                <tbody>
                                    {familyMembers.map((member, index) => (
                                        <tr key={index}>
                                            <td className='px-4 py-2'>
                                                <input
                                                    type="text"
                                                    value={member.name}
                                                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                                                    className='border border-gray-300 rounded-md shadow-sm p-1 w-full sm:w-64'
                                                    placeholder="Enter name"
                                                />
                                            </td>
                                            <td className='px-4 py-2'>
                                                <input
                                                    type="text"
                                                    value={member.relation}
                                                    onChange={(e) => handleChange(index, 'relation', e.target.value)}
                                                    className='border border-gray-300 rounded-md shadow-sm p-1 w-full sm:w-64'
                                                    placeholder="Enter relation"
                                                />
                                            </td>
                                            <td className='px-4 py-2'>
                                                <input
                                                    type="number"
                                                    value={member.age}
                                                    onChange={(e) => handleChange(index, 'age', e.target.value)}
                                                    className='border border-gray-300 rounded-md shadow-sm p-1 w-full sm:w-24'
                                                    placeholder="Enter age"
                                                />
                                            </td>
                                            <td className='px-4 py-2'>
                                                <input
                                                    type="text"
                                                    value={member.occupation}
                                                    onChange={(e) => handleChange(index, 'occupation', e.target.value)}
                                                    className='border border-gray-300 rounded-md shadow-sm p-1 w-full sm:w-64'
                                                    placeholder="Enter occupation"
                                                />
                                            </td>
                                            <td className='px-4 py-2'>
                                                <input
                                                    type="text"
                                                    value={member.contactNo}
                                                    onChange={(e) => handleChange(index, 'contactNo', e.target.value)}
                                                    className='border border-gray-300 rounded-md shadow-sm p-1 w-full sm:w-64'
                                                    placeholder="Enter contact number"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className='flex justify-between mt-4'>
                            <button
                                onClick={handleSubmit}
                                className='mt-4 px-4 py-2 bg-blue-800 text-white rounded-md'
                                disabled={mutationLoading} // Disable button while mutation is loading
                            >
                                {mutationLoading ? "Posting..." : <b><u>Post & +Add More Nominee </u></b>}
                            </button>
                            <div className='flex justify-center'>
                                <Link href='/EmploymentHistory'>
                                    <button
                                        className='mt-4 px-4 py-2 bg-[#334155] hover:bg-black text-white rounded-md'
                                    >
                                        Next ➤
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Independent Table Section */}
              
                <button
                    onClick={handleLogout}
                    className='absolute top-3 right-3 text-white'
                >
                    Logout
                </button>
            </div>
        </>
    );
};

export default EmployeeFamily;
