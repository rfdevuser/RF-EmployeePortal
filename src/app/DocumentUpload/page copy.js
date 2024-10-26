"use client";
import HeaderNav from '@/components/HeaderNav';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { storage } from '@/firebase'; // Ensure correct path
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';



const Page = () => {
    const [data, setData] = useState('');
    const [files, setFiles] = useState({});
    const [uploading, setUploading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const employeeData = localStorage.getItem('employeeData');
        if (!employeeData) {
            router.push('/');
        } else {
            const parsedData = JSON.parse(employeeData);
            setData(parsedData);
            fetchUploadedFiles(parsedData.employeeID);
        }
    }, [router]);

    const fetchUploadedFiles = async (employeeID) => {
        console.log("Fetching uploaded files...");
        const emp = employeeID ; 
        const directoryRef = ref(storage, `uploads/${emp}/`);

        try {
            const res = await listAll(directoryRef);
            const filePromises = res.items.map(async (item) => {
                const url = await getDownloadURL(item);
                return { name: item.name, url };
            });

            const filesWithUrls = await Promise.all(filePromises);
            console.log("Fetched files:", filesWithUrls);
            setUploadedFiles(filesWithUrls);

        } catch (error) {
            console.error("Error fetching uploaded files: ", error);
            setError("Error fetching uploaded files. Please try again.");
        }
    };

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
    };

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    const handleUpload = async () => {
        setUploading(true);
        setError('');
        const uploadPromises = [];

        for (const doc of Object.keys(files)) {
            if (files[doc]) {
                const file = files[doc];
                const fileName = `${data.employeeID}_${doc.replace(/\s+/g, '_').toLowerCase()}`;
                const storageRef = ref(storage, `uploads/${data.employeeID}/${fileName}`);

                uploadPromises.push(
                    uploadBytes(storageRef, file).then(() => getDownloadURL(storageRef).then((url) => {
                        setUploadedFiles(prev => [...prev, { name: doc, url }]);
                        console.log(`Uploaded ${doc} URL:`, url);
                    })).catch(err => {
                        console.error("Error uploading file:", err);
                        setError("Error uploading files. Please try again.");
                    })
                );
            }
        }

        try {
            await Promise.all(uploadPromises);
        } catch (error) {
            console.error("Error uploading files:", error);
            setError("Error uploading files. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleViewFile = (url) => {
        window.open(url, "_blank");
    };

    return (
        <>
            {data && (
                <>
                    <HeaderNav name={data.name} highlight='Documents' />
                    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Upload Your Documents</h2>
                        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                        <form className="space-y-6">
                            {[
                                'Aadhar Card',
                                'PAN Card',
                                'Driving License',
                                'Transfer Certificate',
                                'Xth Marksheet',
                                'XIIth Marksheet',
                                'UG/PG/Diploma Degree/Provisional',
                                'Experience Certificate/Relieving Order',
                                'Pay Slip/Salary Certificate/Bank Statement',
                                'Offer Letter of Last Company/Appointment Order',
                                'Training Certificate/Skill Certificate',
                                'Bank Passbook',
                                'Medical Certificate',
                                'Local Address Proof',
                                'Photograph',
                            ].map((doc) => (
                                <div key={doc}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {doc}
                                    </label>
                                    <input
                                        type="file"
                                        name={doc}
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:border file:border-gray-300
                                            file:rounded-md file:text-sm
                                            file:bg-gray-50 file:text-gray-700
                                            hover:file:bg-gray-100"
                                    />
                                </div>
                            ))}

                            {/* Display Uploaded Files */}
                            {uploadedFiles.map(({ name, url }) => (
                                <div key={name} className="mt-2 text-sm text-gray-600 flex items-center">
                                    <span>{name}</span>
                                    <button
                                        onClick={() => handleViewFile(url)}
                                        className="ml-2 text-blue-500 hover:underline"
                                    >
                                        View
                                    </button>
                                </div>
                            ))}

                            <div className="flex items-center mt-4">
                                <input
                                    type="checkbox"
                                    id="declaration"
                                    checked={isChecked}
                                    onChange={handleCheckboxChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="declaration" className="ml-2 block text-sm text-gray-600">
                                    I hereby declare that all the details furnished above are true to the best of my knowledge and belief.
                                </label>
                            </div>

                            <button
                                type="button"
                                onClick={handleUpload}
                                disabled={uploading}
                                className={`mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded-md
                                    ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                            >
                                {uploading ? 'Uploading...' : 'Upload All'}
                            </button>
                        </form>
                    </div>
                </>
            )}
        </>
    );
};

export default Page;
