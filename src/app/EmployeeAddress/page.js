"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HeaderNav from '@/components/HeaderNav';
import Link from 'next/link';
import { useMutation, useQuery } from '@apollo/client';
import { INSERT_OR_UPDATE_EMPLOYEE_ADDRESS } from '@/utils/gql/GQL_MUTATION';
import { GET_EMPLOYEE_ADDRESS } from '@/utils/gql/GQL_QUERIES';
// import { INSERT_OR_UPDATE_EMPLOYEE_ADDRESS } from '@/graphql/mutations'; // Adjust the path accordingly

const EmployeeAddress = () => {
    const [data, setData] = useState('');
    const [permanentAddress, setPermanentAddress] = useState({
        address1: '',
        address2: '',
        city: '',
        state: '',
        country: '',
        pin: ''
    });
    const [temporaryAddress, setTemporaryAddress] = useState({
        address1: '',
        address2: '',
        city: '',
        state: '',
        country: '',
        pin: ''
    });

    const router = useRouter();

    const [insertOrUpdateAddress, { loading }] = useMutation(INSERT_OR_UPDATE_EMPLOYEE_ADDRESS, {
        onCompleted: (response) => {
            console.log('Response:', response);
            // You can redirect or show a success message here
        },
        onError: (error) => {
            console.error('Error:', error);
            // Handle error (show a message, etc.)
        }
    });

    const { loading: loadingQuery} = useQuery(GET_EMPLOYEE_ADDRESS, {
        variables: { employeeID: data.employeeID }, // Replace with dynamic employeeID if needed
        onCompleted: (data) => {
            if (data && data.getEmployeeAddressByEmployeeID) {
                const addressData = data.getEmployeeAddressByEmployeeID;
                setPermanentAddress({
                    address1: addressData.paddress1,
                    address2: addressData.paddress2,
                    city: addressData.pcity,
                    state: addressData.pstate,
                    country: addressData.pcountry,
                    pin: addressData.ppin,
                });
                setTemporaryAddress({
                    address1: addressData.taddress1,
                    address2: addressData.taddress2,
                    city: addressData.tcity,
                    state: addressData.tstate,
                    country: addressData.tcountry,
                    pin: addressData.tpin,
                });
            }
        }
    });
    console.log(loadingQuery)
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

    const handleLogout = () => {
        localStorage.removeItem('employeeData');
        router.push('/');
    };

    const handlePermanentChange = (e) => {
        const { name, value } = e.target;
        setPermanentAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleTemporaryChange = (e) => {
        const { name, value } = e.target;
        setTemporaryAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const addresses = {
            permanentAddress,
            temporaryAddress
        };

        console.log(addresses);

        try {
            await insertOrUpdateAddress({
                variables: {
                    clientMutationId: '', // or generate a unique ID
                    employeeID: data.employeeID, // assuming employeeID is part of parsedData
                    paddress1: addresses.permanentAddress.address1,
                    paddress2: addresses.permanentAddress.address2,
                    pcity: addresses.permanentAddress.city,
                    pstate: addresses.permanentAddress.state,
                    pcountry: addresses.permanentAddress.country,
                    ppin: addresses.permanentAddress.pin,
                    taddress1: addresses.temporaryAddress.address1,
                    taddress2: addresses.temporaryAddress.address2,
                    tcity: addresses.temporaryAddress.city,
                    tstate: addresses.temporaryAddress.state,
                    tcountry: addresses.temporaryAddress.country,
                    tpin: addresses.temporaryAddress.pin
                }
            });
            // Navigate to the next page after successful submission
            router.push('/EmployeeQualification');
        } catch (error) {
            console.error('Failed to submit addresses:', error);
            // Optionally show an error message to the user
        }
    };


    return (
        <>
            {data && <HeaderNav name={data.name} highlight='Employee Address' />}
            <div className='h-full flex flex-col items-center'>
                <div className='w-full bg-white p-6'>
                    <div className='max-w-full mx-auto'>
                        <h2 className='text-lg font-semibold mb-4'>Permanent Address</h2>
                        <div className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Address Line 1</label>
                                <input
                                    type="text"
                                    name="address1"
                                    value={permanentAddress.address1}
                                    onChange={handlePermanentChange}
                                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Address Line 2</label>
                                <input
                                    type="text"
                                    name="address2"
                                    value={permanentAddress.address2}
                                    onChange={handlePermanentChange}
                                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={permanentAddress.city}
                                    onChange={handlePermanentChange}
                                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={permanentAddress.state}
                                    onChange={handlePermanentChange}
                                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={permanentAddress.country}
                                    onChange={handlePermanentChange}
                                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Pin Code</label>
                                <input
                                    type="text"
                                    name="pin"
                                    value={permanentAddress.pin}
                                    onChange={handlePermanentChange}
                                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
                                />
                            </div>
                        </div>

                        <h2 className='text-lg font-semibold mt-6 mb-4'>Temporary Address</h2>
                        <div className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Address Line 1</label>
                                <input
                                    type="text"
                                    name="address1"
                                    value={temporaryAddress.address1}
                                    onChange={handleTemporaryChange}
                                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Address Line 2</label>
                                <input
                                    type="text"
                                    name="address2"
                                    value={temporaryAddress.address2}
                                    onChange={handleTemporaryChange}
                                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={temporaryAddress.city}
                                    onChange={handleTemporaryChange}
                                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={temporaryAddress.state}
                                    onChange={handleTemporaryChange}
                                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={temporaryAddress.country}
                                    onChange={handleTemporaryChange}
                                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Pin Code</label>
                                <input
                                    type="text"
                                    name="pin"
                                    value={temporaryAddress.pin}
                                    onChange={handleTemporaryChange}
                                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
                                />
                            </div>
                        </div>
                        
                        <div className='flex justify-center'>
                            <Link href='/EmployeeQualification'>
                            <button
                                onClick={handleSubmit}
                                disabled={loading} // Disable button while loading
                                className={`mt-4 px-4 py-2 ${loading ? 'bg-gray-400' : 'bg-[#334155] hover:bg-black'} text-white rounded-md`}
                            >
                                {loading ? 'Please wait...' : 'Submit and Next ➤'}
                            </button>
                            </Link>
                            </div>
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

export default EmployeeAddress;
