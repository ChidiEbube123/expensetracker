import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ReceiptParser() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const sampleReceipt = `
    ----------------------------------------------------
             Grocery Store Receipt
    ----------------------------------------------------
    Date: 2024-12-31
    Transaction ID: 123456791

    Items Purchased:
    1. Yogurt - $2.50
    2. Peach - $1.20
    3. Water - $3.00

    Subtotal: $6.70
    Tax (5%): $0.34
    Total: $7.04

    Thank you for shopping with us!
    ----------------------------------------------------
    Store Address:
    1234 Main Street, Anytown, USA
    Phone: (123) 456-7890
    ----------------------------------------------------
  `;

  const parseReceipt = () => {
    const itemRegex = /\d+\.\s(.+?)\s-\s\$(\d+\.\d+)/g;
    let match;
    const extractedItems = [];

    while ((match = itemRegex.exec(sampleReceipt)) !== null) {
      extractedItems.push({ name: match[1], price: parseFloat(match[2]) });
    }

    const totalMatch = sampleReceipt.match(/Total:\s\$(\d+\.\d+)/);
    const extractedTotal = totalMatch ? parseFloat(totalMatch[1]) : 0;

    setItems(extractedItems);
    setTotal(extractedTotal);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Receipt Parser</h2>
      <button
        onClick={parseReceipt}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Extract Data
      </button>

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
