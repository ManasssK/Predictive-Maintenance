<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI Kavach - Predictive Maintenance System</title>
</head>

<body>

<h1>AI Kavach: Predictive Maintenance for Industrial Equipment using Machine Learning</h1>

<h2>Project Overview</h2>
<p>
AI Kavach is an intelligent predictive maintenance platform designed to forecast failures in industrial equipment using machine learning. 
The system analyzes multivariate sensor data to estimate the Remaining Useful Life (RUL) of machines, allowing organizations to schedule maintenance proactively and significantly reduce unexpected downtime.
</p>

<p>
This project was developed during the <strong>IEEE CS SPIT AERAVAT 1.0 AI Hackathon</strong>, where it secured 
<strong>1st Prize in the Machine Learning domain</strong>.
</p>

<hr>

<h2>Problem Statement</h2>
<p>
Industrial machines generate large volumes of sensor data, yet most maintenance is still performed either reactively (after failure) or periodically. 
This often leads to unplanned downtime, increased operational costs, and reduced equipment lifespan.
</p>

<p>
The goal of this project is to develop a <strong>machine learning-based predictive maintenance system</strong> capable of identifying potential equipment failures before they occur.
</p>

<hr>

<h2>Objectives</h2>
<ul>
<li>Develop a machine learning model to predict equipment failure and Remaining Useful Life (RUL).</li>
<li>Enable proactive maintenance scheduling using predictive insights.</li>
<li>Build an interactive web platform for real-time monitoring and visualization.</li>
</ul>

<hr>

<h2>Dataset</h2>
<p>
The project utilizes the <strong>NASA CMAPSS Jet Engine Simulated Dataset</strong>, which contains multivariate time-series sensor data collected from a fleet of simulated jet engines.
</p>

<p>
Each engine dataset includes multiple operational cycles and sensor readings, enabling predictive modeling of equipment degradation and failure.
</p>

<hr>

<h2>Data Preprocessing</h2>
<ul>
<li>Feature selection and dimensionality reduction</li>
<li>Handling missing and inconsistent values</li>
<li>Normalization using <strong>Min-Max Scaling</strong></li>
<li>Preparation of time-series data for RUL prediction</li>
</ul>

<hr>

<h2>Machine Learning Models</h2>
<p>
Multiple regression-based machine learning models were trained and evaluated to predict the Remaining Useful Life (RUL) of equipment:
</p>

<ul>
<li><strong>XGBoost Regressor</strong></li>
<li><strong>Random Forest Regressor</strong></li>
<li><strong>Decision Tree Regressor</strong></li>
</ul>

<hr>

<h2>Model Performance</h2>
<p>
Among the evaluated models, <strong>XGBoost achieved the highest performance</strong> with an 
<strong>R² score of 0.65</strong>, demonstrating strong predictive capability for equipment failure forecasting.
</p>

<hr>

<h2>Interactive Web Application</h2>

<p>
A full-stack web platform was developed to make predictive maintenance insights accessible through an interactive dashboard.
</p>

<ul>
<li>User authentication and role-based access control</li>
<li>Real-time sensor data visualization</li>
<li>Remaining Useful Life (RUL) prediction dashboard</li>
<li>Predictive alerting via browser notifications and Telegram</li>
<li>Maintenance scheduling using a personalized calendar</li>
<li>Static analytics charts and operational dashboards</li>
<li>Feedback and reporting module</li>
</ul>

<hr>

<h2>Technology Stack</h2>

<ul>
<li><strong>Frontend:</strong> React.js, React Chart.js</li>
<li><strong>Backend:</strong> Flask, Node.js</li>
<li><strong>Database:</strong> MongoDB</li>
<li><strong>Machine Learning:</strong> XGBoost, Random Forest, Decision Tree</li>
<li><strong>Notification System:</strong> Telegram API</li>
</ul>

<hr>

<h2>Conclusion</h2>

<ul>
<li>The predictive maintenance system successfully forecasts potential equipment failures using machine learning.</li>
<li>XGBoost demonstrated the strongest predictive capability among tested models.</li>
<li>The interactive dashboard enables real-time monitoring, predictive alerts, and proactive maintenance scheduling.</li>
<li>The system provides a scalable foundation for industrial predictive maintenance solutions.</li>
</ul>

<hr>

<h2>Contributors</h2>

<ul>
<li><strong>J Manasa Krishna</strong></li>
<li><strong>Praneeth Reddy</strong></li>
</ul>

<p>
For implementation details, datasets, and source code, please refer to the respective folders in the repository.
</p>

</body>
</html>
