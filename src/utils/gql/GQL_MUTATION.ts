import { gql } from "@apollo/client";

export const ADD_EMPLOYEE_PERSONAL_DETAILS = gql`
  mutation AddEmployeePersonalDetails(
    $add_contact: String,
    $add_email: String,
    $age: String,
    $blood: String,
    $clientMutationId: String,
    $contact: String,
    $department: String,
    $dob: String,
    $email: String,
    $emergencyContact1: String,
    $emergencyContact2: String,
    $emergencyName1: String,
    $emergencyName2: String,
    $emergencyRelation1: String,
    $emergencyRelation2: String,
    $employeeID: String,
    $gender: String,
    $marital: String,
    $name: String
  ) {
    employeeInsertintoPersonalDetails(input: {
      add_contact: $ add_contact,
      add_email: $add_email,
      age: $age,
      blood: $blood,
      clientMutationId: $clientMutationId,
      contact: $contact,
      department: $department,
      dob: $dob,
      email: $email,
      emergencyContact1: $emergencyContact1,
      emergencyContact2: $emergencyContact2,
      emergencyName1: $emergencyName1,
      emergencyName2: $emergencyName2,
      emergencyRelation1: $emergencyRelation1,
      emergencyRelation2: $emergencyRelation2,
      employeeID: $employeeID,
      gender: $gender,
      marital: $marital,
      name: $name
    }) {
      responseMessage
    }
  }
`;



export const INSERT_OR_UPDATE_EMPLOYEE_ADDRESS = gql`
  mutation MyMutation(
    $clientMutationId: String,
    $employeeID: String,
    $paddress1: String,
    $paddress2: String,
    $pcity: String,
    $pcountry: String,
    $ppin: String,
    $pstate: String,
    $taddress1: String,
    $taddress2: String,
    $tcity: String,
    $tcountry: String,
    $tpin: String,
    $tstate: String
  ) {
    employeeinsertintoOrUpdateAddress(input: {
      clientMutationId: $clientMutationId,
      employeeID: $employeeID,
      paddress1: $paddress1,
      paddress2: $paddress2,
      pcity: $pcity,
      pcountry: $pcountry,
      ppin: $ppin,
      pstate: $pstate,
      taddress1: $taddress1,
      taddress2: $taddress2,
      tcity: $tcity,
      tcountry: $tcountry,
      tpin: $tpin,
      tstate: $tstate
    }) {
      clientMutationId
      responseMessage
    }
  }
`;

export const EMPLOYEE_QUALIFICATION_INSERT = gql`
  mutation EmployeeQualificationInsert(
    $clientMutationId: String,
    $employeeID: String,
    $institutename: String,
    $percentage: String,
    $qualification: String,
    $university: String,
    $yop: String
  ) {
    employeeQualificationInsert(input: {
      clientMutationId: $clientMutationId,
      employeeID: $employeeID,
      institutename: $institutename,
      percentage: $percentage,
      qualification: $qualification,
      university: $university,
      yop: $yop
    }) {
      clientMutationId
      responseMessage
    }
  }
`;


export const EMPLOYEE_FAMILY_UPDATE = gql`
  mutation EmployeeFamilyUpdate(
    $clientMutationId: String,
    $employeeID: String,
    $name: String,
    $age: String,
    $relation: String,
    $occupation: String,
    $contact: String
  ) {
    employeeFamilyUpdate(input: {
      clientMutationId: $clientMutationId,
      employeeID: $employeeID,
      name: $name,
      age: $age,
      relation: $relation,
      occupation: $occupation,
      contact: $contact
    }) {
      clientMutationId
      responseMessage
    }
  }
`;



export const EMPLOYEE_HISTORY_INSERT = gql`
  mutation MyMutation(
    $clientMutationId: String!,
    $companyname: String!,
    $designation: String!,
    $employeeID: String!,
    $lastsalary: String!,
    $location: String!,
    $periodfrom: String!,
    $periodto: String!,
    $reasonofleave: String!,
    $referencepersoncontact: String!,
    $referencepersonname: String!
  ) {
    employeeHistoryInsert(input: {
      clientMutationId: $clientMutationId,
      companyname: $companyname,
      designation: $designation,
      employeeID: $employeeID,
      lastsalary: $lastsalary,
      location: $location,
      periodfrom: $periodfrom,
      periodto: $periodto,
      reasonofleave: $reasonofleave,
      referencepersoncontact: $referencepersoncontact,
      referencepersonname: $referencepersonname
    }) {
      clientMutationId
      responseMessage
    }
  }
`;

