"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HeaderNav from '@/components/HeaderNav';
import { useMutation, useQuery } from '@apollo/client';
import { EMPLOYEE_INSERT_OR_UPDATE_EXTRA_DETAILS, EMPLOYEE_LANGUAGE_UPDATE, EMPLOYEE_SKILL_UPDATE } from '@/utils/gql/GQL_MUTATION';
import { GET_EMPLOYEE_EXTRA_DETAILS } from '@/utils/gql/GQL_QUERIES';

const EmployeeSkill = () => {

    const [data, setData] = useState('');
    const [Emp , setEmp] = useState('')
    const [skills] = useState([{ skillName: '', certification: '', experience: '' }]);
    const [languages, setLanguages] = useState([{ languageName: '', proficiency: '' }]);
    const [loading, setLoading] = useState(false);
    const [aadhar, setAadhar] = useState('');
    const [drivingLicense, setDrivingLicense] = useState('');
    const [drivingLicenseExpiry, setDrivingLicenseExpiry] = useState('');
    const [pan, setPan] = useState('');

    const router = useRouter();
   


    const [updateSkill] = useMutation(EMPLOYEE_SKILL_UPDATE);
    const [updateLanguage] = useMutation(EMPLOYEE_LANGUAGE_UPDATE);
const { loading: loadingQuery, error: queryError, data: queryData } = useQuery(GET_EMPLOYEE_EXTRA_DETAILS, {
    variables: { employeeID: Emp }, // Replace with dynamic employeeID if needed
    onCompleted: (data) => {
        if (data && data.employeeExtraDetails) {
            const empData = data.employeeExtraDetails;
            setAadhar(empData.aadhar);
            setDrivingLicense(empData.drivinglicense);
            setDrivingLicenseExpiry(empData.drivinglicenseexpiry);
            setPan(empData.pan);
        }
    }
});
useEffect(() => {
    if (loadingQuery) {
        console.log("Loading...");
    }
    if (queryData) {
        console.log(queryData,"darta..");
    }
    if (queryError) {
        console.error("Error fetching employee data:", queryError);
    }
}, [loadingQuery, queryError,queryData]);
    useEffect(() => {
        const employeeData = localStorage.getItem('employeeData');
        if (!employeeData) {
            router.push('/');
        } else {
            const parsedData = JSON.parse(employeeData);
            setData(parsedData);
            setEmp(parsedData.employeeID)
            console.log(parsedData);
        }
    }, [router]);
    const [insertOrUpdateExtraDetails] = useMutation(EMPLOYEE_INSERT_OR_UPDATE_EXTRA_DETAILS, {
        onCompleted: () => {
            console.log('Response: Extra details submitted successfully');
            setLoading(false);
        },
        onError: (error) => {
            console.error('Error inserting/updating extra details:', error);
            setLoading(false);
        }
    });

    const handleSkillChange = (e) => {
        const { name, value } = e.target;
        setSkillData((prev) => ({ ...prev, [name]: value }));
      };
  


    const handleLanguageChange = (index, field, value) => {
        const newLanguages = [...languages];
        newLanguages[index][field] = value;
        setLanguages(newLanguages);
    };



    const handleSubmit = async () => {
        setLoading(true);
        const employeeDetails = {
            aadhar,
            drivingLicense,
            drivingLicenseExpiry,
            pan,
            employeeID: data.employeeID,
        };

        try {
            await insertOrUpdateExtraDetails({
                variables: {
                    clientMutationId: 'unique-id',
                    aadhar: employeeDetails.aadhar,
                    drivingLicense: employeeDetails.drivingLicense,
                    drivingLicenseExpiry: employeeDetails.drivingLicenseExpiry,
                    employeeID: employeeDetails.employeeID,
                    pan: employeeDetails.pan,
                }
            });
        } catch (error) {
            console.error('Failed to insert/update extra details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('employeeData');
        router.push('/');
    };



    const handleSkillSubmit = async () => {
        try {
          const { data } = await updateSkill({ variables: skillData });
          console.log(data.employeeSkillUpdate.responseMessage);
        } catch (error) {
          console.error('Error updating skill:', error);
        }
      };



  const handleLanguageSubmit = async () => {
    try {
      const { data } = await updateLanguage({ variables: languageData });
      console.log(data.employeeLanguageUpdate.responseMessage);
    } catch (error) {
      console.error('Error updating language:', error);
    }
  };
    return (
        <>
            {data && <HeaderNav name={data.name} highlight='Employee Extra Details' />}
            <div className='h-full flex flex-col items-center'>
                <div className='w-full bg-white p-6'>
                    <div className='max-w-full mx-auto'>
                        <h2 className='text-lg font-semibold mb-4'>Employee Skills and Documents</h2>
                        <div className='mb-4'>
                            <label className='block text-sm font-medium text-gray-700'>PAN Number</label>
                            <input
                                type="text"
                                value={pan}
                                onChange={(e) => setPan(e.target.value)}
                                className='border border-gray-300 rounded-md shadow-sm p-2 w-full'
                            />
                        </div>
                        <div className='mb-4'>
                            <label className='block text-sm font-medium text-gray-700'>Aadhar Number</label>
                            <input
                                type="text"
                                value={aadhar}
                                onChange={(e) => setAadhar(e.target.value)}
                                className='border border-gray-300 rounded-md shadow-sm p-2 w-full'
                            />
                        </div>
                        <div className='mb-4'>
                            <label className='block text-sm font-medium text-gray-700'>Driving License Number</label>
                            <input
                                type="text"
                                value={drivingLicense}
                                onChange={(e) => setDrivingLicense(e.target.value)}
                                className='border border-gray-300 rounded-md shadow-sm p-2 w-full'
                            />
                        </div>
                        <div className='mb-4'>
                            <label className='block text-sm font-medium text-gray-700'>Driving License Expiry Date</label>
                            <input
                                type="date"
                                value={drivingLicenseExpiry}
                                onChange={(e) => setDrivingLicenseExpiry(e.target.value)}
                                className='border border-gray-300 rounded-md shadow-sm p-2 w-full'
                            />
                        </div>

                        <h3 className='text-lg font-semibold mt-6'>Skills</h3>
                        <table className='min-w-full border-collapse border border-gray-300'>
                            <thead>
                                <tr>
                                    <th className='border border-gray-300 p-2'>S.No</th>
                                    <th className='border border-gray-300 p-2'>Skill Name</th>
                                    <th className='border border-gray-300 p-2'>Certification</th>
                                    <th className='border border-gray-300 p-2'>Experience</th>
                                    <th className='border border-gray-300 p-2'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {skills.map((skill, index) => (
                                    <tr key={index}>
                                        <td className='border border-gray-300 p-2'>{index + 1}</td>
                                        <td className='border border-gray-300 p-2'>
                                            <input
                                                type="text"
                                                value={skill.skillName}
                                                onChange={(e) => handleSkillChange(index, 'skillName', e.target.value)}
                                                className='border border-gray-300 rounded-md shadow-sm p-1 w-full'
                                                placeholder="Skill Name"
                                            />
                                        </td>
                                        <td className='border border-gray-300 p-2'>
                                            <input
                                                type="text"
                                                value={skill.certification}
                                                onChange={(e) => handleSkillChange(index, 'certification', e.target.value)}
                                                className='border border-gray-300 rounded-md shadow-sm p-1 w-full'
                                                placeholder="Certification"
                                            />
                                        </td>
                                        <td className='border border-gray-300 p-2'>
                                            <input
                                                type="text"
                                                value={skill.experience}
                                                onChange={(e) => handleSkillChange(index, 'experience', e.target.value)}
                                                className='border border-gray-300 rounded-md shadow-sm p-1 w-full'
                                                placeholder="Experience (Years)"
                                            />
                                        </td>
                                        <td className='border border-gray-300 p-2'>
                                            <button
                                                onClick={() => handleSkillSubmit(index)}
                                                className='px-2 py-1 text-center mx-auto flex justify-center'
                                            >
                                               POST
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     

                        <h3 className='text-lg font-semibold mt-6'>Languages</h3>
                        <table className='min-w-full border-collapse border border-gray-300'>
                            <thead>
                                <tr>
                                    <th className='border border-gray-300 p-2'>S.No</th>
                                    <th className='border border-gray-300 p-2'>Language Name</th>
                                    <th className='border border-gray-300 p-2'>Proficiency</th>
                                    <th className='border border-gray-300 p-2'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {languages.map((lang, index) => (
                                    <tr key={index}>
                                        <td className='border border-gray-300 p-2'>{index + 1}</td>
                                        <td className='border border-gray-300 p-2'>
                                            <input
                                                type="text"
                                                value={lang.languageName}
                                                onChange={(e) => handleLanguageChange(index, 'languageName', e.target.value)}
                                                className='border border-gray-300 rounded-md shadow-sm p-1 w-full'
                                                placeholder="Language Name"
                                            />
                                        </td>
                                        <td className='border border-gray-300 p-2'>
                                            <select
                                                value={lang.proficiency}
                                                onChange={(e) => handleLanguageChange(index, 'proficiency', e.target.value)}
                                                className='border border-gray-300 rounded-md shadow-sm p-1 w-full'
                                            >
                                                <option value="" disabled>Select Proficiency</option>
                                                <option value="Beginner">Beginner</option>
                                                <option value="Intermediate">Intermediate</option>
                                                <option value="Advanced">Advanced</option>
                                            </select>
                                        </td>
                                        <td className='border border-gray-300 p-2'>
                                            <button
                                                onClick={() => handleLanguageSubmit(index)}
                                                className='px-2 py-1 rounded-md text-center mx-auto flex justify-center'
                                            >
                                               POST
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                       
                        <div className='flex justify-center'>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`mt-4 px-4 py-2 ${loading ? 'bg-gray-400' : 'bg-[#334155] hover:bg-black'} text-white rounded-md`}
                            >
                                {loading ? 'Submitting...' : 'Submit and Next ➤'}
                            </button>
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

export default EmployeeSkill;
