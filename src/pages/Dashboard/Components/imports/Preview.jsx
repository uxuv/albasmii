import React, { useRef, useState, useEffect } from 'react';
import supabase from '../../../../../supabase';


const uploadPhoto = async (file, clientId) => {
  const ext = file.name.split('.').pop();
  const filePath = `${clientId}/photo/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase
    .storage
    .from('designs')
    .upload(filePath, file);

  if (error) throw error;

  return supabase
    .storage
    .from('designs')
    .getPublicUrl(filePath).data.publicUrl;
};

const uploadDesign = async (file, clientId, isPreview = false) => {
  const ext = file.name.split('.').pop();
  const folder = isPreview ? 'preview_images' : 'more_images';
  const filePath = `${clientId}/${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase
    .storage
    .from('designs')
    .upload(filePath, file);

  if (error) throw error;

  return supabase
    .storage
    .from('designs')
    .getPublicUrl(filePath).data.publicUrl;
};


const createClient = async (clientData) => {
  const { data, error } = await supabase
    .from('clients')
    .insert([clientData])
    .select()
    .single();
  if (error) throw error;
  return data;
};

const createDesign = async (designData) => {
  const { data, error } = await supabase
    .from('client_designs')
    .insert([designData])
    .select()
    .single();
  if (error) throw error;
  return data;
};

const getAllClientsWithDesigns = async () => {
  const { data, error } = await supabase
    .from('clients')
    .select(`
      *,
      client_designs (*)
    `)
    .eq('is_visible', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const Preview = ({ imageSrc, onChange, onRemove }) => {
  const fileInputRef = useRef(null);

  return (
    <div className='rounded-4xl flex items-center justify-center w-full h-47 bg-[#D1D1D1]/20 p-1.5 border border-white/50 group relative overflow-hidden'
      style={{ boxShadow: "0px 12px 42px -4px rgba(0, 0, 0, 0.1)" }}>
      {imageSrc ? (
        <>
          <img src={imageSrc} alt="" className="w-full h-full object-cover rounded-3xl" />
          <button
            onClick={onRemove}
            className="absolute inset-0 m-auto w-fit h-fit bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 duration-300"
            style={{ boxShadow: "0px 12px 42px -4px rgba(0, 0, 0, 0.1)" }}
          >
            <svg className='text-3xl cursor-pointer' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" opacity=".5" />
                <path strokeLinecap="round" d="m14.5 9.5-5 5m0-5 5 5" />
              </g>
            </svg>
          </button>
        </>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className='bg-white cursor-pointer p-4 rounded-full hover:scale-105 active:scale-95 duration-300'
          style={{ boxShadow: "0px 12px 42px -4px rgba(0, 0, 0, 0.1)" }}
        >
          <svg className='text-3xl' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5">
              <path d="M22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2" />
              <path d="m2 12.5 1.752-1.533a2.3 2.3 0 0 1 3.14.105l4.29 4.29a2 2 0 0 0 2.564.222l.299-.21a3 3 0 0 1 3.731.225L21 18.5" opacity=".5" />
              <path d="M15 5.5h3.5m0 0H22m-3.5 0V9m0-3.5V2" />
            </g>
          </svg>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          if (e.target.files?.[0]) onChange(e.target.files[0]);
          e.target.value = '';
        }}
      />
    </div>
  );
};

export const ImageUploadBox = ({ onUpload }) => {
  const fileInputRef = useRef(null);

  return (
    <div className='rounded-[1.75rem] flex items-center justify-center size-40 bg-[#D1D1D1]/20 p-1.5 border border-white/50'
      style={{ boxShadow: '0px 12px 42px -4px rgba(0, 0, 0, 0.1)' }}>
      <div
        onClick={() => fileInputRef.current?.click()}
        className='bg-white cursor-pointer p-4 rounded-full hover:scale-[1.04] active:scale-[0.98] duration-300'
        style={{ boxShadow: '0px 12px 42px -4px rgba(0, 0, 0, 0.1)' }}
      >
        <svg className='text-3xl' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5">
            <path d="M22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2" />
            <path d="m2 12.5 1.752-1.533a2.3 2.3 0 0 1 3.14.105l4.29 4.29a2 2 0 0 0 2.564.222l.299-.21a3 3 0 0 1 3.731.225L21 18.5" opacity=".5" />
            <path d="M15 5.5h3.5m0 0H22m-3.5 0V9m0-3.5V2" />
          </g>
        </svg>
      </div>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        multiple
        onChange={e => {
          if (e.target.files) onUpload(e.target.files);
          e.target.value = '';
        }} className='hidden'
      />
    </div>
  );
};

export const ImageGalleryItem = ({ imageSrc, onRemove }) => {
  return (
    <div className='rounded-[1.75rem] flex items-center justify-center size-40 bg-[#D1D1D1]/20 p-1.5 border border-white/50 group relative'
      style={{ boxShadow: '0px 12px 42px -4px rgba(0, 0, 0, 0.1)' }}>
      <img src={imageSrc} className='w-full h-full object-cover rounded-3xl' alt='' />
      <button
        onClick={onRemove}
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white cursor-pointer p-2 rounded-full opacity-0 group-hover:opacity-100 hover:scale-[1.04] active:scale-[0.98] duration-300 transition-all'
        style={{ boxShadow: '0px 12px 42px -4px rgba(0, 0, 0, 0.1)' }}
      >
        <svg className='text-3xl' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" opacity=".5" />
            <path strokeLinecap="round" d="m14.5 9.5-5 5m0-5 5 5" />
          </g>
        </svg>
      </button>
    </div>
  );
};

export const AvatarUpload = ({ imageSrc, onChange }) => {
  const handleFileChange = (file) => {
    if (file instanceof File) {
      onChange(file);
    } else {
      console.error('Expected a File but got:', file);
    }
  };
  return (
    <div>
      <label
        className="size-20 bg-white hover:scale-[1.04] active:scale-[0.98] duration-300 rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
        style={{ boxShadow: '0px 12px 42px -4px rgba(0, 0, 0, 0.1)' }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files[0]) onChange(e.dataTransfer.files[0]);
        }}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange(file);  
            e.target.value = '';
          }}
        />        {imageSrc ? (
          <img src={imageSrc} className="w-full h-full object-cover" alt="" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <circle cx="12" cy="6" r="4" fill="currentColor" />
            <path fill="currentColor" d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5" opacity=".5" />
          </svg>
        )}
      </label>
    </div>
  );
};

