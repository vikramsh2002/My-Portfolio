import projectsData from "./projects.json";

export const profile = {
  name: "Vikram Sharma",
  role: "Python Backend Engineer",
  location: "Bengaluru, India",
  email: "vikramsh2002@gmail.com",
  summary:
    "Software Development Engineer I with 2.5+ years of experience building Python backend systems, AWS serverless applications, REST APIs, and production integrations.",
  focus: ["Python backends", "AWS serverless", "REST APIs", "Production reliability"],
  socials: {
    github: "https://github.com/vikramsh2002",
    linkedin: "https://www.linkedin.com/in/vikramsharma20",
    medium: "https://medium.com/@vikramsh2002",
    hackerrank: "https://www.hackerrank.com/vikramsh2002",
  },
};

export const experience = [
  {
    company: "Philips",
    location: "Bengaluru",
    title: "Software Development Engineer I",
    dates: "Jul 2024 - Present",
    image: "images/Experience/sde_intern_philips.png",
    highlights: [
      "Designed and maintained Python-based serverless applications using AWS Lambda and DynamoDB.",
      "Built and supported REST APIs and third-party integrations for scalable service communication.",
      "Led root cause analysis for production issues and improved reliability through better validation and error handling.",
      "Refactored 10+ AWS Lambda functions and reduced technical debt across backend services.",
      "Enhanced CI/CD pipelines and resolved 20+ security vulnerabilities for safer deployments.",
    ],
  },
  {
    company: "Philips",
    location: "Bengaluru",
    title: "Software Development Engineer Intern",
    dates: "Aug 2023 - Jul 2024",
    image: "images/Experience/sde_intern_philips.png",
    highlights: [
      "Integrated REST APIs across distributed microservices.",
      "Migrated legacy frontend surfaces to React.js for better scalability and maintainability.",
      "Built Qlik Sense dashboards for real-time analytics and reporting.",
      "Collaborated in Agile teams across planning, reviews, implementation, and feature delivery.",
    ],
  },
  {
    company: "The Sparks Foundation",
    location: "Remote",
    title: "Data Science and Business Analytics Intern",
    dates: "Early career",
    image: "images/Experience/sparks.jfif",
    highlights: [
      "Applied and evaluated machine learning algorithms on analytical datasets.",
      "Performed comparative analysis and validation to improve model performance.",
    ],
  },
];

export const skillGroups = [
  {
    title: "Backend",
    skills: ["Python", "REST APIs", "Microservices", "API design", "System integration"],
  },
  {
    title: "Cloud and DevOps",
    skills: ["AWS Lambda", "DynamoDB", "S3", "CloudWatch", "CI/CD", "SonarQube"],
  },
  {
    title: "Testing",
    skills: ["Pytest", "Moto", "Tox", "Validation", "Error handling"],
  },
  {
    title: "Data and ML",
    skills: ["TensorFlow", "NLP", "Computer vision", "Data pipelines", "Model inference"],
  },
  {
    title: "Frontend",
    skills: ["React.js", "TypeScript", "HTML", "CSS", "Responsive UI"],
  },
  {
    title: "Databases",
    skills: ["DynamoDB", "GraphDB", "MySQL", "OracleDB", "MongoDB"],
  },
];

export const projects = projectsData;

export const publications = [
  {
    title: "Hybrid Approaches for Stocks Price Prediction: A New Institutive Way of Neural Architecture Design",
    venue: "IEEE",
    date: "November 2024",
    image: "images/Publication/ieee.png",
    href: "https://ieeexplore.ieee.org/document/10739249",
  },
  {
    title: "Hybrid Approaches for Stocks Prediction and Recommendation System",
    venue: "E3S Web of Conferences",
    date: "November 2023",
    image: "images/Publication/edp.png",
    href: "https://www.e3s-conferences.org/articles/e3sconf/abs/2023/90/e3sconf_icsdg2023_01047/e3sconf_icsdg2023_01047.html",
  },
  {
    title: "A Review on Classification of Covid-19 and Pneumonia Disease Using Machine Learning",
    venue: "Routledge book chapter",
    date: "October 2023",
    image: "images/Publication/routledge.png",
    href: "https://www.routledge.com/Computer-Science-Engineering-and-Emerging-Technologies-Proceedings-of-ICCS/Sobti-Garg/p/book/9781032521992",
  },
];

export const certifications = [
  "Research Paper Presentation at ICEECT 2024",
  "Java Full Stack Training",
  "Machine Learning Advanced Certification Training",
  "Review Paper Presentation at ICCS 2022",
  "Python 3 Specialization",
  "Object Oriented Programming with Java",
  "Python-101 for Data Science by IBM",
  "Data Analysis with Python by IBM",
  "Crash Course on Python by Google",
  "Data Manipulation with SQL",
  "Machine Learning for All",
  "Object Oriented Data Structures with C++",
  "Introduction to Sustainability",
];

export const education = {
  school: "Lovely Professional University",
  degree: "Integrated B.Tech and M.Tech, Computer Science",
  dates: "Aug 2019 - Jun 2024",
  detail: "CGPA: 8.56, Academic Topper Award",
};
