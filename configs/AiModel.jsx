const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const CodeGenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [],
});

export const GenAiCode = model.startChat({
  generationConfig: CodeGenerationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: 'generate a todo app :Generate a Project in React. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, \nwithout any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from "lucide-react" and use it in JSX as <Heart className="" />.\nalso you can use date-fns for date format and react-chartjs-2 chart, graph library\n\nReturn the response in JSON format with the following schema:\n{\n  "projectTitle": "",\n  "explanation": "",\n  "files": {\n    "/App.js": {\n      "code": ""\n    },\n    ...\n  },\n  "generatedFiles": []\n}\n\nHere’s the reformatted and improved version of your prompt:\n\nGenerate a programming code structure for a React project using Vite. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, without any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from "lucide-react" and use it in JSX as <Heart className="" />.\n\nReturn the response in JSON format with the following schema:\n\njson\nCopy code\n{\n  "projectTitle": "",\n  "explanation": "",\n  "files": {\n    "/App.js": {\n      "code": ""\n    },\n    ...\n  },\n  "generatedFiles": []\n}\nEnsure the files field contains all created files, and the generatedFiles field lists all the filenames. Each file\'s code should be included in the code field, following this example:\nfiles:{\n  "/App.js": {\n    "code": "import React from \'react\';\\nimport \'./styles.css\';\\nexport default function App() {\\n  return (\\n    <div className=\'p-4 bg-gray-100 text-center\'>\\n      <h1 className=\'text-2xl font-bold text-blue-500\'>Hello, Tailwind CSS with Sandpack!</h1>\\n      <p className=\'mt-2 text-gray-700\'>This is a live code editor.</p>\\n    </div>\\n  );\\n}"\n  }\n}\n  Additionally, include an explanation of the project\'s structure, purpose, and functionality in the explanation field. Make the response concise and clear in one paragraph.\n  - When asked then only use this package to import, here are some packages available to import and use (date-fns,react-chartjs-2,"firebase","@google/generative-ai" ) only when it required\n  \n  - For placeholder images, please use a https://archive.org/download/placeholder-image/placeholder-image.jpg\n  -Add Emoji icons whenever needed to give good user experinence\n  - all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\n- By default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\n- Use icons from lucide-react for logos.\n\n- Use stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.\n   `,\n',
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "projectTitle": "Simple Todo App",\n  "explanation": "This React project implements a basic Todo application using Tailwind CSS for styling and lucide-react for icons. The application is structured into components for the task list, input form, and individual todo items, promoting modularity and maintainability. It allows users to add, mark as complete and delete tasks. No other third party UI libraries are used other than requested libraries, date-fns for formatting dates.",\n  "files": {\n    "/App.js": {\n      "code": "import React, { useState } from \'react\';\\nimport TaskList from \'./components/TaskList\';\\nimport TaskForm from \'./components/TaskForm\';\\nimport { Clock, Plus, Check } from \'lucide-react\';\\n\\nconst App = () => {\\n  const [tasks, setTasks] = useState([]);\\n\\n  const addTask = (task) => {\\n    setTasks([...tasks, {\\n      id: Date.now(),\\n      text: task,\\n      completed: false,\\n      createdAt: new Date(),\\n    }]);\\n  };\\n\\n  const toggleComplete = (id) => {\\n    setTasks(tasks.map(task => task.id === id ? {...task, completed: !task.completed} : task));\\n  };\\n\\n  const deleteTask = (id) => {\\n    setTasks(tasks.filter(task => task.id !== id));\\n  };\\n\\n  return (\\n    <div className=\\"flex flex-col items-center min-h-screen bg-gray-100 p-4\\">\\n      <h1 className=\\"text-3xl font-bold mb-6 text-gray-800 flex items-center \\">\\n        <Clock className=\\"mr-2 text-blue-500\\"/> To-Do List\\n      </h1>\\n\\n      <div className=\\"bg-white shadow-md rounded-lg p-6 w-full max-w-md mb-6\\">\\n        <TaskForm onAddTask={addTask} />\\n      </div>\\n      \\n      <div className=\\"w-full max-w-md\\">\\n       {tasks.length === 0 &&  <div className=\\"flex justify-center items-center p-4 m-auto gap-2\\">\\n          <img src=\\"https://archive.org/download/placeholder-image/placeholder-image.jpg\\" alt=\\"placeholder\\" className=\'w-16 h-16 rounded-full object-cover\'/>\\n         <p className=\\"text-gray-500\\">No tasks yet. Add some!  <Plus className=\\"inline-block text-green-500\\" /></p>\\n        </div>}\\n        <TaskList tasks={tasks} onToggleComplete={toggleComplete} onDeleteTask={deleteTask} />\\n      </div>\\n    </div>\\n  );\\n};\\n\\nexport default App;\\n",\n      "generated": false\n    },\n    "/components/TaskForm.js": {\n      "code": "import React, { useState } from \'react\';\\nimport { Plus } from \'lucide-react\';\\n\\nconst TaskForm = ({ onAddTask }) => {\\n  const [taskText, setTaskText] = useState(\'\');\\n\\n  const handleSubmit = (e) => {\\n    e.preventDefault();\\n    if (taskText.trim()) {\\n      onAddTask(taskText);\\n      setTaskText(\'\');\\n    }\\n  };\\n\\n  return (\\n    <form onSubmit={handleSubmit} className=\\"flex space-x-2\\">\\n        <input\\n          type=\\"text\\"\\n          value={taskText}\\n          onChange={(e) => setTaskText(e.target.value)}\\n          placeholder=\\"Add new task...\\" \\n          className=\\"flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500\\"\\n        />\\n        <button type=\\"submit\\" className=\\"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md\\">\\n            <Plus className=\\"h-4 w-4\\"/>\\n        </button>\\n    </form>\\n  );\\n};\\n\\nexport default TaskForm;\\n",\n      "generated": true\n    },\n    "/components/TaskList.js": {\n      "code": "import React from \'react\';\\nimport TaskItem from \'./TaskItem\';\\n\\nconst TaskList = ({ tasks, onToggleComplete, onDeleteTask }) => {\\n  return (\\n    <ul className=\\"space-y-3\\">\\n      {tasks.map(task => (\\n        <TaskItem\\n          key={task.id}\\n          task={task}\\n          onToggleComplete={onToggleComplete}\\n          onDeleteTask={onDeleteTask}\\n        />\\n      ))}\\n    </ul>\\n  );\\n};\\n\\nexport default TaskList;\\n",\n      "generated": true\n    },\n    "/components/TaskItem.js": {\n      "code": "import React from \'react\';\\nimport { Trash, Check, X } from \'lucide-react\';\\nimport { format } from \'date-fns\';\\n\\nconst TaskItem = ({ task, onToggleComplete, onDeleteTask }) => {\\n    const formattedDate = format(task.createdAt, \'MMM dd, yyyy hh:mm a\');\\n\\n  return (\\n    <li className=\\"bg-white shadow-md rounded-md p-4 flex items-center justify-between\\">\\n      <div className=\\"flex items-center space-x-4\\">\\n        <button onClick={() => onToggleComplete(task.id)} className={`p-2 rounded-full transition duration-200 ${task.completed ? \'bg-green-500 hover:bg-green-600 text-white\' : \'border border-gray-300 hover:bg-gray-100\'}`}>\\n         {task.completed ?  <Check className=\\"h-4 w-4\\"/> : <X  className=\\"h-4 w-4 text-gray-500\\"/>}\\n        </button>\\n        <div className={`${task.completed ? \'line-through text-gray-500\' : \'text-gray-800\'}`}>\\n         <p className=\\"font-medium\\">{task.text}</p>\\n         <p className=\\"text-sm text-gray-500\\">Created at: {formattedDate}</p>\\n        </div>\\n      </div>\\n\\n      <button onClick={() => onDeleteTask(task.id)} className=\\"text-red-500 hover:text-red-700 transition duration-200\\">\\n        <Trash className=\\"h-4 w-4\\"/>\\n      </button>\\n    </li>\\n  );\\n};\\n\\nexport default TaskItem;\\n",\n      "generated": true\n    }\n  },\n  "generatedFiles": [\n    "/components/TaskForm.js",\n    "/components/TaskList.js",\n    "/components/TaskItem.js"\n  ]\n}\n```\n',
        },
      ],
    },
  ],
});