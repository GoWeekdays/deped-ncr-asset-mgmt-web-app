export default function useFileUpload() {
    const file = ref<File | null>(null);

    const isUploading = ref(false);

    async function uploadFile() {

        if (file.value) {
            isUploading.value = true;

            const formData = new FormData();
            formData.append("file", file.value);

            try {
                const res = await useNuxtApp().$api<TKeyValuePair>("/api/files", {
                    method: "POST",
                    body: formData,
                });
                isUploading.value = false;
                return res;
            } catch (error) {
                isUploading.value = false;
                throw error;
            }
        }
    }

    async function deleteFile(attachmentId: string) {
        try {
            const res = await useNuxtApp().$api<TKeyValuePair>(
                `/api/files/${attachmentId}`,
                {
                    method: "DELETE",
                }
            );
            file.value = null;
            return res;
        } catch (error) {
            throw error;
        }
    }

    return {
        file,
        isUploading,
        uploadFile,
        deleteFile
    }
}