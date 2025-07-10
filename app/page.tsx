import EditableTable from "../editable-table"
import { Toaster } from "sonner" // Import Toaster

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <EditableTable />
      <Toaster /> {/* Render Toaster here */}
    </main>
  )
}
