import { gql } from "@apollo/client";

export const GET_EMPLOYEE_DETAILS = gql`
  query GetEmployeeDetails($employeeID: String!, $password: String!) {
    getEmployeeDetails(employeeID: $employeeID, password: $password) {
      contact
      dept
      email
      employeeID
      name
    }
  }
`;


export const GET_EMPLOYEE_PERSONAL_DETAILS = gql`
  query GetEmployeePersonalDetails($employeeID: String!) {
    getEmployeeDetailsByEmployeeID(employeeID: $employeeID) {
      add_contact
      add_email
      age
      blood
      contact
      department
      dob
      email
      emergencyContact1
      emergencyContact2
      emergencyName1
      emergencyName2
      emergencyRelation1
      emergencyRelation2
      employeeID
      gender
      marital
      name
    }
  }
`;


export const GET_EMPLOYEE_ADDRESS = gql`
  query GetEmployeeAddress($employeeID: String!) {
    getEmployeeAddressByEmployeeID(employeeID: $employeeID) {
      employeeID
      id
      paddress1
      paddress2
      pcity
      pcountry
      ppin
      pstate
      taddress1
      taddress2
      tcity
      tcountry
      tpin
      tstate
    }
  }
`;

export const GET_EMPLOYEE_QUALIFICATIONS = gql`
  query GetEmployeeQualifications($employeeID: String!) {
    employeeQualifications(employeeID: $employeeID) {
      institutename
      percentage
      qualification
      university
      yop
    }
  }
`;


export const GET_EMPLOYEE_FAMILY = gql`
  query GetEmployeeFamily($employeeID: String!) {
    employeeFamily(employeeID: $employeeID) {
      age
      contact
      employeeID
      id
      name
      occupation
      relation
    }
  }
`;

export const GET_EMPLOYEE_HISTORY = gql`
  query GetEmployeeHistory($employeeID: String!) {
    employeeHistory(employeeID: $employeeID) {
      companyname
      designation
      employeeID
      id
      lastsalary
      location
      periodfrom
      periodto
      reasonofleave
      referencepersoncontact
      referencepersonname
    }
  }
`;


export const GET_EMPLOYEE_EXTRA_DETAILS = gql`
  query GetEmployeeExtraDetails($employeeID: String!) {
    employeeExtraDetails(employeeID: $employeeID) {
    aadhar
    drivinglicense
    drivinglicenseexpiry
    employeeID
    pan
    }
  }
`;


export const GET_EMPLOYEE_SKILLS = gql`
  query GetEmployeeSkills($employeeID: String!) {
    employeeSkills(employeeID: $employeeID) {
      certificate
      employeeID
      experience
      id
      skillname
    }
  }
`;


export const GET_EMPLOYEE_LANGUAGE = gql`
  query GetEmployeeLanguage($employeeID: String!) {
    getEmployeeLanguage(employeeID: $employeeID) {
      languageName
      proficiency
    }
  }
`;


export const GET_EMPLOYEE_VERIFICATION = gql`
  query GetEmployeeVerification($employeeID: String!) {
    employeeVerificationByID(empID: $employeeID) {
      empID
      idPrimary
      submittedAt
      verificationStatus
    }
  }
`;


export const GET_EMPLOYEE_WORK_DETAILS = gql`
  query GetEmployeeWorkDetails($employeeID: String!) {
    employeeDashboardWorks(employeeID: $employeeID) {
      dateOfSubmission
      employeeID
      employeeName
      status
      timeline
      workTicket
      id
    }
  }
`;

export const GET_INDIVIDUAL_EMPLOYEE_DAILYACTIVITY = gql`
query GetIndividualEmployeeDailyWorkDetails($employeeID:String) {
  employeeDailyActivities(employeeID: $employeeID) {
    date_of_submission
   
    id
   
  }
}`