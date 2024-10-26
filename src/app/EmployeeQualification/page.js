"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HeaderNav from '@/components/HeaderNav';
import { useMutation, useQuery } from '@apollo/client';
import { EMPLOYEE_QUALIFICATION_INSERT } from '@/utils/gql/GQL_MUTATION';
import { GET_EMPLOYEE_QUALIFICATIONS } from '@/utils/gql/GQL_QUERIES';
const Shimmer = () => (
    <div className="space-y-4">
        <div className="h-4 bg-gray-300 animate-pulse rounded"></div>
        <div className="h-4 bg-gray-300 animate-pulse rounded"></div>
        <div className="h-4 bg-gray-300 animate-pulse rounded"></div>
    </div>
);

const EmployeeQualification = () => {
    const [data, setData] = useState('');
    const [qualifications, setQualifications] = useState([
        { slNo: 1, qualification: '', year: '', institute: '', university: '', percentage: '' }
    ]);

    const resetQualifications = () => {
        setQualifications([
            { slNo: 1, qualification: '', year: '', institute: '', university: '', percentage: '' }
        ]);
    };
    const router = useRouter();
    const { loading: queryLoading, error: queryError, data: queryData,refetch } = useQuery(GET_EMPLOYEE_QUALIFICATIONS, {
        variables: { employeeID: data.employeeID },
    });

    const [insertQualification, { loading: mutationLoading }] = useMutation(EMPLOYEE_QUALIFICATION_INSERT, {
        onCompleted: async (response) => {
            console.log('Response:', response);
            await refetch(); // Refetch qualifications after insertion
            resetQualifications();
        },
        onError: (error) => {
            console.error('Error:', error);
        }
    });

    useEffect(() => {
        const employeeData = localStorage.getItem('employeeData');
        if (!employeeData) {
            router.push('/');
        } else {
            const parsedData = JSON.parse(employeeData);
            setData(parsedData);
            console.log(parsedData);
        }
    }, [router]);

    const handleChange = (index, field, value) => {
        const newQualifications = [...qualifications];
        newQualifications[index][field] = value;
        setQualifications(newQualifications);
    };

    const handleLogout = () => {
        localStorage.removeItem('employeeData');
        router.push('/');
    };

    const addQualification = () => {
        setQualifications([
            ...qualifications,
            { slNo: qualifications.length + 1, qualification: '', year: '', institute: '', university: '', percentage: '' }
        ]);
    };

    const deleteQualification = (index) => {
        const newQualifications = qualifications.filter((_, i) => i !== index);
        setQualifications(newQualifications.map((qual, i) => ({ ...qual, slNo: i + 1 })));
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        for (const qual of qualifications) {
            if (!qual.qualification || !qual.year || !qual.institute || !qual.university || !qual.percentage) {
                alert('Please fill out all fields.');
                return; // Stop submission if any field is empty
            }
            try {
                await insertQualification({
                    variables: {
                        clientMutationId: '',
                        employeeID: data.employeeID,
                        institutename: qual.institute,
                        percentage: qual.percentage,
                        qualification: qual.qualification,
                        university: qual.university,
                        yop: qual.year,
                    },
                });
            } catch (error) {
                console.error('Failed to submit qualification:', error);
            }
        }
      
    };

    const handleSubmitRoute = () => {
        router.push('/EmployeeFamily');
    };

    if (queryLoading) return <Shimmer />;
    if (queryError) return <p>Error: {queryError.message}</p>;

    return (
        <div className='flex flex-col h-full bg-white'>
          
            {data && <HeaderNav name={data.name} highlight='Employee Qualification' />}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
                {queryData?.employeeQualifications?.map((qual) => (
                    <div key={qual.__typename + qual.yop} className="border p-4 rounded-lg shadow-md bg-blue-50">
                        <h4 className="font-semibold">{qual.qualification}</h4>
                        <p><strong>Institute:</strong> {qual.institutename}</p>
                        <p><strong>University:</strong> {qual.university}</p>
                        <p><strong>Year of Passing:</strong> {new Date(qual.yop).toLocaleDateString()}</p>
                        <p><strong>Percentage:</strong> {qual.percentage}</p>
                    </div>
                ))}
            </div>
            <div className='flex-grow flex items-center justify-center bg-white mt-3'>
                <div className='w-full max-w-full bg-white p-6 rounded-lg shadow-lg'>
                    <h2 className='text-lg font-semibold mb-4'>Qualifications</h2>
                    <form className='space-y-6' onSubmit={handleSubmit}>
                        {qualifications.map((qual, index) => (
                            <div key={index} className='space-y-4'>
                                <div className='flex space-x-4'>
                                    <label className='flex-none '>Provide Qualification one by one</label>
                                 
                                </div>
                                <div className='flex flex-col'>
                                    <label>Qualification</label>
                                    <input
                                        type="text"
                                        value={qual.qualification}
                                        onChange={(e) => handleChange(index, 'qualification', e.target.value)}
                                        placeholder="Enter qualification"
                                        className='border border-gray-300 rounded-md shadow-sm p-2'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label>Year of Passing</label>
                                    <input
                                        type="date"
                                        value={qual.year}
                                        onChange={(e) => handleChange(index, 'year', e.target.value)}
                                        className='border border-gray-300 rounded-md shadow-sm p-2'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label>Institute</label>
                                    <input
                                        type="text"
                                        value={qual.institute}
                                        onChange={(e) => handleChange(index, 'institute', e.target.value)}
                                        placeholder="Enter institute name"
                                        className='border border-gray-300 rounded-md shadow-sm p-2'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label>University</label>
                                    <input
                                        type="text"
                                        value={qual.university}
                                        onChange={(e) => handleChange(index, 'university', e.target.value)}
                                        placeholder="Enter university name"
                                        className='border border-gray-300 rounded-md shadow-sm p-2'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label>Percentage/CGPA</label>
                                    <input
                                        type="text"
                                        value={qual.percentage}
                                        onChange={(e) => handleChange(index, 'percentage', e.target.value)}
                                        placeholder="Enter percentage or CGPA"
                                        className='border border-gray-300 rounded-md shadow-sm p-2'
                                    />
                                </div>
                            </div>
                        ))}
                        <div className='flex justify-between'>
                            <button
                                type="submit"
                                disabled={mutationLoading}
                                className={`mt-4 px-4 py-2 ${mutationLoading ? 'bg-gray-400' : 'bg-[#334155] hover:bg-black'} text-white rounded-md`}
                            >
                                {mutationLoading ? 'Posting...' : 'Post and + Add More'}
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmitRoute}
                                disabled={mutationLoading}
                                className={`mt-4 px-4 py-2 ${mutationLoading ? 'bg-gray-400' : 'bg-[#334155] hover:bg-black'} text-white rounded-md`}
                            >
                                Next ➤
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <button
                onClick={handleLogout}
                className='absolute top-3 right-3 text-white'
            >
                Logout
            </button>
        </div>
    );
};

export default EmployeeQualification;
