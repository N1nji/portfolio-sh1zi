import { useState } from "react"
import { db } from "../firebase"
import { ref, push } from "firebase/database"
import emailjs from 'emailjs-com'

export default function BugReportButton() {
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubmit = () => {
    if (!message.trim()) return

    const bugRef = ref(db, "bugReports")
    push(bugRef, {
      message,
      timestamp: new Date().toISOString()
    });

    emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
            name: "Relatório Anônimo",
            message: message
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    ).then (() => {
        console.log("Bug report enviado por e-mail");
    }).catch((error) => {
        console.error("Erro ao enviar e-mail:", error);
    });

    setSent(true)
    setTimeout(() => {
      setShowModal(false)
      setMessage("")
      setSent(false)
    }, 2000)
  }


  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-lg z-50"
      >
        Reportar Bug 🐞
      </button>


      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96 max-w-full">
            <h2 className="text-xl font-bold mb-4">Reportar Bug</h2>
            {sent ? (
              <p className="text-green-600">Obrigado pelo feedback! 💖</p>
            ) : (
              <>

        <textarea
                  className="w-full border rounded p-2 mb-4"
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Descreva o problema..."
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-600 hover:text-black"
                  >
                    Cancelar

                </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                  >
                    Enviar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}