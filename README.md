# TeuxDeux Clone - GitHub Copilot Demo

A faithful recreation of the minimalist TeuxDeux to-do list application, built to demonstrate the capabilities of GitHub Copilot.

## Features

✅ **Weekly View** - Clean 7-day column layout with current week dates  
✅ **Task Management** - Add, edit, delete, and complete tasks  
✅ **Drag & Drop** - Move tasks between days seamlessly  
✅ **Local Storage** - Persist tasks across browser sessions  
✅ **Responsive Design** - Works on desktop and mobile devices  
✅ **Clean UI** - Minimalist, paper-inspired design like the original TeuxDeux  

## Demo

![TeuxDeux Clone Initial View](https://github.com/user-attachments/assets/82bff395-90d9-4952-9045-0bed90af7fb8)

*Initial view with demo tasks loaded*

![TeuxDeux Clone After Interaction](https://github.com/user-attachments/assets/4e32f2d1-4131-4286-a60c-5675aea0636b)

*After testing functionality: completed tasks removed, new task added, and drag & drop demonstrated*

## Getting Started

1. Clone this repository
2. Open `index.html` in your web browser, or
3. Serve it using a local web server:
   ```bash
   python3 -m http.server 8000
   # Then visit http://localhost:8000
   ```

## Usage

- **Add Tasks**: Type in the "Add a task..." field at the bottom of any day column and press Enter
- **Complete Tasks**: Click the checkbox next to any task to mark it as completed
- **Edit Tasks**: Click on any task text to edit it inline
- **Delete Tasks**: Hover over a task and click the "×" button
- **Move Tasks**: Drag tasks between day columns to reschedule them
- **Clear Completed**: Use the "Clear Completed" button in the header
- **Clear All**: Use the "Clear All" button to remove all tasks (with confirmation)

## GitHub Copilot Demo

This project showcases GitHub Copilot's capabilities across different technologies:

- **HTML Structure**: Semantic, accessible markup for the weekly layout
- **CSS Styling**: Modern CSS with flexbox, responsive design, and smooth animations
- **JavaScript Functionality**: ES6+ features, event handling, DOM manipulation, and local storage
- **User Experience**: Intuitive interactions and visual feedback

The entire application was built with GitHub Copilot assistance, demonstrating how AI can accelerate web development while maintaining code quality and best practices.

## Technology Stack

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with flexbox and animations
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **Local Storage API** - Client-side persistence
- **Drag and Drop API** - Native browser drag & drop

## Browser Compatibility

Works in all modern browsers that support:
- ES6+ JavaScript features
- CSS Flexbox
- Local Storage
- Drag and Drop API

## License

MIT License - feel free to use this code for your own projects!
