import Modal from "./Modal";

export default function ProductFormModal({
  open,
  onClose,
  form,
  setForm,
  categories,
  submit,
  editId
}) {

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        editId
          ? "Edit Produk"
          : "Tambah Produk"
      }
    >

      <input
        type="text"
        placeholder="Nama Produk"
        className="border p-3 rounded-lg w-full mb-3"
        value={form.name}
        onChange={(e)=>
          setForm({
            ...form,
            name:e.target.value
          })
        }
      />

      <select
        className="border p-3 rounded-lg w-full mb-3"
        value={form.category_id}
        onChange={(e)=>
          setForm({
            ...form,
            category_id:e.target.value
          })
        }
      >
        <option value="">
          Pilih Kategori
        </option>

        {
          categories.map(
            item=>(
              <option
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>
            )
          )
        }
      </select>

      <input
        type="number"
        placeholder="Harga"
        className="border p-3 rounded-lg w-full mb-3"
        value={form.price}
        onChange={(e)=>
          setForm({
            ...form,
            price:e.target.value
          })
        }
      />

      <input
        type="file"
        className="w-full mb-3"
        onChange={(e)=>
          setForm({
            ...form,
            image:e.target.files[0]
          })
        }
      />

      <button
        onClick={submit}
        className="bg-blue-600 text-white p-3 rounded-lg w-full"
      >
        Simpan
      </button>

    </Modal>
  );
}