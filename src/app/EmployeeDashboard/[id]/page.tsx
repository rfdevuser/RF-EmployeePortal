"use client"
import { GET_EMPLOYEE_VERIFICATION, GET_EMPLOYEE_WORK_DETAILS } from '@/utils/gql/GQL_QUERIES';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import DailyActivity from '@/components/DailyActivity'
import Link from 'next/link';

// Import mutation
import { EMPLOYEE_WORK_STATUS_UPDATE } from '@/utils/gql/GQL_MUTATION'; // Add this import for your mutation

// Register the necessary components for Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

interface Work {
  workTicket: string;
  status: string;
  dateOfSubmission: string;
  timeline: string;
  employeeName?: string; // Optional if available
  id: string;
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

  const { loading, error, data: workData ,refetch} = useQuery(GET_EMPLOYEE_WORK_DETAILS, {
    variables: { employeeID: params.id },
  });
console.log(workData)
  const [updateWorkStatus, { loading: mutationLoading, error: mutationError }] = useMutation(EMPLOYEE_WORK_STATUS_UPDATE);
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



  // Handle mark as completed
  const handleMarkAsCompleted = async (workTicketId: string) => {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    try {
      const { data } = await updateWorkStatus({
        variables: {
          clientMutationId: "test", // You can generate a unique client ID if needed
          id: workTicketId, // Use the work ticket id for mutation
          status: "0", // Mark as completed (0 means completed)
          dateOfCompletion: today, // Set today's date as the completion date
        },
      });

      // Handle the response
      if (data?.employeeUpdateWorkStatus?.responseMessage === "Employee work details updated successfully") {
        console.log('Work status updated successfully');
        refetch()
        // Optionally, refetch the work data to reflect the update
      } else {
        console.error('Failed to update work status');
      }
    } catch (error) {
      console.error('Error while updating work status:', error);
    }
  };

  return (
    <>
      <div className={`relative ${!isVerified ? 'blurred' : ''}`}>
        {isVerified ? (
          <div className='bg-white'>
            <b className='flex justify-center text-red-600 text-md lg:text-3xl mt-3 mb-3'>
              Hello {data}, Welcome to Rakhis Fashions
            </b>

            {/* Pie chart - Small size */}
            <div className="flex justify-center my-4">
              <div className="w-full lg:w-1/4 ">
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
                    <div key={workDetail.workTicket} className="bg-[#fef2f2] shadow-md rounded-lg p-4 border-2 border-black">
                      <div className="flex justify-between items-center mb-4">
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
                          className="w-full text-left bg-red-100 hover:bg-red-200 px-4 py-2 rounded-md"
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
                          <button 
                            className=' bg-green-400 p-1 rounded-md hover:bg-green-700 hover:text-gray-50'
                            onClick={() => handleMarkAsCompleted(workDetail.id)} // Trigger the mutation
                            disabled={mutationLoading}
                          >
                           {mutationLoading?"Please Wait...":" Mark as completed"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null; // Don't return anything for completed tasks
              })}
            </div>
            <DailyActivity empid={params.id} />
          </div>
        ) : (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex justify-center items-center z-10 h-screen">
            <p className="text-xl font-semibold text-red-600">
              You are not verified yet. Please wait for your documents to be verified.
            </p>
          </div>
        )}
      </div>

      <Link href='/EnrollmentForm'>
        <div className='absolute top-3 left-3 text-yellow-200 bg-white p-1 rounded-full'>🏠</div>
      </Link>
    </>
  );
};

export default Page;
