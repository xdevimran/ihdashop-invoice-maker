import React, { useState, useRef, useEffect } from "react";
import QRCode from "react-qr-code";

export default function Invoice() {
  const printRef = useRef(null);
  const [products, setProducts] = useState([{ name: "", price: "", qty: "1" }]);
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  const [deliveryCharge, setDeliveryCharge] = useState("0");
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const stored = localStorage.getItem("lastInvoice");
    const count = parseInt(localStorage.getItem("invoiceCount")) || 0;

    let newCount = 1;
    if (stored === today) {
      newCount = count + 1;
    }

    const newInvoiceNumber = `${today.replace(/-/g, "")}-${String(newCount).padStart(3, "0")}`;
    setInvoiceNumber(newInvoiceNumber);
  }, []);

  const handleChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const handleAddProduct = () => {
    setProducts([...products, { name: "", price: "", qty: "1" }]);
  };

  const handleRemoveProduct = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const subtotal = products.reduce(
    (acc, item) => acc + (parseFloat(item.price) || 0) * (parseFloat(item.qty) || 0),
    0
  );
  const total = subtotal + parseFloat(deliveryCharge || "0");

  const handlePrint = () => {
    if (products.some(p => !p.name || !p.price)) {
      alert("প্রতিটি প্রোডাক্টের নাম ও দর পূরণ করুন।");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const stored = localStorage.getItem("lastInvoice");
    let count = parseInt(localStorage.getItem("invoiceCount")) || 0;

    if (stored === today) {
      count += 1;
    } else {
      count = 1;
    }

    const newInvoiceNumber = `${today.replace(/-/g, "")}-${String(count).padStart(3, "0")}`;
    localStorage.setItem("lastInvoice", today);
    localStorage.setItem("invoiceCount", count);
    setInvoiceNumber(newInvoiceNumber);
    setShowInvoice(true);

    setTimeout(() => {
      window.print();
      setShowInvoice(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col items-center justify-center p-6 font-sans">
      <style>{`@media print { body { overflow: hidden; } }`}</style>

      {!showInvoice && (
        <div className="w-full max-w-5xl">
          <div className="shadow-2xl rounded-2xl border border-gray-300 bg-white">
            <div className="p-8 space-y-6">
              <div className="text-center mb-4">
                <h1 className="text-4xl font-extrabold text-indigo-800">ইহদা শপ</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input type="text" placeholder="কাস্টমারের নাম" className="rounded-xl px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-indigo-400 shadow-sm" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
                <input type="text" placeholder="ফোন নাম্বার" className="rounded-xl px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-indigo-400 shadow-sm" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
                <input type="text" placeholder="ঠিকানা" className="rounded-xl px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-indigo-400 shadow-sm" value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} />
              </div>

              <div className="space-y-4">
                {products.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <input type="text" placeholder="প্রোডাক্টের নাম" className="rounded-xl px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-purple-400 shadow-sm" value={item.name} onChange={e => handleChange(index, "name", e.target.value)} />
                    <input type="number" min="0" placeholder="দর" className="rounded-xl px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-purple-400 shadow-sm" value={item.price} onChange={e => handleChange(index, "price", e.target.value)} />
                    <input type="number" min="1" placeholder="পরিমাণ" className="rounded-xl px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-purple-400 shadow-sm" value={item.qty} onChange={e => handleChange(index, "qty", e.target.value)} />
                    <button onClick={() => handleRemoveProduct(index)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl">মুছুন</button>
                  </div>
                ))}
                <button onClick={handleAddProduct} className="mt-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-md">আরো প্রোডাক্ট</button>
              </div>

              <input type="number" min="0" placeholder="ডেলিভারি চার্জ (৳)" className="w-full rounded-xl px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-indigo-400 shadow-sm" value={deliveryCharge} onChange={e => setDeliveryCharge(e.target.value)} />

              <div className="text-center">
                <button onClick={handlePrint} className="mt-4 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md">প্রিন্ট করুন</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showInvoice && (
        <div ref={printRef} className="w-[148mm] h-[210mm] bg-white p-8 text-gray-900 text-sm print:shadow-none">
          <div className="text-center mb-6 border-b pb-3">
            <h2 className="text-3xl font-extrabold text-indigo-700">ইহদা শপ</h2>
            <p className="text-sm text-gray-500">ক্রয় রসিদ (Invoice)</p>
          </div>

          <div className="flex justify-between text-sm mb-6">
            <div>
              <p><strong>কাস্টমার:</strong> {customer.name || "-"}</p>
              <p><strong>ফোন:</strong> {customer.phone || "-"}</p>
              <p><strong>ঠিকানা:</strong> {customer.address || "-"}</p>
            </div>
            <div className="text-right">
              <p><strong>তারিখ:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>ইনভয়েস নম্বর:</strong> {invoiceNumber}</p>
            </div>
          </div>

          <table className="w-full text-sm border border-gray-400">
            <thead className="bg-indigo-100">
              <tr>
                <th className="border px-4 py-2 text-left">প্রোডাক্ট</th>
                <th className="border px-4 py-2 text-right">দর (৳)</th>
                <th className="border px-4 py-2 text-right">পরিমাণ</th>
                <th className="border px-4 py-2 text-right">মোট</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, i) => (
                <tr key={i} className="even:bg-gray-100">
                  <td className="border px-4 py-2">{item.name || "-"}</td>
                  <td className="border px-4 py-2 text-right">{item.price ? `৳${parseFloat(item.price).toFixed(2)}` : "-"}</td>
                  <td className="border px-4 py-2 text-right">{item.qty || "-"}</td>
                  <td className="border px-4 py-2 text-right font-semibold">{item.price && item.qty ? `৳${(parseFloat(item.price) * parseFloat(item.qty)).toFixed(2)}` : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 text-right text-sm space-y-1 border-t pt-4">
            <p><strong>মোট:</strong> ৳{subtotal.toFixed(2)}</p>
            <p><strong>ডেলিভারি চার্জ:</strong> ৳{parseFloat(deliveryCharge || "0").toFixed(2)}</p>
            <p className="text-xl font-extrabold text-indigo-900">সর্বমোট: ৳{total.toFixed(2)}</p>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">আমাদের ফেসবুক পেজ স্ক্যান করুন:</p>
              <div className="bg-white p-2 border rounded w-24">
                <QRCode value="https://www.facebook.com/ihdashop" size={80} />
              </div>
            </div>
            <div className="text-right">
              <p className="border-t border-gray-400 pt-2 w-40">স্বাক্ষর</p>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500 italic">
            আমাদের ফেসবুক পেজে ভিজিট করুন: <br />
            <a href="https://www.facebook.com/ihdashop" className="text-indigo-700 underline">fb.com/ihdashop</a>
          </p>
        </div>
      )}
    </div>
  );
}
