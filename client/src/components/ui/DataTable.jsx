export default function DataTable({
  columns,
  data,
  actions,
}) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-100">
            {columns.map((column) => (
              <th
                key={column.key}
                className="text-left p-4"
              >
                {column.label}
              </th>
            ))}

            {actions && (
              <th className="text-center p-4">
                Aksi
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={
                  columns.length + 1
                }
                className="text-center p-6"
              >
                Tidak ada data
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                className="border-t"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="p-4"
                  >
                    {column.render
                      ? column.render(row)
                      : row[column.key]}
                  </td>
                ))}

                {actions && (
                  <td className="p-4 text-center">
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}