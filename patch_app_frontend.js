const fs = require('fs');

let file = 'pos-frontend/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('io(')) {
    content = 'import { io } from "socket.io-client";\nimport { useEffect } from "react";\nimport { useQueryClient } from "@tanstack/react-query";\n' + content;
    
    content = content.replace(
        'function App() {',
        `function App() {\n  const queryClient = useQueryClient();\n  useEffect(() => {\n    const socket = io("http://localhost:8000");\n    socket.on("newOrder", () => {\n      queryClient.invalidateQueries({ queryKey: ["orders"] });\n    });\n    socket.on("orderUpdated", () => {\n      queryClient.invalidateQueries({ queryKey: ["orders"] });\n    });\n    return () => socket.disconnect();\n  }, [queryClient]);`
    );
    fs.writeFileSync(file, content);
    console.log("App.jsx updated with socket!");
}

