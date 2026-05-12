import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper function to add standard header
const addHeader = (doc, title) => {
  doc.setFontSize(22);
  doc.setTextColor(33, 37, 41);
  doc.text('Hostel Management System', 14, 20);
  
  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100);
  doc.text(title, 14, 30);
  
  doc.setLineWidth(0.5);
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 35, 196, 35);
};

// Helper function to add standard footer
const addFooter = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 285);
    doc.text(`Page ${i} of ${pageCount}`, 180, 285);
  }
};

export const generateLeaveReceiptPDF = (leave) => {
  const doc = new jsPDF();
  addHeader(doc, 'Leave Request Receipt');

  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);

  const data = [
    ['Reference ID', leave._id],
    ['Student Name', leave.student?.name || 'N/A'],
    ['Status', leave.status],
    ['Destination', leave.destination || 'N/A'],
    ['From Date', new Date(leave.fromDate).toLocaleDateString()],
    ['To Date', new Date(leave.toDate).toLocaleDateString()],
    ['Reason', leave.reason],
    ['Admin Comment', leave.adminComment || 'None'],
    ['Applied On', new Date(leave.createdAt).toLocaleString()]
  ];

  autoTable(doc, {
    startY: 45,
    body: data,
    theme: 'striped',
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 130 }
    }
  });

  addFooter(doc);
  doc.save(`Leave_Receipt_${leave._id}.pdf`);
};

export const generateComplaintReportPDF = (complaint) => {
  const doc = new jsPDF();
  addHeader(doc, 'Complaint Report');

  const data = [
    ['Complaint ID', complaint._id],
    ['Category', complaint.type],
    ['Title', complaint.title],
    ['Status', complaint.status],
    ['Submitted On', new Date(complaint.createdAt).toLocaleString()],
    ['Description', complaint.description],
    ['Admin Response', complaint.adminResponse || 'Pending response']
  ];

  autoTable(doc, {
    startY: 45,
    body: data,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 140 }
    }
  });

  addFooter(doc);
  doc.save(`Complaint_Report_${complaint._id}.pdf`);
};

export const generateRoomOccupancyReportPDF = (rooms) => {
  const doc = new jsPDF();
  addHeader(doc, 'Room Occupancy Report');

  const tableData = rooms.map(room => [
    room.roomNumber,
    room.block,
    room.type,
    `${room.occupiedBeds} / ${room.capacity}`,
    room.status
  ]);

  autoTable(doc, {
    startY: 45,
    head: [['Room No.', 'Block', 'Type', 'Occupancy', 'Status']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [39, 174, 96] }
  });

  addFooter(doc);
  doc.save(`Room_Occupancy_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateDashboardSummaryPDF = (statsData) => {
  const doc = new jsPDF();
  addHeader(doc, 'Admin Dashboard Summary Report');

  const data = [
    ['Total Registered Students', statsData.totalStudents],
    ['Total Hostel Rooms', statsData.totalRooms],
    ['Occupied Rooms', statsData.occupiedRooms],
    ['Pending Maintenance Complaints', statsData.pendingComplaints],
    ['Pending Leave Requests', statsData.leaveRequests],
  ];

  autoTable(doc, {
    startY: 45,
    body: data,
    theme: 'plain',
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 100 },
      1: { cellWidth: 80 }
    }
  });

  addFooter(doc);
  doc.save(`Dashboard_Summary_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateStudentProfileReportPDF = (student, stats) => {
  const doc = new jsPDF();
  addHeader(doc, 'Student Profile Report');

  const data = [
    ['Name', student.name],
    ['Email', student.email],
    ['Phone', student.phone || 'N/A'],
    ['Course', student.course || 'N/A'],
    ['Year', student.year || 'N/A'],
    ['Room Allocation', student.roomId ? 'Allocated' : 'Not Allocated'],
    ['Active Leaves', stats?.activeLeaves || 0],
    ['Open Complaints', stats?.openComplaints || 0],
    ['Joined On', new Date(student.createdAt).toLocaleDateString()]
  ];

  autoTable(doc, {
    startY: 45,
    body: data,
    theme: 'striped',
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 130 }
    }
  });

  addFooter(doc);
  doc.save(`Student_Profile_${student.name.replace(/\s+/g, '_')}.pdf`);
};

export const generateAllStudentsReportPDF = (students) => {
  const doc = new jsPDF();
  addHeader(doc, 'Complete Student Roster');

  const tableData = students.map(student => [
    student.name,
    student.email,
    student.course || '-',
    student.phone || '-',
    student.roomId?.roomNumber || 'Not Assigned'
  ]);

  autoTable(doc, {
    startY: 45,
    head: [['Name', 'Email', 'Course', 'Phone', 'Room']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [52, 152, 219] }
  });

  addFooter(doc);
  doc.save(`Student_Roster_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateAllComplaintsReportPDF = (complaints) => {
  const doc = new jsPDF();
  addHeader(doc, 'Complete Complaints Report');

  const tableData = complaints.map(c => [
    c.title.substring(0, 20) + '...',
    c.type,
    c.student?.name || 'Unknown',
    c.status,
    new Date(c.createdAt).toLocaleDateString()
  ]);

  autoTable(doc, {
    startY: 45,
    head: [['Title', 'Category', 'Student', 'Status', 'Date']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [155, 89, 182] }
  });

  addFooter(doc);
  doc.save(`Complaints_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateAllLeavesReportPDF = (leaves) => {
  const doc = new jsPDF();
  addHeader(doc, 'Complete Leave Requests Report');

  const tableData = leaves.map(l => [
    l.student?.name || 'Unknown',
    l.destination || '-',
    new Date(l.fromDate).toLocaleDateString(),
    new Date(l.toDate).toLocaleDateString(),
    l.status
  ]);

  autoTable(doc, {
    startY: 45,
    head: [['Student', 'Destination', 'From', 'To', 'Status']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [230, 126, 34] }
  });

  addFooter(doc);
  doc.save(`Leaves_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};
