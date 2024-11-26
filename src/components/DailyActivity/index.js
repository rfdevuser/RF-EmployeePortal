"use client";
import { EMPLOYEE_DAILY_ACTIVITY_INSERT } from '@/utils/gql/GQL_MUTATION';
import { GET_INDIVIDUAL_EMPLOYEE_DAILYACTIVITY } from '@/utils/gql/GQL_QUERIES';
import { useMutation, useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';

const DailyActivity = ({ empid }) => {
  const [activity, setActivity] = useState('');
  const [insertDailyActivity, { data, loading, error }] = useMutation(EMPLOYEE_DAILY_ACTIVITY_INSERT);
  const { loading: dailyLoading, error: dailyError, data: dailyData } = useQuery(GET_INDIVIDUAL_EMPLOYEE_DAILYACTIVITY, {
    variables: { employeeID: empid },
  });

  // Track the current month and year
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Current month (0-11)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Current year

  const handleActivityChange = (e) => {
    e.preventDefault();
    setActivity(e.target.value);
  };

  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

  const handleOnClick = async (e) => {
    e.preventDefault();

    try {
      const response = await insertDailyActivity({
        variables: {
          clientMutationId: "test", // Replace with actual ID or dynamic value
          employeeID: empid,
          workDetails: activity,
          submissionDate: date,
        },
      });
      setActivity('');
      alert("Your daily Activity Submitted Successfully");
      console.log(data.employeeInsertDailyActivity.responseMessage);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Get the first day of the current month to calculate the starting weekday
  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay(); // Returns 0 (Sunday) to 6 (Saturday)
  };

  // Get the dates of the current month
  const getDatesInMonth = (month, year) => {
    const date = new Date(year, month, 1);
    const dates = [];
    const firstDay = getFirstDayOfMonth(month, year);
    date.setDate(1); // Start from the first day of the month

    // Fill the first empty cells of the calendar
    for (let i = 0; i < firstDay; i++) {
      dates.push(null); // Empty slots before the first day
    }

    while (date.getMonth() === month) {
      dates.push(new Date(date));
      date.setDate(date.getDate()+1);
    }
    return dates;
  };

  // Get all dates for the current month
  const allDatesInMonth = getDatesInMonth(currentMonth, currentYear);

  // Function to convert 'DD/MM/YYYY' format to 'YYYY-MM-DD' format
  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`; // Returns in 'YYYY-MM-DD' format
  };

  // Helper function to normalize dates to 'YYYY-MM-DD' format (ignoring time)
  const normalizeDate = (dateObj) => {
    return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()).toISOString().split('T')[0];
  };

  // Extract dates from dailyData and convert to 'YYYY-MM-DD' format
  const markedDates = dailyData?.employeeDailyActivities?.map(item => {
    return formatDate(item.date_of_submission); // Convert server date to proper format
  });

  // Update to show the previous month
  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11); // December (previous month)
      setCurrentYear(currentYear - 1); // Go to previous year
    } else {
      setCurrentMonth(currentMonth - 1); // Decrease month
    }
  };

  // Update to show the next month
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0); // January (next month)
      setCurrentYear(currentYear + 1); // Go to next year
    } else {
      setCurrentMonth(currentMonth + 1); // Increase month
    }
  };

  return (
    <>
      <div className="bg-red-50 mt-2">
        <div className="flex justify-center lg:text-xl text-white mt-2">
          <p className="bg-[#4a044e] p-1 rounded-xl mt-2"> Date :- {date} </p>
        </div>

        <div className="flex flex-col lg:flex-row justify-center mt-3 mb-3 bg-red-50 p-4">
          <label className="flex items-center justify-center m-3 text-3xl text-red-800">𝑫𝒂𝒊𝒍𝒚 𝑨𝒄𝒕𝒊𝒗𝒊𝒕𝒚</label>
          <input
            id="activity"
            type="text"
            value={activity}
            onChange={handleActivityChange}
            className="border-2 border-gray-400 hover:bg-blue-50 w-full lg:w-1/2 h-32"
            placeholder="Please Write Detail Work"
          />
          <button
            className="bg-gray-600 text-white hover:bg-gray-900 p-2 rounded-md mt-2 lg:mt-0 lg:mx-2"
            onClick={handleOnClick}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>

        <div className="mt-8">
          {/* Calendar Navigation */}
          <div className="flex justify-between mb-4">
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-800"
              onClick={handlePreviousMonth}>
              Previous
            </button>
            <div className="text-center text-xl">
              {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
            </div>
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-800"
              onClick={handleNextMonth}>
              Next
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
              <div key={index} className="text-center font-bold">{day}</div>
            ))}
            {allDatesInMonth.map((dateObj, index) => {
              if (!dateObj) {
                return <div key={index}></div>; // Empty cell for padding
              }

              const dateStr = normalizeDate(dateObj); // Normalize to 'YYYY-MM-DD' format
              const isMarked = markedDates?.includes(dateStr); // Check if the date is marked
              const isPastDate = new Date() > dateObj; // Check if the date is in the past
              return (
                <div key={index} className={`text-center p-2 ${isMarked ? 'bg-green-500 text-white' : isPastDate ? 'bg-red-500 text-white' : ''}`}>
                  {dateObj.getDate()}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default DailyActivity;
