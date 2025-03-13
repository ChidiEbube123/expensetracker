import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ReceiptUploader() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      parseReceipt(text);
    };
    reader.readAsText(file);
  };

  const parseReceipt = (receiptText) => {
    const itemRegex = /\d+\.\s(.+?)\s-\s\$(\d+\.\d+)/g;
    let match;
    const extractedItems = [];

    while ((match = itemRegex.exec(receiptText)) !== null) {
      extractedItems.push({ name: match[1], price: parseFloat(match[2]) });
    }

    const totalMatch = receiptText.match(/Total:\s\$(\d+\.\d+)/);
    const extractedTotal = totalMatch ? parseFloat(totalMatch[1]) : 0;

    setItems(extractedItems);
    setTotal(extractedTotal);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Upload Receipt</h2>
      <input
        type="file"
        accept=".txt"
        onChange={handleFileUpload}
        className="mb-4 border p-2"
      />

      {items.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mt-4">Items Purchased</h3>
          <table className="w-full border mt-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Item</th>
                <th className="border p-2">Price ($)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="text-lg font-semibold mt-4">Total: ${total.toFixed(2)}</h3>

          {/* Bar Chart */}
          <h3 className="text-lg font-semibold mt-4">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={items}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="price" fill="#4A90E2" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
