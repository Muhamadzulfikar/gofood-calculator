import { useEffect, useState } from 'react'

const App = () => {
  const [count, setCount] = useState(1);
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [priceQty, setPriceQty] = useState(0);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [fee, setFee] = useState(0);
  const [people, setPeople] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [grandData, setGrandData] = useState([])
  const [bill, setBill] =  useState(0);

  const calculate = () => {
    if (grandTotal > 0 && discount > 0) {
      const percentageDiscount = (discount / grandTotal) * 100;
      const feePerson = fee / people

      setGrandData(data.map((item) => {
        const priceQtyDiscount = item.priceQty * ((100 - percentageDiscount) / 100);
        const roundUpQty = Math.ceil(priceQtyDiscount);
        return {
          id: item.id,
          name: item.name,
          priceQty: roundUpQty,
          total: roundUpQty * item.total,
          payPerson: Math.round(feePerson + roundUpQty),
        };
      })
      );

      setBill(grandTotal - discount + parseInt(fee))
    }
  }

  // Effect to update data items based on discount, fee, or people changes
  useEffect(() => {
    calculate();
  }, [discount, fee, people]);

  useEffect(() => {
    calculate();
  }, [grandTotal])

  // Handle form submission to add new items
  const handleSubmit = (e) => {
    e.preventDefault();

    setCount((prevCount) => prevCount + 1);

    const newItem = {
      id: count,
      name,
      priceQty: priceQty || 0,
      total: total || 0,
    };

    // Use functional update to ensure you get the latest state
    setData((prevData) => {
      const updatedData = [...prevData, newItem];


      // Calculate new grand total based on the updated data
      const newGrandTotal = updatedData.reduce(
        (acc, curr) => acc + (curr.priceQty * curr.total || 0),
        0
      );
      setGrandTotal(newGrandTotal);

      return updatedData; // Return the updated state
    });

    clearFormFields();
  };

  // Clear form fields after submission
  const clearFormFields = () => {
    setName('');
    setPriceQty(0);
    setTotal(0);
  };

  // Handle item deletion
  const deleteItem = (id) => {
    setData((prevData) => {
      const updatedData = prevData.filter((item) => item.id !== id);

      // Calculate new grand total based on the updated data
      const newGrandTotal = updatedData.reduce(
        (acc, curr) => acc + (curr.priceQty * curr.total || 0),
        0
      );
      setGrandTotal(newGrandTotal);

      return updatedData; // Return the updated state
    });
  };
  return (
    <section className="w-11/12 mx-auto mt-10 bg-gray-50 shadow-lg text-gray-700 text-lg px-7 py-5">
      <h1 className='font-bold text-xl mx-auto mb-6 text-center'>GoFood Calculator</h1>
      <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-5 mb-9'>
        <section className='grid gap-2'>
          <div>
            <label htmlFor="name" className="block font-medium"> Nama Makanan </label>

            <input
              type="text"
              placeholder="Nasi Goreng"
              value={name}
              onChange={(e) => { setName(e.target.value) }}
              className="mt-1 w-full rounded-md border-solid border-2 p-2 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="price-qty" className="block font-medium"> Harga per satuan </label>

            <input
              type="number"
              placeholder="19000"
              value={priceQty}
              onChange={(e) => { setPriceQty(e.target.value) }}
              className="mt-1 w-full rounded-md border-solid border-2 p-2 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="total" className="block font-medium"> Jumlah </label>

            <input
              type="number"
              placeholder="4"
              value={total}
              onChange={(e) => { setTotal(e.target.value) }}
              className="mt-1 w-full rounded-md border-solid border-2 p-2 sm:text-sm"
            />
          </div>

          <button className='mt-4 inline-block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500'>Tambah</button>
        </section>

        <section className='grid gap-2'>
          <div>
            <label htmlFor="discount" className="block font-medium"> Diskon </label>

            <input
              type="number"
              placeholder="30000"
              onChange={(e) => { setDiscount(e.target.value) }}
              className="mt-1 w-full rounded-md border-solid border-2 p-2 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="fee" className="block font-medium"> Ongkir </label>

            <input
              type="number"
              placeholder="2500"
              onChange={(e) => { setFee(e.target.value) }}
              className="mt-1 w-full rounded-md border-solid border-2 p-2 sm:text-sm"
            />
          </div>


          <div>
            <label htmlFor="people" className="block font-medium"> Jumlah Orang </label>

            <input
              type="number"
              placeholder="16000"
              onChange={(e) => { setPeople(e.target.value) }}
              className="mt-1 w-full rounded-md border-solid border-2 p-2 sm:text-sm"
            />
          </div>
        </section>

      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="text-left">
            <tr>
              <th className="px-4 py-2 font-medium text-gray-900">Nama Makanan</th>
              <th className="px-4 py-2 font-medium text-gray-900">Harga Diskon</th>
              <th className="px-4 py-2 font-medium text-gray-900">Total Diskon</th>
              <th className="px-4 py-2 font-medium text-gray-900">Bayar per Orang</th>
              <th className="px-4 py-2 font-medium text-gray-900">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {grandData.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2 text-gray-700">{item.name}</td>
                <td className="px-4 py-2 text-gray-700">Rp.{item.priceQty.toLocaleString()}</td>
                <td className="px-4 py-2 text-gray-700">Rp.{item.total.toLocaleString()}</td>
                <td className="px-4 py-2 text-gray-700">Rp.{item.payPerson.toLocaleString()}</td>
                <td className="px-4 py-2 text-gray-700">
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="inline-block rounded border border-red-600 bg-red-600 px-4 py-1 text-sm font-medium text-white hover:bg-transparent hover:text-red-600 focus:outline-none focus:ring active:text-red-500"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='text-right mt-4'>
        Total Bayar: Rp.{bill.toLocaleString()}
      </div>

    </section>
  )
}

export default App
