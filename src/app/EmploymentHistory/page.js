"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HeaderNav from '@/components/HeaderNav';
import Link from 'next/link';
import { useMutation, useQuery } from '@apollo/client';
import { EMPLOYEE_HISTORY_INSERT } from '@/utils/gql/GQL_MUTATION';
import { GET_EMPLOYEE_HISTORY } from '@/utils/gql/GQL_QUERIES'; // Adjust the import path as needed

const EmploymentHistory = () => {
    const [data, setData] = useState('');
    const [employmentHistory, setEmploymentHistory] = useState([
        { id: 1, companyName: '', location: '', designation: '', periodFrom: '', periodTo: '', reason: '', lastSalary: '', refPersonName: '', refPersonContact: '' }
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

    const { data: queryData ,refetch} = useQuery(GET_EMPLOYEE_HISTORY, {
        variables: { employeeID: data.employeeID },
        skip: !data.employeeID // Skip query until employeeID is available
    });

    const handleChange = (index, field, value) => {
        const newEmploymentHistory = [...employmentHistory];
        newEmploymentHistory[index][field] = value;
        setEmploymentHistory(newEmploymentHistory);
    };

    const handleLogout = () => {
        localStorage.removeItem('employeeData');
        router.push('/');
    };

    const [insertEmploymentHistory, { loading }] = useMutation(EMPLOYEE_HISTORY_INSERT, {
        onCompleted: async () => {
            // Clear the employment history state
            setEmploymentHistory([{ id: 1, companyName: '', location: '', designation: '', periodFrom: '', periodTo: '', reason: '', lastSalary: '', refPersonName: '', refPersonContact: '' }]);
       await refetch()
        },
        onError: (error) => {
            console.error('Error inserting employment history:', error);
        }
    });

    const handleSubmit = async () => {
        try {
            for (const entry of employmentHistory) {
                await insertEmploymentHistory({
                    variables: {
                        clientMutationId: 'unique-id',
                        companyname: entry.companyName,
                        designation: entry.designation,
                        employeeID: data.employeeID,
                        lastsalary: entry.lastSalary,
                        location: entry.location,
                        periodfrom: entry.periodFrom,
                        periodto: entry.periodTo,
                        reasonofleave: entry.reason,
                        referencepersoncontact: entry.refPersonContact,
                        referencepersonname: entry.refPersonName
                    }
                });
            }
        } catch (error) {
            console.error('Failed to insert employment history:', error);
        }
    };

    return (
        <>
            {data && <HeaderNav name={data.name} highlight='Employee Employment History' />}
            <div className='h-full flex flex-col items-center'>
                <div className='w-full bg-white p-6'>
                    <div className='max-w-full mx-auto '>
                        <h2 className='text-lg font-semibold mb-4'>Employment History</h2>
                        <h2 className='text-lg font-semibold mb-4'>Saved Employment History</h2>
                    
                    {queryData && queryData.employeeHistory.map((entry) => (
                        <div key={entry.id} className='mb-4 p-4 border border-gray-300 rounded-md bg-blue-50'>
                            <h3 className='font-semibold'>{entry.companyname}</h3>
                            <p><strong>Designation:</strong> {entry.designation}</p>
                            <p><strong>Location:</strong> {entry.location}</p>
                            <p><strong>Period:</strong> {entry.periodfrom} to {entry.periodto}</p>
                            <p><strong>Reason for Leaving:</strong> {entry.reasonofleave}</p>
                            <p><strong>Last Salary:</strong> {entry.lastsalary}</p>
                            <p><strong>Reference Person:</strong> {entry.referencepersonname} ({entry.referencepersoncontact})</p>
                        </div>
                    ))}

                        {/* Employment History Form */}
                        {employmentHistory.map((entry, index) => (
                            <div key={index} className='mb-4 p-4 border border-gray-300 rounded-md'>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700'>Company Name</label>
                                        <input
                                            type="text"
                                            value={entry.companyName}
                                            onChange={(e) => handleChange(index, 'companyName', e.target.value)}
                                            className='border border-gray-300 rounded-md shadow-sm p-2 w-full'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700'>Location</label>
                                        <input
                                            type="text"
                                            value={entry.location}
                                            onChange={(e) => handleChange(index, 'location', e.target.value)}
                                            className='border border-gray-300 rounded-md shadow-sm p-2 w-full'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700'>Designation</label>
                                        <input
                                            type="text"
                                            value={entry.designation}
                                            onChange={(e) => handleChange(index, 'designation', e.target.value)}
                                            className='border border-gray-300 rounded-md shadow-sm p-2 w-full'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700'>Period From</label>
                                        <input
                                            type="date"
                                            value={entry.periodFrom}
                                            onChange={(e) => handleChange(index, 'periodFrom', e.target.value)}
                                            className='border border-gray-300 rounded-md shadow-sm p-2 w-full'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700'>Period To</label>
                                        <input
                                            type="date"
                                            value={entry.periodTo}
                                            onChange={(e) => handleChange(index, 'periodTo', e.target.value)}
                                            className='border border-gray-300 rounded-md shadow-sm p-2 w-full'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700'>Reason for Leaving</label>
                                        <input
                                            type="text"
                                            value={entry.reason}
                                            onChange={(e) => handleChange(index, 'reason', e.target.value)}
                                            className='border border-gray-300 rounded-md shadow-sm p-2 w-full'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700'>Last Drawn Salary</label>
                                        <input
                                            type="text"
                                            value={entry.lastSalary}
                                            onChange={(e) => handleChange(index, 'lastSalary', e.target.value)}
                                            className='border border-gray-300 rounded-md shadow-sm p-2 w-full'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700'>Reference Person Name</label>
                                        <input
                                            type="text"
                                            value={entry.refPersonName}
                                            onChange={(e) => handleChange(index, 'refPersonName', e.target.value)}
                                            className='border border-gray-300 rounded-md shadow-sm p-2 w-full'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700'>Reference Person Contact</label>
                                        <input
                                            type="text"
                                            value={entry.refPersonContact}
                                            onChange={(e) => handleChange(index, 'refPersonContact', e.target.value)}
                                            className='border border-gray-300 rounded-md shadow-sm p-2 w-full'
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={handleSubmit}
                            className='mt-4 px-4 py-2 text-blue-800 rounded-md'
                            disabled={loading}
                        >
                            {loading ? "Posting..." : <u><b>Post & + Add More Employment History</b></u>}  
                        </button>
                        <div className='flex justify-center mb-8'>
                            <Link href='/EmploymentExtraDetails'>
                                <button
                                    className='mt-4 px-4 py-2 bg-[#334155] hover:bg-black text-white rounded-md '
                                >
                                    Next ➤
                                </button>
                            </Link>
                        </div>
                            
                        {/* Displaying Employment History from Query */}
                     
                    </div>
                </div>
                
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

export default EmploymentHistory;
