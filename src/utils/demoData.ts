
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
        content: "Hello Dr. Johnson, I have a question about my medication.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        attachments: [],
        metadata: {
          title: "Medication Question"
        }
      },
      {
        id: "msg2",
        sender: "provider",
        content: "Hi Maria, what would you like to know about your medication?",
        timestamp: new Date(),
        metadata: {
          title: "Medication Inquiry"
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
        content: "I attached my lab results from last week.",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        attachments: [
          {
            id: "att1",
            name: "Lab_Results.pdf",
            type: "application/pdf",
            size: 1240000
          }
        ],
        metadata: {
          title: "Lab Results"
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
