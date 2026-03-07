const fs = require('fs');

let targetFile = 'pos-frontend/src/pages/Orders.jsx';
let content = fs.readFileSync(targetFile, 'utf8');

if (!content.includes('socket.io-client')) {
    content = content.replace(
        "import React, { useState, useEffect } from 'react';",
        "import React, { useState, useEffect } from 'react';\nimport io from 'socket.io-client';"
    );
    // In case no 'React,' found
    if (!content.includes("import io from 'socket.io-client';")) {
        content = "import io from 'socket.io-client';\n" + content;
    }
}

if (!content.includes('socket.on("newOrder"')) {
    // find useEffect
    const UseEffectMatch = content.match(/useEffect\(\(\) => \{[\s\S]*?fetchOrders\(\);/);
    if (UseEffectMatch) {
       content = content.replace(
            "fetchOrders();\n  }, []);",
            `fetchOrders();

    const socket = io('http://localhost:8000');
    socket.on('newOrder', (order) => {
      setOrders(prev => [order, ...prev]);
    });
    socket.on('orderUpdated', (updatedOrder) => {
      setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    });
    return () => socket.disconnect();
  }, []);`
       );
       fs.writeFileSync(targetFile, content);
       console.log("Orders.jsx patched!");
    } else {
       console.log("Could not find useEffect to patch");
    }
}
