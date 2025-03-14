
// Demo data for conversations in the chat feature
export const DEMO_CONVERSATIONS = [
  {
    id: "1",
    patientId: "maria-garcia",
    patientName: "Maria Garcia",
    lastUpdated: new Date(),
    unread: true,
    messages: [
      {
        id: "msg1",
        sender: "patient",
        content: "Hello Dr. Johnson, I've attached my recent lab results for your review.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        attachments: [
          {
            id: "att1",
            name: "Blood Test Results.pdf",
            type: "application/pdf",
            size: 1240000,
            preview: "Hemoglobin: 13.2 g/dL (Normal)\nWhite Blood Cells: 7,500/μL (Normal)\nPlatelets: 250,000/μL (Normal)\nGlucose: 95 mg/dL (Normal)"
          }
        ],
        metadata: {
          title: "Lab Results"
        }
      },
      {
        id: "msg2",
        sender: "provider",
        content: "Thank you for sending these over. Your hemoglobin, white blood cell count, and other values look normal. We should continue monitoring your glucose levels, but I don't see any immediate concerns.",
        timestamp: new Date(),
        metadata: {
          title: "Results Review"
        },
        attachments: []
      }
    ]
  },
  {
    id: "2",
    patientId: "james-wilson",
    patientName: "James Wilson",
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    unread: false,
    messages: [
      {
        id: "msg3",
        sender: "patient",
        content: "Dr. Johnson, my appointment is tomorrow at 2pm, correct?",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        attachments: [],
        metadata: {
          title: "Appointment Question"
        }
      },
      {
        id: "msg4",
        sender: "provider",
        content: "Yes, James. We have you scheduled for tomorrow at 2pm. Please arrive 15 minutes early to complete paperwork.",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        metadata: {
          title: "Appointment Confirmation"
        },
        attachments: []
      }
    ]
  },
  {
    id: "3",
    patientId: "sophia-rodriguez",
    patientName: "Sophia Rodriguez",
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    unread: true,
    messages: [
      {
        id: "msg5",
        sender: "patient",
        content: "I attached my prescription and have a question about the dosage.",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        attachments: [
          {
            id: "att2",
            name: "Prescription.pdf",
            type: "application/pdf",
            size: 840000,
            preview: "Medication: Amoxicillin\nDosage: 500mg\nFrequency: 3 times daily\nDuration: 7 days\nNotes: Take with food"
          }
        ],
        metadata: {
          title: "Prescription Question"
        }
      }
    ]
  }
];

// Demo data for patient appointments
export const DEMO_APPOINTMENTS = [
  {
    id: "apt1",
    patientId: "maria-garcia",
    patientName: "Maria Garcia",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    time: "10:00 AM",
    type: "Follow-up",
    status: "confirmed"
  },
  {
    id: "apt2",
    patientId: "james-wilson",
    patientName: "James Wilson",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    time: "2:30 PM",
    type: "Initial Visit",
    status: "confirmed"
  }
];