export const AdditionalDesignsModal = ({ isOpen, onClose, images, onUpload, onRemove }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 backdrop-blur-sm"
    >
      <div className='absolute z-60 mx-auto max-w-5xl top-1/2 left-1/2 -translate-x-1/2 flex justify-end -translate-y-1/2 rounded-4xl p-6 w-full h-120 bg-[#D1D1D1]/20 backdrop-blur-xl border border-white/50'
        style={{ boxShadow: '0px 12px 42px -4px rgba(0, 0, 0, 0.1)' }}>
        <div className='gap-4 flex'>
          <div className='flex flex-wrap gap-4'>
            <ImageUploadBox onUpload={onUpload} />
            {images.map((image, index) => (
              <ImageGalleryItem
                key={index}
                imageSrc={image}
                onRemove={() => onRemove(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ClientCard = ({
  avatarSrc,
  onAvatarChange,
  clientName,
  onClientNameChange,
  description,
  onDescriptionChange,
  onMoreClick,
  onSubmit,
}) => {
  const [verify, setVerify] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewDesigns, setPreviewDesigns] = useState([null, null, null, null]);
  const [designFiles, setDesignFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (file) => {
    if (!(file instanceof File)) return;

    setAvatarFile(file);
    onAvatarChange(URL.createObjectURL(file));
  };




  const handlePreviewChange = (index, file) => {
    const newPreviews = [...previewDesigns];
    newPreviews[index] = file;
    setPreviewDesigns(newPreviews);
  };

  const handlePreviewRemove = (index) => {
    const newPreviews = [...previewDesigns];
    newPreviews[index] = null;
    setPreviewDesigns(newPreviews);
  };

  const handleAdditionalImagesUpload = (files) => {
    const newImages = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setDesignFiles(prev => [...prev, ...newImages]);
    setAdditionalImages(prev => [...prev, ...newImages.map(img => img.preview)]);
  };

  const handleRemoveAdditionalImage = (index) => {
    setDesignFiles(prev => prev.filter((_, i) => i !== index));
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!clientName || !avatarFile) {
      alert('الرجاء إدخال اسم العميل والصورة الشخصية');
      return;
    }

    setLoading(true);
    try {
      const newClient = await createClient({
        name: clientName,
        subtitle: description,
        is_verified: verify,
        is_visible: true,
        photo: ''
      });
      const photoUrl = await uploadPhoto(avatarFile, newClient.id);
      await supabase.from('clients').update({ photo: photoUrl }).eq('id', newClient.id);

      const allDesigns = [
        ...previewDesigns.filter(f => f !== null),
        ...designFiles.map(d => d.file)
      ];
      const uploads = await Promise.all(
        allDesigns.map((file, index) =>
          uploadDesign(file, newClient.id, index < previewDesigns.filter(f => f).length)
        )
      );

      const designs = uploads.map((url, i) => ({
        client_id: newClient.id,
        design_url: url,
        title: allDesigns[i].name
      }));

      await supabase.from('client_designs').insert(designs);

      alert('تم إضافة العميل بنجاح!');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ أثناء الإضافة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='flex'>
        <div className='flex flex-col w-full gap-5 pl-5 max-[500px]:hidden'>
          <Preview
            imageSrc={previewDesigns[0] ? URL.createObjectURL(previewDesigns[0]) : null}
            onChange={(file) => handlePreviewChange(0, file)}
            onRemove={() => handlePreviewRemove(0)}
          />
          <Preview
            imageSrc={previewDesigns[1] ? URL.createObjectURL(previewDesigns[1]) : null}
            onChange={(file) => handlePreviewChange(1, file)}
            onRemove={() => handlePreviewRemove(1)}
          />
        </div>

        <div
          className='w-200 max-[700px]:w-120 h-100 flex flex-col items-center justify-center px-3 max-[500px]:h-110 rounded-4xl bg-[#D1D1D1]/20 p-1.5 backdrop-blur-xl border border-white/50'
          style={{ boxShadow: "0px 12px 42px -4px rgba(0, 0, 0, 0.1)" }}
        >
          <div
            onClick={() => setVerify(!verify)}
            className=" absolute mr-12 z-60 border border-gray-300 top-30 p-2 bg-white hover:scale-[1.04] active:scale-[0.98] duration-300 rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
            style={{ boxShadow: '0px 12px 42px -4px rgba(0, 0, 0, 0.1)' }}
          >
            {verify ? (
              <svg className='text-[#0095F6]' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M9.592 3.2a6 6 0 0 1-.495.399c-.298.2-.633.338-.985.408c-.153.03-.313.043-.632.068c-.801.064-1.202.096-1.536.214a2.71 2.71 0 0 0-1.655 1.655c-.118.334-.15.735-.214 1.536a6 6 0 0 1-.068.632c-.07.352-.208.687-.408.985c-.087.13-.191.252-.399.495c-.521.612-.782.918-.935 1.238c-.353.74-.353 1.6 0 2.34c.153.32.414.626.935 1.238c.208.243.312.365.399.495c.2.298.338.633.408.985c.03.153.043.313.068.632c.064.801.096 1.202.214 1.536a2.71 2.71 0 0 0 1.655 1.655c.334.118.735.15 1.536.214c.319.025.479.038.632.068c.352.07.687.209.985.408c.13.087.252.191.495.399c.612.521.918.782 1.238.935c.74.353 1.6.353 2.34 0c.32-.153.626-.414 1.238-.935c.243-.208.365-.312.495-.399c.298-.2.633-.338.985-.408c.153-.03.313-.043.632-.068c.801-.064 1.202-.096 1.536-.214a2.71 2.71 0 0 0 1.655-1.655c.118-.334.15-.735.214-1.536c.025-.319.038-.479.068-.632c.07-.352.209-.687.408-.985c.087-.13.191-.252.399-.495c.521-.612.782-.918.935-1.238c.353-.74.353-1.6 0-2.34c-.153-.32-.414-.626-.935-1.238a6 6 0 0 1-.399-.495a2.7 2.7 0 0 1-.408-.985a6 6 0 0 1-.068-.632c-.064-.801-.096-1.202-.214-1.536a2.71 2.71 0 0 0-1.655-1.655c-.334-.118-.735-.15-1.536-.214a6 6 0 0 1-.632-.068a2.7 2.7 0 0 1-.985-.408a6 6 0 0 1-.495-.399c-.612-.521-.918-.782-1.238-.935a2.71 2.71 0 0 0-2.34 0c-.32.153-.626.414-1.238.935m6.781 6.663a.814.814 0 0 0-1.15-1.15l-4.85 4.85l-1.596-1.595a.814.814 0 0 0-1.15 1.15l2.17 2.17a.814.814 0 0 0 1.15 0z" clipRule="evenodd" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M10.594 2.319a3.26 3.26 0 0 1 2.812 0c.387.185.74.487 1.231.905l.078.066c.238.203.313.265.389.316c.193.13.41.219.637.264c.09.018.187.027.499.051l.101.008c.642.051 1.106.088 1.51.23a3.27 3.27 0 0 1 1.99 1.99c.142.404.178.868.23 1.51l.008.101c.024.312.033.41.051.499c.045.228.135.445.264.638c.051.075.113.15.316.388l.066.078c.419.49.72.844.905 1.23c.425.89.425 1.924 0 2.813c-.184.387-.486.74-.905 1.231l-.066.078a5 5 0 0 0-.316.389c-.13.193-.219.41-.264.637c-.018.09-.026.187-.051.499l-.009.101c-.05.642-.087 1.106-.23 1.51a3.26 3.26 0 0 1-1.989 1.99c-.404.142-.868.178-1.51.23l-.101.008a5 5 0 0 0-.499.051a1.8 1.8 0 0 0-.637.264a5 5 0 0 0-.39.316l-.077.066c-.49.419-.844.72-1.23.905a3.26 3.26 0 0 1-2.813 0c-.387-.184-.74-.486-1.231-.905l-.078-.066a5 5 0 0 0-.388-.316a1.8 1.8 0 0 0-.638-.264a5 5 0 0 0-.499-.051l-.101-.009c-.642-.05-1.106-.087-1.51-.23a3.26 3.26 0 0 1-1.99-1.989c-.142-.404-.179-.868-.23-1.51l-.008-.101a5 5 0 0 0-.051-.499a1.8 1.8 0 0 0-.264-.637a5 5 0 0 0-.316-.39l-.066-.077c-.418-.49-.72-.844-.905-1.23a3.26 3.26 0 0 1 0-2.813c.185-.387.487-.74.905-1.231l.066-.078a5 5 0 0 0 .316-.388c.13-.193.219-.41.264-.638c.018-.09.027-.187.051-.499l.008-.101c.051-.642.088-1.106.23-1.51a3.26 3.26 0 0 1 1.99-1.99c.404-.142.868-.179 1.51-.23l.101-.008a5 5 0 0 0 .499-.051c.228-.045.445-.135.638-.264c.075-.051.15-.113.388-.316l.078-.066c.49-.418.844-.72 1.23-.905m2.163 1.358a1.76 1.76 0 0 0-1.514 0c-.185.088-.38.247-.981.758l-.03.025c-.197.168-.34.291-.497.396c-.359.24-.761.407-1.185.49c-.185.037-.373.052-.632.073l-.038.003c-.787.063-1.036.089-1.23.157c-.5.177-.894.57-1.07 1.071c-.07.194-.095.443-.158 1.23l-.003.038c-.02.259-.036.447-.072.632c-.084.424-.25.826-.49 1.185c-.106.157-.229.3-.397.498l-.025.029c-.511.6-.67.796-.758.98a1.76 1.76 0 0 0 0 1.515c.088.185.247.38.758.981l.025.03c.168.197.291.34.396.497c.24.359.407.761.49 1.185c.037.185.052.373.073.632l.003.038c.063.787.089 1.036.157 1.23c.177.5.57.894 1.071 1.07c.194.07.443.095 1.23.158l.038.003c.259.02.447.036.632.072c.424.084.826.25 1.185.49c.157.106.3.229.498.397l.029.025c.6.511.796.67.98.758a1.76 1.76 0 0 0 1.515 0c.185-.088.38-.247.981-.758l.03-.025c.197-.168.34-.291.497-.396c.359-.24.761-.407 1.185-.49a6 6 0 0 1 .632-.073l.038-.003c.787-.063 1.036-.089 1.23-.157c.5-.177.894-.57 1.07-1.071c.07-.194.095-.444.158-1.23l.003-.038a6 6 0 0 1 .072-.633c.084-.423.25-.825.49-1.184c.106-.157.229-.3.397-.498l.025-.029c.511-.6.67-.796.758-.98a1.76 1.76 0 0 0 0-1.515c-.088-.185-.247-.38-.758-.981l-.025-.03c-.168-.197-.291-.34-.396-.497a3.3 3.3 0 0 1-.49-1.185a6 6 0 0 1-.073-.632l-.003-.038c-.063-.787-.089-1.036-.157-1.23c-.177-.5-.57-.894-1.071-1.07c-.194-.07-.444-.095-1.23-.158l-.038-.003a6 6 0 0 1-.633-.072a3.3 3.3 0 0 1-1.184-.49c-.157-.106-.3-.229-.498-.397l-.029-.025c-.6-.511-.796-.67-.98-.758m3.287 5.282a.75.75 0 0 1 0 1.065l-5.017 5.017a.753.753 0 0 1-1.064 0l-2.007-2.007A.753.753 0 1 1 9.02 11.97l1.475 1.474L14.98 8.96a.753.753 0 0 1 1.064 0" clipRule="evenodd" /></svg>
            )}
          </div>

          <AvatarUpload imageSrc={avatarSrc} onChange={handleAvatarChange} />

          <input
            type="text"
            placeholder='اسم العميل'
            value={clientName}
            onChange={e => onClientNameChange(e.target.value)}
            className='font-semibold mt-4 text-xl text-center outline-none bg-transparent'
          />

          <textarea
            placeholder="شرح مُبسط"
            value={description}
            onChange={e => onDescriptionChange(e.target.value)}
            className="mt-2 text-sm max-w-60 text-center outline-none resize-none overflow-hidden bg-transparent"
            rows={1}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />

          <div className='flex items-center justify-between gap-3 mt-10'>
            <div className='flex items-center justify-center hover:scale-[1.05] active:scale-[0.98] duration-300 bg-[#D1D1D1]/20 backdrop-blur-xl border border-white/50 p-2 w-fit rounded-full'>
              <button
                className='cursor-pointer px-4 rounded-full transition-all py-3 text-lg duration-300 bg-white'
                onClick={() => {
                  setIsModalOpen(true);
                  onMoreClick();
                }}
              >
                <svg className='text-xl' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" opacity=".5" /><path strokeLinecap="round" d="M15 12h-3m0 0H9m3 0V9m0 3v3" /></g></svg>
              </button>
            </div>

            <div className='flex items-center justify-center bg-[#D1D1D1]/20 backdrop-blur-xl border border-white/50 p-2 w-fit rounded-full'>
              <button
                className='cursor-pointer px-4 hover:px-6 rounded-full transition-all py-3 duration-300 bg-white'
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'جاري الإضافة...' : 'اضافة عميل'}
              </button>
            </div>
          </div>
        </div>

        <div className='flex flex-col w-full gap-5 pr-5 max-[700px]:hidden'>
          <Preview
            imageSrc={previewDesigns[2] ? URL.createObjectURL(previewDesigns[2]) : null}
            onChange={(file) => handlePreviewChange(2, file)}
            onRemove={() => handlePreviewRemove(2)}
          />
          <Preview
            imageSrc={previewDesigns[3] ? URL.createObjectURL(previewDesigns[3]) : null}
            onChange={(file) => handlePreviewChange(3, file)}
            onRemove={() => handlePreviewRemove(3)}
          />
        </div>
      </div>

      <AdditionalDesignsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={additionalImages}
        onUpload={handleAdditionalImagesUpload}
        onRemove={handleRemoveAdditionalImage}
      />
    </>
  );
};

export const ClientsDisplay = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getAllClientsWithDesigns();
        setCustomers(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div className="flex flex-col gap-10">
      {customers.map((customer) => {
        const designs = customer.client_designs || [];
        const hasDesigns = designs.length > 0;

        return (
          <div key={customer.id} className='flex'>
            <div className='flex flex-col w-full gap-5 pl-5 max-[500px]:hidden'>
              {hasDesigns && designs[0] && (
                <div className='rounded-4xl bg-[#D9D9D9] w-full h-47 overflow-hidden'>
                  <img src={designs[0].design_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              {hasDesigns && designs[1] && (
                <div className='rounded-4xl bg-[#D9D9D9] w-full h-47 overflow-hidden'>
                  <img src={designs[1].design_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className='rounded-4xl bg-[#D9D9D9] w-200 max-[700px]:w-120 h-100 flex flex-col items-center justify-center px-3 max-[500px]:h-110'>
              <div className='size-20 bg-white rounded-full flex items-center justify-center overflow-hidden'>
                {customer.photo ? (
                  <img src={customer.photo} alt={customer.name} className="w-full h-full object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                    <circle cx="12" cy="6" r="4" fill="currentColor" />
                    <path fill="currentColor" d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5" opacity=".5" />
                  </svg>
                )}
              </div>
              <h1 className='font-semibold mt-4 text-xl'>{customer.name}</h1>
              <h1 className='mt-1 text-sm max-w-60 text-center'>{customer.subtitle}</h1>

              {hasDesigns && (
                <div className='flex items-center justify-center mt-6'>
                  <div className='flex items-center justify-center'>
                    {designs.slice(0, 3).map((design, index) => (
                      <div
                        key={design.id}
                        className='bg-[#1e1e1e] border border-transparent rounded-full size-8 overflow-hidden'
                        style={{ marginRight: index > 0 ? '-1.25rem' : '0' }}
                      >
                        <img src={design.design_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <button className='mr-2 font-medium flex items-center gap-5 bg-black hover:scale-[1.04] active:scale-[0.98] duration-300 text-white px-4 py-3 text-sm rounded-full cursor-pointer'>
                      +{designs.length} تصميم
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className='flex flex-col w-full gap-5 pr-5 max-[700px]:hidden'>
              {hasDesigns && designs[2] && (
                <div className='rounded-4xl bg-[#D9D9D9] w-full h-47 overflow-hidden'>
                  <img src={designs[2].design_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              {hasDesigns && designs[3] && (
                <div className='rounded-4xl bg-[#D9D9D9] w-full h-47 overflow-hidden'>
                  <img src={designs[3].design_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Preview;
