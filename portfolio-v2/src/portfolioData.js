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

export const projects = [
  {
    title: "Dr. CNN",
    subtitle: "Lung condition detection",
    image: "images/Projects/DrCnn.jpg",
    description:
      "Python and TensorFlow web application with a data-processing, model-training, and real-time inference pipeline for classifying lung X-ray conditions.",
    impact: "Built scalable prediction-serving APIs with preprocessing, model integration, and inference reliability in mind.",
    tags: ["Python", "TensorFlow", "APIs", "ML", "Healthcare"],
    featured: true,
    links: [
      { label: "Source", href: "https://github.com/vikramsh2002/DrCNN" },
      { label: "Live app", href: "https://cvbn.azurewebsites.net/" },
    ],
  },
  {
    title: "VRL Shopping",
    subtitle: "Microservices shopping system",
    image: "images/Projects/shopping.png",
    description:
      "Online shopping system designed with Java Spring Boot services, MVC patterns, REST APIs, and MongoDB persistence.",
    impact: "Useful proof of backend service boundaries, API flow, and distributed application thinking.",
    tags: ["Java", "Spring Boot", "Microservices", "MongoDB"],
    featured: true,
    links: [{ label: "Source", href: "https://github.com/vikramsh2002/VRL-Shopping" }],
  },
  {
    title: "VRL Headlines",
    subtitle: "React news reader",
    image: "images/Projects/headlines.png",
    description:
      "React application that consumes a News API and renders current top headlines through a responsive interface.",
    impact: "Demonstrates frontend API consumption, state-driven UI, and responsive application delivery.",
    tags: ["React", "API", "Frontend"],
    featured: true,
    links: [{ label: "Source", href: "https://github.com/vikramsh2002/VRL-Headlines/tree/master" }],
  },
  {
    title: "VRL Novel Recommendation Engine",
    subtitle: "Book recommendation system",
    image: "images/Projects/Novel.png",
    description:
      "NLP-assisted recommendation application that combines trending books with collaborative rating analysis.",
    impact: "Shows applied recommendation concepts and data-driven product thinking.",
    tags: ["Python", "NLP", "Recommender", "Streamlit"],
    featured: true,
    links: [
      { label: "Live app", href: "https://vikramsh2002-vrl-novel-recommendation-engine.streamlit.app/" },
      { label: "Source", href: "https://github.com/vikramsh2002/VRL-Novel-Recommendation-Engine" },
    ],
  },
  {
    title: "VRL Human Pose Estimator",
    subtitle: "Computer vision pose classifier",
    image: "images/Projects/Human.png",
    description:
      "Computer vision application for classifying popular yoga poses from images, webcam streams, and videos.",
    impact: "Explores real-time inputs, pose estimation, and applied computer vision workflows.",
    tags: ["Python", "Computer Vision", "ML"],
    links: [
      {
        label: "Demo",
        href: "https://www.linkedin.com/posts/vikramsharma20_pythonisfun-ml-humanposeestimationandclassification-activity-6885170708142534656-IynA?utm_source=share&utm_medium=member_desktop",
      },
      { label: "Source", href: "https://github.com/vikramsh2002/VRL-Human-Pose-Estimation" },
    ],
  },
  {
    title: "VRL E-Learning Course Recommender",
    subtitle: "Course discovery assistant",
    image: "images/Projects/Course.png",
    description:
      "NLP-based recommender built on Coursera course data to help learners filter and discover courses.",
    impact: "Combines data preparation, text matching, and recommendation UX.",
    tags: ["Python", "NLP", "Recommender", "Streamlit"],
    links: [
      { label: "Live app", href: "https://vikramsh2002-vrl-e-learning-course-recommender-webdeploy-fwgv8b.streamlit.app/" },
      { label: "Source", href: "https://github.com/vikramsh2002/VRL-E-Learning-Course-Recommender" },
    ],
  },
  {
    title: "VRL Diamond Price Predictor",
    subtitle: "Regression pipeline",
    image: "images/Projects/Diamond.png",
    description:
      "Machine learning regression project that predicts diamond prices from quality and dimension features.",
    impact: "Covers preprocessing, model evaluation, and deployment-facing prediction flow.",
    tags: ["Python", "Regression", "ML", "Streamlit"],
    links: [
      { label: "Live app", href: "https://share.streamlit.io/vikramsh2002/diamond-price-predictor/VRLDiamondPricePredictor/Deployment/Deploy.py" },
      { label: "Source", href: "https://github.com/vikramsh2002/Diamond-Price-Predictor" },
    ],
  },
  {
    title: "VRL Crops Classifier",
    subtitle: "Crop recommendation model",
    image: "images/Projects/Crop.png",
    description:
      "Deep learning project using soil and climate features to classify the best crop from 22 crop categories.",
    impact: "Highlights applied agricultural ML, EDA, and model-building workflow.",
    tags: ["Python", "Deep Learning", "Data"],
    links: [{ label: "Source", href: "https://github.com/vikramsh2002/Crop-Classification" }],
  },
  {
    title: "VRL Movie Recommender System",
    subtitle: "Content-based recommendation",
    image: "images/Projects/Movie.png",
    description:
      "NLP-based movie recommendation app that suggests similar movies from previously watched content.",
    impact: "Shows text-processing, similarity modeling, and recommendation interface design.",
    tags: ["Python", "NLP", "Recommender"],
    links: [
      { label: "Live app", href: "https://share.streamlit.io/vikramsh2002/vrl_movie_recommender_system_webapp/WebsiteWebDeploy.py" },
      { label: "Source", href: "https://github.com/vikramsh2002/VRL_Movie_Recommender_System_WebApp" },
      {
        label: "Demo",
        href: "https://www.linkedin.com/posts/vikramsharma20_python-textmining-nlp-activity-6830195562508292096-uXFE?utm_source=share&utm_medium=member_desktop",
      },
    ],
  },
  {
    title: "IVA Message Security",
    subtitle: "Steganography and encryption",
    image: "images/Projects/IVA.png",
    description:
      "Python GUI application for hiding and encrypting data in images and files using layered custom encryption.",
    impact: "Demonstrates security-oriented thinking, file handling, and desktop application flow.",
    tags: ["Python", "Security", "GUI"],
    links: [{ label: "Source", href: "https://github.com/vikramsh2002/I.V.A-Message-Security" }],
  },
  {
    title: "AMS Alumni Management System",
    subtitle: "Static university website",
    image: "images/Projects/AMS.png",
    description:
      "Static website for alumni interaction, student information, profile pages, and an LPU virtual gallery.",
    impact: "Early project showing multi-page static site structure and GitHub Pages deployment.",
    tags: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    links: [
      { label: "Live site", href: "https://vikramsh2002.github.io/AMS/" },
      { label: "Source", href: "https://github.com/vikramsh2002/AMS/tree/master/docs" },
      { label: "Demo", href: "https://github.com/vikramsh2002/Video-of-AMS" },
    ],
  },
];

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
