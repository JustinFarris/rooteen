RooTeen

RooTeen is a simple, efficient, and easy-to-use web application to help you manage your daily tasks. The application allows you to create, edit, delete, and manage tasks, as well as archive old tasks. It has an additional admin view for more detailed task management.

Features

-   Create, edit, and delete tasks
-   Group tasks by status (UNSTARTED, STARTED, COMPLETE)
-   Assign classes to tasks (DEFAULT, CUSTOM, ARCHIVED)
-   Color-coded task statuses for better visual organization
-   Daily reset function to reset task statuses
-   Admin view to manage tasks with more details

Installation

1.  Clone the repository:

git clone <https://github.com/yourusername/rooteen.git>

1.  Install dependencies:

cd rooteen npm install

1.  Run the application:

npm start

1.  Visit the application in your browser at [http://localhost:3000](http://localhost:3000/).

Usage

-   Add new tasks using the text field and ADD button
-   Perform actions on tasks (START, COMPLETE, RESET) using the corresponding action button
-   Delete tasks with the DELETE button (with confirmation)
-   Re-add archived tasks with the RE-ADD button
-   Access the admin view at /admin to edit task details, including name, status, and class

Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

License

[MIT](https://choosealicense.com/licenses/mit/)
