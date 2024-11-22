"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HeaderNav from '@/components/HeaderNav';
import { useMutation, useQuery } from '@apollo/client';
import { EMPLOYEE_INSERT_OR_UPDATE_EXTRA_DETAILS, EMPLOYEE_LANGUAGE_UPDATE, EMPLOYEE_SKILL_UPDATE } from '@/utils/gql/GQL_MUTATION';
import { GET_EMPLOYEE_EXTRA_DETAILS, GET_EMPLOYEE_LANGUAGE, GET_EMPLOYEE_SKILLS } from '@/utils/gql/GQL_QUERIES';
import Link from 'next/link';

const EmployeeSkill = () => {
    const [data, setData] = useState('');
    const [Emp, setEmp] = useState('');
    const [skills, setSkills] = useState([{ skillName: '', certification: '', experience: '' }]);
    const [languages, setLanguages] = useState([{ languageName: '', proficiency: '' }]);
    const [loading, setLoading] = useState(false);
    const [aadhar, setAadhar] = useState('');
    const [drivingLicense, setDrivingLicense] = useState('');
    const [drivingLicenseExpiry, setDrivingLicenseExpiry] = useState('');
    const [pan, setPan] = useState('');
    const [loadingSkill, setLoadingSkill] = useState(false);
    const [loadingLanguage, setLoadingLanguage] = useState(false);
    const router = useRouter();

    const [updateSkill] = useMutation(EMPLOYEE_SKILL_UPDATE);
    const [updateLanguage] = useMutation(EMPLOYEE_LANGUAGE_UPDATE);
    
    const { loading: loadingQuery, error: queryError, data: queryData } = useQuery(GET_EMPLOYEE_EXTRA_DETAILS, {
        variables: { employeeID: Emp },
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
    const { loadin: skillLoading, error, data: skillData, refetch } = useQuery(GET_EMPLOYEE_SKILLS, {
        variables: { employeeID: Emp },
    });

    const { loading: languageLoading, error: languageError, data: languageData, refetch: langRefetch } = useQuery(GET_EMPLOYEE_LANGUAGE, {
        variables: { employeeID: Emp },
    });

    useEffect(() => {
        const employeeData = localStorage.getItem('employeeData');
        if (!employeeData) {
            router.push('/');
        } else {
            const parsedData = JSON.parse(employeeData);
            setData(parsedData);
            setEmp(parsedData.employeeID);
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

    const handleSkillChange = (index, field, value) => {
        const newSkills = [...skills];
        newSkills[index][field] = value;
        setSkills(newSkills);
    };

    const handleLanguageChange = (index, field, value) => {
        const newLanguages = [...languages];
        newLanguages[index][field] = value;
        setLanguages(newLanguages);
    };

    const handleSubmitExtraDetails = async () => {
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

    const handleSkillSubmit = async (index) => {
        setLoadingSkill(true);
        const skillData = {
            clientMutationId: 'unique-id',
            employeeID: data.employeeID,
            skillname: skills[index].skillName,
            certificate: skills[index].certification,
            experience: skills[index].experience,
        };

        try {
            const { data } = await updateSkill({ variables: skillData });
            console.log(data.employeeSkillUpdate.responseMessage);
            refetch();
        } catch (error) {
            console.error('Error updating skill:', error);
        } finally {
            setLoadingSkill(false);
        }
    };

    const handleLanguageSubmit = async (index) => {
        setLoadingLanguage(true);
        const languageData = {
            clientMutationId: 'unique-id',
            employeeID: data.employeeID,
            languageName: languages[index].languageName,
            proficiency: languages[index].proficiency,
        };

        try {
            const { data } = await updateLanguage({ variables: languageData });
            console.log(data.employeeLanguageUpdate.responseMessage);
            langRefetch();
        } catch (error) {
            console.error('Error updating language:', error);
        } finally {
            setLoadingLanguage(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('employeeData');
        router.push('/');
    };

    return (
        <>
            {data && <HeaderNav name={data.name} highlight='Employee Extra Details' />}
            <div className='h-full flex flex-col items-center'>
                <div className='w-full bg-white p-6'>
                    <div className='max-w-full mx-auto'>
                        <h2 className='text-lg font-semibold mb-4'>Employee Skills and Documents</h2>

                        {/* Form Fields */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
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
                        </div>

                        <div className='flex justify-center'>
                            <button
                                onClick={handleSubmitExtraDetails}
                                disabled={loading}
                                className={`mt-4 px-4 py-2 ${loading ? 'bg-gray-400' : 'bg-[#334155] hover:bg-black'} text-white rounded-md`}
                            >
                                {loading ? 'Submitting...' : 'Post'}
                            </button>
                        </div>

                        <h3 className='text-lg font-semibold mt-6'>Skills</h3>

                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse border border-gray-300">
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
                                                    className='px-2 py-1 text-center mx-auto flex justify-center bg-green-600 rounded-md text-white'
                                                    disabled={loadingSkill}
                                                >
                                                    {loadingSkill ? 'Posting...' : '+'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className='flex justify-center mt-8 text-red-800'><b>Added Skills</b></div>
                        <div className="overflow-x-auto bg-blue-50">
                            <table className="min-w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 p-2">S.No</th>
                                        <th className="border border-gray-300 p-2">Skill Name</th>
                                        <th className="border border-gray-300 p-2">Certificate</th>
                                        <th className="border border-gray-300 p-2">Experience</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {skillData?.employeeSkills?.map((skill, index) => (
                                        <tr key={skill.id} className="hover:bg-gray-100">
                                            <td className="border border-gray-300 p-2">{index + 1}</td>
                                            <td className="border border-gray-300 p-2">{skill.skillname}</td>
                                            <td className="border border-gray-300 p-2">{skill.certificate}</td>
                                            <td className="border border-gray-300 p-2">{skill.experience}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <h3 className='text-lg font-semibold mt-6'>Languages</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 p-2">S.No</th>
                                        <th className="border border-gray-300 p-2">Language Name</th>
                                        <th className="border border-gray-300 p-2">Proficiency</th>
                                        <th className="border border-gray-300 p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {languages.map((lang, index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-300 p-2">{index + 1}</td>
                                            <td className="border border-gray-300 p-2">
                                                <input
                                                    type="text"
                                                    value={lang.languageName}
                                                    onChange={(e) => handleLanguageChange(index, 'languageName', e.target.value)}
                                                    className='border border-gray-300 rounded-md shadow-sm p-1 w-full'
                                                    placeholder="Language Name"
                                                />
                                            </td>
                                            <td className="border border-gray-300 p-2">
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
                                            <td className="border border-gray-300 p-2">
                                                <button
                                                    onClick={() => handleLanguageSubmit(index)}
                                                    className='px-2 py-1 text-center mx-auto flex justify-center bg-green-600 rounded-md text-white'
                                                    disabled={loadingLanguage}
                                                >
                                                    {loadingLanguage ? 'Posting...' : '+'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className='flex justify-center mt-8 text-red-800'><b>Added Languages</b></div>
                        <div className="overflow-x-auto bg-blue-50">
                            <table className="min-w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 p-2">S.No</th>
                                        <th className="border border-gray-300 p-2">Language Name</th>
                                        <th className="border border-gray-300 p-2">Proficiency</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {languageData?.getEmployeeLanguage?.map((language, index) => (
                                        <tr key={index} className="hover:bg-gray-100">
                                            <td className="border border-gray-300 p-2">{index + 1}</td>
                                            <td className="border border-gray-300 p-2">{language.languageName}</td>
                                            <td className="border border-gray-300 p-2">{language.proficiency}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className='flex justify-center'>
                            <Link href='/DocumentUpload'>
                                <button
                                    disabled={loading}
                                    className={`mt-4 px-4 py-2 ${loading ? 'bg-gray-400' : 'bg-[#334155] hover:bg-black'} text-white rounded-md`}
                                >
                                    Next ➤
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

export default EmployeeSkill;