export const EMPLOYEE_INSERT_OR_UPDATE_EXTRA_DETAILS = gql`
  mutation MyMutation(
    $clientMutationId: String!,
    $aadhar: String!,
    $drivingLicense: String!,
    $drivingLicenseExpiry: String!,
    $employeeID: String!,
    $pan: String!
  ) {
    employeeInsertOrUpdateExtraDetails(input: {
      clientMutationId: $clientMutationId,
      aadhar: $aadhar,
      drivingLicense: $drivingLicense,
      drivingLicenseExpiry: $drivingLicenseExpiry,
      employeeID: $employeeID,
      pan: $pan
    }) {
      clientMutationId
      responseMessage
    }
  }
`;


export const UPDATE_EMPLOYEE_DOCUMENT = gql`
  mutation UpdateEmployeeDocument(
    $employeeID: String!,
    $aadhar_card: String,
    $bank_passbook: String,
    $driving_license: String,
    $experience_certificate: String,
    $local_address_proof: String,
    $medical_certificate: String,
    $offer_letter: String,
    $pan_card: String,
    $pay_slip: String,
    $photograph: String,
    $training_certificate: String,
    $transfer_certificate: String,
    $ug_pg_diploma: String,
    $xii_marksheet: String,
    $xth_marksheet: String,
    $clientMutationId: String
  ) {
    employeeUpdateDocuments(input: {
      employeeID: $employeeID,
      aadhar_card: $aadhar_card,
      bank_passbook: $bank_passbook,
      driving_license: $driving_license,
      experience_certificate: $experience_certificate,
      local_address_proof: $local_address_proof,
      medical_certificate: $medical_certificate,
      offer_letter: $offer_letter,
      pan_card: $pan_card,
      pay_slip: $pay_slip,
      photograph: $photograph,
      training_certificate: $training_certificate,
      transfer_certificate: $transfer_certificate,
      ug_pg_diploma: $ug_pg_diploma,
      xii_marksheet: $xii_marksheet,
      xth_marksheet: $xth_marksheet,
      clientMutationId: $clientMutationId
    }) {
      clientMutationId
      responseMessage
    }
  }
`;



export const EMPLOYEE_SKILL_UPDATE = gql`
  mutation MyMutation(
    $clientMutationId: String!,
    $employeeID: String!,
    $skillname: String!,
    $experience: String!,
    $certificate: String!
  ) {
    employeeSkillUpdate(input: {
      clientMutationId: $clientMutationId,
      employeeID: $employeeID,
      skillname: $skillname,
      experience: $experience,
      certificate: $certificate
    }) {
      clientMutationId
      responseMessage
    }
  }
`;

export const EMPLOYEE_LANGUAGE_UPDATE = gql`
  mutation MyMutation(
    $clientMutationId: String!,
    $employeeID: String!,
    $languageName: String!,
    $proficiency: String!
  ) {
    employeeLanguageUpdate(input: {
      clientMutationId: $clientMutationId,
      employeeID: $employeeID,
      languageName: $languageName,
      proficiency: $proficiency
    }) {
      clientMutationId
      responseMessage
    }
  }
`;


export const EMPLOYEE_WORK_STATUS_UPDATE = gql`
  mutation UpdateEmployeeWorkStatus(
    $clientMutationId: String!,
    $id: String!,
    $status: String!,
    $dateOfCompletion: String!
  ) {
    employeeUpdateWorkStatus(input: {
      clientMutationId: $clientMutationId,
      id: $id,
      status: $status,
      dateOfCompletion: $dateOfCompletion
    }) {
      clientMutationId
      responseMessage
    }
  }
`;


export const EMPLOYEE_DAILY_ACTIVITY_INSERT = gql`
  mutation InsertEmployeeDailyActivity(
    $clientMutationId: String!,
    $employeeID: String!,
    $workDetails: String!,
    $submissionDate: String!
  ) {
    employeeInsertDailyActivity(input: {
      clientMutationId: $clientMutationId,
      employeeID: $employeeID,
      workDetails: $workDetails,
      submissionDate: $submissionDate
    }) {
      clientMutationId
      responseMessage
    }
  }
`;
