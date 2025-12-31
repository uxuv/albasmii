import React, { useState } from 'react'
import supabase from '../../../../supabase'
import { ClientCard, AdditionalDesignsModal } from './imports/Preview';

function Works() {
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null); 
    const [clientName, setClientName] = useState('');
    const [description, setDescription] = useState('');

    const [previews, setPreviews] = useState([
        null, null, null, null
    ]);

    const [modalOpen, setModalOpen] = useState(false);
    const [additionalImages, setAdditionalImages] = useState([]);

    const uploadImage = async (file, path) => {
        const ext = file.name.split('.').pop();
        const filePath = `${path}/${crypto.randomUUID()}.${ext}`;

        const { error } = await supabase
            .storage
            .from('designs')
            .upload(filePath, file);

        if (error) throw error;

        const { data } = supabase
            .storage
            .from('designs')
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const handlePreviewChange = (index, file) => {
        setPreviews(prev => {
            const updated = [...prev];
            updated[index] = {
                file,
                preview: URL.createObjectURL(file)
            };
            return updated;
        });
    };

    const handlePreviewRemove = (index) => {
        setPreviews(prev => {
            const newPreviews = [...prev];
            newPreviews[index] = null;
            return newPreviews;
        });
    };

    const handleAdditionalUpload = (files) => {
        const newFiles = Array.from(files).map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setAdditionalImages(prev => [...prev, ...newFiles]);
    };

    const handleAdditionalRemove = (index) => {
        setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleAvatarChange = (previewUrl) => {
        setAvatarPreview(previewUrl);
    };

    const handleSubmit = async () => {
        if (!avatar || !clientName) {
            alert('يرجى إدخال الاسم والصورة');
            return;
        }

        try {
            const userFolder = clientName.replace(/\s+/g, '_');

            const avatarUrl = await uploadImage(
                avatar,
                `${userFolder}/Photo`
            );

            const previewUploads = await Promise.all(
                previews
                    .filter(p => p)
                    .map(p =>
                        uploadImage(p.file, `${userFolder}/MoreDesigns/preview`)
                    )
            );

            const moreUploads = await Promise.all(
                additionalImages.map(img =>
                    uploadImage(img.file, `${userFolder}/MoreDesigns`)
                )
            );

            console.log({
                avatarUrl,
                previewUploads,
                moreUploads
            });

            alert('تم الرفع بنجاح ✅');

        } catch (err) {
            console.error(err);
            alert('صار خطأ أثناء الرفع');
        }
    };

    return (
        <>
            <div className='flex mt-10'>
                <ClientCard
                    avatarSrc={avatarPreview}
                    onAvatarChange={handleAvatarChange}
                    clientName={clientName}
                    onClientNameChange={setClientName}
                    description={description}
                    onDescriptionChange={setDescription}
                    onMoreClick={() => setModalOpen(true)}
                    onSubmit={handleSubmit}
                />
            </div>
        </>
    )
}

export default Works