import { useEffect, useState } from "react";
import heroImage from "../assets/images/Hero-image.png";
import logo from "../assets/images/logo.png";
const Careers = () => {
  //const { user } = useAuth();
  //if (!user) return <Navigate to="/login" replace />;

  const [expandedCard, setExpandedCard] = useState(null);

  const toggleDetails = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const jobs = [
    {
      title: "UI/UX Designer",
      description:
        "Create intuitive and visually appealing user experiences with a strong focus on usability.",
      details:
        "You'll work closely with the product team to create user-centric features and maintain design consistency across all platforms.",
      emoji: "🎨",
      requirements: [
        "2+ years of experience in UI/UX design.",
        "Strong knowledge of Figma/Adobe XD or similar tools.",
        "Understanding of design principles and accessibility.",
      ],
      badge: "Design",
    },
    {
      title: "Frontend Developer",
      description:
        "Engage with potential clients, promote services, and contribute to revenue growth.",
      details:
        "Design and develop responsive, user-friendly web interfaces using modern frameworks.",
      emoji: "💻",
      requirements: [
        "Proficiency in React / Angular / Vue.",
        "Strong HTML5, CSS3, and JavaScript (ES6+) skills.",
        "Familiarity with Tailwind CSS or other UI frameworks.",
        "Experience with state management (Redux, Context API, etc.).",
      ],
      badge: "Development",
    },
    {
      title: "Backend Developer",
      description:
        "Build and maintain scalable, secure, and efficient server-side applications and APIs.",
      details:
        "Must have proficiency in Adobe Creative Suite, and a keen eye for color, typography, and layout.",
      emoji: "⚙️",
      requirements: [
        "Strong knowledge of Node.js / Python / Java / Go.",
        "Hands-on experience with SQL and NoSQL databases.",
        "Experience with RESTful and GraphQL APIs.",
        "Familiarity with cloud platforms (AWS, GCP, or Azure).",
      ],
      badge: "Development",
    },
    {
      title: "Human Resource",
      description:
        "Manage recruitment, employee relations, and foster a positive workplace culture.",
      details:
        "You'll work closely with the product team to create user-centric features and maintain design consistency across all platforms.",
      emoji: "💻",
      requirements: [
        " Experience in HR operations or talent management.",
        "Strong interpersonal and organizational skills.",
        "Knowledge of labor laws and HR policies.",
        "Proficiency in HR software and tools.",
      ],
      badge: "Development",
    },
    {
      title: "DevOps Engineer",
      description:
        "Engage with potential clients, promote services, and contribute to revenue growth.",
      details:
        "Automate deployments, manage cloud infrastructure, and ensure reliable CI/CD pipelines.",
      emoji: "🔧",
      requirements: [
        "Proficiency with Docker and Kubernetes.",
        "Experience with CI/CD tools (Jenkins, GitHub Actions, GitLab CI).",
        "Strong knowledge of Linux and shell scripting.",
        "Familiarity with cloud services (AWS/GCP/Azure).",
      ],
      badge: "Operations",
    },
    {
      title: "Project Manager",
      description:
        "Create compelling visual assets for print and digital media that align with our brand.",
      details:
        "Lead projects by coordinating teams, managing timelines, and ensuring deliverables.",
      emoji: "📊",
      requirements: [
        "Experience with Agile/Scrum project management.",
        "Proficiency in tools like Jira, Trello, or Asana.",
        "Strong leadership and communication skills.",
        "Ability to manage timelines and budgets.",
      ],
      badge: "Management",
    },
    {
      title: "QA/Tester",
      description:
        "Ensure product quality through test planning, execution, and defect reporting.",
      details:
        "You'll work closely with the product team to create user-centric features and maintain design consistency across all platforms.",
      emoji: "🔍",
      requirements: [
        " Knowledge of testing frameworks (Selenium, Jest, Cypress).",
        "Familiarity with bug tracking tools (Jira, Trello).",
        "Understanding of SDLC and Agile methodologies.",
        "Strong analytical and attention-to-detail skills.",
      ],
      badge: "Quality",
    },
    {
      title: "Software Developer",
      description:
        "Develop, test, and maintain software solutions aligned with business requirements.",
      details:
        "This role requires strategic thinking, market research, and outreach efforts to boost brand visibility.",
      emoji: "💻",
      requirements: [
        "Strong skills in at least one backend and one frontend framework.",
        "Proficiency in Git and collaborative development workflows.",
        "Knowledge of software architecture patterns (MVC, microservices).",
        "Problem-solving and debugging skills.",
      ],
      badge: "Development",
    },
    {
      title: "Operations Intern",
      description:
        "Support daily operations, documentation, and coordination to streamline workflows.",
      details:
        "Must have proficiency in Adobe Creative Suite, and a keen eye for color, typography, and layout.",
      emoji: "🎓",
      requirements: [
        "Currently pursuing a Bachelor’s degree (Business/Management/Engineering preferred).",
        "Strong organizational and multitasking skills.",
        "Basic knowledge of MS Office/Google Workspace.",
        "Good communication and problem-solving abilities.",
        "Eagerness to learn and adapt in a fast-paced environment.",
      ],
      badge: "Intern",
    },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="p-5 min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-purple-200">
      {/* Header Section */}
      <div className="bg-white border-2 border-blue-400 rounded-lg mx-4 mt-8 p-8 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Join Our Team At
            </h1>
            <h2 className="text-6xl font-bold text-pink-600 mb-4">Printzet</h2>
            <p className="text-gray-600 mb-6 max-w-md">
              Join our fast-growing company and be part of our revolutionary
              journey in transforming the digital landscape.
            </p>
            <button
              className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition duration-200"
              onClick={(e) => {
                document
                  .getElementById("job")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Apply Today
            </button>

            {/* Features List */}
            <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  WORKING ENVIRONMENT
                </h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Remote-first culture</li>
                  <li>• Flexible working hours</li>
                  <li>• Modern office spaces</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  CAREER GROWTH
                </h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Learning opportunities</li>
                  <li>• Mentorship programs</li>
                  <li>• Skill development</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">PERKS</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Health insurance</li>
                  <li>• Competitive salary</li>
                  <li>• Team building events</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  WORK-LIFE BALANCE
                </h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Paid time off</li>
                  <li>• Mental health support</li>
                  <li>• Family-friendly policies</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side Content */}
          <div className="flex-1 pl-8 mt-52">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Your Life At Printzet
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                At Printzet, we believe in empowering our team members to
                achieve their full potential. We offer a dynamic work
                environment where innovation thrives, collaboration is key, and
                every voice matters.
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Join us in building the future of digital solutions while
                enjoying competitive benefits, professional growth
                opportunities, and a culture that celebrates diversity and
                creativity.
              </p>
              <p className="text-sm text-gray-600">
                Whether you're a seasoned professional or just starting your
                career, we have opportunities that will challenge and inspire
                you to do your best work.
              </p>
            </div>
          </div>

          {/* Illustration */}
          <div className="absolute top-6 right-10">
            <div className="w-[300px] h-[200px] bg-gradient-to-br from-blue-400 to-purple-500  items-center justify-center flex">
              <img src={heroImage} alt="Hero Illustration" className="" />
            </div>
          </div>
        </div>
      </div>

      {/* Job Openings Section */}
      <div className="mt-12 mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Job Openings</h2>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            className="bg-pink-600 text-white px-4 py-2 rounded-full text-sm"
            onClick={() => {
              document
                .getElementById("job")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Remote
          </button>
          <button
            className="bg-pink-600 text-white px-4 py-2 rounded-full text-sm"
            onClick={() => {
              document
                .getElementById("job")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Full-time
          </button>
        </div>

        {/* Job Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" id="job">
          {jobs.map((job, index) => {
            const isExpanded = expandedCard === index;

            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-all duration-300"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {job.title}
                    </h3>
                    <span className="text-2xl">{job.emoji}</span>
                  </div>

                  <span className="bg-pink-600 text-white px-3 py-1 rounded-full text-xs mb-3 inline-block">
                    {job.badge}
                  </span>

                  <p className="text-gray-600 text-sm mb-4">
                    {job.description}
                  </p>

                  {/* Expandable Details */}
                  <div
                    className={`transition-all duration-300 overflow-hidden text-sm text-gray-600 ${
                      isExpanded ? "max-h-40 mb-4" : "max-h-0"
                    }`}
                  >
                    <p className="mb-2">{job.details}</p>
                    <ul className="list-disc list-inside space-y-1">
                      {job.requirements?.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center justify-between">
                    <a
                      href={`mailto:career@printzet.com?subject=Application for ${encodeURIComponent(
                        job.title
                      )}`}
                      className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition duration-200 text-sm"
                    >
                      Apply Now
                    </a>
                    <button
                      onClick={() => toggleDetails(index)}
                      className="text-sm text-pink-600 hover:underline"
                    >
                      {isExpanded ? "Hide Details" : "View Details"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-16 mx-4 w-full-screen pb-2">
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg p-8 text-white">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">20+</div>
              <div className="text-pink-100">Team Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">30+</div>
              <div className="text-pink-100">Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">1000+</div>
              <div className="text-pink-100">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recruitment Process Section */}
      <div className="mt-16 mx-4">
        <h2 className="text-4xl font-bold text-gray-800 mb-2 text-center">
          Learn Our Recruitment <span className="text-pink-600">Process</span>
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-pink-600 font-bold">1</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Resume Submission
            </h3>
            <p className="text-gray-600 text-sm">
              Submit your resume and cover letter through our career portal or
              email.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold">2</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Phone Screening
            </h3>
            <p className="text-gray-600 text-sm">
              Initial phone interview to discuss your background and interest in
              the role.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 font-bold">3</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Skill Assessment
            </h3>
            <p className="text-gray-600 text-sm">
              Technical assessment or portfolio review based on the role
              requirements.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 font-bold">4</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Final Interview
            </h3>
            <p className="text-gray-600 text-sm">
              Meet with team leads and discuss culture fit and career goals.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Logo */}
      <div className="mt-16 text-center pb-8">
        <div className="inline-block">
          <div className="flex items-center gap-2 w-[180px] h-auto">
            <img src={logo} />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            © 2025 Printzet. All rights Reserved.
            <br />
            <span className="font-medium">Connect with Us.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Careers;
