"use client"
import { GET_EMPLOYEE_VERIFICATION, GET_EMPLOYEE_WORK_DETAILS } from '@/utils/gql/GQL_QUERIES';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import DailyActivity from '@/components/DailyActivity'
// Register the necessary components for Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);


interface Work {
  workTicket: string;
  status: string;
  dateOfSubmission: string;
  timeline: string;
  employeeName?: string; // Optional if available
}
const Page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [data, setData] = useState([]);

  // Fetch employee verification data
  useEffect(() => {
    const employeeData = localStorage.getItem('employeeData');
    if (!employeeData) {
      router.push('/');
    } else {
      const parsedData = JSON.parse(employeeData);
      setData(parsedData.name);
    }
  }, [router]);

  const { loading: verificationLoading, error: verificationError, data: verificationData } = useQuery(GET_EMPLOYEE_VERIFICATION, {
    variables: { employeeID: params.id },
  });

  const { loading, error, data: workData } = useQuery(GET_EMPLOYEE_WORK_DETAILS, {
    variables: { employeeID: params.id },
  });

  // Check if verification data is empty or not
  const verificationStatus = verificationData?.employeeVerificationByID?.verificationStatus;
  const isVerified = verificationStatus === '1'; 

  if (verificationLoading) {
    return <div className='flex justify-center text-lg lg:text-2xl text-red-600 h-screen items-center'>Please wait...</div>;
  }

  if (verificationError) {
    return <div>Error loading verification data.</div>;
  }

  // Count pending and completed tasks for Pie chart
  const statusCount = {
    pending: 0,
    completed: 0,
  };

  workData?.employeeDashboardWorks?.forEach((work: Work) => {
    if (work.status === "1") {
      statusCount.pending++;
    } else {
      statusCount.completed++;
    }
  });

  // Pie chart data
  const pieData = {
    labels: ['Pending', 'Completed'],
    datasets: [
      {
        data: [statusCount.pending, statusCount.completed],
        backgroundColor: ['#f87171', '#34d399'], // Red for pending, Green for completed
        hoverOffset: 4,
      },
    ],
  };

  // Pie chart options
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  // Function to toggle accordion visibility
  const toggleAccordion = (workTicket: string) => {
    const content = document.getElementById(workTicket);
    if (content) {
      content.classList.toggle('hidden');
    }
  };

  // Calculate percentage of completed tasks
  const totalTasks = statusCount.pending + statusCount.completed;
  const completedPercentage = totalTasks === 0 ? 0 : (statusCount.completed / totalTasks) * 100;

  // Determine message and color based on percentage
  let performanceMessage = '';
  let boxColor = ''; // For dynamic color styling

  if (completedPercentage > 90) {
    performanceMessage = 'Excellent';
    boxColor = 'bg-green-500'; // Green for excellent performance
  } else if (completedPercentage >= 80) {
    performanceMessage = 'Good';
    boxColor = 'bg-yellow-400'; // Yellow for good performance
  } else if (completedPercentage >= 70) {
    performanceMessage = 'Keep working hard';
    boxColor = 'bg-yellow-300'; // Light Yellow for keep working hard
  } else {
    performanceMessage = 'Bad';
    boxColor = 'bg-red-500'; // Red for below 70%
  }

  return (
    <div className={`relative ${!isVerified ? 'blurred' : ''}`}>
      {isVerified ? (
        <div>
          <b className='flex justify-center text-red-600 text-md lg:text-3xl mt-3 mb-3'>
            Hello {data}, Welcome to Rakhis Fashions
          </b>
          
          {/* Pie chart - Small size */}
          <div className="flex justify-center my-4">
            <div className="w-1/4">
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>

          {/* Percentage and performance message */}
          <div className="flex justify-center my-4">
            <div className={`${boxColor} text-white p-3 rounded-lg`}>
              <p className="text-xl font-bold">Performance Health - {completedPercentage.toFixed(2)}%</p>
              <p className="text-lg flex justify-center">{performanceMessage}</p>
            </div>
          </div>

          {/* Display work data in cards (only pending tasks) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {workData?.employeeDashboardWorks?.map((workDetail: Work) => {
              if (workDetail.status === "1") { // Show only pending tasks
                return (
                  <div key={workDetail.workTicket} className="bg-white shadow-md rounded-lg p-4 border-2 border-black">
                    <div className="flex justify-between items-center mb-4">
                      {/* <h3 className="text-xl font-semibold">{workDetail.employeeName}</h3> */}
                      <span
                        className={` flex justify-center px-3 py-1 rounded-full bg-red-300 text-red-900`}
                      >
                        Pending
                      </span>
                
                    </div>

                    <p className="text-sm">
                      <strong>Date of Assignment:</strong> {new Date(workDetail.dateOfSubmission).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      <strong>Timeline:</strong> {new Date(workDetail.timeline).toLocaleDateString()}
                    </p>

                    {/* Accordion for workTicket */}
                    <div className="mt-4">
                      <button
                        type="button"
                        className="w-full text-left bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md"
                        onClick={() => toggleAccordion(workDetail.workTicket)}
                      >
                        <strong>Work Ticket Details</strong>
                      </button>
                      <div
                        id={workDetail.workTicket}
                        className="hidden mt-2 px-4 py-2 bg-gray-50 rounded-md"
                      >
                        <p>{workDetail.workTicket}</p>
                      </div>
                      <div className='flex justify-center mt-3'>
                      <button className=' bg-green-400 p-1 rounded-md hover:bg-green-700 hover:text-gray-50'>Mark as completed</button>
                      </div>
                    </div>
                   
                  </div>
                  
                );
              }
              return null; // Don't return anything for completed tasks
            })}
          </div>
          <DailyActivity empid={params.id}/>
        </div>
      ) : (
        <>
          <div className="absolute inset-0 bg-white bg-opacity-80 flex justify-center items-center z-10 h-screen">
            <p className="text-xl font-semibold text-red-600">
              You are not verified yet. Please wait for your documents to be verified.
            </p>
          </div>
          <div className="opacity-50 pointer-events-none">
            Hello {params.id}
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
