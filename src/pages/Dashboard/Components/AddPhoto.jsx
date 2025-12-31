import { useRef, useState, useEffect } from "react"
import supabase from "../../../../supabase"

function AddPhoto() {
  const [img, setImg] = useState(null)
  const inputRef = useRef(null)
  const bucketName = "image"
  const fileName = "photo.png"

  useEffect(() => {
    supabase.storage.from(bucketName).list("", { limit: 1, sortBy: { column: "created_at", order: "desc" } })
      .then(({ data }) => {
        if (data?.length) {
          const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(data[0].name)
          setImg(urlData.publicUrl)
        }
      })
  }, [])

  const uploadImage = async (file) => {
    if (!file) return
    try {
      await supabase.storage.from(bucketName).remove([fileName])
      const { error: uploadError } = await supabase.storage.from(bucketName).upload(fileName, file, { cacheControl: '3600', upsert: true })
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName)
      setImg(`${data.publicUrl}?t=${new Date().getTime()}`)
    } catch (error) {
      console.error("Error updating image:", error)
      alert("حدث خطأ أثناء تحديث الصورة")
    }
  }

  return (
    <div className="mt-40 w-full">
      <div
        className="rounded-4xl flex items-center justify-center w-full h-90 bg-[#D1D1D1]/20 px-10 py-10 border border-white/50 cursor-pointer hover:bg-[#D1D1D1]/30 transition-all"
        style={{ boxShadow: "0px 12px 42px -4px rgba(0,0,0,0.1)" }}
        onClick={() => inputRef.current.click()} 
      >
        {img ? (
          <img
            src={img}
            alt="Uploaded"
            className="h-full max-h-[300px] object-contain rounded-xl"
          />
        ) : (
          <div className="bg-white p-4 rounded-full flex items-center justify-center">
                      <svg className="text-3xl" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5">
              <path d="M22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2" />
              <path d="m2 12.5 1.752-1.533a2.3 2.3 0 0 1 3.14.105l4.29 4.29a2 2 0 0 0 2.564.222l.299-.21a3 3 0 0 1 3.731.225L21 18.5" opacity=".5" />
              <path d="M15 5.5h3.5m0 0H22m-3.5 0V9m0-3.5V2" />
            </g>
          </svg>
          </div>
        )}
        <input
          type="file"
          hidden
          ref={inputRef}
          accept="image/*"
          onChange={(e) => uploadImage(e.target.files[0])}
        />
      </div>
    </div>
  )
}

export default AddPhoto
