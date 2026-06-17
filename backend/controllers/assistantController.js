exports.chatWithAssistant = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required' });

    // Simple rule-based assistant for college queries
    const msg = message.toLowerCase();
    let reply = '';

    if (msg.includes('admission') || msg.includes('apply')) {
      reply = 'To apply for admission, visit our Admissions page and fill out the application form. We offer courses in various disciplines. Would you like more details about a specific course?';
    } else if (msg.includes('course') || msg.includes('program')) {
      reply = 'We offer a wide range of undergraduate and postgraduate programs. Please visit our Courses page for the complete list with fees and duration details.';
    } else if (msg.includes('fee') || msg.includes('fees') || msg.includes('cost')) {
      reply = 'Fees vary by course. You can check the detailed fee structure on our Courses page or contact us directly for fee-related queries.';
    } else if (msg.includes('placement') || msg.includes('job') || msg.includes('career')) {
      reply = 'Our placement cell has an excellent track record with 95%+ placement rate. Top companies like TCS, Infosys, Wipro, and many more recruit from our campus.';
    } else if (msg.includes('result') || msg.includes('marks') || msg.includes('grade')) {
      reply = 'You can check your results on our Results page by entering your roll number. Results are updated within 2 weeks of exam completion.';
    } else if (msg.includes('contact') || msg.includes('address') || msg.includes('phone')) {
      reply = 'You can reach us via the Contact page. Our office is open Monday–Saturday, 9 AM to 5 PM.';
    } else if (msg.includes('hostel') || msg.includes('accommodation')) {
      reply = 'We provide hostel facilities for both boys and girls. Please contact the admissions office for hostel availability and fees.';
    } else if (msg.includes('scholarship') || msg.includes('financial')) {
      reply = 'We offer merit-based and need-based scholarships. Please contact the financial aid office or visit the admissions office for details.';
    } else if (msg.includes('faculty') || msg.includes('teacher') || msg.includes('professor')) {
      reply = 'Our faculty consists of highly qualified and experienced professors. You can view faculty profiles on our Faculty page.';
    } else if (msg.includes('library') || msg.includes('books')) {
      reply = 'Our library has over 50,000 books and provides access to digital resources. It is open 8 AM to 8 PM on weekdays.';
    } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      reply = 'Hello! Welcome to Zorvex Institute. I am here to help you with any queries about admissions, courses, placements, and more. How can I assist you today?';
    } else {
      reply = 'Thank you for your query. For specific information, please visit the relevant section on our website or contact us directly through the Contact page. Our team will be happy to assist you.';
    }

    res.json({ success: true, data: { reply } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
