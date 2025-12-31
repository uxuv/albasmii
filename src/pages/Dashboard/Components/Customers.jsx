import React, { useState, useEffect, useRef } from 'react'
import supabase from '../../../../supabase'
import check from '../../../assets/images/check.svg'

function Works() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDesigns, setSelectedDesigns] = useState([]);
    const [showItem, setShowItem] = useState(null);
    const [clients, setClients] = useState([]);
    const [currentClientId, setCurrentClientId] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageSelection = async (e, type, id, clientId) => {
        e.preventDefault();
        e.stopPropagation();
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                if (type === 'client') await updateClientPhoto(id, file);
                else if (type === 'design') await updateDesignImage(id, clientId, file);
                else if (type === 'more') await uploadMoreImages([file], clientId);
            }
        };
        input.click();
    };

    const handleDeleteClient = async (clientId) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا العميل وكل بياناته؟')) return;
        try {
            const deleteFolderRecursive = async (folderPath) => {
                const { data: items, error: listError } = await supabase.storage.from('designs').list(folderPath, { limit: 1000 });
                if (listError) throw listError;
                if (items.length === 0) return;
                const filePathsToDelete = [];
                const subFoldersToProcess = [];
                for (const item of items) {
                    const itemPath = `${folderPath}/${item.name}`;
                    if (!item.id) { subFoldersToProcess.push(itemPath); } else { filePathsToDelete.push(itemPath); }
                }
                if (filePathsToDelete.length > 0) {
                    const { error: deleteError } = await supabase.storage.from('designs').remove(filePathsToDelete);
                    if (deleteError) throw deleteError;
                }
                for (const subFolder of subFoldersToProcess) { await deleteFolderRecursive(subFolder); }
            };
            await deleteFolderRecursive(clientId);
            const { error: folderDeleteError } = await supabase.storage.from('designs').remove([clientId]);
            if (folderDeleteError) { console.log('لم يتم حذف المجلد الفارغ:', folderDeleteError.message); }
            const { error: designsError } = await supabase.from('client_designs').delete().eq('client_id', clientId);
            if (designsError) throw designsError;
            const { error: clientError } = await supabase.from('clients').delete().eq('id', clientId);
            if (clientError) throw clientError;
            setClients(prev => prev.filter(client => client.id !== clientId));
            alert('تم حذف العميل وكل بياناته بنجاح!');
        } catch (err) {
            console.error('حدث خطأ أثناء الحذف:', err);
            alert(`حدث خطأ أثناء الحذف: ${err.message}`);
        }
    };

    const toggleVerification = async (clientId, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            const { error } = await supabase.from('clients').update({ is_verified: newStatus }).eq('id', clientId);
            if (error) throw error;
            setClients(prev => prev.map(client => client.id === clientId ? { ...client, is_verified: newStatus } : client));
            alert(`تم ${newStatus ? 'التحقق' : 'إلغاء التحقق'} من العميل بنجاح`);
        } catch (err) {
            console.error('خطأ في تحديث حالة التحقق:', err);
            alert(`فشل التحديث: ${err.message}`);
        }
    };

    const updateClientPhoto = async (clientId, file) => {
        try {
            const filePath = `${clientId}/photo/photo.jpg`;

            await supabase.storage
                .from('designs')
                .upload(filePath, file, { upsert: true });

            const { data } = supabase
                .storage
                .from('designs')
                .getPublicUrl(filePath);

            const newUrl = `${data.publicUrl}?t=${Date.now()}`;

            await supabase
                .from('clients')
                .update({ photo: newUrl })
                .eq('id', clientId);

            setClients(prev =>
                prev.map(client =>
                    client.id === clientId
                        ? { ...client, photo: newUrl }
                        : client
                )
            );

            alert('تم تحديث الصورة بنجاح ✅');
        } catch (err) {
            console.error(err);
            alert('فشل تحديث الصورة ❌');
        }
    };

    const updateDesignImage = async (designId, clientId, file) => {
        try {
            const fileName = `design-${Date.now()}`;
            const filePath = `${clientId}/${designId}/${fileName}`;
            const { error: uploadError } = await supabase.storage.from('designs').upload(filePath, file, { upsert: true });
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('designs').getPublicUrl(filePath);
            const { error: updateError } = await supabase.from('client_designs').update({ design_url: publicUrl }).eq('id', designId);
            if (updateError) throw updateError;
            setClients(prev => prev.map(client => ({
                ...client,
                client_designs: client.client_designs.map(design => design.id === designId ? { ...design, design_url: publicUrl } : design)
            })));
            alert('تم تحديث صورة التصميم بنجاح');
        } catch (err) {
            console.error('خطأ في تحديث صورة التصميم:', err);
            alert(`فشل التحديث: ${err.message}`);
        }
    };

    const uploadMoreImages = async (files, clientId) => {
        try {
            const newDesigns = [];
            for (const file of files) {
                const fileName = `more-image-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
                const filePath = `${clientId}/more_images/${fileName}`;
                const { error: uploadError } = await supabase.storage.from('designs').upload(filePath, file);
                if (uploadError) throw uploadError;
                const { data: { publicUrl } } = supabase.storage.from('designs').getPublicUrl(filePath);
                const { data, error: insertError } = await supabase.from('client_designs').insert({ client_id: clientId, design_url: publicUrl }).select();
                if (insertError) throw insertError;
                newDesigns.push({ ...data[0], isPreview: false });
            }
            setClients(prev => prev.map(client => client.id === clientId ? { ...client, client_designs: [...client.client_designs, ...newDesigns] } : client));
            setSelectedDesigns(prev => [...prev, ...newDesigns]);
            alert(`تم إضافة ${files.length} صور بنجاح`);
        } catch (err) {
            console.error('خطأ في إضافة الصور:', err);
            alert(`فشل الإضافة: ${err.message}`);
        }
    };

    const deleteDesign = async (designId, clientId) => {
        try {
            const designToDelete = selectedDesigns.find(d => d.id === designId);
            if (!designToDelete) return;
            const filePath = designToDelete.design_url.split('/').slice(-2).join('/');
            const { error: storageError } = await supabase.storage.from('designs').remove([filePath]);
            if (storageError) throw storageError;
            const { error: dbError } = await supabase.from('client_designs').delete().eq('id', designId);
            if (dbError) throw dbError;
            setClients(prev => prev.map(client => client.id === clientId ? { ...client, client_designs: client.client_designs.filter(d => d.id !== designId) } : client));
            setSelectedDesigns(prev => prev.filter(d => d.id !== designId));
            alert('تم حذف الصورة بنجاح');
        } catch (err) {
            console.error('خطأ في حذف الصورة:', err);
            alert(`فشل الحذف: ${err.message}`);
        }
    };

    const fetchClients = async () => {
        try {
            const { data, error } = await supabase.from('clients').select(`*, client_designs (*)`).eq('is_visible', true).order('created_at', { ascending: true });
            if (error) throw error;
            const clientsWithPreviewFlag = data.map(client => {
                const designsWithFlag = client.client_designs.map((design, index) => ({ ...design, isPreview: index < 4 }));
                return { ...client, client_designs: designsWithFlag };
            });
            setClients(clientsWithPreviewFlag);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    return (
        <>
            {clients.map((client) => {
                const previewDesigns = client.client_designs.filter(design => design.isPreview);
                const moreDesigns = client.client_designs.filter(design => !design.isPreview);

                return (
                    <div key={client.id} className='flex mt-12 items-stretch sm:h-100' id='works' >
                        <div className='flex flex-col w-full gap-5 pl-5'>
                            {previewDesigns[0] && <div className='cursor-pointer rounded-4xl w-full h-full bg-[#D1D1D1]/20 overflow-hidden'><img onClick={(e) => handleImageSelection(e, 'design', previewDesigns[0].id, client.id)} src={previewDesigns[0].design_url} className="hover:scale-[1.05] duration-300 w-full h-full object-cover" />
                            </div>}
                            {previewDesigns[1] && <div className='cursor-pointer rounded-4xl w-full h-full bg-[#D1D1D1]/20 overflow-hidden'><img onClick={(e) => handleImageSelection(e, 'design', previewDesigns[1].id, client.id)} src={previewDesigns[1].design_url} className="hover:scale-[1.05] duration-300 w-full h-full object-cover" />
                            </div>}
                        </div>
                        <div style={{ boxShadow: "0px 12px 42px -4px rgba(0, 0, 0, 0.1)" }} className='w-200 max-[700px]:w-120 flex flex-col items-center justify-center px-3 max-[500px]:h-110 rounded-4xl bg-[#D1D1D1]/20 p-1.5 backdrop-blur-xl border border-white/50'>
                            <div className="flex flex-col items-center">
                                <div className="size-20 bg-white rounded-3xl overflow-hidden">
                                    <img onClick={(e) => handleImageSelection(e, 'client', client.id, client.id)} src={client.photo} alt={client.name} className="w-full h-full object-cover cursor-pointer" />
                                </div>
                                {client.is_verified && (
                                    <div className="-mt-6 -ml-16 rounded-full flex items-center justify-center" style={{ boxShadow: '0px 12px 42px -4px rgba(0, 0, 0, 0.1)' }}><img className='size-7' src={check} alt="" /></div>
                                )}
                            </div>
                            <h1 className='font-semibold mt-4 text-xl'>{client.name}</h1>
                            <h1 className='mt-1 text-sm max-w-60 text-center'>{client.subtitle}</h1>
                            <div className='flex items-center w-full justify-center mt-6 gap-2'>
                                <div className='flex items-center justify-center w-full bg-[#D1D1D1]/20 backdrop-blur-xl border border-white/50 p-2 rounded-full'>
                                    <button onClick={() => handleDeleteClient(client.id)} className='w-full flex items-center justify-center cursor-pointer px-4 rounded-full transition-all py-3 text-lg duration-300 bg-white'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M3 6.386c0-.484.345-.877.771-.877h2.665c.529-.016.996-.399 1.176-.965l.03-.1l.115-.391c.07-.24.131-.45.217-.637c.338-.739.964-1.252 1.687-1.383c.184-.033.378-.033.6-.033h3.478c.223 0 .417 0 .6.033c.723.131 1.35.644 1.687 1.383c.086.187.147.396.218.637l.114.391l.03.1c.18.566.74.95 1.27.965h2.57c.427 0 .772.393.772.877s-.345.877-.771.877H3.77c-.425 0-.77-.393-.77-.877" /><path fill="currentColor" fillRule="evenodd" d="M11.596 22h.808c2.783 0 4.174 0 5.08-.886c.904-.886.996-2.339 1.181-5.245l.267-4.188c.1-1.577.15-2.366-.303-2.865c-.454-.5-1.22-.5-2.753-.5H8.124c-1.533 0-2.3 0-2.753.5s-.404 1.288-.303 2.865l.267 4.188c.185 2.906.277 4.36 1.182 5.245c.905.886 2.296.886 5.079.886m-1.35-9.811c-.04-.434-.408-.75-.82-.707c-.413.043-.713.43-.672.864l.5 5.263c.04.434.408.75.82.707c.413-.043.713-.43-.672-.864zm4.329-.707c.412.043.713.43.671.864l-.5 5.263c-.04.434-.409.75-.82.707c-.413-.043-.713-.43-.672-.864l.5-5.263c.04-.434.409-.75.82-.707" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                                <div className='flex items-center w-full justify-center bg-[#D1D1D1]/20 backdrop-blur-xl border border-white/50 p-2 rounded-full'>
                                    <button onClick={() => toggleVerification(client.id, client.is_verified)} className='w-full flex items-center justify-center cursor-pointer px-4 rounded-full transition-all py-3 text-lg duration-300 bg-white'>
                                        {client.is_verified ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10m-5.97-3.03a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 0 1 1.06-1.06l1.47 1.47l2.235-2.235L14.97 8.97a.75.75 0 0 1 1.06 0" clipRule="evenodd" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M16.03 10.03a.75.75 0 1 0-1.06-1.06l-4.47 4.47l-1.47-1.47a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0z" /><path fill="currentColor" fillRule="evenodd" d="M12 1.25C6.063 1.25 1.25 6.063 1.25 12S6.063 22.75 12 22.75S22.75 17.937 22.75 12S17.937 1.25 12 1.25M2.75 12a9.25 9.25 0 1 1 18.5 0a9.25 9.25 0 0 1-18.5 0" clipRule="evenodd" /></svg>)}
                                    </button>
                                </div>
                            </div>
                            <div className='mt-2 flex items-center justify-center w-full bg-[#D1D1D1]/20 backdrop-blur-xl border border-white/50 p-2 w-fit rounded-full'>
                                <button onClick={() => {
                                    setSelectedDesigns(moreDesigns.map(d => ({ ...d, clientId: client.id })));
                                    setCurrentClientId(client.id);
                                    setIsModalOpen(true);
                                }} className='active:scale-[0.98] w-full cursor-pointer px-4 hover:px-6 rounded-full transition-all py-3 duration-300 bg-white'>عرض المزيد</button>
                            </div>
                        </div>
                        <div className='flex flex-col w-full gap-5 pr-5 max-[700px]:hidden'>
                            {previewDesigns[2] && <div className='cursor-pointer rounded-4xl w-full h-full bg-[#D1D1D1]/20 overflow-hidden'><img onClick={(e) => handleImageSelection(e, 'design', previewDesigns[2].id, client.id)} src={previewDesigns[2].design_url} className="w-full hover:scale-[1.05] duration-300 h-full object-cover" /></div>}
                            {previewDesigns[3] && <div className='cursor-pointer rounded-4xl w-full h-full bg-[#D1D1D1]/20 overflow-hidden'><img onClick={(e) => handleImageSelection(e, 'design', previewDesigns[3].id, client.id)} src={previewDesigns[3].design_url} className="w-full hover:scale-[1.05] duration-300 h-full object-cover" /></div>}
                        </div>
                    </div>
                )
            })}

            {showItem && (
                <div onClick={(e) => { if (e.target === e.currentTarget) setShowItem(null); }} className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center"><img src={showItem} className="max-w-[90%] max-h-[90%] rounded-3xl shadow-2xl" /></div>
            )}

            {isModalOpen && (
                <div onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)} className="fixed inset-0 z-50 bg-[#D1D1D1]/20 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="absolute z-60 mx-auto max-w-5xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-4xl p-6 w-full h-120 bg-[#D1D1D1]/20 backdrop-blur-xl border border-white/50">
                        <div className="flex flex-row-reverse flex-wrap max-h-full gap-4 overflow-y-auto">
                            {selectedDesigns.map((design) => (
                                <div key={design.id} className='rounded-[1.75rem] flex items-center justify-center size-40 bg-[#D1D1D1]/20 p-1.5 border border-white/50 group relative' style={{ boxShadow: '0px 12px 42px -4px rgba(0, 0, 0, 0.1)' }}>
                                    <img onClick={(e) => handleImageSelection(e, 'design', design.id, design.clientId)} src={design.design_url} className='w-full h-full object-cover rounded-3xl' alt='' />
                                    <button
                                        onClick={() => deleteDesign(design.id, design.clientId)}
                                        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white cursor-pointer p-2 rounded-full opacity-0 group-hover:opacity-100 hover:scale-[1.04] active:scale-[0.98] duration-300 transition-all'
                                        style={{ boxShadow: '0px 12px 42px -4px rgba(0, 0, 0, 0.1)' }}
                                    >
                                        <svg className='text-3xl' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" opacity=".5" /><path strokeLinecap="round" d="m14.5 9.5-5 5m0-5 5 5" /></g></svg>
                                    </button>
                                </div>
                            ))}
                            <div className='rounded-[1.75rem] flex items-center justify-center size-40 bg-[#D1D1D1]/20 p-1.5 border border-white/50' style={{ boxShadow: '0px 12px 42px -4px rgba(0, 0, 0, 0.1)' }}>
                                <div className='bg-white cursor-pointer p-4 rounded-full hover:scale-[1.04] active:scale-[0.98] duration-300' style={{ boxShadow: '0px 12px 42px -4px rgba(0, 0, 0, 0.1)' }} onClick={() => fileInputRef.current?.click()}>
                                    <svg className='text-3xl' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"><path d="M22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2" />
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
                                        if (e.target.files && currentClientId) {
                                            handleImageSelection(e, 'more', currentClientId, e.target.files);
                                            e.target.value = '';
                                        }
                                    }}
                                    className='hidden'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Works