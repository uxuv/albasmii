// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import supabase from "../../../../supabase";

// function AddTag() {
//   const [image, setImage] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState(null);

//   // جلب الصورة من Supabase عند تحميل المكون
//   useEffect(() => {
//     fetchImage();
//   }, []);

//   const fetchImage = async () => {
//     try {
//       // جلب رابط الصورة العامة من Supabase
//       const { data } = supabase.storage
//         .from("image")
//         .getPublicUrl("main-image.png");
      
//       if (data.publicUrl) {
//         setImage(data.publicUrl);
//       }
//     } catch (error) {
//       console.error("خطأ في جلب الصورة:", error);
//     }
//   };

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploading(true);
//     setError(null);

//     try {
//       // عرض الصورة المحددة فوراً
//       setImage(URL.createObjectURL(file));

//       // رفع الصورة إلى Supabase مع تحديث الصورة الحالية إذا وجدت
//       const { data, error } = await supabase.storage
//         .from("image")
//         .upload("main-image.png", file, { upsert: true });
        
//       if (error) {
//         throw error;
//       }

//       // جلب الرابط العام للصورة بعد الرفع
//       const { data: publicUrlData } = supabase.storage
//         .from("image")
//         .getPublicUrl("main-image.png");
      
//       setImage(publicUrlData.publicUrl);
//       console.log("تم رفع الصورة بنجاح!");
//     } catch (error) {
//       console.error("خطأ في رفع الصورة:", error);
//       setError("فشل في رفع الصورة، يرجى المحاولة مرة أخرى");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
//       animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//       transition={{ duration: 0.7 }}
//       className="relative mt-40 flex flex-row-reverse justify-between max-[700px]:flex-col"
//     >
//       <div className="relative overflow-hidden">
//         <div className="rounded-4xl flex items-center justify-center md:size-110 max-[770px]:px-4 w-full object-cover bg-[#D1D1D1]/20 p-1.5 border border-white/50 group relative overflow-hidden" style={{ boxShadow: "0px 12px 42px -4px rgba(0, 0, 0, 0.1)" }}>
//           <input
//             type="file"
//             accept="image/*"
//             id="imageInput"
//             className="hidden"
//             onChange={handleImageChange}
//             disabled={uploading}
//           />

//           {!image && (
//             <label htmlFor="imageInput" className="cursor-pointer flex flex-col items-center justify-center">
//               <div className="bg-white p-4 rounded-full hover:scale-105 active:scale-95 duration-300" style={{ boxShadow: "0px 12px 42px -4px rgba(0, 0, 0, 0.1)" }}>
//                 <svg className="text-3xl" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
//                   <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5">
//                     <path d="M22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2" />
//                     <path d="m2 12.5 1.752-1.533a2.3 2.3 0 0 1 3.14.105l4.29 4.29a2 2 0 0 0 2.564.222l.299-.21a3 3 0 0 1 3.731.225L21 18.5" opacity=".5" />
//                     <path d="M15 5.5h3.5m0 0H22m-3.5 0V9m0-3.5V2" />
//                   </g>
//                 </svg>
//               </div>
//               {uploading && <p className="mt-2 text-sm">جاري الرفع...</p>}
//               {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
//             </label>
//           )}

//           {image && (
//             <label htmlFor="imageInput" className="cursor-pointer w-full h-full relative">
//               <img
//                 src={image}
//                 className="md:size-110 w-full max-[770px]:px-4 rounded-4xl object-cover"
//                 alt="upload"
//               />
//               {uploading && (
//                 <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-4xl">
//                   <p className="text-white">جاري الرفع...</p>
//                 </div>
//               )}
//             </label>
//           )}
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
//           animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//           transition={{ duration: 0.7, delay: 0.2 }}
//           className='absolute top-2 left-2 z-60 flex-col w-fit h-fit bg-[#D1D1D1]/20 backdrop-blur-xl border border-white/50 rounded-2xl justify-center flex'
//         >
//           <div className='flex pr-5 pl-8 py-2.5'>
//             <div className='bg-white rounded-xl size-10'></div>
//             <div className='flex flex-col pr-4'>
//               <p className='font-medium text-[13px]'>عنوان النص</p>
//               <p className='text-[13px] leading-4 w-32'>لوريم ايبسوم هو ببساطة نص شكلي</p>
//             </div>
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
//           animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//           transition={{ duration: 0.7 }}
//           className='absolute bottom-2 right-2 z-60 flex-col w-fit h-fit bg-[#D1D1D1]/20 backdrop-blur-xl border border-white/50 rounded-2xl justify-center flex'
//         >
//           <div className='flex pr-5 pl-8 py-2'>
//             <div className='bg-white rounded-xl size-10'></div>
//             <div className='flex flex-col pr-4'>
//               <p className='font-medium text-[12px]'>عنوان النص</p>
//               <p className='text-[12px] leading-4 w-32'>لوريم ايبسوم هو ببساطة نص شكلي</p>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// }

// export default AddTag;