const fs = require('fs');

let file = 'pos-frontend/src/pages/Orders.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('useQueryClient')) {
    content = content.replace(
        'import { keepPreviousData, useQuery } from "@tanstack/react-query";',
        'import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";\nimport { io } from "socket.io-client";'
    );
    
    content = content.replace(
        'const Orders = () => {',
        `const Orders = () => {\n  const queryClient = useQueryClient();\n\n  useEffect(() => {\n    const socket = io("http://localhost:8000");\n    socket.on("newOrder", () => {\n      queryClient.invalidateQueries(["orders"]);\n    });\n    socket.on("orderUpdated", () => {\n      queryClient.invalidateQueries(["orders"]);\n    });\n    return () => socket.disconnect();\n  }, [queryClient]);`
    );
    
    fs.writeFileSync(file, content);
    console.log("Orders.jsx patched for React Query websockets");
}
