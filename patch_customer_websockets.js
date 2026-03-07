const fs = require('fs');

let file = 'pos-customer/src/pages/Success.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('io(')) {
    content = 'import io from "socket.io-client";\n' + content;
    
    // Add real-time status state
    content = content.replace(
        "const [eta, setEta] = useState(25);",
        "const [eta, setEta] = useState(25);\n  const [orderStatus, setOrderStatus] = useState('In Progress');"
    );
    
    // Add websocket effect
    const effectStr = `  useEffect(() => {
    if (!orderId) return;
    const socket = io('http://localhost:8000');
    socket.on('orderUpdated', (updatedOrder) => {
       if (updatedOrder.id === orderId) {
          setOrderStatus(updatedOrder.orderStatus);
       }
    });
    return () => socket.disconnect();
  }, [orderId]);`;

    content = content.replace(
        "  useEffect(() => {\n    if (stateEta) setEta(stateEta);",
        effectStr + "\n  useEffect(() => {\n    if (stateEta) setEta(stateEta);"
    );
    
    // Replace the ETA UI rendering block
    content = content.replace(
        /<div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-8 flex items-center gap-5 text-left shadow-sm">[\s\S]*?<\/div>/m,
        `{orderStatus === 'Completed' || orderStatus === 'Ready' ? (
         <div className="bg-green-50 border border-green-100 rounded-2xl p-5 mb-8 flex items-center gap-5 text-left shadow-sm">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-500 shadow-sm shrink-0">
               <FiCheckCircle size={24} />
            </div>
            <div>
               <p className="text-xs font-bold text-green-800/60 uppercase tracking-wider mb-1">Order Status</p>
               <p className="text-2xl font-black text-green-600 font-serif">Ready to Serve! ✅</p>
            </div>
         </div>
        ) : (
         <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-8 flex items-center gap-5 text-left shadow-sm">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-orange-500 shadow-sm shrink-0">
               <FiClock size={24} />
            </div>
            <div>
               <p className="text-xs font-bold text-orange-800/60 uppercase tracking-wider mb-1">Estimated Prep Time</p>
               <p className="text-2xl font-black text-orange-600 font-serif">{eta} <span className="text-lg font-medium">mins</span></p>
            </div>
         </div>
        )}`
    );

    fs.writeFileSync(file, content);
    console.log("Success.jsx patched for WebSockets tracking");
}
