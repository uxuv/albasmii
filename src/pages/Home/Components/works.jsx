import React, { useState, useEffect } from 'react'
import supabase from '../../../../supabase'
import check from '../../../assets/images/check.svg'

const ClientCardSkeleton = () => (
    <div className='flex my-25 items-stretch sm:h-100 animate-pulse'>
        <div className='flex flex-col w-full gap-5 pl-5'>
            <div className='rounded-4xl w-full h-full bg-[#EAE6E9]/40'></div>
            <div className='rounded-4xl w-full h-full bg-[#EAE6E9]/40'></div>
        </div>
        <div className='w-200 max-[700px]:w-120 flex flex-col items-center justify-center px-3 max-[500px]:h-110 rounded-4xl bg-[#EAE6E9]/50 p-1.5 '>
            <div className="flex flex-col items-center">
                <div className="size-20 bg-[#d5d5d5] rounded-3xl"></div>
            </div>
            <div className='font-semibold mt-4 text-xl text-center bg-[#d5d5d5] h-4 w-32 rounded-full'></div>
            <div className='mt-1 text-sm max-w-60 text-center bg-[#d5d5d5] h-4 w-40 rounded-full'></div>
            <div className='flex items-center justify-center mt-6'>
                <div className='bg-[#d5d5d5] h-10 p-2 w-fit rounded-full'>
                    <div className='px-6 rounded-full py-3 h-11 w-24'></div>
                </div>
            </div>
        </div>
        <div className='flex flex-col w-full gap-5 pr-5 max-[700px]:hidden'>
            <div className='rounded-4xl w-full h-full bg-[#EAE6E9]/40'></div>
            <div className='rounded-4xl w-full h-full bg-[#EAE6E9]/40'></div>
        </div>
    </div>
);


function Works() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDesigns, setSelectedDesigns] = useState([]);
    const [showItem, setShowItem] = useState(null);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        document.body.style.overflow = isModalOpen || showItem ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isModalOpen, showItem]);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('clients')
                .select('*, client_designs(*)')
                .eq('is_visible', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setClients(data);
        } catch (err) {
            console.error('Error fetching clients:', err);
        } finally {
            setLoading(false);
        }
    };

useEffect(() => {
    fetchClients();

    const channel = supabase
        .channel('db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => fetchClients())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'client_designs' }, () => fetchClients())
        .on('storage', { event: '*', bucket: 'designs' }, () => fetchClients())
        .subscribe();

    return () => supabase.removeChannel(channel);
}, []);

    const skeletonCount = 3;

    return (
        <>
            {loading ? (
                [...Array(skeletonCount)].map((_, index) => (
                    <ClientCardSkeleton key={`skeleton-${index}`} />
                ))
            ) : (
                /* === عرض المحتوى الحقيقي بعد اكتمال التحميل === */
                clients.map((client) => {
                    const previewDesigns = client.client_designs.slice(0, 4);
                    const moreDesigns = client.client_designs.slice(4);

                    return (
                        <div key={client.id}  className='flex my-25 items-stretch sm:h-100' id='works'>
                            <div className='flex flex-col w-full gap-5 pl-5'>
                                {previewDesigns[0] && <div className=' cursor-pointer rounded-4xl w-full h-full bg-[#D1D1D1]/20 overflow-hidden'><img onClick={() => setShowItem(previewDesigns[0].design_url)} src={previewDesigns[0].design_url} className=" hover:scale-[1.05] duration-300 w-full h-full object-cover" /></div>}
                                {previewDesigns[1] && <div className=' cursor-pointer rounded-4xl w-full h-full bg-[#D1D1D1]/20 overflow-hidden'><img onClick={() => setShowItem(previewDesigns[1].design_url)} src={previewDesigns[1].design_url} className=" hover:scale-[1.05] duration-300 w-full h-full object-cover" /></div>}
                            </div>

                            <div style={{ boxShadow: "0px 12px 42px -4px rgba(0, 0, 0, 0.1)" }} className='w-200 max-[700px]:w-120 flex flex-col items-center justify-center px-3 max-[500px]:h-110 rounded-4xl bg-[#D1D1D1]/20 p-1.5 backdrop-blur-xl border border-white/50'>
                                <div>
                                    <div className="flex flex-col items-center">
                                        <div className="size-20 bg-white rounded-3xl overflow-hidden">
                                            <img src={client.photo} alt={client.name} className="w-full h-full object-cover" />
                                        </div>
                                        {client.is_verified && (
                                            <div className="-mt-6 -ml-16 rounded-full flex items-center justify-center" style={{ boxShadow: '0px 12px 42px -4px rgba(0, 0, 0, 0.1)' }}>
                                                <img className='size-7' src={check} alt="" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <h1 className='font-semibold mt-4 text-xl text-center'>{client.name}</h1>
                                <h1 className='mt-1 text-sm max-w-60 text-center'>{client.subtitle}</h1>
                                <div className='flex items-center justify-center mt-6'>
                                    <div className='flex items-center justify-center bg-[#D1D1D1]/20 backdrop-blur-xl border border-white/50 p-2 w-fit rounded-full'>
                                        <button onClick={() => { setSelectedDesigns(window.innerWidth < 700 ? [...previewDesigns.slice(2), ...moreDesigns] : moreDesigns); setIsModalOpen(true); }} className=' active:scale-[0.98] cursor-pointer px-4 hover:px-6 rounded-full transition-all py-3 duration-300 bg-white'>عرض المزيد</button>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col w-full gap-5 pr-5 max-[700px]:hidden'>
                                {previewDesigns[2] && <div className='cursor-pointer rounded-4xl w-full h-full bg-[#D1D1D1]/20 overflow-hidden'><img onClick={() => setShowItem(previewDesigns[2].design_url)} src={previewDesigns[2].design_url} className="w-full hover:scale-[1.05] duration-300 h-full object-cover" /></div>}
                                {previewDesigns[3] && <div className='cursor-pointer rounded-4xl w-full h-full bg-[#D1D1D1]/20 overflow-hidden'><img onClick={() => setShowItem(previewDesigns[3].design_url)} src={previewDesigns[3].design_url} className="w-full hover:scale-[1.05] duration-300 h-full object-cover" /></div>}
                            </div>
                        </div>
                    )
                })
            )}

            {showItem && (
                <div onClick={(e) => { if (e.target === e.currentTarget) setShowItem(null); }} className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <img src={showItem} className="max-w-[90%] max-h-[90%] rounded-3xl shadow-2xl" />
                </div>
            )}

            {isModalOpen && (
                <div onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)} className="fixed inset-0 z-50 bg-[#D1D1D1]/20  backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-5xl max-h-[85vh] backdrop-blur-xl border border-white/60 rounded-4xl overflow-hidden">
                        <div className="h-full max-h-[85vh] overflow-y-auto overscroll-contain p-4" onWheel={(e) => e.stopPropagation()}>
                            <div className="columns-2 gap-4 space-y-4">
                                {selectedDesigns.map((design, index) => (
                                    <div key={index} className="break-inside-avoid rounded-3xl overflow-hidden">
                                        <img src={design.design_url} onClick={() => setShowItem(design.design_url)} className="w-full h-auto object-contain cursor-pointer hover:scale-[1.02] transition-transform duration-300" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Works